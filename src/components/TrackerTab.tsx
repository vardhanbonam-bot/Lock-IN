import React, { useState } from 'react';
import { DayData } from '../types';
import { 
  Zap, Lock, Unlock, Sparkles, Sliders, Calendar, ArrowRight, Target, Flame, 
  TrendingUp, Dumbbell, GraduationCap, Moon, CheckCircle2, ShieldCheck, HeartPulse
} from 'lucide-react';
import MorningLaunchpad from './sri/MorningLaunchpad';
import MorningTimetable from './sri/MorningTimetable';
import PreMarketTrading from './sri/PreMarketTrading';
import MiddayPhysical from './sri/MiddayPhysical';
import CatPrepSection from './sri/CatPrepSection';
import EveningShutdown from './sri/EveningShutdown';
import WeeklyReviewSection from './sri/WeeklyReviewSection';

interface Props {
  dayData: DayData;
  allDays?: Record<string, DayData>;
  onChange: (updated: Partial<DayData>) => void;
  onReset?: () => void;
  onOpenHistory?: () => void;
  streakCount?: number;
}

type SectionView = 'all' | 'morning' | 'timetable' | 'trading' | 'physical' | 'cat' | 'shutdown' | 'weekly';

export default function TrackerTab({
  dayData,
  allDays = {},
  onChange,
  onReset,
  onOpenHistory,
  streakCount: propStreakCount
}: Props) {
  const [activeSection, setActiveSection] = useState<SectionView>('all');
  const [showCelebration, setShowCelebration] = useState(false);

  // Streak calculation
  let calculatedStreak = 0;
  if (propStreakCount !== undefined) {
    calculatedStreak = propStreakCount;
  } else {
    const dates = Object.keys(allDays).sort();
    for (let i = dates.length - 1; i >= 0; i--) {
      const d = allDays[dates[i]];
      if (d?.isConfirmed || (d?.executionScore && d.executionScore >= 7)) {
        calculatedStreak++;
      } else {
        break;
      }
    }
  }
  const streakCount = calculatedStreak;

  // Big 3 completed count
  const big3Done = dayData.todaysBig3Done || [];
  const big3DoneCount = big3Done.filter(Boolean).length;

  // Lock protocol handler
  const handleLockProtocol = () => {
    const nextState = !dayData.isConfirmed;
    onChange({ isConfirmed: nextState });
    if (nextState) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 🚀 PERFORMANCE DASHBOARD HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#12121E] via-brand-card to-[#12121E] border border-brand-border/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-lime bg-brand-lime/10 border border-brand-lime/30 px-2.5 py-0.5 rounded-full">
                SRI RAMA SATYA • OPERATING SYSTEM
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                5-LAYER ENGINE: PLAN ➔ EXECUTE ➔ MEASURE ➔ LEARN ➔ CORRECT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
              PERSONAL PERFORMANCE DASHBOARD
            </h1>

            {/* Central Philosophy Question */}
            <div className="bg-black/40 border border-brand-purple/30 rounded-2xl px-4 py-2.5 inline-block">
              <p className="text-xs sm:text-sm font-bold text-brand-lime font-mono">
                “Did today's actions make tomorrow's version of me stronger?”
              </p>
            </div>

            {/* 4 Pillars Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono font-black">
              <span className="text-brand-lime bg-brand-lime/10 px-2.5 py-1 rounded-xl border border-brand-lime/20">
                1. BODY (Physio & Sleep)
              </span>
              <span className="text-gray-600">➔</span>
              <span className="text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-xl border border-brand-purple/20">
                2. MIND (Meditation & Clarity)
              </span>
              <span className="text-gray-600">➔</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                3. BUSINESS / FINANCE (Trading)
              </span>
              <span className="text-gray-600">➔</span>
              <span className="text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
                4. CAREER / INTELLECT (CAT)
              </span>
            </div>
          </div>

          {/* Quick Stats & Lock CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="grid grid-cols-3 gap-2 bg-black/50 p-2.5 rounded-2xl border border-white/5 text-center">
              <div className="px-2">
                <span className="text-[9px] font-mono uppercase text-gray-400 block">Streak</span>
                <span className="text-base font-mono font-black text-brand-lime">
                  {streakCount > 0 ? `${streakCount}d` : '1d'} 🔥
                </span>
              </div>
              <div className="px-2 border-x border-white/5">
                <span className="text-[9px] font-mono uppercase text-gray-400 block">Execution</span>
                <span className="text-base font-mono font-black text-brand-purple">
                  {dayData.executionScore ?? 8}/10
                </span>
              </div>
              <div className="px-2">
                <span className="text-[9px] font-mono uppercase text-gray-400 block">Big 3</span>
                <span className="text-base font-mono font-black text-cyan-400">
                  {big3DoneCount}/3
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLockProtocol}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                dayData.isConfirmed
                  ? 'bg-brand-lime text-black border border-brand-lime hover:bg-brand-lime/90'
                  : 'bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white border border-brand-purple/40'
              }`}
            >
              {dayData.isConfirmed ? (
                <>
                  <Lock className="w-4 h-4" /> PROTOCOL COMMITTED
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-brand-lime" /> COMMIT PROTOCOL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 bg-brand-lime text-black flex flex-col items-center justify-center text-center p-6 rounded-3xl transition-all duration-300 z-20">
            <Sparkles className="w-10 h-10 mb-2 animate-bounce" />
            <h3 className="text-2xl font-black uppercase tracking-wider italic">
              DAY'S PROTOCOL LOCKED IN! 🔒
            </h3>
            <p className="text-sm font-mono font-bold mt-1">
              PROCESS OVER OUTCOME. TOMORROW YOU WILL BE STRONGER.
            </p>
          </div>
        )}
      </div>

      {/* 🧭 SECTION QUICK-NAVIGATOR FILTER BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: '⭐ Full Day Flow' },
          { id: 'morning', label: '🌅 Morning Launchpad' },
          { id: 'timetable', label: '☀️ 6:10-8:40 Morning Mind' },
          { id: 'trading', label: '📈 Pre-Market & Trading' },
          { id: 'physical', label: '🏋️ Physio & Workout' },
          { id: 'cat', label: '🎯 CAT Preparation' },
          { id: 'shutdown', label: '🧾 10:30 PM Shutdown' },
          { id: 'weekly', label: '📊 Sunday Review' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as SectionView)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-brand-purple text-white shadow-lg border border-brand-purple/50'
                : 'bg-brand-card hover:bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔄 CONDITIONAL SECTION RENDERING OR FULL FLOW */}
      <div className="space-y-8">
        {(activeSection === 'all' || activeSection === 'morning') && (
          <MorningLaunchpad dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'timetable') && (
          <MorningTimetable dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'trading') && (
          <PreMarketTrading dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'physical') && (
          <MiddayPhysical dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'cat') && (
          <CatPrepSection dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'shutdown') && (
          <EveningShutdown dayData={dayData} onChange={onChange} />
        )}

        {(activeSection === 'all' || activeSection === 'weekly') && (
          <WeeklyReviewSection dayData={dayData} onChange={onChange} />
        )}
      </div>

      {/* BOTTOM FOOTER PROTOCOL ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-card border border-brand-border/60 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase text-white tracking-wider">
              {dayData.isConfirmed ? 'TODAY COMMITTED & SEALED' : 'READY TO SECURE TODAY?'}
            </h4>
            <p className="text-xs text-gray-400">
              {dayData.isConfirmed
                ? 'Your daily metrics are locked into your performance history.'
                : 'Review your leading indicators and commit today’s execution score.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-black/40 hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            View History ➔
          </button>
          <button
            type="button"
            onClick={handleLockProtocol}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              dayData.isConfirmed
                ? 'bg-brand-coral/20 hover:bg-brand-coral text-brand-coral hover:text-white border border-brand-coral/40'
                : 'bg-brand-lime text-black border border-brand-lime hover:bg-brand-lime/90'
            }`}
          >
            {dayData.isConfirmed ? (
              <>
                <Unlock className="w-4 h-4" /> UNLOCK TO EDIT
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> LOCK PROTOCOL 🔒
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
