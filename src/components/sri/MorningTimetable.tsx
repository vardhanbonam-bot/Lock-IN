import React from 'react';
import { DayData } from '../../types';
import { BookOpen, Sparkles, Clock, Coffee, Droplets, Check, X, Compass, Dumbbell } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function MorningTimetable({ dayData, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* 📚 6:10 - 6:40: READING & MEDITATION */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase text-white tracking-wider">6:10–6:40 — READING + MEDITATION</h3>
                <span className="text-[10px] font-mono text-brand-purple font-bold">MIND PILLAR</span>
              </div>
              <p className="text-[10px] font-mono text-gray-400">Measure key ideas and mental stillness, not endless statistics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* READING LOG */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-purple" /> Book & Pages
              </span>
              <span className="text-[10px] font-mono text-gray-400">Target: 20-30m</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Book Title</label>
                <input
                  type="text"
                  value={dayData.readingBook || dayData.readingWhat || ''}
                  onChange={e => onChange({ readingBook: e.target.value, readingWhat: e.target.value })}
                  placeholder="e.g. Thinking in Bets, Atomic Habits"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Minutes / Pages</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={dayData.readingMinutes || dayData.readingDuration || 25}
                    onChange={e => onChange({ readingMinutes: parseInt(e.target.value) || 0, readingDuration: parseInt(e.target.value) || 0 })}
                    className="w-1/2 bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:border-brand-purple"
                  />
                  <input
                    type="number"
                    value={dayData.readingPages || dayData.kpiPagesRead || 10}
                    onChange={e => onChange({ readingPages: parseInt(e.target.value) || 0, kpiPagesRead: parseInt(e.target.value) || 0 })}
                    placeholder="p."
                    className="w-1/2 bg-black/50 border border-white/10 rounded-xl px-2 py-1.5 text-xs text-brand-lime font-mono text-center focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-brand-lime font-bold mb-1">
                ⭐ 1 Key Idea (What did I learn?)
              </label>
              <textarea
                value={dayData.readingKeyIdea || ''}
                onChange={e => onChange({ readingKeyIdea: e.target.value })}
                rows={2}
                placeholder="e.g. Discipline is more about reducing decision-making than increasing motivation."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-purple resize-none"
              />
            </div>
          </div>

          {/* MEDITATION LOG */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Meditation & Centering
              </span>
              <span className="text-[10px] font-mono text-gray-400">Target: 10-20m</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Duration (min)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dayData.meditationMinutes || dayData.meditationDuration || 15}
                    onChange={e => onChange({ meditationMinutes: parseInt(e.target.value) || 0, meditationDuration: parseInt(e.target.value) || 0, meditationDone: true })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
                  />
                  <span className="text-xs font-mono text-gray-500">min</span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Quality (/5)</label>
                <div className="flex items-center gap-1 pt-0.5">
                  {[1, 2, 3, 4, 5].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onChange({ meditationQuality: q, meditationDone: true })}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        (dayData.meditationQuality || 4) >= q
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-black/40 text-gray-600 border border-white/5'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">
                Meditation Insight / State
              </label>
              <textarea
                value={dayData.meditationInsight || ''}
                onChange={e => onChange({ meditationInsight: e.target.value })}
                rows={2}
                placeholder="e.g. Felt racing thoughts initially, focused on breath diaphragm, settled into calm focus."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-purple resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🌤️ 6:40–7:10 BUFFER WINDOW & 7:10–8:20 FRESHENING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 6:40 - 7:10 BUFFER */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">6:40–7:10 — BUFFER WINDOW</h3>
              <p className="text-[10px] font-mono text-gray-400">Flexible window: walk, stretch, plan, or think</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
                What did you actually use this 30m window for?
              </label>
              <input
                type="text"
                value={dayData.morningBufferUsedFor || ''}
                onChange={e => onChange({ morningBufferUsedFor: e.target.value })}
                placeholder="e.g. 6:40-7:00 Walk outside, 7:00-7:10 Planning day"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-medium"
              />
            </div>

            {/* Quick selector options */}
            <div className="flex flex-wrap gap-1.5">
              {['Walk outside', 'Mobility & stretch', 'Day organization', 'Relaxed tea', 'Spontaneous thinking'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ morningBufferUsedFor: opt })}
                  className="text-[9px] font-mono px-2 py-1 rounded-lg bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            <p className="text-[9px] font-mono text-gray-500 italic">
              Data insight: Tracking this reveals whether this buffer energizes you or slips into scrolling.
            </p>
          </div>
        </div>

        {/* 7:10 - 8:20 PRODUCTIVITY & FRESHENING */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">7:10–8:20 — PRODUCTIVITY + FRESHENING</h3>
              <p className="text-[10px] font-mono text-gray-400">Mobility, bath, preparation & intentional pacing</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Morning Activity (min)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={dayData.morningPhysicalActivityMinutes ?? 20}
                  onChange={e => onChange({ morningPhysicalActivityMinutes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
                />
                <span className="text-xs font-mono text-gray-500">min</span>
              </div>
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Freshened up by</label>
              <input
                type="time"
                value={dayData.freshenedUpBy || '08:15'}
                onChange={e => onChange({ freshenedUpBy: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Morning Prep Routine Complete?</span>
            <button
              type="button"
              onClick={() => onChange({ morningRoutineCompleted: !dayData.morningRoutineCompleted })}
              className={`px-3 py-1 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                dayData.morningRoutineCompleted
                  ? 'bg-brand-lime text-black border-brand-lime'
                  : 'bg-black/40 text-gray-500 border-white/10'
              }`}
            >
              {dayData.morningRoutineCompleted ? 'COMPLETED ✓' : 'PENDING ✗'}
            </button>
          </div>
        </div>
      </div>

      {/* 🍳 8:20–8:40 BREAKFAST & NUTRITION */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">8:20–8:40 — BREAKFAST & NOURISHMENT</h3>
              <p className="text-[10px] font-mono text-gray-400">High-leverage nutrition variables without neurotic calorie counting</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quality ⭐ / 5 */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-1">
            <span className="block text-[10px] font-mono uppercase text-gray-400">Breakfast Quality</span>
            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4, 5].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onChange({ breakfastQuality: q })}
                  className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    (dayData.breakfastQuality || 4) >= q
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-black/40 text-gray-600 border border-white/5'
                  }`}
                >
                  ★{q}
                </button>
              ))}
            </div>
          </div>

          {/* Protein included? */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Protein Included?</span>
              <span className="text-[9px] font-mono text-gray-500">Eggs, whey, paneer, tofu</span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ breakfastProtein: !dayData.breakfastProtein })}
              className={`px-3 py-1.5 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                dayData.breakfastProtein
                  ? 'bg-brand-lime text-black border-brand-lime'
                  : 'bg-black/40 text-gray-500 border-white/10'
              }`}
            >
              {dayData.breakfastProtein ? 'YES ✓' : 'NO ✗'}
            </button>
          </div>

          {/* Junk/Processed food? */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Junk / Processed Food?</span>
              <span className="text-[9px] font-mono text-gray-500">Refined sugars, deep fried</span>
            </div>
            <button
              type="button"
              onClick={() => onChange({ breakfastJunkFood: !dayData.breakfastJunkFood })}
              className={`px-3 py-1.5 text-xs font-mono font-black rounded-xl border transition-all cursor-pointer ${
                dayData.breakfastJunkFood
                  ? 'bg-brand-coral text-white border-brand-coral'
                  : 'bg-brand-lime/10 text-brand-lime border-brand-lime/30'
              }`}
            >
              {dayData.breakfastJunkFood ? 'YES (Junk)' : 'CLEAN ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
