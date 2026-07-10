import React, { useState } from 'react';
import { Expense, CategoryBudget } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Edit2, Search, Filter, PieChart, Landmark,
  TrendingUp, CreditCard, DollarSign, Calendar, Sliders, Check, 
  AlertTriangle, CheckCircle, Info, ChevronDown, ListFilter, X
} from 'lucide-react';

interface ExpensesTabProps {
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (id: string, updated: Partial<Expense>) => void;
  onDeleteExpense: (id: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  budgets: CategoryBudget[];
  onUpdateBudget: (category: string, limit: number) => void;
}

export default function ExpensesTab({
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  categories,
  onAddCategory,
  onDeleteCategory,
  budgets,
  onUpdateBudget
}: ExpensesTabProps) {
  // Local active states
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07'); // Default to Jul 2026
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form State
  const [formDate, setFormDate] = useState('2026-07-10');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0] || 'Food');
  const [formPaymentMethod, setFormPaymentMethod] = useState('UPI');
  const [formNote, setFormNote] = useState('');

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');

  // Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);

  // Helper lists
  const paymentMethods = ['UPI', 'Card', 'Cash', 'NetBanking'];

  // Current Date contexts (relative to system date 2026-07-10)
  const systemDateStr = '2026-07-10';
  const systemYear = 2026;
  const systemMonth = 7; // July (1-indexed)
  const systemDay = 10;

  // Handle open Form for Add
  const handleOpenAddForm = () => {
    setEditingExpenseId(null);
    setFormDate('2026-07-10');
    setFormAmount('');
    setFormCategory(categories[0] || 'Food');
    setFormPaymentMethod('UPI');
    setFormNote('');
    setIsFormOpen(true);
  };

  // Handle Edit click
  const handleStartEdit = (exp: Expense) => {
    setEditingExpenseId(exp.id);
    setFormDate(exp.date);
    setFormAmount(exp.amount.toString());
    setFormCategory(exp.category);
    setFormPaymentMethod(exp.paymentMethod);
    setFormNote(exp.note);
    setIsFormOpen(true);
  };

  // Submit Expense Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (editingExpenseId) {
      onUpdateExpense(editingExpenseId, {
        date: formDate,
        amount: amountNum,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        note: formNote
      });
    } else {
      const newExp: Expense = {
        id: `exp-${Date.now()}`,
        date: formDate,
        amount: amountNum,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        note: formNote
      };
      onAddExpense(newExp);
    }

    setIsFormOpen(false);
    setEditingExpenseId(null);
  };

  // Category Manager action
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) return;

    onAddCategory(trimmed);
    setNewCategoryName('');
  };

  // Filter expenses by selected month (format 'YYYY-MM')
  const monthlyExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));

  // Category colors map for rendering donut charts & bars
  const getCategoryColor = (cat: string, index: number) => {
    const colors = [
      '#8B5CF6', // Purple
      '#C6FF3D', // Lime
      '#3B82F6', // Blue
      '#FF5C7A', // Coral
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#84CC16', // Lime alternative
      '#6366F1', // Indigo
    ];
    return colors[index % colors.length];
  };

  // Month Statistics calculations
  const totalSpent = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Category aggregates
  const categorySpentMap: Record<string, number> = {};
  categories.forEach(c => { categorySpentMap[c] = 0; });
  monthlyExpenses.forEach(exp => {
    if (categorySpentMap[exp.category] !== undefined) {
      categorySpentMap[exp.category] += exp.amount;
    } else {
      categorySpentMap[exp.category] = exp.amount;
    }
  });

  // Top category
  let topCategory = 'None';
  let maxSpent = 0;
  Object.entries(categorySpentMap).forEach(([cat, amt]) => {
    if (amt > maxSpent) {
      maxSpent = amt;
      topCategory = cat;
    }
  });

  // Average daily spend and Month-end projection
  const [yearStr, monthStr] = selectedMonth.split('-');
  const selYear = parseInt(yearStr);
  const selMonth0 = parseInt(monthStr) - 1; // 0-indexed for Date
  
  const totalDaysInMonth = new Date(selYear, selMonth0 + 1, 0).getDate();
  
  // Calculate elapsed days
  let elapsedDays = totalDaysInMonth;
  const isCurrentMonth = (selYear === systemYear && (selMonth0 + 1) === systemMonth);
  if (isCurrentMonth) {
    elapsedDays = systemDay; // 10 days elapsed in July
  }

  const averageDailySpend = elapsedDays > 0 ? (totalSpent / elapsedDays) : 0;
  const projectedMonthEnd = averageDailySpend * totalDaysInMonth;

  // Budget comparison table
  const categoryBudgetStatus = categories.map(cat => {
    const spent = categorySpentMap[cat] || 0;
    const budgetObj = budgets.find(b => b.category === cat);
    const limit = budgetObj ? budgetObj.limit : 0;
    const percent = limit > 0 ? (spent / limit) * 100 : 0;
    return {
      category: cat,
      spent,
      limit,
      percent,
      over: spent > limit && limit > 0
    };
  });

  // Filtered Transaction Log
  const filteredExpenses = monthlyExpenses
    .filter(exp => {
      const matchSearch = exp.note.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || exp.category === filterCategory;
      const matchPay = filterPayment === 'All' || exp.paymentMethod === filterPayment;
      return matchSearch && matchCat && matchPay;
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // reverse-chronological

  // Hardcoded historical data mock for 6 months Trend
  const mockTrendMonths = [
    { name: 'Feb 26', total: 14200 },
    { name: 'Mar 26', total: 18500 },
    { name: 'Apr 26', total: 16100 },
    { name: 'May 26', total: 19800 },
    { name: 'Jun 26', total: 12400 },
    { name: 'Jul 26', total: totalSpent } // Bound to actual dynamic state for July!
  ];

  // SVG Donut Calculations
  const donutData = Object.entries(categorySpentMap)
    .filter(([_, amt]) => amt > 0)
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percent: totalSpent > 0 ? (amt / totalSpent) * 100 : 0
    }));

  let cumPercent = 0;

  return (
    <div className="space-y-6">
      {/* 🚀 EXPENSES CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-card border border-brand-border/60 p-4 rounded-3xl shadow-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-brand-purple" />
          <span className="text-xs font-black font-mono text-gray-500 uppercase tracking-widest">Analysis Period:</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="bg-black border border-brand-border/60 rounded-xl px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-brand-purple cursor-pointer"
          >
            <option value="2026-07">July 2026 (Today)</option>
            <option value="2026-06">June 2026</option>
            <option value="2026-05">May 2026</option>
            <option value="2026-04">April 2026</option>
            <option value="2026-03">March 2026</option>
            <option value="2026-02">February 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="flex-1 sm:flex-initial px-4 py-2 border border-brand-border/60 hover:border-brand-purple rounded-xl text-xs font-black font-mono text-gray-300 hover:text-white uppercase transition-all"
          >
            Categories 🛠️
          </button>
          <button
            onClick={() => setShowBudgetManager(!showBudgetManager)}
            className="flex-1 sm:flex-initial px-4 py-2 border border-brand-border/60 hover:border-brand-lime rounded-xl text-xs font-black font-mono text-gray-300 hover:text-white uppercase transition-all"
          >
            Budgets 📊
          </button>
          <button
            onClick={handleOpenAddForm}
            className="flex-1 sm:flex-initial px-5 py-2 bg-brand-purple text-white font-black tracking-wider rounded-xl text-xs uppercase hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            <Plus className="w-4 h-4" /> LOCK IN EXPENSE
          </button>
        </div>
      </div>

      {/* CATEGORY MANAGER BLOCK */}
      <AnimatePresence>
        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-card border border-brand-purple/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-sm font-display font-bold uppercase text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-purple" />
                  Category Config Manager
                </h4>
                <button 
                  onClick={() => setShowCategoryManager(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Category (e.g., Supplements, Gym Gear)"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-purple text-white font-mono text-xs font-bold rounded-xl uppercase hover:bg-brand-purple/90"
                >
                  Create
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                {categories.map((cat, idx) => {
                  const isInUse = expenses.some(e => e.category === cat);
                  return (
                    <div 
                      key={cat} 
                      className="bg-brand-bg/60 border border-white/5 rounded-xl px-3 py-2 flex items-center justify-between gap-1 group"
                    >
                      <span className="text-xs font-medium text-gray-300 truncate">{cat}</span>
                      {!isInUse ? (
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(cat)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/5 rounded text-brand-coral hover:text-red-400 transition-opacity"
                          title="Delete unused category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-600 cursor-help" title="Category in use">In-Use</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BUDGETS CONFIG MANAGER */}
      <AnimatePresence>
        {showBudgetManager && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-brand-card border border-brand-lime/30 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-sm font-display font-bold uppercase text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-brand-lime" />
                  Monthly Budgets Calibration (₹)
                </h4>
                <button 
                  onClick={() => setShowBudgetManager(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400">
                Adjust budgets for each category below. Changes are saved automatically in real-time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {categories.map((cat, idx) => {
                  const budgetObj = budgets.find(b => b.category === cat);
                  const limit = budgetObj ? budgetObj.limit : 0;
                  return (
                    <div key={cat} className="bg-brand-bg/60 border border-white/5 rounded-xl p-3 flex flex-col justify-between gap-2">
                      <span className="text-xs font-mono text-gray-400 uppercase">{cat} Limit</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-lime">₹</span>
                        <input
                          type="number"
                          value={limit || ''}
                          onChange={e => onUpdateBudget(cat, parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full bg-brand-bg border border-white/15 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-lime font-mono"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPENSE FORM MODAL / DRAWER */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-brand-card border border-brand-purple/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-brand-purple to-indigo-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-base font-display font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-lime" />
                  {editingExpenseId ? 'CALIBRATE TRANSACTION' : 'SECURE DAILY OUTFLOW'}
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Outflow Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="850"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-purple cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Payment Channel</label>
                  <div className="grid grid-cols-4 gap-2">
                    {paymentMethods.map(pm => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setFormPaymentMethod(pm)}
                        className={`py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                          formPaymentMethod === pm
                            ? 'bg-brand-purple/20 border-brand-purple text-brand-purple'
                            : 'bg-brand-bg border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Memo / Notes</label>
                  <input
                    type="text"
                    required
                    placeholder="High-protein groceries and supplements..."
                    value={formNote}
                    onChange={e => setFormNote(e.target.value)}
                    className="w-full bg-brand-bg border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-purple"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-mono font-bold text-gray-400 uppercase hover:text-white hover:bg-white/5 transition-all"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-lime text-black font-display font-black text-xs uppercase tracking-wider rounded-xl hover:bg-brand-lime/95 transition-all"
                  >
                    {editingExpenseId ? 'RE-LOCK TRANSACTION' : 'SECURE OUTFLOW'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 MONTHLY SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TOTAL SPENT */}
        <div className="bg-[#14141C] border border-[#2D2D3D] rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-3 right-3 p-1.5 bg-brand-purple/10 rounded-lg">
            <Landmark className="w-4 h-4 text-brand-purple" />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Spent</span>
          <div className="text-3xl font-black text-white italic">₹{totalSpent.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-gray-500 block mt-2 font-mono uppercase tracking-wider">For {selectedMonth}</span>
        </div>

        {/* TOP CATEGORY */}
        <div className="bg-[#14141C] border border-[#2D2D3D] rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-3 right-3 p-1.5 bg-brand-coral/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-brand-coral" />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Top Category</span>
          <div className="text-3xl font-black text-brand-coral italic truncate">{topCategory}</div>
          <span className="text-[10px] text-gray-500 block mt-2 font-mono uppercase tracking-wider">
            ₹{maxSpent.toLocaleString('en-IN')} logged
          </span>
        </div>

        {/* DAILY AVERAGE */}
        <div className="bg-[#14141C] border border-[#2D2D3D] rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-3 right-3 p-1.5 bg-brand-lime/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-brand-lime" />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Daily Average Spend</span>
          <div className="text-3xl font-black text-brand-lime italic">₹{Math.round(averageDailySpend).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-gray-500 block mt-2 font-mono uppercase tracking-wider">
            Based on {elapsedDays} days elapsed
          </span>
        </div>

        {/* PROJECTED MONTH-END */}
        <div className="bg-[#14141C] border border-[#2D2D3D] rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute top-3 right-3 p-1.5 bg-sky-500/10 rounded-lg">
            <Sliders className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Projected Outflow</span>
          <div className="text-3xl font-black text-[#8B5CF6] italic">₹{Math.round(projectedMonthEnd).toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-gray-500 block mt-2 font-mono uppercase tracking-wider">
            Targeting {totalDaysInMonth} days full-run
          </span>
        </div>
      </div>

      {/* 🚀 CHART BREAKDOWN & BUDGETS BAR TAB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DONUT CHART BLOCK */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 lg:col-span-5 space-y-5 shadow-lg">
          <h3 className="text-sm font-black uppercase text-brand-purple tracking-widest flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-purple" />
            CATEGORY OUTFLOW SPLIT
          </h3>

          {totalSpent > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-48 h-48">
                {/* SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {donutData.map((slice, index) => {
                    const radius = 35;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((cumPercent / 100) * circumference);
                    cumPercent += slice.percent;
                    return (
                      <circle
                        key={slice.category}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={getCategoryColor(slice.category, index)}
                        strokeWidth="15"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 hover:scale-[1.03] origin-center cursor-pointer"
                        title={`${slice.category}: ${slice.percent.toFixed(1)}%`}
                      />
                    );
                  })}
                  <circle cx="50" cy="50" r="26" fill="#14141C" />
                </svg>

                {/* Donut Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">MONTH OUTFLOW</span>
                  <span className="text-xl font-black text-white italic">₹{totalSpent}</span>
                </div>
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full pt-2">
                {donutData.map((slice, index) => (
                  <div key={slice.category} className="flex items-center gap-2 text-xs truncate">
                    <span 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: getCategoryColor(slice.category, index) }} 
                    />
                    <span className="text-gray-300 font-medium truncate">{slice.category}</span>
                    <span className="font-mono text-gray-500 ml-auto">{slice.percent.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-brand-border/40 rounded-xl">
              <Info className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-mono text-gray-500 uppercase">NO OUTFLOW RECORDED FOR THIS MONTH</span>
            </div>
          )}
        </div>

        {/* BUDGETS COMPARISON TABLE */}
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 lg:col-span-7 space-y-5 shadow-lg">
          <h3 className="text-sm font-black uppercase text-brand-lime tracking-widest flex items-center gap-2">
            <Landmark className="w-4 h-4 text-brand-lime" />
            MONTHLY BUDGET CONTROLS & BURN RATIO
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {categoryBudgetStatus.map((status, index) => {
              const spent = status.spent;
              const limit = status.limit;
              const percent = status.percent;
              const over = status.over;

              return (
                <div key={status.category} className="space-y-1 bg-black/30 p-3 rounded-2xl border border-brand-border/40">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: getCategoryColor(status.category, index) }} 
                      />
                      {status.category}
                    </span>
                    <div className="space-x-1">
                      <span className="text-gray-300 font-bold">₹{spent}</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-gray-500 font-bold">₹{limit || 'No Limit'}</span>
                      {limit > 0 && (
                        <span className={`font-black ml-1 ${over ? 'text-brand-coral' : 'text-brand-lime'}`}>
                          ({percent.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative w-full bg-black h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        over ? 'bg-brand-coral' : 'bg-brand-lime'
                      }`}
                      style={{ width: `${limit > 0 ? Math.min(100, percent) : (spent > 0 ? 100 : 0)}%` }}
                    />
                  </div>

                  {limit > 0 && over && (
                    <div className="text-[10px] text-brand-coral font-bold font-mono flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                      <span>BUDGET CRITICAL OUTFLOW EXCEEDED LIMIT BY ₹{spent - limit}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 🚀 SIX MONTHS HISTORICAL TREND */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
        <h3 className="text-sm font-black uppercase text-brand-lime tracking-widest flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-lime" />
          LAST 6 MONTHS RUNNING OUTFLOW TREND
        </h3>

        <div className="grid grid-cols-6 gap-2 pt-6 h-48 border-b border-brand-border/40 pb-2 relative">
          {mockTrendMonths.map((m, idx) => {
            const maxVal = Math.max(...mockTrendMonths.map(i => i.total), 1);
            const barHeightPercent = (m.total / maxVal) * 100;
            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full relative group">
                <div className="absolute top-0 opacity-0 group-hover:opacity-100 bg-brand-purple border border-brand-purple/50 text-white font-mono text-[10px] font-bold py-1 px-1.5 rounded -translate-y-8 transition-opacity z-10 whitespace-nowrap">
                  ₹{m.total.toLocaleString('en-IN')}
                </div>
                <div 
                  className="w-full sm:w-12 bg-brand-purple/20 border border-brand-border/40 hover:bg-brand-lime/20 hover:border-brand-lime hover:scale-x-105 rounded-t-lg transition-all"
                  style={{ height: `${barHeightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-gray-400 mt-2 text-center truncate w-full">{m.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 TRANSACTION LOG */}
      <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-border/40 pb-3">
          <h3 className="text-sm font-black uppercase text-brand-purple tracking-widest flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-brand-purple" />
            TRANSACTION LOG ({filteredExpenses.length} ITEMS)
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search memo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-brand-border/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-black border border-brand-border/60 rounded-xl px-2 py-1.5 text-xs text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Payment channel filter */}
            <select
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value)}
              className="bg-black border border-brand-border/60 rounded-xl px-2 py-1.5 text-xs text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Channels</option>
              {paymentMethods.map(pm => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction log table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-brand-border/40 text-[10px] font-mono text-gray-500 uppercase">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Memo / Notes</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-center">Channel</th>
                <th className="py-3 px-2 text-right">Outflow (₹)</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp, index) => (
                  <tr key={exp.id} className="border-b border-brand-border/40 hover:bg-white/5 transition-all">
                    <td className="py-3 px-2 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-2 text-white font-medium">
                      {exp.note}
                    </td>
                    <td className="py-3 px-2 text-xs">
                      <span className="px-2 py-1 rounded bg-[#1A1A24] text-gray-300 border border-brand-border/40 uppercase font-mono text-[10px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-xs text-center font-mono">
                      <span className={`px-2 py-0.5 rounded-full border ${
                        exp.paymentMethod === 'UPI' 
                          ? 'bg-brand-lime/10 border-brand-lime/30 text-brand-lime' 
                          : exp.paymentMethod === 'Card'
                          ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}>
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-black text-white text-base italic">
                      ₹{exp.amount}
                    </td>
                    <td className="py-3 px-2 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleStartEdit(exp)}
                        className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-brand-purple transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(exp.id)}
                        className="p-1 hover:bg-white/5 rounded text-gray-400 hover:text-brand-coral transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-mono text-xs uppercase">
                    NO TRANSACTIONS FOUND MATCHING CRITERIA
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
