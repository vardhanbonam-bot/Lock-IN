import React from 'react';
import { DayData, CATMistakeClassification } from '../../types';
import { GraduationCap, Target, Clock, CheckCircle2, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function CatPrepSection({ dayData, onChange }: Props) {
  const attempted = dayData.catQuestionsAttempted || 0;
  const correct = dayData.catQuestionsCorrect || 0;
  const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : '0.0';

  const mistakes: CATMistakeClassification = dayData.catMistakeClassification || {};

  const toggleMistakeType = (typeKey: keyof CATMistakeClassification) => {
    onChange({
      catMistakeClassification: {
        ...mistakes,
        [typeKey]: !mistakes[typeKey]
      }
    });
  };

  const mistakeCategories: { key: keyof CATMistakeClassification; label: string; icon: string; desc: string }[] = [
    { key: 'conceptGap', label: 'Concept Gap', icon: '❌', desc: 'Did not know the fundamental formula or theorem' },
    { key: 'calculationError', label: 'Calculation Error', icon: '🧮', desc: 'Concept was right, made an arithmetic slip' },
    { key: 'misreadQuestion', label: 'Misread Question', icon: '👀', desc: 'Overlooked a condition or solved for wrong variable' },
    { key: 'timeManagement', label: 'Time Management', icon: '⏱️', desc: 'Spent 5+ minutes trapped in a single dead end' },
    { key: 'wrongApproach', label: 'Wrong Approach', icon: '🧠', desc: 'Started with suboptimal method' },
    { key: 'carelessness', label: 'Carelessness', icon: '😵', desc: 'Rushed option marking or silly sign mistake' },
    { key: 'poorSelection', label: 'Poor Question Selection', icon: '🎯', desc: 'Should have skipped this trap question immediately' }
  ];

  const activeMistakesCount = Object.values(mistakes).filter(Boolean).length;

  return (
    <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                4:30–7:30 — CAT PREPARATION LABORATORY
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">CAREER / INTELLECT PILLAR</span>
            </div>
            <p className="text-[10px] font-mono text-gray-400">
              Input ➔ Output measurement with rigorous mistake taxonomy
            </p>
          </div>
        </div>

        {/* Accuracy badge */}
        <div className="flex items-center gap-3">
          <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2 text-center">
            <span className="text-[9px] font-mono uppercase text-gray-400 block tracking-wider">Accuracy</span>
            <span
              className={`text-lg font-black font-mono ${
                attempted === 0
                  ? 'text-gray-500'
                  : parseFloat(accuracy) >= 80
                  ? 'text-brand-lime'
                  : parseFloat(accuracy) >= 60
                  ? 'text-yellow-400'
                  : 'text-brand-coral'
              }`}
            >
              {accuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Category selector & Concept input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Section Category */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
          <label className="block text-[10px] font-mono uppercase text-gray-400">Section Domain</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Quant', 'LRDI', 'VARC'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ catTopicCategory: cat })}
                className={`py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                  dayData.catTopicCategory === cat
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-black/40 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Name */}
        <div className="md:col-span-2 bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
          <label className="block text-[10px] font-mono uppercase text-gray-400">Specific Concept / Module</label>
          <input
            type="text"
            value={dayData.catConcept || ''}
            onChange={e => onChange({ catConcept: e.target.value })}
            placeholder="e.g. Time Speed Distance - Relative Speed & Circular Tracks, or Circular Seating"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-medium"
          />
        </div>
      </div>

      {/* Numerical Metrics: Attempted, Correct, Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
          <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Questions Attempted</label>
          <input
            type="number"
            min="0"
            value={dayData.catQuestionsAttempted ?? 0}
            onChange={e => onChange({ catQuestionsAttempted: parseInt(e.target.value) || 0 })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-cyan-400 text-center"
          />
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
          <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Questions Correct</label>
          <input
            type="number"
            min="0"
            max={dayData.catQuestionsAttempted ?? 999}
            value={dayData.catQuestionsCorrect ?? 0}
            onChange={e => onChange({ catQuestionsCorrect: parseInt(e.target.value) || 0 })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-brand-lime font-mono font-bold focus:outline-none focus:border-cyan-400 text-center"
          />
        </div>

        <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
          <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Total Time Invested</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              value={dayData.catTimeMinutes ?? 60}
              onChange={e => onChange({ catTimeMinutes: parseInt(e.target.value) || 0 })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-cyan-400 text-center"
            />
            <span className="text-xs font-mono text-gray-500">min</span>
          </div>
        </div>
      </div>

      {/* 🎯 MISTAKE CLASSIFICATION ENGINE (GOLD) */}
      <div className="bg-cyan-500/5 border border-cyan-500/30 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-black uppercase text-cyan-400 tracking-wider">
              MISTAKE CLASSIFICATION ENGINE
            </h4>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {activeMistakesCount} pattern{activeMistakesCount === 1 ? '' : 's'} identified today
          </span>
        </div>
        <p className="text-[10px] text-gray-300">
          Classify why errors happened. You cannot fix what you do not categorize.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {mistakeCategories.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => toggleMistakeType(cat.key)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                mistakes[cat.key]
                  ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                  : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
              }`}
            >
              <span className="text-base shrink-0">{cat.icon}</span>
              <div>
                <span className="text-xs font-bold block">{cat.label}</span>
                <span className="text-[9px] font-mono text-gray-500 leading-tight block mt-0.5">
                  {cat.desc}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Mistake Notes */}
        <div className="pt-2">
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
            Specific Mistake Analysis & Actionable Rule
          </label>
          <textarea
            value={dayData.catMistakeNotes || ''}
            onChange={e => onChange({ catMistakeNotes: e.target.value })}
            rows={2}
            placeholder="e.g. In Q4, confused harmonic mean with arithmetic mean in average speed. Rule: For equal distance, always use 2S1S2 / (S1 + S2)."
            className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-medium"
          />
        </div>
      </div>
    </div>
  );
}
