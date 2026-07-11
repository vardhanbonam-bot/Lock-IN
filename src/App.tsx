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
  deleteBudgetFromFirebase
} from './firebaseService';
import TrackerTab from './components/TrackerTab';
import ExpensesTab from './components/ExpensesTab';
import HistoryTab from './components/HistoryTab';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Calendar, CreditCard, ClipboardList, TrendingUp, Zap, 
  ChevronLeft, ChevronRight, RefreshCw, Trophy, Target
} from 'lucide-react';

export default function App() {
  // Master application states loaded from Firestore
  const [days, setDays] = useState<Record<string, DayData>>({});
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Active navigation states
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-10'); // Default to Today
  const [activeTab, setActiveTab] = useState<'tracker' | 'expenses' | 'history'>('tracker');

  // Hardcoded current date representation
  const TODAY_STR = '2026-07-10';

  // Mount logic: Seed default dataset if Firestore is blank, then load all collections
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
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
  }, []);

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
          <img src="/logo.svg" alt="LOCKED IN Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_30px_rgba(139,92,246,0.4)] animate-pulse mb-4 pointer-events-none select-none" />
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

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between">
      
      {/* 🚀 MAIN TOP BRANDED BAR */}
      <header className="border-b border-brand-border/40 bg-[#0A0A0F] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center lg:text-left">
            <img src="/logo.svg" alt="LOCKED IN logo" className="w-12 h-12 md:w-14 md:h-14 drop-shadow-[0_0_15px_rgba(139,92,246,0.35)] select-none pointer-events-none animate-pulse" />
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
            >
              <TrackerTab 
                dayData={activeDayData}
                onChange={handleDayDataChange}
                streakCount={streakCount}
              />
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
