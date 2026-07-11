import React, { useState } from 'react';
import { DayData } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Dumbbell, GlassWater, BookOpen, Newspaper, Lightbulb, 
  Footprints, CheckCircle2, AlertCircle, Award, Sparkles, Plus, Trash2, Clock
} from 'lucide-react';

interface InduTrackerProps {
  dayData: DayData;
  onChange: (updatedData: Partial<DayData>) => void;
  streakCount: number;
}

export default function InduTracker({ dayData, onChange, streakCount }: InduTrackerProps) {
  const [exerciseInput, setExerciseInput] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // Parse exercise list as an array for checklist rendering
  const exercises = dayData.induExercisesList
    ? dayData.induExercisesList.split(',').map(item => item.trim()).filter(Boolean)
    : [];

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseInput.trim()) return;
    const newList = [...exercises, exerciseInput.trim()].join(', ');
    onChange({ 
      induExercisesList: newList,
      induExercisesDone: true 
    });
    setExerciseInput('');
  };

  const handleRemoveExercise = (indexToRemove: number) => {
    const updated = exercises.filter((_, idx) => idx !== indexToRemove);
    onChange({
      induExercisesList: updated.join(', '),
      induExercisesDone: updated.length > 0
    });
  };

  // Helper: check completion percentage of Indu's core habits
  const completedHabits = [
    dayData.wakeTime ? 1 : 0,
    dayData.induExercisesDone ? 1 : 0,
    dayData.induWater10Glasses ? 1 : 0,
    dayData.induPreparedForClass ? 1 : 0,
    dayData.induReadNewspaper ? 1 : 0,
    dayData.induWalked5Km ? 1 : 0,
    dayData.induDeepSleepHours && dayData.induDeepSleepHours >= 3 ? 1 : 0
  ];
  
  const totalCoreCount = completedHabits.length;
  const completedCoreCount = completedHabits.reduce((a, b) => a + b, 0);
  const completionPct = Math.round((completedCoreCount / totalCoreCount) * 100);

  const handleToggleWater = () => {
    const nextVal = !dayData.induWater10Glasses;
    if (nextVal) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    onChange({ induWater10Glasses: nextVal });
  };

  return (
    <div className="space-y-6">
      
      {/* 🌟 SATISFACTION HERO SCOREBOARD */}
      <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-brand-coral animate-pulse" />
              <span className="text-xs font-black text-brand-coral font-mono uppercase tracking-widest">
                Growth & Class Protocol
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tight font-display">
              INDU'S DAILY POWER HUB
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Lock in your non-negotiables, log active classroom prep, track physical walking benchmarks, and compound daily victories.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-black/40 border border-white/5 rounded-2xl p-4 w-full md:w-auto justify-around">
            <div className="text-center">
              <span className="text-[10px] text-gray-500 font-mono block uppercase">Streak</span>
              <span className="text-2xl font-black text-white font-mono">{streakCount} 🔥</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <span className="text-[10px] text-gray-500 font-mono block uppercase">Daily Completion</span>
              <span className="text-2xl font-black text-brand-lime font-mono">{completionPct}%</span>
            </div>
          </div>
        </div>

        {/* Global Progress Line */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-2">
            <span>Protocol Mastery Level</span>
            <span>{completedCoreCount} / {totalCoreCount} Tasks Complete</span>
          </div>
          <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-brand-purple to-brand-coral h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(255,92,122,0.3)]"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 📊 BENTO GRID LOGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD 1: SLEEP & WAKE CIRCADIAN ALIGNMENT */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-brand-purple/10 rounded-xl text-brand-purple">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Circadian Baseline</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5 font-mono">Wake Up Timestamp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-lime text-xs">⏰</span>
                  <input 
                    type="text" 
                    value={dayData.wakeTime || ''}
                    onChange={e => onChange({ wakeTime: e.target.value })}
                    placeholder="e.g. 06:30 AM"
                    className="w-full bg-black/60 border border-brand-border/60 rounded-xl pl-9 pr-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-300 font-mono">Deep Sleep Hours</label>
                  <span className="text-xs font-black font-mono text-brand-purple">{dayData.induDeepSleepHours || 0} hrs</span>
                </div>
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-brand-purple shrink-0" />
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={dayData.induDeepSleepHours || 0}
                    onChange={e => onChange({ induDeepSleepHours: parseFloat(e.target.value) })}
                    className="flex-1 accent-brand-purple cursor-pointer h-1.5 bg-black/60 rounded-lg"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  Maintain at least 3-4 hours of high-quality deep sleep.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Sleep Index</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              (dayData.induDeepSleepHours || 0) >= 3.5 ? 'bg-brand-lime/10 text-brand-lime' : 'bg-brand-coral/10 text-brand-coral'
            }`}>
              {(dayData.induDeepSleepHours || 0) >= 3.5 ? 'OPTIMAL' : 'RECOVERING'}
            </span>
          </div>
        </div>

        {/* CARD 2: EXERCISES & TRAINING CHECKLIST */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-coral/10 rounded-xl text-brand-coral">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Physical Exercise</span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ induExercisesDone: !dayData.induExercisesDone })}
                className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl transition-all ${
                  dayData.induExercisesDone 
                    ? 'bg-brand-lime/20 text-brand-lime border border-brand-lime/30' 
                    : 'bg-black/40 text-gray-400 border border-white/5'
                }`}
              >
                {dayData.induExercisesDone ? '✓ WORKED OUT' : 'NO WORKOUT'}
              </button>
            </div>

            {/* Exercise List Input Form */}
            <form onSubmit={handleAddExercise} className="flex gap-2 mb-3">
              <input 
                type="text"
                placeholder="Add exercise name..."
                value={exerciseInput}
                onChange={e => setExerciseInput(e.target.value)}
                className="flex-1 bg-black/60 border border-brand-border/60 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-brand-coral"
              />
              <button 
                type="submit"
                className="p-1.5 bg-brand-coral/15 border border-brand-coral/30 hover:bg-brand-coral hover:text-white text-brand-coral rounded-xl transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Render exercises checkboxes */}
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {exercises.length === 0 ? (
                  <div className="text-[11px] text-gray-500 italic py-4 text-center">
                    No exercises entered yet. Add items above.
                  </div>
                ) : (
                  exercises.map((item, index) => (
                    <motion.div 
                      key={`${item}-${index}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      className="flex items-center justify-between bg-black/30 border border-white/5 px-2.5 py-1.5 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-brand-lime text-[10px]">●</span>
                        <span className="text-gray-300 font-medium truncate">{item}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveExercise(index)}
                        className="text-gray-500 hover:text-brand-coral p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 mt-3 border-t border-white/5 pt-2">
            Exercises drive metabolic rate and neural focus. Lock it in daily!
          </p>
        </div>

        {/* CARD 3: 10 GLASSES OF WATER LOG */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-brand-lime/10 rounded-xl text-brand-lime">
                <GlassWater className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Hydration Protocol</span>
            </div>

            <div className="text-center py-4 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden">
              <AnimatePresence>
                {showCelebration && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="absolute inset-0 bg-brand-lime/10 flex items-center justify-center font-bold text-brand-lime text-xs tracking-wider uppercase font-mono z-10"
                  >
                    💦 HYDRATION TARGET COMPLETED!
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Status Check</span>
              <button 
                type="button"
                onClick={handleToggleWater}
                className={`text-3xl font-black font-display tracking-tight italic transition-all ${
                  dayData.induWater10Glasses ? 'text-brand-lime scale-105' : 'text-gray-400 hover:text-white'
                }`}
              >
                {dayData.induWater10Glasses ? '10 GLASSES COMPLETE ✓' : 'TAP TO SECURE 🥤'}
              </button>
              <p className="text-[10px] text-gray-400 mt-2 font-mono">
                {dayData.induWater10Glasses ? 'Elite cell hydration achieved.' : 'Target: Drank 10 glasses of water.'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Target glasses</span>
            <span className="text-xs font-bold text-brand-lime font-mono">10 Glasses/Day</span>
          </div>
        </div>

        {/* CARD 4: WALKING ACTIVITY PROTOCOL */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-brand-lime/10 rounded-xl text-brand-lime">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Aerobic Benchmarks</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-4">
                <div>
                  <h4 className="text-xs font-black text-white font-mono uppercase">Walked At Least 5 KM</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Enforces cardiovascular base layer</p>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ induWalked5Km: !dayData.induWalked5Km })}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                    dayData.induWalked5Km ? 'bg-brand-lime' : 'bg-gray-800'
                  }`}
                >
                  <div className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    dayData.induWalked5Km ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="w-full bg-black/50 p-3 rounded-xl border border-white/5 text-[11px] leading-relaxed text-gray-400">
                <span className="text-brand-lime font-bold">🧠 PERFORMANCE NOTES:</span> Walking triggers lateral eye movements, lowering amygdala threat response and optimizing focus.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-500">
            <span>Minimum distance</span>
            <span className="text-brand-lime font-black">5.0 KM</span>
          </div>
        </div>

        {/* CARD 5: CLASS PREPARATION & NEWS MEDIA */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-brand-purple/10 rounded-xl text-brand-purple">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Daily Academic Readiness</span>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => onChange({ induPreparedForClass: !dayData.induPreparedForClass })}
                className={`p-3 border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                  dayData.induPreparedForClass 
                    ? 'bg-brand-purple/15 border-brand-purple text-white shadow-md' 
                    : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${dayData.induPreparedForClass ? 'bg-brand-purple text-white' : 'bg-black/40 text-gray-500'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold font-mono">Prepared For Class Today</h4>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">Checked subjects, syllabus notes, slide sheets</p>
                </div>
              </div>

              <div 
                onClick={() => onChange({ induReadNewspaper: !dayData.induReadNewspaper })}
                className={`p-3 border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                  dayData.induReadNewspaper 
                    ? 'bg-brand-coral/15 border-brand-coral text-white shadow-md' 
                    : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${dayData.induReadNewspaper ? 'bg-brand-coral text-white' : 'bg-black/40 text-gray-500'}`}>
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold font-mono">Read Newspaper</h4>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">Updated on global events, tech, business news</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 mt-4 border-t border-white/5 pt-2">
            Regular class prep and broad reading prevents cramming and raises scores.
          </p>
        </div>

        {/* CARD 6: COMPLEMENTARY HIGHLIGHT (NEW THINGS LOG) */}
        <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-coral/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-coral/10 rounded-xl text-brand-coral">
                  <Lightbulb className="w-4 h-4 animate-bounce" />
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest font-mono">Curiosity Engine</span>
              </div>
              
              <button
                type="button"
                onClick={() => onChange({ induLearnedNewThing: !dayData.induLearnedNewThing })}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  dayData.induLearnedNewThing ? 'bg-brand-coral/20 text-brand-coral' : 'bg-black/40 text-gray-500'
                }`}
              >
                {dayData.induLearnedNewThing ? '✓ YES, LEARNED' : 'NO ENTRY'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1 font-mono">What did you learn today?</label>
                <textarea 
                  value={dayData.induNewThingText || ''}
                  onChange={e => onChange({ 
                    induNewThingText: e.target.value,
                    induLearnedNewThing: e.target.value.trim().length > 0
                  })}
                  placeholder="e.g. Learned about TypeScript keyof operators or how the human heart maintains circadian balance..."
                  rows={4}
                  className="w-full bg-black/60 border border-brand-border/60 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-brand-coral leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 mt-3 pt-2 border-t border-white/5 leading-tight flex items-center justify-between font-mono">
            <span>Learn index</span>
            <span className="text-brand-coral font-bold uppercase">Compound Interest</span>
          </div>
        </div>

      </div>

      {/* 🔒 PROTOCOL VERIFICATION & CONFIRMATION BOX */}
      <div className="bg-brand-dark-gray border border-brand-border/60 rounded-3xl p-6 text-center space-y-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <div className={`p-3 rounded-full ${dayData.isConfirmed ? 'bg-brand-lime/10 text-brand-lime' : 'bg-brand-purple/10 text-brand-purple animate-pulse'}`}>
              <Award className="w-8 h-8" />
            </div>
          </div>
          
          <h3 className="text-lg font-black text-white uppercase tracking-tight font-display italic">
            {dayData.isConfirmed ? 'PROTCOHOL LOCK ACTIVE ✓' : 'VERIFY & LOCK TODAY\'S PROTOCOL'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {dayData.isConfirmed 
              ? 'This date is locked into your permanent historical database. No further edits required.'
              : 'Verifying that all logged benchmarks represent accurate personal performance. Ready to compile into history.'}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => onChange({ isConfirmed: !dayData.isConfirmed })}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                dayData.isConfirmed
                  ? 'bg-brand-lime text-black shadow-[0_0_15px_rgba(198,255,61,0.4)]'
                  : 'bg-brand-purple text-white hover:bg-brand-purple/95 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
              }`}
            >
              {dayData.isConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[3px]" />
                  Protocol Locked In
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 stroke-[2.5px]" />
                  Secure and Lock Log
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
