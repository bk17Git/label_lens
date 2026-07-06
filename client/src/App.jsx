import React, { useState } from 'react';
import Header from './components/Header';
import LandingScreen from './components/LandingScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import Alert from './components/Alert';

export default function App() {
  const [status, setStatus] = useState('idle'); // idle, loading, results, error
  const [image, setImage] = useState(null); // base64 encoded image
  const [result, setResult] = useState(null); // JSON analysis results
  const [errorMessage, setErrorMessage] = useState(null);

  const analyzeLabel = async (base64Image) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process the label. Please try again.');
      }

      setResult(data);
      setStatus('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'A network error occurred. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const handleImageSelected = (base64Image) => {
    setImage(base64Image);
    setStatus('loading');
    setErrorMessage(null);
    analyzeLabel(base64Image);
  };

  const handleRetry = () => {
    if (image) {
      setStatus('loading');
      setErrorMessage(null);
      analyzeLabel(image);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setImage(null);
    setResult(null);
    setErrorMessage(null);
  };

  const handleLandingError = (msg) => {
    setErrorMessage(msg);
    setStatus('error');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-emerald-500/20">
      <div className="flex-1 flex flex-col">
        {/* Top sticky navbar */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full">
          {status === 'idle' && (
            <LandingScreen 
              onImageSelected={handleImageSelected} 
              onError={handleLandingError} 
            />
          )}

          {status === 'loading' && <LoadingScreen />}

          {status === 'results' && result && (
            <ResultsScreen result={result} onReset={handleReset} />
          )}
        </main>
      </div>

      {/* Floating Error Dialogue */}
      {status === 'error' && (
        <Alert 
          message={errorMessage} 
          onRetry={handleRetry} 
        />
      )}

      {/* Modern Compact Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/40 py-4 text-center">
        <p className="text-[10px] text-slate-500 tracking-wider">
          &copy; {new Date().getFullYear()} LabelLens. Empowering product literacy.
        </p>
      </footer>
    </div>
  );
}
