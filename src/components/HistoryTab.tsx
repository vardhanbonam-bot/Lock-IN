import React, { useState } from 'react';
import { DayData } from '../types';
import { 
  FileSpreadsheet, Search, Calendar, ChevronRight, Lock, 
  Unlock, Trash2, ShieldAlert, Sparkles, Filter, Download,
  Flame, Activity
} from 'lucide-react';

interface HistoryTabProps {
  days: Record<string, DayData>;
  onSelectDate: (date: string) => void;
  onSwitchTab: (tab: 'tracker' | 'expenses' | 'history') => void;
  currentUserId: 'sri_rama_satya' | 'indu';
}

export default function HistoryTab({ days, onSelectDate, onSwitchTab, currentUserId }: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfirmed, setFilterConfirmed] = useState<'all' | 'committed' | 'draft'>('all');

  // Convert Record to Array and sort descending by date
  const sortedDays = Object.values(days).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Filter based on search (date or focus text or deep work tasks) and confirmation state
  const filteredDays = sortedDays.filter(day => {
    const matchesSearch = 
      day.date.includes(searchTerm) ||
      (day.rehabFocusText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (day.deepWork1Task || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (day.deepWork2Task || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (day.readingWhat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (day.induExercisesList || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (day.induNewThingText || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterConfirmed === 'all' ||
      (filterConfirmed === 'committed' && day.isConfirmed) ||
      (filterConfirmed === 'draft' && !day.isConfirmed);

    return matchesSearch && matchesStatus;
  });

  // Analytics calculations
  const totalDays = filteredDays.length;
  const isIndu = currentUserId === 'indu';
  
  // Averages depending on active profile
  const avgSleep = totalDays > 0 
    ? (filteredDays.reduce((sum, d) => sum + (isIndu ? (d.induDeepSleepHours || 0) : (d.kpiSleepHours || 0)), 0) / totalDays).toFixed(1) 
    : '0.0';
    
  const avgMood = totalDays > 0 
    ? (filteredDays.reduce((sum, d) => sum + (d.kpiMoodScore || 0), 0) / totalDays).toFixed(1) 
    : '0.0';
    
  const avgPain = totalDays > 0 
    ? (filteredDays.reduce((sum, d) => sum + (d.kpiPainScore || 0), 0) / totalDays).toFixed(1) 
    : '0.0';

  const totalDeepWorkHours = filteredDays.reduce((sum, d) => sum + (d.deepWork1Hours || 0) + (d.deepWork2Hours || 0), 0);
  const avgDeepWork = totalDays > 0 ? (totalDeepWorkHours / totalDays).toFixed(1) : '0.0';

  // Indu specialized progress rates
  const walked5KmDays = filteredDays.filter(d => d.induWalked5Km).length;
  const walkAdherence = totalDays > 0 ? Math.round((walked5KmDays / totalDays) * 100) : 0;

  const classPrepDays = filteredDays.filter(d => d.induPreparedForClass).length;
  const classPrepRate = totalDays > 0 ? Math.round((classPrepDays / totalDays) * 100) : 0;

  const newspaperDays = filteredDays.filter(d => d.induReadNewspaper).length;
  const newspaperRate = totalDays > 0 ? Math.round((newspaperDays / totalDays) * 100) : 0;

  const exerciseDays = filteredDays.filter(d => d.induExercisesDone).length;
  const exerciseRate = totalDays > 0 ? Math.round((exerciseDays / totalDays) * 100) : 0;

  const water10Days = filteredDays.filter(d => d.induWater10Glasses).length;
  const waterAdherence = totalDays > 0 ? Math.round((water10Days / totalDays) * 100) : 0;

  // Calculate percentage of floor completion
  let floorAdherenceRate = 0;
  if (isIndu) {
    let totalHabitsCompleted = 0;
    filteredDays.forEach(d => {
      if (d.wakeTime) totalHabitsCompleted++;
      if (d.induExercisesDone) totalHabitsCompleted++;
      if (d.induWater10Glasses) totalHabitsCompleted++;
      if (d.induPreparedForClass) totalHabitsCompleted++;
      if (d.induReadNewspaper) totalHabitsCompleted++;
      if (d.induWalked5Km) totalHabitsCompleted++;
      if (d.induDeepSleepHours && d.induDeepSleepHours >= 3.5) totalHabitsCompleted++;
    });
    floorAdherenceRate = totalDays > 0 
      ? Math.round((totalHabitsCompleted / (totalDays * 7)) * 100) 
      : 0;
  } else {
    let totalNonNegsChecked = 0;
    filteredDays.forEach(d => {
      if (d.nonNegRehab) totalNonNegsChecked++;
      if (d.nonNegMeditation) totalNonNegsChecked++;
      if (d.nonNegWaterNutrition) totalNonNegsChecked++;
    });
    floorAdherenceRate = totalDays > 0 
      ? Math.round((totalNonNegsChecked / (totalDays * 3)) * 100) 
      : 0;
  }

  // Export full historical records to Excel-compatible CSV format
  const handleExportAllToCSV = () => {
    if (sortedDays.length === 0) return;

    // Define CSV headers
    const headers = isIndu ? [
      'Date', 'Status', 'Wake Time', 'Exercises Done', 'Exercises List', 'Drank 10 Glasses Water',
      'Prepared For Class', 'Read Newspaper', 'Learned New Thing', 'New Thing Details', 'Walked At Least 5 KM',
      'Deep Sleep Hours'
    ] : [
      'Date', 'Status', 'Wake Time', 'Target Wake Window', 'No Phone Hour Done', 'No Phone Note', 
      'First Water Glass Time', 'Total Water (Glasses)', 'Meditation Done', 'Meditation Duration (mins)',
      'Reading Book', 'Reading Pages Read', 'Reading Duration (mins)', 'Morning Walk Distance (km)',
      'Morning Walk Feel', 'Pre Workout Snack', 'Rehab Focus Strategy', 
      'AM Rehab Exercises Count', 'AM Rehab Done Count', 'AM Pain Before (1-10)', 'AM Pain After (1-10)',
      'PM Rehab Exercises Count', 'PM Rehab Done Count', 'PM Pain Before (1-10)', 'PM Pain After (1-10)',
      'Deep Work 1 Task', 'Deep Work 1 Hours', 'Deep Work 1 Focus Score',
      'Deep Work 2 Task', 'Deep Work 2 Hours', 'Deep Work 2 Focus Score',
      'Daily Pain Score (1-10)', 'Daily Mood Score (1-10)', 'Daily Sleep Hours',
      'Journal Review', 'Dinner Time', 'Dinner What', 'Sleep Time',
      'Weekly Wins (Sunday Only)', 'Weekly Losses', 'Custom Tasks Total', 'Custom Tasks Done'
    ];

    // Map rows
    const rows = sortedDays.map(day => {
      if (isIndu) {
        return [
          day.date,
          day.isConfirmed ? 'LOCKED / COMMITTED' : 'DRAFT',
          day.wakeTime || 'N/A',
          day.induExercisesDone ? 'YES' : 'NO',
          `"${(day.induExercisesList || '').replace(/"/g, '""')}"`,
          day.induWater10Glasses ? 'YES' : 'NO',
          day.induPreparedForClass ? 'YES' : 'NO',
          day.induReadNewspaper ? 'YES' : 'NO',
          day.induLearnedNewThing ? 'YES' : 'NO',
          `"${(day.induNewThingText || '').replace(/"/g, '""')}"`,
          day.induWalked5Km ? 'YES' : 'NO',
          day.induDeepSleepHours || 0
        ];
      } else {
        const amDone = day.rehab1?.exercises?.filter(e => e.done).length || 0;
        const amTotal = day.rehab1?.exercises?.length || 0;
        const pmDone = day.rehab2?.exercises?.filter(e => e.done).length || 0;
        const pmTotal = day.rehab2?.exercises?.length || 0;

        return [
          day.date,
          day.isConfirmed ? 'LOCKED / COMMITTED' : 'DRAFT',
          day.wakeTime || 'N/A',
          day.targetWakeWindow || 'N/A',
          day.noPhoneHour ? 'YES' : 'NO',
          `"${(day.noPhoneNote || '').replace(/"/g, '""')}"`,
          day.waterFirstGlass || 'N/A',
          day.waterTotalGlasses || 0,
          day.meditationDone ? 'YES' : 'NO',
          day.meditationDuration || 0,
          `"${(day.readingWhat || '').replace(/"/g, '""')}"`,
          day.kpiPagesRead || 0,
          day.readingDuration || 0,
          day.morningWalkDistance || 0,
          `"${(day.morningWalkFeel || '').replace(/"/g, '""')}"`,
          `"${(day.preWorkoutSnack || '').replace(/"/g, '""')}"`,
          `"${(day.rehabFocusText || '').replace(/"/g, '""')}"`,
          amTotal,
          amDone,
          day.rehab1?.painBefore || 0,
          day.rehab1?.painAfter || 0,
          pmTotal,
          pmDone,
          day.rehab2?.painBefore || 0,
          day.rehab2?.painAfter || 0,
          `"${(day.deepWork1Task || '').replace(/"/g, '""')}"`,
          day.deepWork1Hours || 0,
          day.deepWork1Focus || 0,
          `"${(day.deepWork2Task || '').replace(/"/g, '""')}"`,
          day.deepWork2Hours || 0,
          day.deepWork2Focus || 0,
          day.kpiPainScore || 0,
          day.kpiMoodScore || 0,
          day.kpiSleepHours || 0,
          `"${(day.journalLines || '').replace(/"/g, '""')}"`,
          day.dinnerTime || 'N/A',
          `"${(day.dinnerWhat || '').replace(/"/g, '""')}"`,
          day.sleepTime || 'N/A',
          `"${(day.weeklyWins || '').replace(/"/g, '""')}"`,
          `"${(day.weeklyLosses || '').replace(/"/g, '""')}"`,
          (day.customTasks || []).length,
          (day.customTasks || []).filter(t => t.done).length
        ];
      }
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LOCKED_IN_TRACKER_EXPORT_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date nicely
  const formatDatePretty = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileSpreadsheet className="w-5 h-5 text-brand-lime" />
              <span className="text-xs font-black text-brand-lime uppercase tracking-widest font-mono">Archive Database</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic text-white uppercase tracking-tight">
              HISTORICAL PROTOCOL LOGS
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Access and download your entire elite logging history. Click any record to switch the live calendar, view detailed lists, and update your metrics.
            </p>
          </div>

          <button
            onClick={handleExportAllToCSV}
            disabled={sortedDays.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-lime text-black font-mono text-xs font-black uppercase rounded-2xl tracking-widest hover:bg-brand-lime/90 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-brand-lime/20 cursor-pointer transform active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD FULL EXCEL/CSV
          </button>
        </div>
      </div>

      {/* 📊 PROTOCOL INSIGHTS & ANALYTICS DASHBOARD */}
      {totalDays > 0 && (
        <div id="history-analytics-dashboard" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Core Floor Adherence */}
          <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-brand-lime" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">Floor Adherence</span>
              </div>
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                floorAdherenceRate >= 80 ? 'bg-brand-lime/10 text-brand-lime' : 'bg-brand-purple/10 text-brand-purple'
              }`}>
                {floorAdherenceRate >= 80 ? 'ELITE LEVEL' : 'BUILDING'}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-black text-white italic">{floorAdherenceRate}%</span>
              <span className="text-xs text-gray-500 font-mono">Adherence Rate</span>
            </div>

            <div className="w-full bg-black/40 border border-white/5 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-brand-lime h-full rounded-full transition-all duration-500" 
                style={{ width: `${floorAdherenceRate}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
              {isIndu 
                ? "Based on completion of wake times, exercises, water target, class prep, reading newspaper, walked 5km, and deep sleep metrics."
                : "Based on completion of core morning rehab, midday mindfulness, and water hydration non-negotiables."}
            </p>
          </div>

          {/* Card 2: Routine Benchmarks / Deep Focus */}
          {isIndu ? (
            <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-coral/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-coral animate-pulse" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">Routine Benchmarks</span>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-brand-coral/10 text-brand-coral">
                  CLASS READY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 mt-1">
                <div className="bg-black/20 p-1.5 rounded border border-white/5">
                  <span className="text-gray-500">Class Prep:</span> <strong className="text-white">{classPrepRate}%</strong>
                </div>
                <div className="bg-black/20 p-1.5 rounded border border-white/5">
                  <span className="text-gray-500">News Read:</span> <strong className="text-white">{newspaperRate}%</strong>
                </div>
                <div className="bg-black/20 p-1.5 rounded border border-white/5">
                  <span className="text-gray-500">Water 10G:</span> <strong className="text-brand-lime">{waterAdherence}%</strong>
                </div>
                <div className="bg-black/20 p-1.5 rounded border border-white/5">
                  <span className="text-gray-500">Walk 5KM:</span> <strong className="text-brand-lime">{walkAdherence}%</strong>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 mt-3 leading-relaxed">
                Compound scores: {exerciseRate}% of logged days included physical exercises.
              </p>
            </div>
          ) : (
            <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-purple animate-pulse" />
                  <span className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">Deep Focus Output</span>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                  {totalDeepWorkHours >= 15 ? 'ULTRA FOCUS' : 'LOCKED IN'}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-black text-white italic">{totalDeepWorkHours.toFixed(1)}h</span>
                <span className="text-xs text-gray-500 font-mono">Total Hours</span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mt-4 pt-3 border-t border-white/5">
                <span>Avg Daily: <strong className="text-brand-purple">{avgDeepWork}h</strong></span>
                <span>Active Logs: <strong className="text-white">{totalDays}</strong></span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2.5 leading-relaxed">
                Sum of structured PM and AM deep work segments. Daily mood score averages {avgMood}/10.
              </p>
            </div>
          )}

          {/* Card 3: Biometric Baseline */}
          <div className="bg-brand-card border border-brand-border/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-sky-400" />
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider font-mono">Biometric Baselines</span>
              </div>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-sky-400/10 text-sky-400">
                ACTIVE
              </span>
            </div>

            {isIndu ? (
              <div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl font-black text-white italic">{avgSleep}h</span>
                  <span className="text-xs text-gray-500 font-mono">Avg Deep Sleep</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-6 leading-relaxed">
                  Target: Maintain an average of 3.5+ hours of restorative deep sleep for classroom cognitive recovery.
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-black/30 border border-white/5 rounded-xl p-2 text-center">
                    <span className="text-[9px] font-mono text-gray-500 block">SLEEP</span>
                    <span className="text-xs font-black text-white">{avgSleep}h</span>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-xl p-2 text-center">
                    <span className="text-[9px] font-mono text-gray-500 block">PAIN</span>
                    <span className={`text-xs font-black ${parseFloat(avgPain) <= 3 ? 'text-brand-lime' : parseFloat(avgPain) <= 6 ? 'text-yellow-400' : 'text-brand-coral'}`}>{avgPain}/10</span>
                  </div>
                  <div className="bg-black/30 border border-white/5 rounded-xl p-2 text-center">
                    <span className="text-[9px] font-mono text-gray-500 block">MOOD</span>
                    <span className="text-xs font-black text-brand-purple">{avgMood}/10</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                  Calculated averages of your sleep, pain level, and daily mood parameters across listed intervals.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH ACTIONS PANEL */}
      <div className="bg-[#111119] border border-brand-border/40 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by date, rehab focus, deep work..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-brand-bg border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-purple"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-500 tracking-wider">
            <Filter className="w-3 h-3 text-brand-purple" />
            Status:
          </div>
          <div className="bg-black/40 rounded-xl p-1 flex border border-white/5 w-full sm:w-auto">
            {(['all', 'committed', 'draft'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterConfirmed(mode)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  filterConfirmed === mode
                    ? 'bg-brand-purple/20 text-white border border-brand-purple/40'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HISTORICAL TABLE CONTAINER */}
      <div className="bg-brand-card border border-brand-border/40 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border/40 bg-[#111119] text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Sync Status</th>
                {isIndu ? (
                  <>
                    <th className="p-4">⏰ Wake & Sleep</th>
                    <th className="p-4">📚 Class & Newspaper</th>
                    <th className="p-4">💦 Water & Walk</th>
                    <th className="p-4">🧠 Curiosity Journal</th>
                  </>
                ) : (
                  <>
                    <th className="p-4">🎯 Big 3 & Objectives</th>
                    <th className="p-4">1️⃣ Execution & Scores</th>
                    <th className="p-4">📈 Trading & CAT Prep</th>
                    <th className="p-4">💪 Body & Physio</th>
                  </>
                )}
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDays.map(day => {
                if (isIndu) {
                  return (
                    <tr key={day.date} className="hover:bg-white/[0.02] transition-colors">
                      {/* Date */}
                      <td className="p-4 pl-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-brand-purple" />
                          <div>
                            <div className="text-sm font-black text-white">{day.date}</div>
                            <div className="text-[10px] font-mono text-gray-500">{formatDatePretty(day.date)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Lock Status */}
                      <td className="p-4 whitespace-nowrap">
                        {day.isConfirmed ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-[9px] font-black uppercase tracking-wider font-mono">
                            <Lock className="w-3 h-3" /> COMMITTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-[9px] font-black uppercase tracking-wider font-mono">
                            <Unlock className="w-3 h-3 animate-pulse" /> DRAFT
                          </span>
                        )}
                      </td>

                      {/* Wake & Sleep */}
                      <td className="p-4 whitespace-nowrap text-xs text-white">
                        <div className="font-medium">Wake: <span className="font-mono text-brand-lime font-bold">{day.wakeTime || 'N/A'}</span></div>
                        <div className="text-[10px] text-gray-400 mt-1">Deep Sleep: <span className="font-mono text-brand-purple font-bold">{day.induDeepSleepHours || 0} hrs</span></div>
                      </td>

                      {/* Class & Newspaper */}
                      <td className="p-4 whitespace-nowrap text-xs text-white">
                        <div className="flex items-center gap-3">
                          <span className={day.induPreparedForClass ? "text-brand-lime font-bold" : "text-gray-600"}>
                            {day.induPreparedForClass ? "✓ Class Prep" : "✗ Class Prep"}
                          </span>
                          <span className="text-gray-700">•</span>
                          <span className={day.induReadNewspaper ? "text-brand-coral font-bold" : "text-gray-600"}>
                            {day.induReadNewspaper ? "✓ Newspaper" : "✗ Newspaper"}
                          </span>
                        </div>
                      </td>

                      {/* Water & Walk */}
                      <td className="p-4 whitespace-nowrap text-xs text-white">
                        <div className="flex items-center gap-3">
                          <span className={day.induWater10Glasses ? "text-brand-lime font-bold" : "text-gray-600"}>
                            {day.induWater10Glasses ? "✓ 10 Glasses" : "✗ Water"}
                          </span>
                          <span className="text-gray-700">•</span>
                          <span className={day.induWalked5Km ? "text-brand-lime font-bold" : "text-gray-600"}>
                            {day.induWalked5Km ? "✓ Walked 5KM" : "✗ Walk"}
                          </span>
                        </div>
                      </td>

                      {/* Curiosity Journal */}
                      <td className="p-4 max-w-xs text-xs text-white">
                        <div className="truncate text-gray-300" title={day.induNewThingText}>
                          {day.induNewThingText || <span className="text-gray-600 italic">No learn logged</span>}
                        </div>
                        {day.induExercisesList && (
                          <div className="text-[10px] text-gray-500 truncate mt-1">
                            Exercises: {day.induExercisesList}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right pr-6 whitespace-nowrap">
                        <button
                          onClick={() => {
                            onSelectDate(day.date);
                            onSwitchTab('tracker');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-purple/10 hover:bg-brand-purple hover:text-white border border-brand-purple/30 text-brand-purple text-xs font-mono font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer"
                        >
                          ⚡ ACT UPON
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                const amDone = day.rehab1?.exercises?.filter(e => e.done).length || 0;
                const amTotal = day.rehab1?.exercises?.length || 0;
                const pmDone = day.rehab2?.exercises?.filter(e => e.done).length || 0;
                const pmTotal = day.rehab2?.exercises?.length || 0;
                const nonNegsDone = (day.nonNegRehab ? 1 : 0) + (day.nonNegMeditation ? 1 : 0) + (day.nonNegWaterNutrition ? 1 : 0);

                return (
                  <tr key={day.date} className="hover:bg-white/[0.02] transition-colors">
                    {/* Date */}
                    <td className="p-4 pl-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-brand-purple" />
                        <div>
                          <div className="text-sm font-black text-white">{day.date}</div>
                          <div className="text-[10px] font-mono text-gray-500">{formatDatePretty(day.date)}</div>
                        </div>
                      </div>
                    </td>

                    {/* Lock Status */}
                    <td className="p-4 whitespace-nowrap">
                      {day.isConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-lime/10 border border-brand-lime/30 text-brand-lime text-[9px] font-black uppercase tracking-wider font-mono">
                          <Lock className="w-3 h-3" /> COMMITTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-[9px] font-black uppercase tracking-wider font-mono">
                          <Unlock className="w-3 h-3 animate-pulse" /> DRAFT
                        </span>
                      )}
                    </td>

                    {/* Big 3 & Objectives */}
                    <td className="p-4 max-w-xs">
                      <div>
                        {day.todaysBig3 && day.todaysBig3.some(b => b.trim()) ? (
                          <div className="space-y-1">
                            {day.todaysBig3.filter(b => b.trim()).slice(0, 2).map((item, bIdx) => (
                              <div key={bIdx} className="text-xs text-white truncate flex items-center gap-1.5">
                                <span className={day.todaysBig3Done?.[bIdx] ? "text-brand-lime font-bold" : "text-gray-500"}>
                                  {day.todaysBig3Done?.[bIdx] ? "✓" : "○"}
                                </span>
                                <span className={day.todaysBig3Done?.[bIdx] ? "line-through text-gray-400" : ""}>
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : day.rehabFocusText ? (
                          <div className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                            {day.rehabFocusText}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600 italic">No Big 3 logged</div>
                        )}
                        {day.todaysRule && (
                          <div className="text-[10px] text-brand-purple font-mono truncate mt-1">
                            Rule: {day.todaysRule}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Execution & Scores */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-xs font-mono font-black text-brand-lime flex items-center gap-1">
                          <span>Exec:</span>
                          <span>{day.executionScore ?? 8}/10</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-brand-purple">Day: {day.sevenDimensionScores?.overall ?? 8}/10</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          Sleep: {day.sleepDuration || day.kpiSleepHours || '7.5'}h • Water: {day.waterLitersActual || 2.5}L
                        </div>
                      </div>
                    </td>

                    {/* Trading & CAT Prep */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1 text-xs">
                        {day.preMarketSentiment && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                            <span className={
                              day.preMarketSentiment === 'Bullish'
                                ? 'text-brand-lime'
                                : day.preMarketSentiment === 'Bearish'
                                ? 'text-brand-coral'
                                : 'text-yellow-400'
                            }>
                              ● {day.preMarketSentiment}
                            </span>
                            {day.tradingTopic && (
                              <span className="text-gray-300 truncate max-w-[120px]">
                                • {day.tradingTopic}
                              </span>
                            )}
                          </div>
                        )}
                        {day.catTopicCategory ? (
                          <div className="text-[10px] font-mono text-cyan-400 truncate">
                            CAT: {day.catTopicCategory} ({day.catQuestionsAttempted || 0} Qs
                            {day.catQuestionsAttempted ? `, ${(((day.catQuestionsCorrect || 0) / (day.catQuestionsAttempted || 1)) * 100).toFixed(0)}%` : ''})
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 italic">CAT prep pending</div>
                        )}
                      </div>
                    </td>

                    {/* Body & Physio */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-gray-300 flex items-center gap-1">
                          <span className="text-brand-lime font-black">Pain:</span>
                          <span>{day.workoutPainBefore ?? day.rehab1?.painBefore ?? 0}/10</span>
                          <span className="text-gray-500">➜</span>
                          <span className="text-brand-lime font-black">{day.workoutPainAfter ?? day.rehab1?.painAfter ?? 0}/10</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          {day.workoutDuration ?? 45}m • Mobility: ★{day.workoutMobility ?? 4}/5
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right pr-6 whitespace-nowrap">
                      <button
                        onClick={() => {
                          onSelectDate(day.date);
                          onSwitchTab('tracker');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand-purple/10 hover:bg-brand-purple hover:text-white border border-brand-purple/30 text-brand-purple text-xs font-mono font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer"
                      >
                        ⚡ ACT UPON
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredDays.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <ShieldAlert className="w-8 h-8 text-brand-purple mx-auto mb-3 animate-bounce" />
                    <p className="text-sm font-bold text-gray-400">NO HISTORICAL TRACKER ARCHIVES RECORDED</p>
                    <p className="text-xs text-gray-600 mt-1">Try expanding your filters or write a protocol entry on the main Tracker tab!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
