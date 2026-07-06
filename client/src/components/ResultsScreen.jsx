import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  FileText, 
  Sparkles,
  Info
} from 'lucide-react';

const VERDICT_CONFIG = {
  'Generally Fine': {
    glowClass: 'bg-radial-glow',
    cardClass: 'bg-emerald-500/5 border-emerald-500/15',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: ShieldCheck,
    title: 'Generally Fine'
  },
  'Consume in Moderation': {
    glowClass: 'bg-radial-glow-yellow',
    cardClass: 'bg-amber-500/5 border-amber-500/15',
    badgeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: AlertTriangle,
    title: 'Consume in Moderation'
  },
  'Worth a Second Look': {
    glowClass: 'bg-radial-glow-red',
    cardClass: 'bg-rose-500/5 border-rose-500/15',
    badgeClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    icon: AlertCircle,
    title: 'Worth a Second Look'
  }
};

export default function ResultsScreen({ result, onReset }) {
  const [openIngredients, setOpenIngredients] = useState({});
  const [showRawIngredients, setShowRawIngredients] = useState(false);

  // Normalize verdict matching in case of minor casing differences
  const getVerdictKey = (verdict) => {
    if (!verdict) return 'Consume in Moderation';
    const normalized = verdict.toLowerCase();
    if (normalized.includes('fine')) return 'Generally Fine';
    if (normalized.includes('second')) return 'Worth a Second Look';
    return 'Consume in Moderation';
  };

  const verdictKey = getVerdictKey(result.verdict);
  const theme = VERDICT_CONFIG[verdictKey] || VERDICT_CONFIG['Consume in Moderation'];
  const VerdictIcon = theme.icon;

  const toggleIngredient = (index) => {
    setOpenIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const flaggedCount = result.flagged_ingredients ? result.flagged_ingredients.length : 0;

  return (
    <div className={`flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6 relative transition-all duration-500 ${theme.glowClass}`}>
      
      {/* 1. Verdict Summary Card */}
      <div className={`rounded-2xl border p-5 space-y-4 shadow-lg shadow-black/30 glass-panel ${theme.cardClass}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Product Verdict</span>
          <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${theme.badgeClass}`}>
            <VerdictIcon className="h-3.5 w-3.5" />
            {theme.title}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-white leading-snug">
            {result.verdict_reason || 'Product analyzed successfully.'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            {result.summary}
          </p>
        </div>
      </div>

      {/* 2. Flagged Ingredients Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
            Notable Ingredients
            <span className={`inline-flex items-center justify-center rounded-full h-5 px-2 text-[10px] font-bold ${
              flaggedCount > 0 ? 'bg-slate-900 border border-white/5 text-slate-300' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
            }`}>
              {flaggedCount} flagged
            </span>
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Tap to expand explanations</span>
        </div>

        {flaggedCount === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 text-center space-y-2">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto opacity-70" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-white">No notable flags raised</p>
              <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                No high-concern additives, hidden added sugars, trans fats, or vague names were flagged on this label.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {result.flagged_ingredients.map((ing, index) => {
              const isOpen = !!openIngredients[index];
              return (
                <div
                  key={index}
                  className={`rounded-2xl border border-white/5 bg-slate-900/30 glass-card transition-all duration-200 overflow-hidden ${
                    isOpen ? 'ring-1 ring-white/5' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleIngredient(index)}
                    className="w-full flex items-center justify-between p-4 text-left select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 border border-white/5 text-amber-400/90 font-medium text-xs uppercase shrink-0">
                        {ing.name ? ing.name.substring(0, 2) : '??'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate capitalize">
                          {ing.name}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono mt-0.5">
                          {ing.concern || 'Additive'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 border-t border-white/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="p-4 bg-slate-950/25">
                      <p className="text-[11px] leading-relaxed text-slate-300 flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        {ing.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Full Ingredients Text (Expandable Drawer) */}
      <div className="rounded-2xl border border-white/5 bg-slate-900/20 glass-card">
        <button
          onClick={() => setShowRawIngredients(!showRawIngredients)}
          className="w-full flex items-center justify-between p-4 text-left font-display text-xs font-bold text-slate-300"
        >
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Full Extracted Ingredient List
          </span>
          {showRawIngredients ? (
            <ChevronUp className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          )}
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            showRawIngredients ? 'max-h-60 border-t border-white/5 opacity-100 overflow-y-auto no-scrollbar' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="p-4 bg-slate-950/30">
            <p className="text-xs leading-relaxed text-slate-400 italic">
              {result.ingredients_raw || 'No raw ingredients details found.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Action Bar (Scan Another) */}
      <div className="pt-4 z-10 relative">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 hover:text-white px-4 py-3.5 text-sm font-semibold shadow-lg shadow-black/40 hover:bg-slate-800 hover:border-slate-700 transition-all duration-200 active:scale-98"
        >
          <RotateCcw className="h-4 w-4 text-emerald-400" />
          Scan Another Product
        </button>
      </div>

    </div>
  );
}
