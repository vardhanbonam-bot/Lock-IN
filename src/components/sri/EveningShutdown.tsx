import React from 'react';
import { DayData, RootCauseAnalysis, SevenDimensionScores } from '../../types';
import { Moon, Award, AlertCircle, Lightbulb, Wrench, ShieldCheck, Heart, Droplets, Footprints, Flame } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function EveningShutdown({ dayData, onChange }: Props) {
  // Wins
  const wins = dayData.todaysWins || ['', '', ''];
  const updateWin = (idx: number, val: string) => {
    const updated = [...wins];
    updated[idx] = val;
    onChange({ todaysWins: updated });
  };

  // Mistakes
  const mistakes = dayData.todaysMistakes || ['', '', ''];
  const updateMistake = (idx: number, val: string) => {
    const updated = [...mistakes];
    updated[idx] = val;
    onChange({ todaysMistakes: updated });
  };

  // Corrections
  const corrections = dayData.tomorrowsCorrections || ['', ''];
  const updateCorrection = (idx: number, val: string) => {
    const updated = [...corrections];
    updated[idx] = val;
    onChange({ tomorrowsCorrections: updated });
  };

  // Root Cause
  const rootCause: RootCauseAnalysis = dayData.rootCauseAnalysis || {
    problem: '',
    why1: '',
    why2: '',
    solution: ''
  };

  const updateRootCause = (field: keyof RootCauseAnalysis, val: string) => {
    onChange({
      rootCauseAnalysis: {
        ...rootCause,
        [field]: val
      }
    });
  };

  // 7 Dimensions
  const scores: SevenDimensionScores = dayData.sevenDimensionScores || {
    sleepRecovery: 8,
    mental: 8,
    physical: 8,
    learning: 8,
    trading: 8,
    execution: 8,
    lifestyle: 8,
    overall: 8
  };

  const updateDimensionScore = (dim: keyof SevenDimensionScores, val: number) => {
    const updated = { ...scores, [dim]: val };
    // recalculate overall average automatically if updating one of the dimensions
    if (dim !== 'overall') {
      const avg = Math.round(
        (updated.sleepRecovery +
          updated.mental +
          updated.physical +
          updated.learning +
          updated.trading +
          updated.execution +
          updated.lifestyle) /
          7
      );
      updated.overall = avg;
    }
    onChange({ sevenDimensionScores: updated });
  };

  // Water helper
  const waterActual = dayData.waterLitersActual ?? 2.5;
  const adjustWater = (delta: number) => {
    const newVal = Math.max(0, parseFloat((waterActual + delta).toFixed(2)));
    onChange({ waterLitersActual: newVal, waterTotalGlasses: Math.round(newVal * 4) });
  };

  return (
    <div className="space-y-6">
      {/* 🍲 8:00 DINNER & 8:00–10:30 EVENING MODE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 8:00 DINNER */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">8:00 PM — DINNER NOURISHMENT</h3>
              <p className="text-[10px] font-mono text-gray-400">High-leverage evening variables</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Dinner Description</label>
              <input
                type="text"
                value={dayData.dinnerWhat || ''}
                onChange={e => onChange({ dinnerWhat: e.target.value })}
                placeholder="e.g. Light khichdi, sauteed veggies, soup"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
                <span className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Food Quality (/5)</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onChange({ dinnerQuality: q })}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        (dayData.dinnerQuality || 4) >= q
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-black/40 text-gray-600 border border-white/5'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Overeating?</span>
                  <span className="text-[9px] font-mono text-gray-500">Sleep barrier</span>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ dinnerOvereating: !dayData.dinnerOvereating })}
                  className={`px-3 py-1.5 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                    dayData.dinnerOvereating
                      ? 'bg-brand-coral text-white border-brand-coral'
                      : 'bg-brand-lime/10 text-brand-lime border-brand-lime/30'
                  }`}
                >
                  {dayData.dinnerOvereating ? 'YES (Over)' : 'CLEAN ✓'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8:00 - 10:30 UNDEFINED ZONE */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">8:00–10:30 — EVENING MODE</h3>
              <p className="text-[10px] font-mono text-gray-400">Intentional mode allocation prevents passive doomscrolling</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1.5">Select Active Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Mode A - Deep Work', label: '🟢 Mode A — Deep Work' },
                  { id: 'Mode B - Light Learning', label: '🔵 Mode B — Light Learning' },
                  { id: 'Mode C - Recovery', label: '🟡 Mode C — Recovery' },
                  { id: 'Mode D - Personal', label: '🟣 Mode D — Personal' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onChange({ eveningMode: mode.id as any })}
                    className={`p-2.5 rounded-xl border text-left text-xs font-mono font-bold transition-all cursor-pointer ${
                      dayData.eveningMode === mode.id
                        ? 'bg-brand-purple text-white border-brand-purple shadow-md'
                        : 'bg-black/30 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
                What did I use this 8:00–10:30 window for?
              </label>
              <input
                type="text"
                value={dayData.eveningUsedFor || ''}
                onChange={e => onChange({ eveningUsedFor: e.target.value })}
                placeholder="e.g. Read financial annual reports, relaxed with family, prepared tomorrow's desk"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🧾 10:30 SHUTDOWN JOURNAL & CLOSING REPORT (10-15 MIN) */}
      <div className="bg-gradient-to-b from-[#13131F] to-brand-card border-2 border-brand-purple/40 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-lime bg-brand-lime/10 px-2.5 py-0.5 rounded-full border border-brand-lime/20">
                10:30 PM • 15 MIN CLOSING PROTOCOL
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black italic uppercase text-white tracking-wide mt-1">
              THE SHUTDOWN JOURNAL & DAILY CLOSING REPORT
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              “Don't journal to remember your day. Journal to improve your next day.”
            </p>
          </div>

          {/* 1️⃣ Execution Score (/10) */}
          <div className="bg-black/50 border border-brand-lime/30 rounded-3xl p-4 text-center min-w-[160px]">
            <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-widest">
              1️⃣ Execution Score
            </span>
            <div className="text-2xl font-black text-brand-lime font-mono mt-0.5">
              {dayData.executionScore ?? 8}/10
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.executionScore ?? 8}
              onChange={e => onChange({ executionScore: parseInt(e.target.value) })}
              className="w-28 accent-brand-lime cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* 🏆 WINS vs ❌ MISTAKES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2️⃣ Today's Wins */}
          <div className="bg-black/30 border border-brand-lime/20 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-lime">
              <Award className="w-5 h-5" />
              <h4 className="text-xs font-black uppercase tracking-wider">2️⃣ TODAY'S WINS (MAX 3)</h4>
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-lime">🏆 #{idx + 1}</span>
                  <input
                    type="text"
                    value={wins[idx] || ''}
                    onChange={e => updateWin(idx, e.target.value)}
                    placeholder={
                      idx === 0
                        ? 'Completed full 90m trading study without distraction'
                        : idx === 1
                        ? 'Physio completed and pain dropped from 4 to 2'
                        : 'Disciplined diet and followed pre-market hypothesis'
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-lime"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3️⃣ Today's Mistakes */}
          <div className="bg-black/30 border border-brand-coral/20 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-coral">
              <AlertCircle className="w-5 h-5" />
              <h4 className="text-xs font-black uppercase tracking-wider">3️⃣ TODAY'S MISTAKES (ACTIONABLE)</h4>
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-coral">❌ #{idx + 1}</span>
                  <input
                    type="text"
                    value={mistakes[idx] || ''}
                    onChange={e => updateMistake(idx, e.target.value)}
                    placeholder={
                      idx === 0
                        ? 'Lost 25 minutes reading unrelated news at 11:30'
                        : idx === 1
                        ? 'Rushed Q6 in CAT quant without checking units'
                        : 'Did not drink water before the afternoon block'
                    }
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-coral"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4️⃣ Today's Learning */}
        <div className="bg-black/30 border border-brand-purple/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-purple">
            <Lightbulb className="w-5 h-5" />
            <h4 className="text-xs font-black uppercase tracking-wider">4️⃣ TODAY'S MAJOR LEARNING</h4>
          </div>
          <textarea
            value={dayData.todaysBiggestLearning || ''}
            onChange={e => onChange({ todaysBiggestLearning: e.target.value })}
            rows={2}
            placeholder="At least one core insight or operational truth extracted from today's execution..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-brand-purple resize-none"
          />
        </div>

        {/* 5️⃣ BIGGEST MISTAKE ➔ ROOT CAUSE ANALYSIS (5-WHYS / SYSTEMS THINKING) */}
        <div className="bg-black/40 border border-amber-500/30 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-lg">🔍</span>
              <h4 className="text-xs font-black uppercase tracking-wider">
                5️⃣ ROOT CAUSE ANALYSIS (Problem ➔ Why? ➔ Why? ➔ Solution)
              </h4>
            </div>
            <span className="text-[9px] font-mono text-gray-500">Systems over willpower</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Problem</label>
              <input
                type="text"
                value={rootCause.problem}
                onChange={e => updateRootCause('problem', e.target.value)}
                placeholder="e.g. Broke focus at 11:30 AM and checked social media"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Why? (Level 1)</label>
              <input
                type="text"
                value={rootCause.why1}
                onChange={e => updateRootCause('why1', e.target.value)}
                placeholder="e.g. Phone was sitting right next to my mouse pad"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Why? (Level 2 - Root)</label>
              <input
                type="text"
                value={rootCause.why2}
                onChange={e => updateRootCause('why2', e.target.value)}
                placeholder="e.g. I didn't plug it in another room during the 8:40 transition"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-brand-lime font-bold mb-1">
                Solution / System Change
              </label>
              <input
                type="text"
                value={rootCause.solution}
                onChange={e => updateRootCause('solution', e.target.value)}
                placeholder="e.g. Rule: Phone stays charging in the wardrobe from 8:45 AM to 1:00 PM"
                className="w-full bg-black/50 border border-brand-lime/30 rounded-xl px-3 py-1.5 text-xs text-brand-lime focus:outline-none focus:border-brand-lime font-medium"
              />
            </div>
          </div>
        </div>

        {/* 6️⃣ TOMORROW'S CORRECTION */}
        <div className="bg-black/30 border border-brand-lime/30 rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-brand-lime">
            <Wrench className="w-5 h-5" />
            <h4 className="text-xs font-black uppercase tracking-wider">6️⃣ TOMORROW'S CORRECTION (1–2 ACTIONS)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[0, 1].map(idx => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-lime">🔧 #{idx + 1}</span>
                <input
                  type="text"
                  value={corrections[idx] || ''}
                  onChange={e => updateCorrection(idx, e.target.value)}
                  placeholder={
                    idx === 0
                      ? 'Put phone in drawer before opening pre-market charts'
                      : 'Hydrate 1 full glass immediately before 4:30 CAT session'
                  }
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-lime"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 7️⃣ DAILY HEALTH DASHBOARD */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5 text-brand-lime" />
              <h4 className="text-xs font-black uppercase tracking-wider">7️⃣ DAILY HEALTH DASHBOARD</h4>
            </div>
            <span className="text-[10px] font-mono text-gray-500">Leading Indicators</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Water Target 2.5-3.0L */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-cyan-400" /> Water
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {waterActual} / 3.0L
                </span>
              </div>
              <div className="flex items-center gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => adjustWater(-0.25)}
                  className="px-2 py-0.5 text-[10px] font-mono bg-black/60 hover:bg-white/10 text-gray-400 rounded-lg cursor-pointer"
                >
                  -0.25
                </button>
                <button
                  type="button"
                  onClick={() => adjustWater(+0.25)}
                  className="flex-1 py-0.5 text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 rounded-lg cursor-pointer"
                >
                  +0.25L
                </button>
              </div>
            </div>

            {/* Daily Steps */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
                <Footprints className="w-3 h-3 text-emerald-400" /> Daily Steps
              </span>
              <input
                type="number"
                step="500"
                value={dayData.dailySteps ?? 7500}
                onChange={e => onChange({ dailySteps: parseInt(e.target.value) || 0 })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-emerald-300 font-mono text-center"
              />
            </div>

            {/* Exercise & Physio */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Exercise & Physio</span>
              <div className="flex gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ nonNegRehab: !dayData.nonNegRehab })}
                  className={`flex-1 py-1 text-[10px] font-mono font-black rounded-lg border cursor-pointer ${
                    dayData.nonNegRehab
                      ? 'bg-brand-lime text-black border-brand-lime'
                      : 'bg-black/40 text-gray-500 border-white/5'
                  }`}
                >
                  {dayData.nonNegRehab ? 'PHYSIO ✓' : 'PHYSIO'}
                </button>
              </div>
            </div>

            {/* Screen time */}
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3 space-y-1">
              <span className="text-[10px] font-mono uppercase text-gray-400 block">Screen Time</span>
              <input
                type="text"
                value={dayData.dailyScreenTime || '2h 15m'}
                onChange={e => onChange({ dailyScreenTime: e.target.value })}
                placeholder="2h 15m"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-white font-mono text-center"
              />
            </div>
          </div>
        </div>

        {/* 8️⃣ 7-DIMENSION SCORECARD (/10 EACH) */}
        <div className="bg-black/40 border border-brand-purple/30 rounded-3xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                8️⃣ THE 7-DIMENSION SCORECARD
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                Score every high-leverage pillar of your life honestly out of 10
              </p>
            </div>
            <div className="bg-brand-purple/20 border border-brand-purple/40 px-3 py-1 rounded-xl text-center">
              <span className="text-[9px] font-mono uppercase text-gray-300 block">Overall Day Score</span>
              <span className="text-sm font-black font-mono text-brand-lime">
                {scores.overall}/10
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { key: 'sleepRecovery', label: '🛌 Sleep', val: scores.sleepRecovery },
              { key: 'mental', label: '🧠 Mental', val: scores.mental },
              { key: 'physical', label: '💪 Physical', val: scores.physical },
              { key: 'learning', label: '📚 Learning', val: scores.learning },
              { key: 'trading', label: '📈 Trading', val: scores.trading },
              { key: 'execution', label: '🎯 Execution', val: scores.execution },
              { key: 'lifestyle', label: '🥗 Lifestyle', val: scores.lifestyle }
            ].map(item => (
              <div key={item.key} className="bg-black/50 border border-white/5 rounded-2xl p-2.5 text-center space-y-1">
                <span className="text-[10px] font-bold text-gray-300 block truncate">{item.label}</span>
                <span className="text-base font-black font-mono text-brand-lime block">{item.val}</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={item.val}
                  onChange={e => updateDimensionScore(item.key as keyof SevenDimensionScores, parseInt(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ONE LINE TO CLOSE THE DAY */}
        <div className="bg-black/50 border border-brand-lime/30 rounded-3xl p-5 space-y-2">
          <label className="block text-xs font-black uppercase text-brand-lime tracking-wider">
            ⭐ ONE LINE TO CLOSE THE DAY
          </label>
          <input
            type="text"
            value={dayData.oneLineClose || ''}
            onChange={e => onChange({ oneLineClose: e.target.value })}
            placeholder="“Process over results. Tomorrow will be stronger.”"
            className="w-full bg-black/60 border border-white/10 rounded-2xl p-3 text-sm text-white font-serif italic focus:outline-none focus:border-brand-lime"
          />
        </div>
      </div>
    </div>
  );
}
