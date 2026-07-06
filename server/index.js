import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { mockAnalysis } from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server folder or the root folder
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup
app.use(cors());

// Configure JSON parser with a large payload limit (50MB) to accept high-res base64 images
app.use(express.json({ limit: '50mb' }));

app.post('/api/analyze', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided. Please upload or take a photo of a label.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // DEMO FALLBACK: If no Gemini API key is configured, return the high-quality mock data
    if (!apiKey || apiKey.trim() === '') {
      console.warn('GEMINI_API_KEY is not set. Falling back to Demo Mode with mock data.');
      // Simulate network request latency of 2 seconds for loading screen realism
      await new Promise(resolve => setTimeout(resolve, 2000));
      return res.json(mockAnalysis);
    }

    // Extract mime type and base64 string from data URI format (e.g. data:image/jpeg;base64,...)
    const matches = image.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format. Expected a base64 encoded image data URI.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemPrompt = `You are analyzing a food or personal care product's ingredient label from an image. Extract the full ingredient list as text. Then for each notable ingredient, explain in plain, non-alarmist language what it is and why it's commonly used (sweetener, preservative, emulsifier, coloring, etc). Flag ingredients that are commonly linked to health concerns (e.g. added sugars under various names, trans fats, artificial dyes, high sodium, vague terms like 'fragrance' or 'natural flavors'). Give an overall verdict as one of: 'Generally Fine', 'Consume in Moderation', or 'Worth a Second Look' — never diagnostic or alarmist language, just informative. Return the response as structured JSON with fields: ingredients_raw, flagged_ingredients (array of {name, concern, explanation}), verdict, verdict_reason, summary (2-3 sentences).`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    console.log(`Sending image data to Gemini API (${model})...`);
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API returned status ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: `Gemini API request failed with status ${response.status}.`,
        details: errorText
      });
    }

    const responseData = await response.json();
    
    // Extract textual content from Gemini response
    if (
      !responseData.candidates ||
      !responseData.candidates[0] ||
      !responseData.candidates[0].content ||
      !responseData.candidates[0].content.parts ||
      !responseData.candidates[0].content.parts[0]
    ) {
      console.error('Unexpected Gemini API response shape:', JSON.stringify(responseData));
      return res.status(502).json({ error: 'Received an invalid response format from the Gemini API.' });
    }

    const rawText = responseData.candidates[0].content.parts[0].text;
    console.log('Gemini API response content retrieved.');

    // Clean up potential markdown formatting (sometimes Gemini still wraps responses in ```json ... ``` despite mimeType constraint)
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText
        .replace(/^```json\s*/i, '')
        .replace(/```$/, '')
        .trim();
    }

    try {
      const parsedJSON = JSON.parse(cleanedText);
      return res.json(parsedJSON);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', parseErr);
      console.log('Raw content received:', rawText);
      return res.status(502).json({
        error: 'Failed to decode response as structured data. Please ensure the label is clearly visible and try again.',
        rawResponse: rawText
      });
    }

  } catch (err) {
    console.error('Error handling label analysis request:', err);
    return res.status(500).json({
      error: 'An internal server error occurred while processing the label.',
      details: err.message
    });
  }
});

// Serve frontend React production assets if they have been built
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  console.log(`Serving React build assets statically from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.log('Vite build assets folder not found. Express will run in API proxy mode only.');
}

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` LabelLens Backend Server is running on port ${PORT} `);
  console.log(`==================================================`);
});
