import React from 'react';
import { DayData } from '../../types';
import { Sun, Moon, Zap, Shield, CheckCircle2, Circle, Target, Flame, Brain, Smile } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function MorningLaunchpad({ dayData, onChange }: Props) {
  const big3 = dayData.todaysBig3 || ['', '', ''];
  const big3Done = dayData.todaysBig3Done || [false, false, false];

  const updateBig3Text = (index: number, val: string) => {
    const updated = [...big3];
    updated[index] = val;
    onChange({ todaysBig3: updated });
  };

  const toggleBig3Done = (index: number) => {
    const updated = [...big3Done];
    updated[index] = !updated[index];
    onChange({ todaysBig3Done: updated });
  };

  const big3CompletedCount = big3Done.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* 🌅 CORE PHILOSOPHY & ANCHOR BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-card via-[#161622] to-brand-card border border-brand-purple/30 rounded-3xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded">
                STAGE 1: PLAN & ANCHOR
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">5:30 - 6:00 AM • 5 MIN PROTOCOL</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black italic uppercase text-white tracking-wide mt-1">
              MORNING LAUNCHPAD & RECOVERY
            </h2>
            <p className="text-xs text-brand-purple font-mono font-bold mt-0.5">
              “Did today's actions make tomorrow's version of me stronger?”
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/50 border border-brand-purple/30 rounded-2xl px-4 py-2 text-center">
              <span className="text-[9px] font-mono uppercase text-gray-400 block tracking-wider">Big 3 Execution</span>
              <span className="text-lg font-black text-brand-lime font-mono">
                {big3CompletedCount}/3
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SLEEP & RECOVERY MATRIX */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">SLEEP & RECOVERY METRICS</h3>
              <p className="text-[10px] font-mono text-gray-400">Track high-leverage sleep variables, not micromanaged minutes</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Bedtime */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Bedtime</label>
            <input
              type="time"
              value={dayData.bedTime || '22:30'}
              onChange={e => onChange({ bedTime: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
            />
          </div>

          {/* Wake-up Time */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
              Wake-up Time <span className="text-brand-lime">(Target 5:30)</span>
            </label>
            <input
              type="time"
              value={dayData.wakeTime || '05:30'}
              onChange={e => onChange({ wakeTime: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
            />
          </div>

          {/* Sleep Duration */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Sleep Duration</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.5"
                min="3"
                max="12"
                value={dayData.sleepDuration || dayData.kpiSleepHours || '7.5'}
                onChange={e => onChange({ sleepDuration: e.target.value, kpiSleepHours: parseFloat(e.target.value) || 7.5 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
              />
              <span className="text-xs font-mono text-gray-500">hrs</span>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Sleep Quality</label>
            <div className="flex items-center justify-between gap-1 pt-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChange({ sleepQuality: star })}
                  className={`px-2 py-1 text-xs rounded-lg font-mono font-bold transition-all cursor-pointer ${
                    (dayData.sleepQuality || 4) >= star
                      ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                      : 'bg-black/40 text-gray-600 border border-white/5'
                  }`}
                >
                  ★{star}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Binary High-Leverage Flags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Got out of bed immediately */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Out of bed immediately?</span>
              <span className="text-[9px] font-mono text-gray-500">Zero scrolling in bed</span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ gotOutOfBedImmediately: !dayData.gotOutOfBedImmediately })}
              className={`px-3 py-1 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                dayData.gotOutOfBedImmediately
                  ? 'bg-brand-lime text-black border-brand-lime'
                  : 'bg-black/40 text-gray-500 border-white/10'
              }`}
            >
              {dayData.gotOutOfBedImmediately ? 'YES ✓' : 'NO ✗'}
            </button>
          </div>

          {/* Morning routine completed */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Morning Routine Done?</span>
              <span className="text-[9px] font-mono text-gray-500">Hydration + Movement</span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ morningRoutineCompleted: !dayData.morningRoutineCompleted })}
              className={`px-3 py-1 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                dayData.morningRoutineCompleted
                  ? 'bg-brand-lime text-black border-brand-lime'
                  : 'bg-black/40 text-gray-500 border-white/10'
              }`}
            >
              {dayData.morningRoutineCompleted ? 'YES ✓' : 'NO ✗'}
            </button>
          </div>

          {/* Morning Start Score */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white block">Morning Start Score</span>
              <span className="text-[10px] font-mono text-brand-lime font-black">
                {dayData.morningStartScore || 4}/5
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  type="button"
                  onClick={() => onChange({ morningStartScore: score })}
                  className={`flex-1 py-1 text-[10px] font-mono rounded-lg transition-all cursor-pointer text-center ${
                    (dayData.morningStartScore || 4) === score
                      ? 'bg-brand-purple text-white font-black'
                      : 'bg-black/40 text-gray-600 hover:text-gray-300'
                  }`}
                  title={score <= 2 ? 'Reactive' : score >= 4 ? 'Intentional' : 'Neutral'}
                >
                  {score}
                </button>
              ))}
            </div>
            <span className="text-[8px] font-mono text-gray-500 block mt-1 text-center">
              (1: Reactive ➔ 5: Intentional)
            </span>
          </div>
        </div>
      </div>

      {/* CURRENT PSYCHOLOGICAL STATE (ENERGY, MOOD, CLARITY /10) */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">CURRENT STATE CALIBRATION</h3>
            <p className="text-[10px] font-mono text-gray-400">Calibrate physical and mental vitality before entering execution mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Energy */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Energy
              </span>
              <span className="text-sm font-mono font-black text-brand-lime">
                {dayData.energyScore ?? 8}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.energyScore ?? 8}
              onChange={e => onChange({ energyScore: parseInt(e.target.value) })}
              className="w-full accent-brand-lime cursor-pointer"
            />
          </div>

          {/* Mood */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-brand-purple" /> Mood
              </span>
              <span className="text-sm font-mono font-black text-brand-purple">
                {dayData.moodScore ?? dayData.kpiMoodScore ?? 8}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.moodScore ?? dayData.kpiMoodScore ?? 8}
              onChange={e => onChange({ moodScore: parseInt(e.target.value), kpiMoodScore: parseInt(e.target.value) })}
              className="w-full accent-brand-purple cursor-pointer"
            />
          </div>

          {/* Mental Clarity */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Mental Clarity
              </span>
              <span className="text-sm font-mono font-black text-blue-400">
                {dayData.mentalClarityScore ?? 8}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.mentalClarityScore ?? 8}
              onChange={e => onChange({ mentalClarityScore: parseInt(e.target.value) })}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 🎯 TODAY'S BIG 3 OUTCOMES & TODAY'S RULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BIG 3 */}
        <div className="lg:col-span-2 bg-brand-card border border-brand-lime/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-lime" />
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  TODAY'S BIG 3 OUTCOMES
                </h3>
                <span className="text-[10px] font-mono text-gray-400">
                  Only 3 high-leverage outcomes. Do not scatter focus.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brand-lime/10 border border-brand-lime/30 text-brand-lime font-black">
              {big3CompletedCount} of 3 COMPLETED
            </span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map(idx => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  big3Done[idx]
                    ? 'bg-brand-lime/10 border-brand-lime/40'
                    : 'bg-black/40 border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleBig3Done(idx)}
                  className="cursor-pointer text-brand-lime shrink-0"
                >
                  {big3Done[idx] ? (
                    <CheckCircle2 className="w-5 h-5 fill-brand-lime text-black" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500 hover:text-white" />
                  )}
                </button>
                <span className="text-xs font-mono font-bold text-gray-500">#{idx + 1}</span>
                <input
                  type="text"
                  value={big3[idx] || ''}
                  onChange={e => updateBig3Text(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'e.g. Complete 3 hours of trading study'
                      : idx === 1
                      ? 'e.g. Complete CAT quant + verbal targets'
                      : 'e.g. Physio + mobility session without skipping'
                  }
                  className={`w-full bg-transparent text-sm focus:outline-none font-medium ${
                    big3Done[idx] ? 'line-through text-gray-400' : 'text-white'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 TODAY'S RULE (PSYCHOLOGICAL ANCHOR) */}
        <div className="bg-brand-card border border-brand-purple/30 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Flame className="w-5 h-5 text-brand-purple animate-pulse" />
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  TODAY'S RULE
                </h3>
                <span className="text-[10px] font-mono text-gray-400">One psychological anchor</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <textarea
                value={dayData.todaysRule || ''}
                onChange={e => onChange({ todaysRule: e.target.value })}
                rows={3}
                placeholder="“Process over outcome.” or “No trade without my setup.”"
                className="w-full bg-black/50 border border-brand-purple/30 rounded-2xl p-3 text-xs text-brand-lime font-mono leading-relaxed focus:outline-none focus:border-brand-purple resize-none"
              />

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Process over outcome.',
                  'No trade without setup.',
                  'Protect focus; don’t chase.',
                  'Control the process.'
                ].map(rule => (
                  <button
                    key={rule}
                    type="button"
                    onClick={() => onChange({ todaysRule: rule })}
                    className="text-[9px] font-mono px-2 py-1 rounded-lg bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple hover:text-white border border-brand-purple/30 transition-all cursor-pointer"
                  >
                    + {rule}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-500 pt-3 border-t border-white/5">
            Anchor for impulsive moments throughout the day.
          </div>
        </div>
      </div>
    </div>
  );
}
