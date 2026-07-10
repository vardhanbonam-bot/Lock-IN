import React, { useState, useEffect } from 'react';
import { DayData, RehabSession } from '../types';
import { createBlankDay } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Coffee, Flame, Heart, Sparkles, Plus, Minus,
  CheckCircle2, AlertCircle, Dumbbell, Calendar, ChevronLeft, 
  ChevronRight, Smile, EyeOff, BookOpen, Clock, Activity, Zap, Trash2
} from 'lucide-react';

interface TrackerTabProps {
  dayData: DayData;
  onChange: (updatedData: Partial<DayData>) => void;
  streakCount: number;
}

export default function TrackerTab({ dayData, onChange, streakCount }: TrackerTabProps) {
  // Local state for confetti or celebration burst
  const [showCelebration, setShowCelebration] = useState(false);

  // Sync state and check completion
  const nonNegCompletedCount = 
    (dayData.nonNegRehab ? 1 : 0) + 
    (dayData.nonNegMeditation ? 1 : 0) + 
    (dayData.nonNegWaterNutrition ? 1 : 0);

  const bonusCompletedCount =
    (dayData.bonusReading ? 1 : 0) +
    (dayData.bonusJournal ? 1 : 0) +
    (dayData.bonusDeepStudy ? 1 : 0) +
    (dayData.bonusFocusProtected ? 1 : 0);

  // Trigger celebration when 3/3 non-negotiables are completed
  useEffect(() => {
    if (nonNegCompletedCount === 3) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [nonNegCompletedCount]);

  // Handle nested Rehab Session updates
  const updateRehab1Exercise = (index: number, done: boolean) => {
    const updatedExercises = [...dayData.rehab1.exercises];
    updatedExercises[index] = { ...updatedExercises[index], done };
    
    // Automatically flag rehab non-negotiable if both sessions are complete
    const rehab1Done = updatedExercises.every(e => e.done);
    const rehab2Done = dayData.rehab2.exercises.every(e => e.done);
    
    onChange({
      rehab1: { ...dayData.rehab1, exercises: updatedExercises },
      nonNegRehab: rehab1Done && rehab2Done
    });
  };

  const updateRehab2Exercise = (index: number, done: boolean) => {
    const updatedExercises = [...dayData.rehab2.exercises];
    updatedExercises[index] = { ...updatedExercises[index], done };
    
    const rehab1Done = dayData.rehab1.exercises.every(e => e.done);
    const rehab2Done = updatedExercises.every(e => e.done);

    onChange({
      rehab2: { ...dayData.rehab2, exercises: updatedExercises },
      nonNegRehab: rehab1Done && rehab2Done
    });
  };

  const isSunday = () => {
    if (!dayData.date) return false;
    // Format YYYY-MM-DD
    const d = new Date(dayData.date);
    return d.getDay() === 0; // 0 is Sunday
  };

  // KPI helper displays
  const totalDeepWorkHours = (dayData.deepWork1Hours || 0) + (dayData.deepWork2Hours || 0);

  return (
    <div className="space-y-6">
      {/* 🚀 HIGHEST LEVEL SUMMARY BANNER (STREAK + PROGRESS) */}
      <div id="summary-hero-card" className="relative overflow-hidden bg-brand-card border border-brand-purple/40 rounded-3xl p-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        {/* Abstract absolute background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-brand-lime animate-pulse" />
            </div>
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-brand-purple font-black">Streak Status</div>
              <div className="text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                {streakCount} {streakCount === 1 ? 'DAY' : 'DAYS'} LOCKED IN 
                <span className="text-brand-lime">🔒</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {streakCount > 0 ? "You're building momentum. Don't break the chain!" : "Day 1 starts now. Secure the floor."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:w-auto w-full">
            <div className="bg-black/40 border border-brand-border/40 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">The Floor</div>
              <div className="text-xl font-black text-brand-lime mt-1 flex items-center justify-center gap-1 italic">
                {nonNegCompletedCount}/3
                <span className="text-xs text-gray-400 font-normal">checked</span>
              </div>
              <div className="w-full bg-black h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-brand-lime h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(nonNegCompletedCount / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-black/40 border border-brand-border/40 rounded-2xl p-3 text-center">
              <div className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">Bonus Goals</div>
              <div className="text-xl font-black text-brand-purple mt-1 flex items-center justify-center gap-1 italic">
                {bonusCompletedCount}/4
                <span className="text-xs text-gray-400 font-normal">done</span>
              </div>
              <div className="w-full bg-black h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-brand-purple h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(bonusCompletedCount / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-black/40 border border-brand-border/40 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">Deep Work</div>
              <div className="text-xl font-black text-white mt-1 italic">
                {totalDeepWorkHours} hrs
              </div>
              <p className="text-[9px] font-black font-mono text-brand-lime mt-2 tracking-widest">FOCUS SECURED</p>
            </div>
          </div>
        </div>

        {/* Celebration Notification overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute inset-0 bg-brand-lime text-black flex flex-col items-center justify-center text-center p-6 rounded-3xl font-display"
            >
              <Sparkles className="w-10 h-10 mb-1 animate-bounce" />
              <h3 className="text-2xl font-black uppercase tracking-wider italic">FLOOR IS LOCKED IN! 🔒</h3>
              <p className="text-sm font-mono font-bold mt-1">NO NEGOTIABLES COMPLETED. DAY SECURED 💪</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🚀 BENTO GRID OF CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 1: 🌅 AM GRIND */}
        <div id="am-grind-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <Sun className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-black italic uppercase text-brand-lime tracking-wide">AM GRIND ROUTINE</h3>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Wake-up Time</label>
              <input 
                type="time" 
                value={dayData.wakeTime || ''}
                onChange={e => onChange({ wakeTime: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Target Window</label>
              <input 
                type="text" 
                value={dayData.targetWakeWindow || ''}
                onChange={e => onChange({ targetWakeWindow: e.target.value })}
                placeholder="06:00 - 06:30"
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
              />
            </div>
          </div>

          {/* No-Phone Hour */}
          <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-brand-purple" />
                <span className="text-sm font-semibold text-white">No-Phone First Hour</span>
              </div>
              <button
                onClick={() => onChange({ noPhoneHour: !dayData.noPhoneHour })}
                className={`px-3 py-1 text-xs uppercase font-mono font-bold rounded-lg border transition-all duration-200 ${
                  dayData.noPhoneHour 
                    ? 'bg-brand-lime/10 border-brand-lime text-brand-lime' 
                    : 'bg-brand-coral/10 border-brand-coral/40 text-brand-coral'
                }`}
              >
                {dayData.noPhoneHour ? 'HELD 🔒' : 'BROKEN 📱'}
              </button>
            </div>
            {!dayData.noPhoneHour && (
              <input 
                type="text"
                placeholder="Why did we break focus? Log it honestly..."
                value={dayData.noPhoneNote || ''}
                onChange={e => onChange({ noPhoneNote: e.target.value })}
                className="w-full bg-brand-bg border border-brand-coral/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-coral"
              />
            )}
          </div>

          {/* Water Intake */}
          <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold text-white">Water Intake Tracker</span>
              </div>
              <span className="text-xs font-mono text-gray-400">First glass: {dayData.waterFirstGlass || '--:--'}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-brand-bg border border-white/10 rounded-lg p-1">
                <button 
                  onClick={() => onChange({ waterTotalGlasses: Math.max(0, dayData.waterTotalGlasses - 1) })}
                  className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-white text-base">
                  {dayData.waterTotalGlasses}
                </span>
                <button 
                  onClick={() => {
                    const nextCount = dayData.waterTotalGlasses + 1;
                    const updates: Partial<DayData> = { waterTotalGlasses: nextCount };
                    if (nextCount === 1 && !dayData.waterFirstGlass) {
                      const now = new Date();
                      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      updates.waterFirstGlass = timeStr;
                    }
                    // Auto toggle water non-negotiable if >= 8 glasses
                    if (nextCount >= 8) {
                      updates.nonNegWaterNutrition = true;
                    }
                    onChange(updates);
                  }}
                  className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white"
                >
                  <Plus className="w-4 h-4 text-brand-lime" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                  <span>Progress to 8 glasses</span>
                  <span className={dayData.waterTotalGlasses >= 8 ? 'text-brand-lime font-bold' : ''}>
                    {Math.min(100, Math.round((dayData.waterTotalGlasses / 8) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (dayData.waterTotalGlasses / 8) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Morning Routine: Meditation & Reading & Snack */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onChange({ 
                  meditationDone: !dayData.meditationDone,
                  nonNegMeditation: !dayData.meditationDone // Auto-sync non-neg too
                })}
                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                  dayData.meditationDone 
                    ? 'bg-brand-lime border-brand-lime text-black' 
                    : 'border-white/20 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-white">Daily Zen Meditation</span>
                  <span className="text-xs font-mono text-gray-400">{dayData.meditationDuration} mins</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  step="5"
                  value={dayData.meditationDuration || 0}
                  onChange={e => onChange({ meditationDuration: parseInt(e.target.value) })}
                  className="w-full accent-brand-purple mt-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Morning Walk Dist (km)</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="3.2"
                  value={dayData.morningWalkDistance || ''}
                  onChange={e => onChange({ morningWalkDistance: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Morning Walk Feel</label>
                <input 
                  type="text" 
                  placeholder="Tight calves, but fluid movement..."
                  value={dayData.morningWalkFeel || ''}
                  onChange={e => onChange({ morningWalkFeel: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Reading productive session</label>
                <input 
                  type="text" 
                  placeholder="Atomic Habits / Tech Blog"
                  value={dayData.readingWhat || ''}
                  onChange={e => onChange({ readingWhat: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Reading duration (mins)</label>
                <input 
                  type="number" 
                  placeholder="20"
                  value={dayData.readingDuration || ''}
                  onChange={e => onChange({ readingDuration: parseInt(e.target.value) || 0 })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Pre-workout Snack</label>
                <input 
                  type="text" 
                  placeholder="Banana, honey & pre-workout"
                  value={dayData.preWorkoutSnack || ''}
                  onChange={e => onChange({ preWorkoutSnack: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Breakfast Time</label>
                  <input 
                    type="time" 
                    value={dayData.breakfastTime || ''}
                    onChange={e => onChange({ breakfastTime: e.target.value })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-brand-purple font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Breakfast Food</label>
                  <input 
                    type="text" 
                    placeholder="Eggs, sourdough..."
                    value={dayData.breakfastWhat || ''}
                    onChange={e => onChange({ breakfastWhat: e.target.value })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-brand-purple text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: ☀️ MIDDAY FLOW */}
        <div id="midday-flow-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Activity className="w-6 h-6 text-brand-purple" />
              <h3 className="text-xl font-black italic uppercase text-brand-purple tracking-wide">MIDDAY FLOW ROUTINE</h3>
            </div>

            {/* Deep Work Block 1 */}
            <div className="bg-brand-bg/50 border border-brand-purple/20 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-lime" />
                  <span className="text-sm font-semibold text-white uppercase tracking-wider">Deep Work Block 1</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 bg-brand-purple/20 border border-brand-purple/40 text-brand-purple rounded">
                  AM FLOW
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Focused Task</label>
                <input 
                  type="text" 
                  placeholder="Refactoring auth state & backend schemas..."
                  value={dayData.deepWork1Task || ''}
                  onChange={e => onChange({ deepWork1Task: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Hours Logged ({dayData.deepWork1Hours} hrs)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="8" 
                    step="0.5"
                    value={dayData.deepWork1Hours || 0}
                    onChange={e => onChange({ deepWork1Hours: parseFloat(e.target.value) || 0 })}
                    className="w-full accent-brand-purple cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <span>0h</span>
                    <span>4h</span>
                    <span>8h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Focus Quality ({dayData.deepWork1Focus}/10)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    step="1"
                    value={dayData.deepWork1Focus || 5}
                    onChange={e => onChange({ deepWork1Focus: parseInt(e.target.value) || 5 })}
                    className="w-full accent-brand-lime cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <span>Distracted 🧠💨</span>
                    <span>God Mode ⚡</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Lunch Time</label>
                <input 
                  type="time" 
                  value={dayData.lunchTime || ''}
                  onChange={e => onChange({ lunchTime: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Lunch Meals</label>
                <input 
                  type="text" 
                  placeholder="Chicken steak & rice, boiled greens..."
                  value={dayData.lunchWhat || ''}
                  onChange={e => onChange({ lunchWhat: e.target.value })}
                  className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>
            </div>

            {/* Nap Section */}
            <div className="bg-brand-bg/50 border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-white font-semibold">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Midday Recovery Nap</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Nap Duration (mins)</label>
                  <input 
                    type="number" 
                    placeholder="20"
                    value={dayData.napDuration || ''}
                    onChange={e => onChange({ napDuration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Woke Up Feeling</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => onChange({ napFeel: 'refreshed' })}
                      className={`py-1.5 px-2 text-xs uppercase font-mono font-bold rounded-lg border transition-all ${
                        dayData.napFeel === 'refreshed'
                          ? 'bg-brand-lime/10 border-brand-lime text-brand-lime'
                          : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      Refreshed 😊
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ napFeel: 'groggy' })}
                      className={`py-1.5 px-2 text-xs uppercase font-mono font-bold rounded-lg border transition-all ${
                        dayData.napFeel === 'groggy'
                          ? 'bg-brand-coral/10 border-brand-coral/60 text-brand-coral'
                          : 'bg-transparent border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      Groggy 🥱
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 text-center">
            <span className="text-xs font-mono text-gray-500 uppercase">⚡ FLOW RATIO SECURED: {(totalDeepWorkHours / 8 * 100).toFixed(0)}% OF TOTAL WORK POTENTIAL</span>
          </div>
        </div>

        {/* CARD 3: 🌇 PM / EVENING GRIND */}
        <div id="pm-grind-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <Moon className="w-6 h-6 text-brand-purple" />
            <h3 className="text-xl font-black italic uppercase text-brand-purple tracking-wide">PM & EVENING CLOSEOUT</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Evening Snack</label>
              <input 
                type="text" 
                placeholder="Whey shake, handful of nuts..."
                value={dayData.eveningSnack || ''}
                onChange={e => onChange({ eveningSnack: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Hobby / Learning Session</label>
              <input 
                type="text" 
                placeholder="Piano / Geopolitics / Chess..."
                value={dayData.hobbyWhat || ''}
                onChange={e => onChange({ hobbyWhat: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Hobby Duration (mins)</label>
            <input 
              type="number" 
              placeholder="30"
              value={dayData.hobbyDuration || ''}
              onChange={e => onChange({ hobbyDuration: parseInt(e.target.value) || 0 })}
              className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
            />
          </div>

          {/* Deep Work Block 2 */}
          <div className="bg-brand-bg/50 border border-brand-purple/20 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-lime" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">Deep Work Block 2</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-brand-lime/10 border border-brand-lime/40 text-brand-lime rounded">
                PM SHIFT
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Focused Task</label>
              <input 
                type="text" 
                placeholder="Writing documentation & server error logs..."
                value={dayData.deepWork2Task || ''}
                onChange={e => onChange({ deepWork2Task: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Hours Logged ({dayData.deepWork2Hours} hrs)</label>
                <input 
                  type="range" 
                  min="0" 
                  max="8" 
                  step="0.5"
                  value={dayData.deepWork2Hours || 0}
                  onChange={e => onChange({ deepWork2Hours: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Focus Quality ({dayData.deepWork2Focus}/10)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={dayData.deepWork2Focus || 5}
                  onChange={e => onChange({ deepWork2Focus: parseInt(e.target.value) || 5 })}
                  className="w-full accent-brand-lime cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Dinner Time</label>
              <input 
                type="time" 
                value={dayData.dinnerTime || ''}
                onChange={e => onChange({ dinnerTime: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Dinner What</label>
              <input 
                type="text" 
                placeholder="Salmon steak, asparagus, rice..."
                value={dayData.dinnerWhat || ''}
                onChange={e => onChange({ dinnerWhat: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Target Sleep Time</label>
            <input 
              type="time" 
              value={dayData.sleepTime || ''}
              onChange={e => onChange({ sleepTime: e.target.value })}
              className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono uppercase text-gray-400">Lines of Real-talk Journaling</label>
              <span className="text-[10px] font-mono text-brand-purple uppercase">Honest review</span>
            </div>
            <textarea 
              rows={2}
              placeholder="What went perfect? What did you slack on? Give it to yourself straight..."
              value={dayData.journalLines || ''}
              onChange={e => onChange({ journalLines: e.target.value })}
              className="w-full bg-brand-bg border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
            />
          </div>
        </div>

        {/* CARD 4: ⚙️ REHAB RECOVERY */}
        <div id="rehab-recovery-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Dumbbell className="w-6 h-6 text-brand-lime" />
              <h3 className="text-xl font-black italic uppercase text-brand-lime tracking-wide">REHAB PHYSIOTHERAPY ROUTINE</h3>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Completing all exercises in both AM & PM Rehab sessions automatically locks in your daily Rehab Non-Negotiable!
            </p>

            {/* Rehab Session 1 */}
            <div className="bg-brand-bg/50 border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-bold">REHAB AM SESSION</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {dayData.rehab1.exercises.filter(e => e.done).length}/{dayData.rehab1.exercises.length} Complete
                </span>
              </div>

              <div className="space-y-2">
                {dayData.rehab1.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <button 
                      onClick={() => updateRehab1Exercise(index, !exercise.done)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        exercise.done 
                          ? 'bg-brand-lime border-brand-lime text-black' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {exercise.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`text-sm ${exercise.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {exercise.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain Before ({dayData.rehab1.painBefore}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={dayData.rehab1.painBefore || 5}
                    onChange={e => onChange({ rehab1: { ...dayData.rehab1, painBefore: parseInt(e.target.value) || 5 } })}
                    className="w-full accent-brand-coral cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain After ({dayData.rehab1.painAfter}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={dayData.rehab1.painAfter || 3}
                    onChange={e => onChange({ rehab1: { ...dayData.rehab1, painAfter: parseInt(e.target.value) || 3 } })}
                    className="w-full accent-brand-lime cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Rehab Session 2 */}
            <div className="bg-brand-bg/50 border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-purple font-bold">REHAB PM SESSION</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {dayData.rehab2.exercises.filter(e => e.done).length}/{dayData.rehab2.exercises.length} Complete
                </span>
              </div>

              <div className="space-y-2">
                {dayData.rehab2.exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <button 
                      onClick={() => updateRehab2Exercise(index, !exercise.done)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        exercise.done 
                          ? 'bg-brand-purple border-brand-purple text-white' 
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {exercise.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`text-sm ${exercise.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {exercise.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain Before ({dayData.rehab2.painBefore}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={dayData.rehab2.painBefore || 5}
                    onChange={e => onChange({ rehab2: { ...dayData.rehab2, painBefore: parseInt(e.target.value) || 5 } })}
                    className="w-full accent-brand-coral cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain After ({dayData.rehab2.painAfter}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={dayData.rehab2.painAfter || 3}
                    onChange={e => onChange({ rehab2: { ...dayData.rehab2, painAfter: parseInt(e.target.value) || 3 } })}
                    className="w-full accent-brand-lime cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 mt-4">
            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold uppercase transition-all duration-300 ${
              dayData.nonNegRehab 
                ? 'bg-brand-lime/10 border-brand-lime text-brand-lime animate-pulse'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}>
              <Dumbbell className="w-4 h-4" />
              {dayData.nonNegRehab ? 'REHAB SECURED FOR THE DAY 💪' : 'PENDING REHAB COMPILATION ⏳'}
            </div>
          </div>
        </div>

        {/* CARD 5: 📊 CORE KPIs & CHECKS */}
        <div id="kpis-checks-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 lg:col-span-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-brand-lime" />
              <h3 className="text-xl font-black italic uppercase text-brand-lime tracking-wide">CORE PERFORMANCE & FLOOR CONTROLS</h3>
            </div>
            <span className="text-xs font-mono text-gray-500 font-bold uppercase tracking-widest">DAY STATUS SUMMARY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Checklists column */}
            <div className="space-y-6">
              {/* NON-NEGOTIABLES CHECKLIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-display font-black tracking-wider text-brand-coral uppercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 animate-bounce" />
                    THE DAILY FLOOR (Non-Negotiables)
                  </h4>
                  <span className="text-[10px] font-mono bg-brand-coral/15 border border-brand-coral/40 text-brand-coral px-2 py-0.5 rounded uppercase">
                    DRIVES THE STREAK
                  </span>
                </div>
                
                <div className="space-y-3 bg-brand-bg/40 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs text-gray-400">Required core actions to maintain daily streak.</span>
                    <span className="text-xs font-mono font-bold text-brand-lime">{nonNegCompletedCount}/3 Complete</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <label className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={dayData.nonNegRehab}
                          onChange={e => onChange({ nonNegRehab: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 text-brand-lime focus:ring-brand-lime accent-brand-lime"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">Full Rehab Protocol</div>
                          <p className="text-xs text-gray-500">Do all exercises in both physiotherapy blocks</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        dayData.nonNegRehab ? 'bg-brand-lime/10 text-brand-lime' : 'bg-white/5 text-gray-500'
                      }`}>
                        {dayData.nonNegRehab ? 'SECURED' : 'PENDING'}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={dayData.nonNegMeditation}
                          onChange={e => onChange({ nonNegMeditation: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 text-brand-lime focus:ring-brand-lime accent-brand-lime"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">Daily Zen Meditation</div>
                          <p className="text-xs text-gray-500">Complete at least 10 minutes of breathing flow</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        dayData.nonNegMeditation ? 'bg-brand-lime/10 text-brand-lime' : 'bg-white/5 text-gray-500'
                      }`}>
                        {dayData.nonNegMeditation ? 'SECURED' : 'PENDING'}
                      </span>
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={dayData.nonNegWaterNutrition}
                          onChange={e => onChange({ nonNegWaterNutrition: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 text-brand-lime focus:ring-brand-lime accent-brand-lime"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">Water & Nutrition Base</div>
                          <p className="text-xs text-gray-500">Drink at least 8 glasses and log meals cleanly</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        dayData.nonNegWaterNutrition ? 'bg-brand-lime/10 text-brand-lime' : 'bg-white/5 text-gray-500'
                      }`}>
                        {dayData.nonNegWaterNutrition ? 'SECURED' : 'PENDING'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* BONUS CHALLENGES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-display font-black tracking-wider text-brand-purple uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    BONUS TARGETS (Grind Booster)
                  </h4>
                  <span className="text-[10px] font-mono bg-brand-purple/15 border border-brand-purple/40 text-brand-purple px-2 py-0.5 rounded uppercase">
                    Level Up
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    dayData.bonusReading ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <BookOpen className="w-4 h-4 text-brand-purple" />
                      <input 
                        type="checkbox" 
                        checked={dayData.bonusReading}
                        onChange={e => onChange({ bonusReading: e.target.checked })}
                        className="rounded border-white/20 text-brand-purple focus:ring-brand-purple accent-brand-purple"
                      />
                    </div>
                    <span className="text-sm font-bold mt-2 text-white">Daily Reading</span>
                    <span className="text-[10px] text-gray-500 mt-1">Acquired deep knowledge</span>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    dayData.bonusJournal ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Clock className="w-4 h-4 text-brand-purple" />
                      <input 
                        type="checkbox" 
                        checked={dayData.bonusJournal}
                        onChange={e => onChange({ bonusJournal: e.target.checked })}
                        className="rounded border-white/20 text-brand-purple focus:ring-brand-purple accent-brand-purple"
                      />
                    </div>
                    <span className="text-sm font-bold mt-2 text-white">Cold Real-talk Journal</span>
                    <span className="text-[10px] text-gray-500 mt-1">Reflected honestly</span>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    dayData.bonusDeepStudy ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <Zap className="w-4 h-4 text-brand-purple" />
                      <input 
                        type="checkbox" 
                        checked={dayData.bonusDeepStudy}
                        onChange={e => onChange({ bonusDeepStudy: e.target.checked })}
                        className="rounded border-white/20 text-brand-purple focus:ring-brand-purple accent-brand-purple"
                      />
                    </div>
                    <span className="text-sm font-bold mt-2 text-white">Deep Study</span>
                    <span className="text-[10px] text-gray-500 mt-1">No phone, no notifications</span>
                  </label>

                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    dayData.bonusFocusProtected ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <EyeOff className="w-4 h-4 text-brand-purple" />
                      <input 
                        type="checkbox" 
                        checked={dayData.bonusFocusProtected}
                        onChange={e => onChange({ bonusFocusProtected: e.target.checked })}
                        className="rounded border-white/20 text-brand-purple focus:ring-brand-purple accent-brand-purple"
                      />
                    </div>
                    <span className="text-sm font-bold mt-2 text-white">Focus Shielded</span>
                    <span className="text-[10px] text-gray-500 mt-1">Destroyed distractions</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Daily KPIs sliders column */}
            <div className="space-y-6">
              <h4 className="text-sm font-display font-black tracking-wider text-white uppercase">
                📊 CORE KPIs OVERRIDE & SCORES
              </h4>

              <div className="space-y-5 bg-brand-bg/40 border border-white/5 rounded-xl p-5">
                {/* KPI Pain score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-semibold">Average Pain Level:</span>
                    <span className={`font-mono font-bold ${dayData.kpiPainScore > 5 ? 'text-brand-coral' : 'text-brand-lime'}`}>
                      {dayData.kpiPainScore}/10 
                      {dayData.kpiPainScore <= 3 ? ' (Minimal 😎)' : dayData.kpiPainScore <= 7 ? ' (Manageable 🩹)' : ' (Severe 😭)'}
                    </span>
                  </div>
                  <input 
                    type="range" min="1" max="10" step="1"
                    value={dayData.kpiPainScore || 5}
                    onChange={e => onChange({ kpiPainScore: parseInt(e.target.value) || 5 })}
                    className="w-full accent-brand-coral cursor-pointer"
                  />
                </div>

                {/* KPI Mood score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-semibold">Mental State / Mood:</span>
                    <span className={`font-mono font-bold ${dayData.kpiMoodScore >= 8 ? 'text-brand-lime' : dayData.kpiMoodScore >= 5 ? 'text-brand-purple' : 'text-brand-coral'}`}>
                      {dayData.kpiMoodScore}/10
                      {dayData.kpiMoodScore >= 8 ? ' (Locked-in 💪)' : dayData.kpiMoodScore >= 5 ? ' (Balanced 🧘)' : ' (Foggy 🧠💨)'}
                    </span>
                  </div>
                  <input 
                    type="range" min="1" max="10" step="1"
                    value={dayData.kpiMoodScore || 5}
                    onChange={e => onChange({ kpiMoodScore: parseInt(e.target.value) || 5 })}
                    className="w-full accent-brand-lime cursor-pointer"
                  />
                </div>

                {/* KPI Sleep hours */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold text-gray-300">Sleep Logged (hours)</label>
                    <span className="text-xs font-mono font-bold text-white">{dayData.kpiSleepHours} hrs</span>
                  </div>
                  <input 
                    type="number" step="0.5" placeholder="8"
                    value={dayData.kpiSleepHours || ''}
                    onChange={e => onChange({ kpiSleepHours: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>

                {/* KPI Pages read */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold text-gray-300">Pages Read</label>
                    <span className="text-xs font-mono font-bold text-white">{dayData.kpiPagesRead} pages</span>
                  </div>
                  <input 
                    type="number" placeholder="25"
                    value={dayData.kpiPagesRead || ''}
                    onChange={e => onChange({ kpiPagesRead: parseInt(e.target.value) || 0 })}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>

                {/* Auto Calculated stats helper block */}
                <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                  <span className="text-xs font-mono text-gray-500 uppercase block">AUTOMATIC STATS SYNCED:</span>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-brand-bg/50 p-2 rounded border border-white/5 text-gray-400">
                      Walk Dist: <span className="text-white font-bold">{dayData.morningWalkDistance} km</span>
                    </div>
                    <div className="bg-brand-bg/50 p-2 rounded border border-white/5 text-gray-400">
                      Deep Work: <span className="text-white font-bold">{totalDeepWorkHours} hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: 📆 WEEKLY REVIEW (Sunday only) */}
        {isSunday() ? (
          <div id="weekly-sunday-review-card" className="bg-gradient-to-br from-brand-card to-brand-purple/10 border border-brand-purple/40 rounded-2xl p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-brand-purple/20 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-brand-purple" />
                <h3 className="text-lg font-display font-black uppercase text-white tracking-wide">
                  SUNDAY WAR-ROOM WEEKLY REVIEW
                </h3>
              </div>
              <span className="text-xs font-mono bg-brand-purple text-white px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                SUNDAY ONLY
              </span>
            </div>

            <p className="text-xs text-brand-purple leading-relaxed font-semibold">
              Today is Sunday. It's time to step out of the daily details, analyze the hard numbers, identify bottlenecks, and plan your experiments for the next weekly sprint. Secure your mind.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Wins</label>
                <textarea 
                  rows={3}
                  placeholder="What absolute victories did we secure this week?..."
                  value={dayData.weeklyWins || ''}
                  onChange={e => onChange({ weeklyWins: e.target.value })}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Losses</label>
                <textarea 
                  rows={3}
                  placeholder="Where did we fail? Slipping sleep times, lack of hydration?..."
                  value={dayData.weeklyLosses || ''}
                  onChange={e => onChange({ weeklyLosses: e.target.value })}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Data & Hard Numbers</label>
                <textarea 
                  rows={3}
                  placeholder="What does the data say? Average sleep, total work hours?..."
                  value={dayData.weeklyData || ''}
                  onChange={e => onChange({ weeklyData: e.target.value })}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Bottlenecks</label>
                <textarea 
                  rows={3}
                  placeholder="What is slowing us down or causing friction in the schedule?..."
                  value={dayData.weeklyBottlenecks || ''}
                  onChange={e => onChange({ weeklyBottlenecks: e.target.value })}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Experiments</label>
                <textarea 
                  rows={3}
                  placeholder="What changes will we test next week to fix bottlenecks?..."
                  value={dayData.weeklyExperiments || ''}
                  onChange={e => onChange({ weeklyExperiments: e.target.value })}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase text-gray-400">Priorities & Gratitude</label>
                <textarea 
                  rows={3}
                  placeholder="Top priorities for next week + 1 thing you are grateful for..."
                  value={dayData.weeklyPriorities || ''}
                  onChange={e => {
                    const value = e.target.value;
                    onChange({ 
                      weeklyPriorities: value,
                      weeklyGratitude: value // Store unified/separate or handle
                    });
                  }}
                  className="w-full bg-brand-bg/80 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-brand-card/40 border border-white/5 rounded-2xl p-4 text-center">
            <span className="text-xs font-mono text-gray-500 uppercase">
              📆 WAR-ROOM WEEKLY REVIEW LOCKED (SUNDAYS ONLY). KEEP THE DAILY SPRINT GOING!
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
