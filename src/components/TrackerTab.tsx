import React, { useState, useEffect } from 'react';
import { DayData, RehabSession } from '../types';
import { createBlankDay } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Coffee, Flame, Heart, Sparkles, Plus, Minus,
  CheckCircle2, AlertCircle, Dumbbell, Calendar, ChevronLeft, 
  ChevronRight, Smile, EyeOff, BookOpen, Clock, Activity, Zap, Trash2,
  Lock, Unlock, Settings, Sliders, Smartphone, Download
} from 'lucide-react';

interface TrackerTabProps {
  dayData: DayData;
  onChange: (updatedData: Partial<DayData>) => void;
  streakCount: number;
}

export default function TrackerTab({ dayData, onChange, streakCount }: TrackerTabProps) {
  // Local state for confetti or celebration burst
  const [showCelebration, setShowCelebration] = useState(false);

  // Local state for custom input values to prevent DOM lookups failing
  const [newAmExercise, setNewAmExercise] = useState('');
  const [newPmExercise, setNewPmExercise] = useState('');
  const [newCustomTaskText, setNewCustomTaskText] = useState('');

  // Layout customization preferences (durable inside localStorage)
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('lockedin_tracker_sections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      amGrind: true,
      middayFlow: true,
      pmEvening: true,
      rehabRecovery: true,
      floorKpis: true,
      weeklyReview: true,
    };
  });

  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User chosen PWA install outcome: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  const toggleSection = (sectionId: string) => {
    setEnabledSections(prev => {
      const updated = { ...prev, [sectionId]: !prev[sectionId] };
      localStorage.setItem('lockedin_tracker_sections', JSON.stringify(updated));
      return updated;
    });
  };

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
    const rehab1 = dayData.rehab1 || { exercises: [], painBefore: 5, painAfter: 3 };
    const rehab2 = dayData.rehab2 || { exercises: [], painBefore: 5, painAfter: 3 };
    const updatedExercises = [...(rehab1.exercises || [])];
    if (updatedExercises[index]) {
      updatedExercises[index] = { ...updatedExercises[index], done };
    }
    
    // Automatically flag rehab non-negotiable if both sessions are complete
    const rehab1Done = updatedExercises.length > 0 ? updatedExercises.every(e => e.done) : false;
    const rehab2Done = (rehab2.exercises || []).length > 0 ? (rehab2.exercises || []).every(e => e.done) : false;
    
    onChange({
      rehab1: { ...rehab1, exercises: updatedExercises },
      nonNegRehab: rehab1Done && rehab2Done
    });
  };

  const updateRehab2Exercise = (index: number, done: boolean) => {
    const rehab1 = dayData.rehab1 || { exercises: [], painBefore: 5, painAfter: 3 };
    const rehab2 = dayData.rehab2 || { exercises: [], painBefore: 5, painAfter: 3 };
    const updatedExercises = [...(rehab2.exercises || [])];
    if (updatedExercises[index]) {
      updatedExercises[index] = { ...updatedExercises[index], done };
    }
    
    const rehab1Done = (rehab1.exercises || []).length > 0 ? (rehab1.exercises || []).every(e => e.done) : false;
    const rehab2Done = updatedExercises.length > 0 ? updatedExercises.every(e => e.done) : false;

    onChange({
      rehab2: { ...rehab2, exercises: updatedExercises },
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

      {/* 🛠️ CONTROLS & PERSONALIZATION HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111119] border border-brand-border/40 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brand-lime" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Protocol Workspace Settings</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInstallApp}
            className="flex items-center gap-2 px-4 py-2 bg-brand-lime/10 hover:bg-brand-lime/20 border border-brand-lime/40 text-brand-lime hover:text-white font-mono text-xs font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            📲 Install App
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 border border-brand-purple/40 text-brand-purple hover:text-brand-lime font-mono text-xs font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer"
          >
            <Settings className={`w-4 h-4 ${showSettings ? "animate-spin" : ""}`} />
            {showSettings ? "Close Personalization" : "Personalize Workspace Grid"}
          </button>
        </div>
      </div>

      {/* ⚙️ PERSONALIZATION PANEL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#14141F] border border-brand-purple/40 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-brand-lime" />
                  <h4 className="text-sm font-black uppercase text-white tracking-widest">
                    PERSONALIZE DAILY WORKSPACE GRID
                  </h4>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Toggle sections on/off to simplify your dashboard. Only track the routines that matter to your daily peak performance.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'amGrind', label: '🌅 AM Grind Routine' },
                  { id: 'middayFlow', label: '⚡ Midday Flow' },
                  { id: 'pmEvening', label: '🌙 PM & Evening Closeout' },
                  { id: 'rehabRecovery', label: '⚙️ Rehab Physiotherapy' },
                  { id: 'floorKpis', label: '📊 KPIs & Checklists' },
                  { id: 'weeklyReview', label: '📆 Weekly Review' },
                ].map(section => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      enabledSections[section.id]
                        ? 'bg-brand-purple/10 border-brand-purple text-white'
                        : 'bg-black/30 border-white/5 text-gray-500'
                    }`}
                  >
                    <span className="text-xs font-bold">{section.label}</span>
                    <span className={`text-[10px] font-mono font-black ${
                      enabledSections[section.id] ? 'text-brand-lime' : 'text-gray-600'
                    }`}>
                      {enabledSections[section.id] ? 'ON' : 'OFF'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔒 PROTOCOL COMMITTED TOP ALERT */}
      {dayData.isConfirmed && (
        <div className="bg-brand-lime/10 border border-brand-lime text-brand-lime px-6 py-4 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-brand-lime text-black flex items-center justify-center font-black">🔒</div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider">TODAY'S PROTOCOL COMMITTED & LOCKED</h4>
              <p className="text-xs text-gray-300">Your metrics are saved and frozen. To make changes, click the unlock button at the bottom.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-brand-lime text-black px-2 py-1 rounded font-black uppercase">LIVE SYNCED</span>
        </div>
      )}

      {/* 🚀 BENTO GRID OF CARDS */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${dayData.isConfirmed ? "opacity-70 pointer-events-none" : ""}`}>

        {/* CARD 1: 🌅 AM GRIND */}
        {enabledSections.amGrind && (
          <div id="am-grind-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg relative">
          <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
            <Sun className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-black italic uppercase text-brand-lime tracking-wide">AM GRIND ROUTINE</h3>
          </div>


          <div className="space-y-4">
            {/* Woke up at/before 5:30 AM */}
            <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Woke Up at/before 5:30 AM?</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        wakeTime: '05:30',
                        targetWakeWindow: '05:00 - 05:30'
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.wakeTime && dayData.wakeTime <= '05:30'
                        ? 'bg-brand-lime text-black border-brand-lime'
                        : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({
                        wakeTime: '06:30',
                        targetWakeWindow: '06:00 - 07:00'
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.wakeTime && dayData.wakeTime > '05:30'
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Actual Time</label>
                  <input 
                    type="time" 
                    value={dayData.wakeTime || ''}
                    onChange={e => onChange({ wakeTime: e.target.value })}
                    className="w-full bg-brand-bg border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Target Window</label>
                  <input 
                    type="text" 
                    value={dayData.targetWakeWindow || ''}
                    onChange={e => onChange({ targetWakeWindow: e.target.value })}
                    placeholder="05:00 - 05:30"
                    className="w-full bg-brand-bg border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-purple font-mono"
                  />
                </div>
              </div>
            </div>

            {/* No-Phone Hour */}
            <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-brand-purple" />
                  <span className="text-sm font-semibold text-white">No-Phone First Hour?</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChange({ noPhoneHour: true })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.noPhoneHour
                        ? 'bg-brand-lime text-black border-brand-lime'
                        : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ noPhoneHour: false })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      !dayData.noPhoneHour
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
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
                  <span className="text-sm font-semibold text-white">Drank 8 glasses of water?</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChange({ waterTotalGlasses: 8, nonNegWaterNutrition: true })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.waterTotalGlasses >= 8
                        ? 'bg-brand-lime text-black border-brand-lime'
                        : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ waterTotalGlasses: 0, nonNegWaterNutrition: false })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.waterTotalGlasses < 8
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1 bg-brand-bg border border-white/10 rounded-lg p-1">
                  <button 
                    type="button"
                    onClick={() => onChange({ waterTotalGlasses: Math.max(0, dayData.waterTotalGlasses - 1), nonNegWaterNutrition: Math.max(0, dayData.waterTotalGlasses - 1) >= 8 })}
                    className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-white text-base">
                    {dayData.waterTotalGlasses}
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      const nextCount = dayData.waterTotalGlasses + 1;
                      const updates: Partial<DayData> = { waterTotalGlasses: nextCount };
                      if (nextCount === 1 && !dayData.waterFirstGlass) {
                        const now = new Date();
                        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        updates.waterFirstGlass = timeStr;
                      }
                      if (nextCount >= 8) {
                        updates.nonNegWaterNutrition = true;
                      }
                      onChange(updates);
                    }}
                    className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-brand-lime" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                    <span>Progress ({dayData.waterTotalGlasses}/8)</span>
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

            {/* Daily Zen Meditation */}
            <div className="bg-brand-bg/50 rounded-xl p-4 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                  <span className="text-sm font-semibold text-white">Daily Zen Meditation Done?</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => onChange({ meditationDone: true, nonNegMeditation: true, meditationDuration: Math.max(10, dayData.meditationDuration || 15) })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      dayData.meditationDone
                        ? 'bg-brand-lime text-black border-brand-lime'
                        : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ meditationDone: false, nonNegMeditation: false, meditationDuration: 0 })}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      !dayData.meditationDone
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              {dayData.meditationDone && (
                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                    <span>Duration</span>
                    <span className="text-brand-lime font-bold">{dayData.meditationDuration || 15} mins</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="5"
                    value={dayData.meditationDuration || 15}
                    onChange={e => onChange({ meditationDuration: parseInt(e.target.value) })}
                    className="w-full accent-brand-purple cursor-pointer mt-1"
                  />
                </div>
              )}
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
        )}

        {/* CARD 2: ☀️ MIDDAY FLOW */}
        {enabledSections.middayFlow && (
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
        )}

        {/* CARD 3: 🌇 PM / EVENING GRIND */}
        {enabledSections.pmEvening && (
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
        )}

        {/* CARD 4: ⚙️ REHAB RECOVERY */}
        {enabledSections.rehabRecovery && (
          <div id="rehab-recovery-card" className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Dumbbell className="w-6 h-6 text-brand-lime" />
              <h3 className="text-xl font-black italic uppercase text-brand-lime tracking-wide">REHAB PHYSIOTHERAPY ROUTINE</h3>
            </div>

            {/* 📝 Daily Focus Input */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-brand-lime font-black">
                🎯 Day-to-Day Rehab Focus & Strategy
              </label>
              <textarea 
                rows={2}
                placeholder="Type your specific focus for today (e.g. Quad strengthening, hamstring load management, shoulder mobility, etc.)..."
                value={dayData.rehabFocusText || ''}
                onChange={e => onChange({ rehabFocusText: e.target.value })}
                className="w-full bg-brand-bg border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime placeholder:text-gray-600"
              />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Completing all exercises in both AM & PM Rehab sessions automatically locks in your daily Rehab Non-Negotiable!
            </p>

            {/* Rehab Session 1 */}
            <div className="bg-brand-bg/50 border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-lime font-bold">REHAB AM SESSION</span>
                <span className="text-[10px] font-mono text-gray-400">
                  {((dayData.rehab1 || {}).exercises || []).filter(e => e.done).length}/{((dayData.rehab1 || {}).exercises || []).length || 0} Complete
                </span>
              </div>

              {/* YES / NO Master toggle for AM Session */}
              <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl border border-white/5">
                <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">All AM Done?</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const currentExs = (dayData.rehab1 || {}).exercises || [];
                      const updatedExercises = currentExs.map(e => ({ ...e, done: true }));
                      const rehab2Done = ((dayData.rehab2 || {}).exercises || []).every(ex => ex.done);
                      onChange({
                        rehab1: { ...(dayData.rehab1 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: rehab2Done
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      ((dayData.rehab1 || {}).exercises || []).length > 0 && ((dayData.rehab1 || {}).exercises || []).every(e => e.done)
                        ? 'bg-brand-lime text-black border-brand-lime'
                        : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentExs = (dayData.rehab1 || {}).exercises || [];
                      const updatedExercises = currentExs.map(e => ({ ...e, done: false }));
                      onChange({
                        rehab1: { ...(dayData.rehab1 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: false
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      ((dayData.rehab1 || {}).exercises || []).length > 0 && ((dayData.rehab1 || {}).exercises || []).every(e => !e.done)
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {((dayData.rehab1 || {}).exercises || []).map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 group bg-black/10 hover:bg-black/25 p-1.5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => updateRehab1Exercise(index, !exercise.done)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          exercise.done 
                            ? 'bg-brand-lime border-brand-lime text-black' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {exercise.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs ${exercise.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {exercise.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentExs = (dayData.rehab1 || {}).exercises || [];
                        const updatedExercises = currentExs.filter((_, i) => i !== index);
                        const rehab1Done = updatedExercises.length > 0 ? updatedExercises.every(ex => ex.done) : false;
                        const rehab2Done = ((dayData.rehab2 || {}).exercises || []).length > 0 ? ((dayData.rehab2 || {}).exercises || []).every(ex => ex.done) : false;
                        onChange({
                          rehab1: { ...(dayData.rehab1 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                          nonNegRehab: (updatedExercises.length > 0 || ((dayData.rehab2 || {}).exercises || []).length > 0) ? (rehab1Done && rehab2Done) : false
                        });
                      }}
                      className="text-gray-500 hover:text-brand-coral transition-all p-1 rounded hover:bg-white/5 cursor-pointer"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {((dayData.rehab1 || {}).exercises || []).length === 0 && (
                  <div className="text-[10px] font-mono text-gray-500 italic py-1">No custom exercises logged for AM. Add one below!</div>
                )}
              </div>

              {/* Add Custom AM Exercise Form */}
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <input
                  type="text"
                  placeholder="New AM exercise..."
                  value={newAmExercise}
                  onChange={e => setNewAmExercise(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-lime"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newAmExercise.trim();
                      if (val) {
                        const currentExs = (dayData.rehab1 || {}).exercises || [];
                        const updatedExercises = [...currentExs, { name: val, done: false }];
                        const rehab1Done = updatedExercises.every(ex => ex.done);
                        const rehab2Done = ((dayData.rehab2 || {}).exercises || []).every(ex => ex.done);
                        onChange({
                          rehab1: { ...(dayData.rehab1 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                          nonNegRehab: rehab1Done && rehab2Done
                        });
                        setNewAmExercise('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newAmExercise.trim();
                    if (val) {
                      const currentExs = (dayData.rehab1 || {}).exercises || [];
                      const updatedExercises = [...currentExs, { name: val, done: false }];
                      const rehab1Done = updatedExercises.every(ex => ex.done);
                      const rehab2Done = ((dayData.rehab2 || {}).exercises || []).every(ex => ex.done);
                      onChange({
                        rehab1: { ...(dayData.rehab1 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: rehab1Done && rehab2Done
                      });
                      setNewAmExercise('');
                    }
                  }}
                  className="px-2.5 py-1 bg-brand-lime/10 border border-brand-lime/30 text-brand-lime rounded-lg hover:bg-brand-lime hover:text-black font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain Before ({((dayData.rehab1 || {}).painBefore) || 5}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={((dayData.rehab1 || {}).painBefore) || 5}
                    onChange={e => onChange({ rehab1: { ...(dayData.rehab1 || { exercises: [], painBefore: 5, painAfter: 3 }), painBefore: parseInt(e.target.value) || 5 } })}
                    className="w-full accent-brand-coral cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain After ({((dayData.rehab1 || {}).painAfter) || 3}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={((dayData.rehab1 || {}).painAfter) || 3}
                    onChange={e => onChange({ rehab1: { ...(dayData.rehab1 || { exercises: [], painBefore: 5, painAfter: 3 }), painAfter: parseInt(e.target.value) || 3 } })}
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
                  {((dayData.rehab2 || {}).exercises || []).filter(e => e.done).length}/{((dayData.rehab2 || {}).exercises || []).length || 0} Complete
                </span>
              </div>

              {/* YES / NO Master toggle for PM Session */}
              <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl border border-white/5">
                <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider">All PM Done?</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const currentExs = (dayData.rehab2 || {}).exercises || [];
                      const updatedExercises = currentExs.map(e => ({ ...e, done: true }));
                      const rehab1Done = ((dayData.rehab1 || {}).exercises || []).every(ex => ex.done);
                      onChange({
                        rehab2: { ...(dayData.rehab2 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: rehab1Done
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      ((dayData.rehab2 || {}).exercises || []).length > 0 && ((dayData.rehab2 || {}).exercises || []).every(e => e.done)
                        ? 'bg-brand-purple text-white border-brand-purple'
                        : 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/25'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currentExs = (dayData.rehab2 || {}).exercises || [];
                      const updatedExercises = currentExs.map(e => ({ ...e, done: false }));
                      onChange({
                        rehab2: { ...(dayData.rehab2 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: false
                      });
                    }}
                    className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                      ((dayData.rehab2 || {}).exercises || []).length > 0 && ((dayData.rehab2 || {}).exercises || []).every(e => !e.done)
                        ? 'bg-brand-coral text-white border-brand-coral'
                        : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                    }`}
                  >
                    NO
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {((dayData.rehab2 || {}).exercises || []).map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 group bg-black/10 hover:bg-black/25 p-1.5 rounded-lg border border-transparent hover:border-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => updateRehab2Exercise(index, !exercise.done)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          exercise.done 
                            ? 'bg-brand-purple border-brand-purple text-white' 
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        {exercise.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-xs ${exercise.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {exercise.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentExs = (dayData.rehab2 || {}).exercises || [];
                        const updatedExercises = currentExs.filter((_, i) => i !== index);
                        const rehab1Done = ((dayData.rehab1 || {}).exercises || []).length > 0 ? ((dayData.rehab1 || {}).exercises || []).every(ex => ex.done) : false;
                        const rehab2Done = updatedExercises.length > 0 ? updatedExercises.every(ex => ex.done) : false;
                        onChange({
                          rehab2: { ...(dayData.rehab2 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                          nonNegRehab: (((dayData.rehab1 || {}).exercises || []).length > 0 || updatedExercises.length > 0) ? (rehab1Done && rehab2Done) : false
                        });
                      }}
                      className="text-gray-500 hover:text-brand-coral transition-all p-1 rounded hover:bg-white/5 cursor-pointer"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {((dayData.rehab2 || {}).exercises || []).length === 0 && (
                  <div className="text-[10px] font-mono text-gray-500 italic py-1">No custom exercises logged for PM. Add one below!</div>
                )}
              </div>

              {/* Add Custom PM Exercise Form */}
              <div className="flex gap-2 pt-1 border-t border-white/5">
                <input
                  type="text"
                  placeholder="New PM exercise..."
                  value={newPmExercise}
                  onChange={e => setNewPmExercise(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-purple"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newPmExercise.trim();
                      if (val) {
                        const currentExs = (dayData.rehab2 || {}).exercises || [];
                        const updatedExercises = [...currentExs, { name: val, done: false }];
                        const rehab1Done = ((dayData.rehab1 || {}).exercises || []).every(ex => ex.done);
                        const rehab2Done = updatedExercises.every(ex => ex.done);
                        onChange({
                          rehab2: { ...(dayData.rehab2 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                          nonNegRehab: rehab1Done && rehab2Done
                        });
                        setNewPmExercise('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newPmExercise.trim();
                    if (val) {
                      const currentExs = (dayData.rehab2 || {}).exercises || [];
                      const updatedExercises = [...currentExs, { name: val, done: false }];
                      const rehab1Done = ((dayData.rehab1 || {}).exercises || []).every(ex => ex.done);
                      const rehab2Done = updatedExercises.every(ex => ex.done);
                      onChange({
                        rehab2: { ...(dayData.rehab2 || { painBefore: 5, painAfter: 3, exercises: [] }), exercises: updatedExercises },
                        nonNegRehab: rehab1Done && rehab2Done
                      });
                      setNewPmExercise('');
                    }
                  }}
                  className="px-2.5 py-1 bg-brand-purple/10 border border-brand-purple/30 text-brand-purple rounded-lg hover:bg-brand-purple hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain Before ({((dayData.rehab2 || {}).painBefore) || 5}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={((dayData.rehab2 || {}).painBefore) || 5}
                    onChange={e => onChange({ rehab2: { ...(dayData.rehab2 || { exercises: [], painBefore: 5, painAfter: 3 }), painBefore: parseInt(e.target.value) || 5 } })}
                    className="w-full accent-brand-coral cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain After ({((dayData.rehab2 || {}).painAfter) || 3}/10)</label>
                  <input 
                    type="range" min="1" max="10" 
                    value={((dayData.rehab2 || {}).painAfter) || 3}
                    onChange={e => onChange({ rehab2: { ...(dayData.rehab2 || { exercises: [], painBefore: 5, painAfter: 3 }), painAfter: parseInt(e.target.value) || 3 } })}
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
        )}

        {/* CARD 5: 📊 CORE KPIs & CHECKS */}
        {enabledSections.floorKpis && (
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
                    <div className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <Dumbbell className={`w-4 h-4 ${dayData.nonNegRehab ? 'text-brand-lime' : 'text-gray-500'}`} />
                        <div>
                          <div className="text-sm font-bold text-white">Full Rehab Protocol</div>
                          <p className="text-xs text-gray-500">Do all exercises in both physiotherapy blocks</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegRehab: true })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              dayData.nonNegRehab
                                ? 'bg-brand-lime text-black border-brand-lime'
                                : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegRehab: false })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              !dayData.nonNegRehab
                                ? 'bg-brand-coral text-white border-brand-coral'
                                : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                            }`}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <Heart className={`w-4 h-4 ${dayData.nonNegMeditation ? 'text-brand-lime' : 'text-gray-500'}`} />
                        <div>
                          <div className="text-sm font-bold text-white">Daily Zen Meditation</div>
                          <p className="text-xs text-gray-500">Complete at least 10 minutes of breathing flow</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegMeditation: true, meditationDone: true, meditationDuration: Math.max(10, dayData.meditationDuration || 15) })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              dayData.nonNegMeditation
                                ? 'bg-brand-lime text-black border-brand-lime'
                                : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegMeditation: false, meditationDone: false, meditationDuration: 0 })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              !dayData.nonNegMeditation
                                ? 'bg-brand-coral text-white border-brand-coral'
                                : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                            }`}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-brand-bg border border-white/5 hover:border-white/15">
                      <div className="flex items-center gap-3">
                        <Coffee className={`w-4 h-4 ${dayData.nonNegWaterNutrition ? 'text-brand-lime' : 'text-gray-500'}`} />
                        <div>
                          <div className="text-sm font-bold text-white">Water & Nutrition Base</div>
                          <p className="text-xs text-gray-500">Drink at least 8 glasses and log meals cleanly</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegWaterNutrition: true, waterTotalGlasses: Math.max(8, dayData.waterTotalGlasses || 8) })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              dayData.nonNegWaterNutrition
                                ? 'bg-brand-lime text-black border-brand-lime'
                                : 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/25'
                            }`}
                          >
                            YES
                          </button>
                          <button
                            type="button"
                            onClick={() => onChange({ nonNegWaterNutrition: false, waterTotalGlasses: Math.min(7, dayData.waterTotalGlasses) })}
                            className={`px-3 py-1 text-[10px] uppercase font-mono font-black rounded-lg border transition-all cursor-pointer ${
                              !dayData.nonNegWaterNutrition
                                ? 'bg-brand-coral text-white border-brand-coral'
                                : 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral hover:bg-brand-coral/25'
                            }`}
                          >
                            NO
                          </button>
                        </div>
                      </div>
                    </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`flex flex-col p-3 rounded-xl border transition-all ${
                    dayData.bonusReading ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-brand-purple" />
                        <span className="text-sm font-bold text-white">Daily Reading</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onChange({ bonusReading: true })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            dayData.bonusReading 
                              ? 'bg-brand-lime text-black border-brand-lime font-black' 
                              : 'bg-brand-lime/10 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/15'
                          }`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({ bonusReading: false })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            !dayData.bonusReading 
                              ? 'bg-brand-coral text-white border-brand-coral font-black' 
                              : 'bg-brand-coral/10 border-brand-coral/20 text-brand-coral hover:bg-brand-coral/15'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Acquired deep knowledge</span>
                  </div>

                  <div className={`flex flex-col p-3 rounded-xl border transition-all ${
                    dayData.bonusJournal ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-purple" />
                        <span className="text-sm font-bold text-white">Cold Real-talk Journal</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onChange({ bonusJournal: true })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            dayData.bonusJournal 
                              ? 'bg-brand-lime text-black border-brand-lime font-black' 
                              : 'bg-brand-lime/10 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/15'
                          }`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({ bonusJournal: false })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            !dayData.bonusJournal 
                              ? 'bg-brand-coral text-white border-brand-coral font-black' 
                              : 'bg-brand-coral/10 border-brand-coral/20 text-brand-coral hover:bg-brand-coral/15'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Reflected honestly</span>
                  </div>

                  <div className={`flex flex-col p-3 rounded-xl border transition-all ${
                    dayData.bonusDeepStudy ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-purple" />
                        <span className="text-sm font-bold text-white">Deep Study</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onChange({ bonusDeepStudy: true })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            dayData.bonusDeepStudy 
                              ? 'bg-brand-lime text-black border-brand-lime font-black' 
                              : 'bg-brand-lime/10 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/15'
                          }`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({ bonusDeepStudy: false })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            !dayData.bonusDeepStudy 
                              ? 'bg-brand-coral text-white border-brand-coral font-black' 
                              : 'bg-brand-coral/10 border-brand-coral/20 text-brand-coral hover:bg-brand-coral/15'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">No phone, no notifications</span>
                  </div>

                  <div className={`flex flex-col p-3 rounded-xl border transition-all ${
                    dayData.bonusFocusProtected ? 'bg-brand-purple/10 border-brand-purple text-white' : 'bg-brand-bg/40 border-white/5 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-brand-purple" />
                        <span className="text-sm font-bold text-white">Focus Shielded</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onChange({ bonusFocusProtected: true })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            dayData.bonusFocusProtected 
                              ? 'bg-brand-lime text-black border-brand-lime font-black' 
                              : 'bg-brand-lime/10 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/15'
                          }`}
                        >
                          YES
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({ bonusFocusProtected: false })}
                          className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                            !dayData.bonusFocusProtected 
                              ? 'bg-brand-coral text-white border-brand-coral font-black' 
                              : 'bg-brand-coral/10 border-brand-coral/20 text-brand-coral hover:bg-brand-coral/15'
                          }`}
                        >
                          NO
                        </button>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Destroyed distractions</span>
                  </div>
                </div>
              </div>

              {/* 🎯 DYNAMIC DAILY CHECKS (Add Your Own Tasks) */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-display font-black tracking-wider text-brand-lime uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-lime animate-pulse" />
                    🎯 DYNAMIC DAILY CHECKS
                  </h4>
                  <span className="text-[10px] font-mono bg-brand-lime/15 border border-brand-lime/40 text-brand-lime px-2 py-0.5 rounded uppercase font-bold">
                    PERSONALIZED
                  </span>
                </div>

                <div className="space-y-3 bg-brand-bg/40 border border-white/5 rounded-xl p-4">
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(dayData.customTasks || []).map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-3 p-2 bg-brand-bg rounded-lg border border-white/5">
                        <span className={`text-xs ${task.done ? 'text-gray-400 line-through' : 'text-white font-semibold'}`}>
                          {task.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (dayData.customTasks || []).map(t => 
                                  t.id === task.id ? { ...t, done: true } : t
                                );
                                onChange({ customTasks: updated });
                              }}
                              className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                                task.done 
                                  ? 'bg-brand-lime text-black border-brand-lime' 
                                  : 'bg-brand-lime/5 border-brand-lime/20 text-brand-lime hover:bg-brand-lime/15'
                              }`}
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (dayData.customTasks || []).map(t => 
                                  t.id === task.id ? { ...t, done: false } : t
                                );
                                onChange({ customTasks: updated });
                              }}
                              className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold rounded border transition-all cursor-pointer ${
                                !task.done 
                                  ? 'bg-brand-coral text-white border-brand-coral' 
                                  : 'bg-brand-coral/5 border-brand-coral/20 text-brand-coral hover:bg-brand-coral/15'
                              }`}
                            >
                              NO
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (dayData.customTasks || []).filter(t => t.id !== task.id);
                              onChange({ customTasks: updated });
                            }}
                            className="text-gray-500 hover:text-brand-coral transition-all p-1 rounded hover:bg-white/5 cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(dayData.customTasks || []).length === 0 && (
                      <p className="text-[10px] text-gray-500 italic text-center py-2">
                        No personalized tasks added for today. Create some below!
                      </p>
                    )}
                  </div>

                  {/* Add personalized task input */}
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="Add custom task (e.g., Cold plunge, take vitamins...)"
                      value={newCustomTaskText}
                      onChange={e => setNewCustomTaskText(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-lime"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = newCustomTaskText.trim();
                          if (val) {
                            const newTask = { id: Math.random().toString(36).substring(2), name: val, done: false };
                            const updated = [...(dayData.customTasks || []), newTask];
                            onChange({ customTasks: updated });
                            setNewCustomTaskText('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newCustomTaskText.trim();
                        if (val) {
                          const newTask = { id: Math.random().toString(36).substring(2), name: val, done: false };
                          const updated = [...(dayData.customTasks || []), newTask];
                          onChange({ customTasks: updated });
                          setNewCustomTaskText('');
                        }
                      }}
                      className="px-2.5 py-1 bg-brand-lime/10 border border-brand-lime/30 text-brand-lime rounded-lg hover:bg-brand-lime hover:text-black font-mono text-xs font-bold transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
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
        )}

        {/* CARD 6: 📆 WEEKLY REVIEW (Sunday only) */}
        {enabledSections.weeklyReview && (isSunday() ? (
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
        ))}

      </div>

      {/* 🔒 PROTOCOL CONFIRMATION & LOCK IN ACTION BAR */}
      <div className="bg-[#111119] border border-brand-border/60 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-lime/10 border border-brand-lime/30 rounded-2xl">
            {dayData.isConfirmed ? (
              <Lock className="w-8 h-8 text-brand-lime animate-bounce" />
            ) : (
              <Unlock className="w-8 h-8 text-brand-purple animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black italic uppercase text-white tracking-wide flex items-center gap-2">
              {dayData.isConfirmed ? "PROTOCOL LOCKED & SECURED" : "PROTOCOL LOG READY"}
              <span className="text-[10px] font-mono bg-brand-lime/15 border border-brand-lime/30 text-brand-lime px-2 py-0.5 rounded uppercase">
                {dayData.isConfirmed ? "COMMITTED" : "DRAFT"}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              {dayData.isConfirmed 
                ? "Today's daily protocol has been locked and committed to the cloud. You are executing at peak performance." 
                : "Verify your metrics and secure the floor. Click below to lock in today's protocol and secure your streak!"}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto justify-end">
          {dayData.isConfirmed ? (
            <button
              onClick={() => {
                onChange({ isConfirmed: false });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-brand-bg hover:bg-brand-purple/10 border border-brand-purple/40 text-brand-purple hover:text-brand-lime font-mono text-xs font-black uppercase rounded-2xl tracking-widest transition-all cursor-pointer"
            >
              🔓 UNLOCK TO RE-EDIT LOG
            </button>
          ) : (
            <button
              onClick={() => {
                onChange({ isConfirmed: true });
                // Trigger celebration
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 4000);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-brand-lime hover:bg-brand-lime/90 text-black font-mono text-sm font-black uppercase rounded-2xl tracking-widest shadow-lg shadow-brand-lime/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
            >
              🔒 LOCK IN PROTOCOL NOW
            </button>
          )}
        </div>
      </div>

      {/* 📱 PWA INSTALLATION GUIDE MODAL */}
      <AnimatePresence>
        {showInstallGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-card border border-brand-border/80 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-lime/10 text-brand-lime flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white tracking-wider">INSTALL INDEPENDENT APP</h3>
                    <p className="text-xs text-gray-400">Run LOCKED IN as a native application</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(false)}
                  className="text-gray-500 hover:text-white text-sm font-bold font-mono p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  ✕ CLOSE
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-2 bg-brand-bg/50 border border-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-brand-lime">🍏 Apple iOS (iPhone/iPad Safari)</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
                    <li>Open this app in <span className="text-white font-bold">Safari Browser</span></li>
                    <li>Tap the <span className="text-white font-bold">Share button</span> (the square icon with an arrow pointing up at the bottom)</li>
                    <li>Scroll down and select <span className="text-white font-bold">"Add to Home Screen"</span></li>
                    <li>Tap <span className="text-white font-bold">"Add"</span> in the top-right corner to install</li>
                  </ol>
                </div>

                <div className="space-y-2 bg-brand-bg/50 border border-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-brand-purple">🤖 Android (Chrome/Firefox)</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
                    <li>Tap the <span className="text-white font-bold">Three Dots (menu)</span> in the top-right corner of Chrome</li>
                    <li>Select <span className="text-white font-bold">"Install App"</span> or <span className="text-white font-bold">"Add to Home Screen"</span></li>
                    <li>Confirm the prompt to install the independent app</li>
                  </ol>
                </div>

                <div className="space-y-2 bg-brand-bg/50 border border-white/5 rounded-xl p-4">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-sky-400">💻 Desktop (Chrome/Edge)</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Click the <span className="text-white font-bold">Install Monitor Icon</span> on the right-hand side of your browser URL search bar to add it directly to your dock or desktop workspace.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-3 bg-brand-lime text-black font-mono text-xs font-black uppercase rounded-xl tracking-wider hover:bg-brand-lime/90 transition-all cursor-pointer"
              >
                I UNDERSTAND
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
