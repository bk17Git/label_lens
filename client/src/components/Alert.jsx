import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Alert({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-rose-500/20 bg-slate-900 shadow-2xl shadow-rose-950/20">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-base font-semibold text-white">Oops! Something went wrong</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              {message}
            </p>
          </div>
        </div>
        <div className="bg-slate-950/40 border-t border-white/5 p-4 flex justify-center">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-red-700 transition-all duration-200 active:scale-98"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Re-uploading Label
          </button>
        </div>
      </div>
    </div>
  );
}
