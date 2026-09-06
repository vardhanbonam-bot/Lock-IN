import React, { useState, useEffect } from 'react';
import { DayData, Expense, CategoryBudget } from './types';
import { 
  createBlankDay, 
  INITIAL_DAYS, 
  INITIAL_EXPENSES, 
  DEFAULT_EXPENSE_CATEGORIES, 
  DEFAULT_BUDGETS 
} from './data';
import {
  seedDatabaseIfEmpty,
  getDaysFromFirebase,
  saveDayToFirebase,
  getExpensesFromFirebase,
  saveExpenseToFirebase,
  deleteExpenseFromFirebase,
  getCategoriesFromFirebase,
  saveCategoryToFirebase,
  deleteCategoryFromFirebase,
  getBudgetsFromFirebase,
  saveBudgetToFirebase,
  deleteBudgetFromFirebase,
  setFirebaseUserScope
} from './firebaseService';
import TrackerTab from './components/TrackerTab';
import InduTracker from './components/InduTracker';
import ExpensesTab from './components/ExpensesTab';
import HistoryTab from './components/HistoryTab';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Calendar, CreditCard, ClipboardList, TrendingUp, Zap, 
  ChevronLeft, ChevronRight, RefreshCw, Trophy, Target,
  Lock, Unlock, KeyRound, Users, LogOut
} from 'lucide-react';

