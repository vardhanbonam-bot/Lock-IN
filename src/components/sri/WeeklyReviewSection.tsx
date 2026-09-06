import React from 'react';
import { DayData, WeeklyDiagnostic } from '../../types';
import { Calendar, Compass, TrendingUp, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function WeeklyReviewSection({ dayData, onChange }: Props) {
  const diag: WeeklyDiagnostic = dayData.weeklyDiagnostic || {
    q1Worked: dayData.weeklyWins || '',
    q2Failed: dayData.weeklyLosses || '',
    q3WastedTime: dayData.weeklyBottlenecks || '',
    q4Improved: '',
    q5BestDays: '',
    q6WorstDays: '',
    q7TradingMistakes: '',
    q8CatWeakAreas: '',
    q9PhysicalProgress: '',
    q10SystemChange: dayData.weeklyExperiments || ''
  };

  const updateDiag = (key: keyof WeeklyDiagnostic, val: string) => {
    onChange({
      weeklyDiagnostic: {
        ...diag,
        [key]: val
      }
    });
  };

  const questions: { key: keyof WeeklyDiagnostic; num: number; question: string; placeholder: string; icon: string }[] = [
    { key: 'q1Worked', num: 1, question: 'What worked this week?', placeholder: 'High-leverage habits, routines, or breakthroughs...', icon: '✅' },
    { key: 'q2Failed', num: 2, question: 'What repeatedly failed?', placeholder: 'Recurring friction points or broken commitments...', icon: '❌' },
    { key: 'q3WastedTime', num: 3, question: 'Where did I waste time?', placeholder: 'Unplanned transitions, social media, over-analyzing...', icon: '⏱️' },
    { key: 'q4Improved', num: 4, question: 'What improved?', placeholder: 'Speed, accuracy, emotional stability, pain reduction...', icon: '📈' },
    { key: 'q5BestDays', num: 5, question: 'What caused my best days?', placeholder: 'What conditions preceded your highest flow days?', icon: '⭐' },
    { key: 'q6WorstDays', num: 6, question: 'What caused my worst days?', placeholder: 'Poor sleep, skipped morning routine, reactive start?', icon: '🌧️' },
    { key: 'q7TradingMistakes', num: 7, question: 'Were trading mistakes repeated?', placeholder: 'Impulsive trades, early exits, position sizing slip?', icon: '📊' },
    { key: 'q8CatWeakAreas', num: 8, question: 'What are my current CAT weak areas?', placeholder: 'Specific topics like Permutations, DI arrangements, VARC tone...', icon: '🎯' },
    { key: 'q9PhysicalProgress', num: 9, question: 'How is physical progress & physio?', placeholder: 'Pain trends, range of motion, energy levels...', icon: '💪' },
    { key: 'q10SystemChange', num: 10, question: 'What ONE system should I change next week?', placeholder: 'The single highest-leverage operational modification...', icon: '🔧' }
  ];

  return (
    <div className="space-y-6">
      {/* 🧭 MANIFESTO: LEADING VS LAGGING INDICATORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              🟢 LEADING INDICATORS (Process You Control)
            </h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-mono">
            Hours studied • Questions solved • Meditation minutes • Workouts completed • Trading plan followed • Sleep duration • Water intake • Daily reading • Deep work blocks protected.
          </p>
          <span className="text-[10px] font-mono text-emerald-400 block pt-1 font-bold">
            Focus 90% of your emotional energy here.
          </span>
        </div>

        <div className="bg-brand-coral/10 border border-brand-coral/30 rounded-3xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-brand-coral">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="text-xs font-black uppercase tracking-wider">
              🔴 LAGGING INDICATORS (Outcomes You Measure)
            </h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-mono">
            Trading P&L • CAT mock percentile • Body composition & weight • Physical endurance test.
          </p>
          <span className="text-[10px] font-mono text-brand-coral block pt-1 font-bold">
            Track weekly/monthly to calibrate, but never obsess daily.
          </span>
        </div>
      </div>

      {/* 10 DIAGNOSTIC QUESTIONS */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              SUNDAY INTELLIGENCE AUDIT — 10 DIAGNOSTIC QUESTIONS
            </h3>
            <p className="text-[10px] font-mono text-gray-400">
              Weekly retrospection turns random effort into deliberate compounding
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map(q => (
            <div key={q.key} className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-200">
                <span>{q.icon}</span>
                <span className="text-brand-purple font-mono font-black">#{q.num}</span>
                <span>{q.question}</span>
              </label>
              <textarea
                value={diag[q.key] || ''}
                onChange={e => updateDiag(q.key, e.target.value)}
                rows={2}
                placeholder={q.placeholder}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-purple resize-none leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
