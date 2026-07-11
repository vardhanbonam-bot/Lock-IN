import React, { useState } from 'react';
import { DayData } from '../types';
import { 
  FileSpreadsheet, Search, Calendar, ChevronRight, Lock, 
  Unlock, Trash2, ShieldAlert, Sparkles, Filter, Download
} from 'lucide-react';

interface HistoryTabProps {
  days: Record<string, DayData>;
  onSelectDate: (date: string) => void;
  onSwitchTab: (tab: 'tracker' | 'expenses') => void;
}

export default function HistoryTab({ days, onSelectDate, onSwitchTab }: HistoryTabProps) {
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
      (day.readingWhat || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterConfirmed === 'all' ||
      (filterConfirmed === 'committed' && day.isConfirmed) ||
      (filterConfirmed === 'draft' && !day.isConfirmed);

    return matchesSearch && matchesStatus;
  });

  // Export full historical records to Excel-compatible CSV format
  const handleExportAllToCSV = () => {
    if (sortedDays.length === 0) return;

    // Define CSV headers
    const headers = [
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
                <th className="p-4">🎯 Daily Rehab Focus</th>
                <th className="p-4">🩹 Pain Δ (Before ➜ After)</th>
                <th className="p-4">📊 Daily KPIs</th>
                <th className="p-4">⚡ Deep Work Sessions</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDays.map(day => {
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

                    {/* Rehab Focus */}
                    <td className="p-4 max-w-xs">
                      <div>
                        {day.rehabFocusText ? (
                          <div className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                            {day.rehabFocusText}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600 italic">No specific focus strategy typed</div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono uppercase text-gray-500">
                          <span>AM Routine: {amDone}/{amTotal}</span>
                          <span>•</span>
                          <span>PM Routine: {pmDone}/{pmTotal}</span>
                        </div>
                      </div>
                    </td>

                    {/* Pain delta */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <span className="text-brand-lime font-black">AM:</span>
                          <span>{day.rehab1?.painBefore || 0}/10</span>
                          <span className="text-gray-500">➜</span>
                          <span className="text-brand-lime font-black">{day.rehab1?.painAfter || 0}/10</span>
                        </div>
                        <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <span className="text-brand-purple font-black">PM:</span>
                          <span>{day.rehab2?.painBefore || 0}/10</span>
                          <span className="text-gray-500">➜</span>
                          <span className="text-brand-purple font-black">{day.rehab2?.painAfter || 0}/10</span>
                        </div>
                      </div>
                    </td>

                    {/* KPIs */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="text-[10px] font-mono text-gray-400">
                          <span className="text-gray-500">Sleep:</span> {day.kpiSleepHours || 0} hrs
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          <span className="text-gray-500">Mood:</span> {day.kpiMoodScore || 0}/10
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          <span className="text-gray-500">Pain:</span> {day.kpiPainScore || 0}/10
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          <span className="text-gray-500">Floor:</span> {nonNegsDone}/3 non-negs
                        </div>
                      </div>
                    </td>

                    {/* Deep work sessions */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {day.deepWork1Task && (
                          <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                            <span className="font-bold text-brand-lime">#1:</span> {day.deepWork1Task} ({day.deepWork1Hours || 0}h)
                          </div>
                        )}
                        {day.deepWork2Task && (
                          <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                            <span className="font-bold text-brand-purple">#2:</span> {day.deepWork2Task} ({day.deepWork2Hours || 0}h)
                          </div>
                        )}
                        {!day.deepWork1Task && !day.deepWork2Task && (
                          <span className="text-xs text-gray-600 italic">No deep work sessions recorded</span>
                        )}
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