export default function App() {
  // Master application states loaded from Firestore
  const [days, setDays] = useState<Record<string, DayData>>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Authentication & profile state
  const [currentUser, setCurrentUser] = useState<'sri_rama_satya' | 'indu' | null>(() => {
    const cached = localStorage.getItem('lockedin_user');
    if (cached === 'sri_rama_satya' || cached === 'indu') {
      return cached;
    }
    return null;
  });

  const [pinInput, setPinInput] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<'sri_rama_satya' | 'indu'>('sri_rama_satya');
  const [pinError, setPinError] = useState('');

  // Active navigation states
  const getLocalDateString = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const r = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${r}`;
  };
  const TODAY_STR = getLocalDateString();

  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);
  const [activeTab, setActiveTab] = useState<'tracker' | 'expenses' | 'history'>('tracker');

  // Load collections when identity is set
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);
        setFirebaseUserScope(currentUser);
        await seedDatabaseIfEmpty();

        const [loadedDays, loadedExpenses, loadedCategories, loadedBudgets] = await Promise.all([
          getDaysFromFirebase(),
          getExpensesFromFirebase(),
          getCategoriesFromFirebase(),
          getBudgetsFromFirebase()
        ]);

        setDays(loadedDays);
        setExpenses(loadedExpenses);
        setCategories(loadedCategories);
        setBudgets(loadedBudgets);
      } catch (error) {
        console.error("Error loading data from Firebase, falling back to local defaults:", error);
        setDays(INITIAL_DAYS);
        setExpenses(INITIAL_EXPENSES);
        setCategories(DEFAULT_EXPENSE_CATEGORIES);
        setBudgets(DEFAULT_BUDGETS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Get current active day data (or create new blank if empty)
  const activeDayData = days[selectedDate] || createBlankDay(selectedDate);

  // Auto-save: handles incoming updates for a day's fields
  const handleDayDataChange = async (updatedData: Partial<DayData>) => {
    const currentDay = days[selectedDate] || createBlankDay(selectedDate);
    const fullDay = {
      ...currentDay,
      ...updatedData
    };

    // Fast UI state transition
    setDays(prev => ({
      ...prev,
      [selectedDate]: fullDay
    }));

    try {
      setSyncing(true);
      await saveDayToFirebase(selectedDate, fullDay);
    } catch (e) {
      console.error("Failed to save day to Firestore:", e);
    } finally {
      setSyncing(false);
    }
  };

  // Streak calculator
  const calculateStreak = (daysRecord: Record<string, DayData>, todayStr: string): number => {
    let streak = 0;
    
    const isCompleted = (dateStr: string) => {
      const day = daysRecord[dateStr];
      if (!day) return false;
      
      if (currentUser === 'indu') {
        return !!(
          day.wakeTime &&
          day.induExercisesDone &&
          day.induWater10Glasses &&
          day.induPreparedForClass &&
          day.induReadNewspaper &&
          day.induWalked5Km &&
          (day.induDeepSleepHours && day.induDeepSleepHours > 0)
        );
      }
      
      return day.nonNegRehab && day.nonNegMeditation && day.nonNegWaterNutrition;
    };

    const formatDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const r = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${r}`;
    };

    // If today is completed, count backwards starting today
    if (isCompleted(todayStr)) {
      let d = new Date(todayStr);
      while (isCompleted(formatDate(d))) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
    } else {
      // If today is not completed, count backwards starting yesterday
      let d = new Date(todayStr);
      d.setDate(d.getDate() - 1);
      while (isCompleted(formatDate(d))) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
    }
    return streak;
  };

  const streakCount = calculateStreak(days, TODAY_STR);

  // Date manipulation helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const newStr = d.toISOString().split('T')[0];
    setSelectedDate(newStr);
  };

  const handleJumpToToday = () => {
    setSelectedDate(TODAY_STR);
  };

  const getFormattedSelectedDate = () => {
    const d = new Date(selectedDate);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Expense Handlers
  const handleAddExpense = async (newExp: Expense) => {
    setExpenses(prev => [newExp, ...prev]);
    try {
      setSyncing(true);
      await saveExpenseToFirebase(newExp);
    } catch (e) {
      console.error("Failed to add expense:", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateExpense = async (id: string, updated: Partial<Expense>) => {
    const expToUpdate = expenses.find(e => e.id === id);
    if (!expToUpdate) return;
    const fullExp = { ...expToUpdate, ...updated };

    setExpenses(prev => prev.map(exp => exp.id === id ? fullExp : exp));
    try {
      setSyncing(true);
      await saveExpenseToFirebase(fullExp);
    } catch (e) {
      console.error("Failed to update expense:", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    try {
      setSyncing(true);
      await deleteExpenseFromFirebase(id);
    } catch (e) {
      console.error("Failed to delete expense:", e);
    } finally {
      setSyncing(false);
    }
  };

  // Category Handlers
  const handleAddCategory = async (newCat: string) => {
    setCategories(prev => [...prev, newCat]);
    const defaultBudget = { category: newCat, limit: 0 };
    setBudgets(prev => [...prev, defaultBudget]);

    try {
      setSyncing(true);
      await saveCategoryToFirebase(newCat);
      await saveBudgetToFirebase(defaultBudget);
    } catch (e) {
      console.error("Failed to add category:", e);
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    setCategories(prev => prev.filter(c => c !== catToDelete));
    setBudgets(prev => prev.filter(b => b.category !== catToDelete));
    try {
      setSyncing(true);
      await deleteCategoryFromFirebase(catToDelete);
      await deleteBudgetFromFirebase(catToDelete);
    } catch (e) {
      console.error("Failed to delete category:", e);
    } finally {
      setSyncing(false);
    }
  };

  // Budget Handlers
  const handleUpdateBudget = async (category: string, newLimit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit: newLimit } : b));
    try {
      setSyncing(true);
      await saveBudgetToFirebase({ category, limit: newLimit });
    } catch (e) {
      console.error("Failed to update budget:", e);
    } finally {
      setSyncing(false);
    }
  };

  // Motivational Quote helper based on selected date and streak
  const getMotivationalQuote = () => {
    if (streakCount >= 3) {
      return "SPEED OF LIGHT MULTIPLIER ACTIVE! YOU ARE GIVING OFF PURE HEAT SENSATION. ⚡";
    }
    const quotes = [
      "FLIGHT MODE ENGAGED. ZERO EXTERNAL INTERFERENCE PERMITTED. ✈️",
      "SECURE THE FLOOR EARLY. THE REST OF THE DAY IS A FREERUN. 🔒",
      "CRUSH THE RESISTANCE. MOTIVATION IS CHEAP, SYSTEM IS ABSOLUTE. 🦾",
      "ELIMINATE THE COGNITIVE SLOP. STAY LOCKED IN. 🧠",
      "PAIN IS SIGNAL. PHYSICAL CORRECTION IS UNDERWAY. 🩹"
    ];
    // Hash based on date
    const idx = Math.abs(selectedDate.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % quotes.length;
    return quotes[idx];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center font-sans p-6 select-none">
        <div className="text-center space-y-6 flex flex-col items-center">
          <img src="/logo.svg" alt="LOCKED IN Logo" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_20px_rgba(139,92,246,0.35)] animate-pulse mb-4 pointer-events-none select-none" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-brand-lime skew-x-[-10deg]">
            LOCKED IN
          </h1>
          <p className="text-brand-purple font-bold tracking-widest text-[10px] sm:text-xs uppercase">
            ESTABLISHING CLOUD PROTOCOL CONNECTION
          </p>
          <div className="flex items-center justify-center space-x-2 text-brand-lime font-mono text-[10px] pt-2">
            <span className="w-2 h-2 rounded-full bg-brand-lime animate-ping" />
            <span>SYNCING WITH CLOUD FIRESTORE...</span>
          </div>
        </div>
      </div>
    );
  }

  // Identity Verification Lock Screen Gate
  if (!currentUser) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setPinError('');
      if (selectedProfileId === 'sri_rama_satya') {
        if (pinInput === '2004') {
          localStorage.setItem('lockedin_user', 'sri_rama_satya');
          setCurrentUser('sri_rama_satya');
          setPinInput('');
        } else {
          setPinError('INVALID SECURE PASSCODE. DECRYPT FAIL.');
        }
      } else if (selectedProfileId === 'indu') {
        if (pinInput === '2007') {
          localStorage.setItem('lockedin_user', 'indu');
          setCurrentUser('indu');
          setPinInput('');
        } else {
          setPinError('INVALID SECURE PASSCODE. DECRYPT FAIL.');
        }
      }
    };

    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden select-none">
        {/* Cyber Grid Pattern & Ambient Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-8">
          <div className="text-center">
            <img 
              src="/logo.svg" 
              alt="LOCKED IN Logo" 
              className="w-10 h-10 mx-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] mb-3 animate-pulse select-none" 
            />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none italic uppercase text-brand-lime skew-x-[-10deg]">
              LOCKED IN
            </h1>
            <p className="text-brand-purple font-mono font-black tracking-widest text-[9px] uppercase mt-2">
              RESTRICTED ELITE LOG PROTOCOL
            </p>
          </div>

          <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-purple via-brand-lime to-brand-purple" />
            
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                <KeyRound className="w-3.5 h-3.5 text-brand-purple" /> IDENTITY ENFORCEMENT
              </span>
              <h2 className="text-lg font-black text-white uppercase mt-1">Select Active Profile</h2>
            </div>

            {/* Profile Selection Selection Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedProfileId('sri_rama_satya');
                  setPinInput('');
                  setPinError('');
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  selectedProfileId === 'sri_rama_satya'
                    ? 'bg-brand-purple/10 border-brand-purple text-white shadow-lg'
                    : 'bg-black/35 border-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                <Users className={`w-5 h-5 ${selectedProfileId === 'sri_rama_satya' ? 'text-brand-purple' : 'text-gray-600'}`} />
                <span className="text-xs font-black uppercase tracking-tight">Sri Rama Satya</span>
                <span className="text-[9px] font-mono text-gray-500">ID: USER_01</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedProfileId('indu');
                  setPinInput('');
                  setPinError('');
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  selectedProfileId === 'indu'
                    ? 'bg-brand-purple/10 border-brand-purple text-white shadow-lg'
                    : 'bg-black/35 border-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                <Users className={`w-5 h-5 ${selectedProfileId === 'indu' ? 'text-brand-purple' : 'text-gray-600'}`} />
                <span className="text-xs font-black uppercase tracking-tight">Indu</span>
                <span className="text-[9px] font-mono text-gray-500">ID: USER_02</span>
              </button>
            </div>

            {/* PIN Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                  Enter Secure Protocol PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  pattern="\d*"
                  inputMode="numeric"
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  placeholder="••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 text-center text-2xl font-mono text-brand-lime tracking-widest placeholder:text-gray-850 focus:outline-none focus:border-brand-purple"
                  required
                  autoFocus
                />
              </div>

              {pinError && (
                <div className="text-[10px] text-brand-coral font-mono text-center font-bold tracking-wider">
                  ⚠ {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-brand-lime hover:bg-brand-lime/90 text-black font-mono text-xs font-black uppercase rounded-xl tracking-widest shadow-lg shadow-brand-lime/20 cursor-pointer transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                ENTER PROTOCOL VIEW
              </button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-mono text-gray-650 uppercase tracking-wider">
              Enforcing extreme high-performance parameters 🔒
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between">
      
      {/* 🚀 MAIN TOP BRANDED BAR */}
      <header className="border-b border-brand-border/40 bg-[#0A0A0F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center lg:text-left">
            <img src="/logo.svg" alt="LOCKED IN logo" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_12px_rgba(139,92,246,0.35)] select-none pointer-events-none animate-pulse" />
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-none italic uppercase text-brand-lime skew-x-[-10deg]">
                LOCKED IN
              </h1>
              <p className="text-brand-purple font-bold tracking-widest text-xs uppercase mt-1">
                Elite Performance Daily Log
              </p>
            </div>
          </div>

          {/* MOTIVATIONAL QUOTE MARQUEE */}
          <div className="flex-1 max-w-md hidden xl:block bg-brand-card border border-brand-border/40 rounded-xl px-4 py-2 text-center">
            <span className="text-[10px] font-mono text-brand-lime uppercase font-semibold">PROTOCOL FOCUS: </span>
            <span className="text-xs text-gray-300 font-medium tracking-wide">
              {getMotivationalQuote()}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 sm:gap-8">
            <div className="text-center lg:text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center justify-center lg:justify-end gap-1.5 mb-1">
                {syncing ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-ping" />
                    <span className="text-brand-lime font-black tracking-wider text-[9px]">SYNCING CLOUD</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                    <span className="text-gray-500 font-bold tracking-wider text-[9px]">CLOUD SYNCHRONIZED</span>
                  </>
                )}
              </p>
              <div className="flex items-baseline space-x-1 justify-center lg:justify-end">
                <span className="text-4xl lg:text-5xl font-black text-white">{streakCount}</span>
                <span className="text-brand-lime text-xl lg:text-2xl">🔥</span>
              </div>
            </div>

            {/* ACTIVE SECURITY IDENTITY DISPLAY */}
            <div className="bg-[#111119] border border-white/5 rounded-2xl px-3 py-1.5 flex items-center gap-2.5 text-center lg:text-right">
              <div>
                <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-wider leading-none">Security Profile</span>
                <span className="text-xs font-black text-brand-lime uppercase tracking-tight block mt-0.5">
                  {currentUser === 'sri_rama_satya' ? 'Sri Rama Satya' : 'Indu'}
                </span>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('lockedin_user');
                  setCurrentUser(null);
                  setPinInput('');
                  setPinError('');
                }}
                className="p-1.5 hover:bg-white/5 rounded-lg text-brand-coral/80 hover:text-brand-coral transition-all cursor-pointer"
                title="Switch Profile / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>


            {/* TAB CONTROL SWITCHER PILL */}
            <div className="bg-[#1A1A24] rounded-full p-1 flex border border-brand-border/40 font-mono">
              <button
                onClick={() => setActiveTab('tracker')}
                className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'tracker'
                    ? 'bg-brand-purple text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tracker
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'expenses'
                    ? 'bg-brand-purple text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'history'
                    ? 'bg-brand-purple text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                History Logs
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* 🚀 MAIN WORKSTAGE AREA */}
      <main className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 space-y-6">

        {/* TRACKER-ONLY DATE CONTROLLERS */}
        {activeTab === 'tracker' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-card border border-white/5 p-4 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button 
                onClick={handlePrevDay}
                className="p-2 hover:bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                title="Previous Day"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center sm:text-left px-2">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-400">Date Log View</div>
                <div className="text-sm font-display font-black text-white mt-0.5">{getFormattedSelectedDate()}</div>
              </div>

              <button 
                onClick={handleNextDay}
                className="p-2 hover:bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                title="Next Day"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="flex-1 sm:flex-initial bg-brand-bg border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-brand-purple cursor-pointer"
              />
              {selectedDate !== TODAY_STR && (
                <button
                  onClick={handleJumpToToday}
                  className="px-4 py-2 bg-brand-purple/15 border border-brand-purple/30 text-brand-purple font-mono text-xs font-bold rounded-xl uppercase hover:bg-brand-purple hover:text-white transition-all whitespace-nowrap"
                >
                  TODAY ↩
                </button>
              )}
            </div>
          </div>
        )}

        {/* RENDER DYNAMIC TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' ? (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {currentUser === 'indu' ? (
                <InduTracker 
                  dayData={activeDayData}
                  onChange={handleDayDataChange}
                  streakCount={streakCount}
                />
              ) : (
                <TrackerTab 
                  dayData={activeDayData}
                  allDays={days}
                  onChange={handleDayDataChange}
                  streakCount={streakCount}
                  onOpenHistory={() => setActiveTab('history')}
                />
              )}
            </motion.div>
          ) : activeTab === 'expenses' ? (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ExpensesTab 
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                onDeleteExpense={handleDeleteExpense}
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
                budgets={budgets}
                onUpdateBudget={handleUpdateBudget}
              />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <HistoryTab 
                days={days}
                currentUserId={currentUser || 'sri_rama_satya'}
                onSelectDate={setSelectedDate}
                onSwitchTab={setActiveTab}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 🚀 BRANDED STEADY FOOTER */}
      <footer className="mt-12 py-6 border-t border-brand-border/40 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">
            <span>Sunday Review: IN 3 DAYS</span>
            <span className="hidden sm:inline">•</span>
            <span>Hype: "Floor's locked in"</span>
            <span className="hidden sm:inline">•</span>
            <span>STREAK ENFORCEMENT ACTIVE</span>
          </div>
          <div className="text-brand-lime font-black italic tracking-wide text-sm">
            LET'S GET IT. 🔒
          </div>
        </div>
      </footer>

    </div>
  );
}
