import React, { useState } from 'react';
import { DayData } from '../../types';
import { Dumbbell, Utensils, Heart, Plus, Trash2, CheckCircle2, Circle, Zap, Activity } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function MiddayPhysical({ dayData, onChange }: Props) {
  const exercises = dayData.workoutExercises || [
    { name: 'Band Pull-Aparts (3x15)', done: false },
    { name: 'Rotator Cuff Rotations (3x12)', done: false },
    { name: 'Hamstring Flossing (3x12)', done: false },
    { name: 'Scapular Wall Slides (3x10)', done: false }
  ];

  const [newExerciseName, setNewExerciseName] = useState('');

  const toggleExercise = (idx: number) => {
    const updated = [...exercises];
    updated[idx] = { ...updated[idx], done: !updated[idx].done };
    onChange({ workoutExercises: updated });
  };

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    onChange({
      workoutExercises: [...exercises, { name: newExerciseName.trim(), done: false }]
    });
    setNewExerciseName('');
  };

  const removeExercise = (idx: number) => {
    const updated = exercises.filter((_, i) => i !== idx);
    onChange({ workoutExercises: updated });
  };

  const completedExerciseCount = exercises.filter(e => e.done).length;

  return (
    <div className="space-y-6">
      {/* 🍱 1:00 LUNCH & 1:40 BUFFER / HOBBY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1:00 LUNCH */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">1:00 PM — LUNCH & RECOVERY</h3>
              <p className="text-[10px] font-mono text-gray-400">Nourishment without afternoon lethargy</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Lunch Description</label>
              <input
                type="text"
                value={dayData.lunchWhat || ''}
                onChange={e => onChange({ lunchWhat: e.target.value })}
                placeholder="e.g. Rice, dal, steamed vegetables, curd"
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
                      onClick={() => onChange({ lunchQuality: q })}
                      className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        (dayData.lunchQuality || 4) >= q
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          : 'bg-black/40 text-gray-600 border border-white/5'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-mono uppercase text-gray-400">Energy After</span>
                  <span className="text-xs font-mono font-black text-brand-lime">
                    {dayData.lunchEnergyAfter ?? 7}/10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={dayData.lunchEnergyAfter ?? 7}
                  onChange={e => onChange({ lunchEnergyAfter: parseInt(e.target.value) })}
                  className="w-full accent-brand-lime cursor-pointer"
                />
                <span className="text-[8px] font-mono text-gray-500 block text-center mt-0.5">
                  (Food coma vs sustained energy)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1:40 - 2:45 BUFFER / HOBBY */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wider">1:40–2:45 — BUFFER / HOBBY</h3>
              <p className="text-[10px] font-mono text-gray-400">Did it actually recharge mental bandwidth?</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
                What did I do during this buffer?
              </label>
              <input
                type="text"
                value={dayData.hobbyActivity || dayData.hobbyWhat || ''}
                onChange={e => onChange({ hobbyActivity: e.target.value, hobbyWhat: e.target.value })}
                placeholder="e.g. Nap (20m), music, walk, casual reading, hobby"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Recharge Score</span>
                <span className="text-xs font-mono font-black text-pink-400">
                  {dayData.hobbyRechargeScore || 4}/5
                </span>
              </div>
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onChange({ hobbyRechargeScore: score })}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-black transition-all cursor-pointer ${
                      (dayData.hobbyRechargeScore || 4) === score
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-black/40 text-gray-500 border border-white/5 hover:text-white'
                    }`}
                  >
                    ★{score}
                  </button>
                ))}
              </div>
              <span className="text-[8px] font-mono text-gray-500 block text-center mt-1">
                (1: Drained ➔ 5: Fully Rejuvenated)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏋️ 3:00–4:15 PHYSIO / WORKOUT */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-lime/10 border border-brand-lime/20 flex items-center justify-center text-brand-lime">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase text-white tracking-wider">
                  3:00–4:15 — PHYSIO & PHYSICAL PERFORMANCE
                </h3>
                <span className="text-[10px] font-mono text-brand-lime font-bold">BODY PILLAR</span>
              </div>
              <p className="text-[10px] font-mono text-gray-400">
                Joint rehabilitation, core stabilization, and deliberate physical capacity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-gray-400">Duration:</span>
              <input
                type="number"
                value={dayData.workoutDuration ?? 45}
                onChange={e => onChange({ workoutDuration: parseInt(e.target.value) || 0 })}
                className="w-12 bg-transparent text-xs font-mono font-black text-brand-lime text-center focus:outline-none"
              />
              <span className="text-[10px] font-mono text-gray-500">min</span>
            </div>
            <span className="text-xs font-mono font-black bg-brand-lime/10 text-brand-lime px-3 py-1.5 rounded-2xl border border-brand-lime/30">
              {completedExerciseCount} of {exercises.length} DONE
            </span>
          </div>
        </div>

        {/* Exercises Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200">Session Exercises & Prescribed Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {exercises.map((ex, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  ex.done
                    ? 'bg-brand-lime/10 border-brand-lime/40 text-white'
                    : 'bg-black/30 border-white/5 text-gray-300'
                }`}
              >
                <div
                  onClick={() => toggleExercise(idx)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
                >
                  {ex.done ? (
                    <CheckCircle2 className="w-5 h-5 fill-brand-lime text-black shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500 hover:text-white shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${ex.done ? 'line-through text-gray-400' : ''}`}>
                    {ex.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(idx)}
                  className="text-gray-600 hover:text-brand-coral transition-all cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom exercise */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={newExerciseName}
              onChange={e => setNewExerciseName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addExercise()}
              placeholder="Add specific exercise (e.g. Thoracic Extensions 3x10)..."
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
            />
            <button
              type="button"
              onClick={addExercise}
              className="px-4 py-2 bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white border border-brand-purple/30 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Effort, Pain Delta, Mobility, Energy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {/* Effort */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono uppercase text-gray-400">Effort Score</span>
              <span className="text-xs font-mono font-black text-brand-lime">
                {dayData.workoutEffort ?? 8}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.workoutEffort ?? 8}
              onChange={e => onChange({ workoutEffort: parseInt(e.target.value) })}
              className="w-full accent-brand-lime cursor-pointer"
            />
          </div>

          {/* Pain Before ➔ After */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <span className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Pain Delta (Pre ➔ Post)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                max="10"
                value={dayData.workoutPainBefore ?? dayData.kpiPainScore ?? 4}
                onChange={e => onChange({ workoutPainBefore: parseInt(e.target.value) || 0, kpiPainScore: parseInt(e.target.value) || 0 })}
                className="w-1/2 bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-brand-coral font-mono text-center"
              />
              <span className="text-gray-500 font-mono text-xs">➔</span>
              <input
                type="number"
                min="0"
                max="10"
                value={dayData.workoutPainAfter ?? 2}
                onChange={e => onChange({ workoutPainAfter: parseInt(e.target.value) || 0 })}
                className="w-1/2 bg-black/50 border border-white/10 rounded-xl px-2 py-1 text-xs text-brand-lime font-mono text-center"
              />
            </div>
          </div>

          {/* Mobility */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <span className="block text-[10px] font-mono uppercase text-gray-400 mb-1">Mobility / Flexibility</span>
            <div className="flex gap-1 pt-0.5">
              {[1, 2, 3, 4, 5].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ workoutMobility: m })}
                  className={`flex-1 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    (dayData.workoutMobility || 4) >= m
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-black/40 text-gray-600 border border-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Energy After */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono uppercase text-gray-400">Energy After</span>
              <span className="text-xs font-mono font-black text-brand-lime">
                {dayData.workoutEnergyAfter ?? 8}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={dayData.workoutEnergyAfter ?? 8}
              onChange={e => onChange({ workoutEnergyAfter: parseInt(e.target.value) })}
              className="w-full accent-brand-lime cursor-pointer"
            />
          </div>
        </div>

        {/* Unusual observations / notes */}
        <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
          <label className="block text-[10px] font-mono uppercase text-gray-400 mb-1">
            Anything unusual? (Clicks, tightness, breakthroughs)
          </label>
          <input
            type="text"
            value={dayData.workoutUnusualNotes || ''}
            onChange={e => onChange({ workoutUnusualNotes: e.target.value })}
            placeholder="e.g. Left shoulder clicked on band pull-apart; improved after 2 sets of rotator cuff rotations"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>
    </div>
  );
}
