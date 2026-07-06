import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const DECODING_MESSAGES = [
  "Reading ingredient text from image...",
  "Translating complex chemical scientific names...",
  "Flagging sugars, artificial colors, and preservatives...",
  "Checking health transparency databases...",
  "Finalizing nutritional literacy overview..."
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DECODING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-6 flex flex-col justify-center">
      {/* Decorative background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      
      {/* Scanner Visual Box */}
      <div className="relative h-48 w-full rounded-2xl border border-white/5 bg-slate-900/40 glass-panel overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg shadow-black/40">
        {/* Laser line scanner */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-scan" />
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase">Deciphering Label</p>
            <p className="text-sm font-medium text-slate-200 mt-1 transition-all duration-300 min-h-[20px]">
              {DECODING_MESSAGES[messageIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Skeleton Card Loaders */}
      <div className="space-y-4 pt-2">
        {/* Skeleton Card 1: Verdict */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-3.5">
          <div className="h-4 w-1/4 rounded-md bg-slate-800 animate-shimmer" />
          <div className="h-7 w-2/3 rounded-lg bg-slate-800 animate-shimmer" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded-md bg-slate-800 animate-shimmer" />
            <div className="h-3 w-5/6 rounded-md bg-slate-800 animate-shimmer" />
          </div>
        </div>

        {/* Skeleton Card 2: List */}
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded-md bg-slate-800 animate-shimmer ml-1" />
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-slate-900/20 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-xl bg-slate-800 animate-shimmer shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-3.5 w-1/4 rounded-md bg-slate-800 animate-shimmer" />
                  <div className="h-3 w-3/5 rounded-md bg-slate-800 animate-shimmer" />
                </div>
              </div>
              <div className="h-4 w-4 rounded bg-slate-800 animate-shimmer shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
