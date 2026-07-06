# LabelLens — Food & Product Label Decoder

LabelLens is a mobile-first web application designed to help users decode and understand packaged food and personal care product ingredient labels. Users can snap a photo or upload an image of an ingredient list, and the app leverages AI to extract the text, explain complex ingredients, and highlight potential items of concern (like hidden added sugars, trans fats, artificial colors, or vague terminology) in clear, plain language.

---

## Key Features

- 📸 **Mobile-First Capture:** Optimized for mobile browser camera integrations.
- 🧠 **AI-Powered Breakdown:** Uses Gemini API vision capabilities to OCR and translate scientific ingredients into plain English.
- 🚦 **Actionable Verdicts:** Non-alarmist, informative literacy ratings: *Generally Fine*, *Consume in Moderation*, or *Worth a Second Look*.
- 🔒 **Secure Design:** Secure backend proxy ensures API keys are never exposed to client-side code.
- 🧪 **Instant Demo Mode:** Fully interactive local operation even without a Gemini API key.

---

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express
- **API Proxy:** Standard HTTPS fetch client querying Gemini API models (`gemini-2.5-flash` by default)

---

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Setup and Installation

1. Clone or copy the project files to your local workspace directory.
2. In the project root folder, run the following command to automatically install all dependencies for the root, frontend, and backend services:
   ```bash
   npm run install:all
   ```

### Configuration (Gemini API Key)

To use the live Gemini API, you need a free API key from Google AI Studio.

1. Create a `.env` file in the project root directory by copying the template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

> [!TIP]
> **Demo Fallback Mode:** If the `GEMINI_API_KEY` is left blank, the backend automatically falls back to **Demo Mode**. It will simulate network latency and return realistic ingredient analysis details for testing. This is ideal for quick UI demos and validation.

---

## Running the Application

### Development Mode

Run the following command in the project root directory to launch the Express backend and Vite frontend concurrently:
```bash
npm run dev
```
- Frontend will open at: `http://localhost:5173`
- Backend API will run on port: `http://localhost:5001`
- The Vite dev server is pre-configured to proxy API requests `/api` to the backend.

### Production Mode

To build and run the application as a single optimized bundle:
1. Compile the React assets:
   ```bash
   npm run build
   ```
2. Start the Express server:
   ```bash
   npm start
   ```
The Express backend will host both the secure API endpoints and serve the built static React assets from a single port (`http://localhost:5001`).

---

## Disclaimer

**LabelLens is a Food Literacy Resource.** It is designed to explain the common use cases of product additives, food compounds, and chemical cosmetics. The verdicts, summary insights, and flagged ingredients are for educational purposes only. They do not constitute, nor are they a substitute for, professional medical advice, diagnosis, treatment, or dietary planning.
