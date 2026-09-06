import React, { useState } from 'react';
import { DayData, TradeEntry, NewsItem } from '../../types';
import { TrendingUp, BarChart3, Plus, Trash2, CheckCircle2, XCircle, AlertCircle, HelpCircle, Layers, FileText } from 'lucide-react';

interface Props {
  dayData: DayData;
  onChange: (updated: Partial<DayData>) => void;
}

export default function PreMarketTrading({ dayData, onChange }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'premarket' | 'learning' | 'trades'>('premarket');

  // Pre-market news items
  const newsItems: NewsItem[] = dayData.preMarketNews && dayData.preMarketNews.length > 0
    ? dayData.preMarketNews
    : [
        { headline: '', credibility: 'High', impact: 'Neutral' },
        { headline: '', credibility: 'Medium', impact: 'Neutral' }
      ];

  const updateNewsItem = (idx: number, field: keyof NewsItem, value: any) => {
    const updated = [...newsItems];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ preMarketNews: updated });
  };

  const addNewsItem = () => {
    onChange({
      preMarketNews: [...newsItems, { headline: '', credibility: 'Medium', impact: 'Neutral' }]
    });
  };

  const removeNewsItem = (idx: number) => {
    const updated = newsItems.filter((_, i) => i !== idx);
    onChange({ preMarketNews: updated });
  };

  // Trades
  const trades: TradeEntry[] = dayData.tradesList || [];

  const addTrade = () => {
    const newTrade: TradeEntry = {
      id: Date.now().toString(),
      setup: '',
      entry: '',
      stop: '',
      target: '',
      risk: '₹1,000',
      positionSize: '',
      reason: '',
      time: '10:15 AM',
      result: '₹0',
      rMultiple: '+0R',
      followedPlan: true,
      emotionalState: 'Calm & Objective',
      mistake: '',
      wasDecisionGood: true
    };
    onChange({ tradesList: [...trades, newTrade] });
  };

  const updateTrade = (id: string, field: keyof TradeEntry, value: any) => {
    const updated = trades.map(t => (t.id === id ? { ...t, [field]: value } : t));
    onChange({ tradesList: updated });
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter(t => t.id !== id);
    onChange({ tradesList: updated });
  };

  return (
    <div className="space-y-6">
      {/* 🧭 NAVIGATION PILLS BETWEEN PRE-MARKET, LEARNING, AND TRADES */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-card border border-brand-border/60 rounded-3xl p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-white tracking-wider">BUSINESS & FINANCE LABORATORY</h3>
            <span className="text-[10px] font-mono text-gray-400">8:45 AM – 12:45 PM • Pre-Market, Learning & Execution</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveSubTab('premarket')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'premarket'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 8:45 Pre-Market
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('learning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'learning'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧠 9:30 Learning & Feynman
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('trades')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'trades'
                ? 'bg-brand-purple text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚡ Live Trades ({trades.length})
          </button>
        </div>
      </div>

      {/* SUB-SECTION 1: 8:45 - 9:15 PRE-MARKET LOG */}
      {activeSubTab === 'premarket' && (
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-wider">
                8:45–9:15 — PRE-MARKET ANALYSIS & HYPOTHESIS
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                Form a clear testable hypothesis before bells ring. Then test against reality.
              </p>
            </div>
            {/* Sentiment Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
              {(['Bullish', 'Neutral', 'Bearish'] as const).map(sent => (
                <button
                  key={sent}
                  type="button"
                  onClick={() => onChange({ preMarketSentiment: sent })}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-black transition-all cursor-pointer ${
                    dayData.preMarketSentiment === sent
                      ? sent === 'Bullish'
                        ? 'bg-brand-lime text-black'
                        : sent === 'Bearish'
                        ? 'bg-brand-coral text-white'
                        : 'bg-yellow-400 text-black'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {sent === 'Bullish' ? '🟢 BULLISH' : sent === 'Bearish' ? '🔴 BEARISH' : '🟡 NEUTRAL'}
                </button>
              ))}
            </div>
          </div>

          {/* Indices & Key Sectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">NIFTY 50 Level / Outlook</label>
              <input
                type="text"
                value={dayData.niftyIndex || ''}
                onChange={e => onChange({ niftyIndex: e.target.value })}
                placeholder="e.g. 24,350 support, gap-up opening"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">BANK NIFTY</label>
              <input
                type="text"
                value={dayData.bankNiftyIndex || ''}
                onChange={e => onChange({ bankNiftyIndex: e.target.value })}
                placeholder="e.g. Consolidating above 52,000"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
              <label className="block text-[9px] font-mono uppercase text-gray-400 mb-1">Key Sectors in Focus</label>
              <input
                type="text"
                value={dayData.keySectors || ''}
                onChange={e => onChange({ keySectors: e.target.value })}
                placeholder="e.g. IT, Auto, Pharma, Private Banks"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {/* 3 Major News Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Major News Items & Credibility</span>
              <button
                type="button"
                onClick={addNewsItem}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-brand-purple hover:text-brand-lime transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add News Item
              </button>
            </div>

            <div className="space-y-2">
              {newsItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-black/30 border border-white/5 rounded-2xl p-3">
                  <span className="text-xs font-mono font-bold text-gray-500 shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item.headline}
                    onChange={e => updateNewsItem(idx, 'headline', e.target.value)}
                    placeholder="News headline or catalyst..."
                    className="w-full sm:flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-1 text-xs text-white focus:outline-none focus:border-brand-purple"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={item.credibility}
                      onChange={e => updateNewsItem(idx, 'credibility', e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2 py-1 text-[10px] font-mono text-gray-300 focus:outline-none"
                    >
                      <option value="High">Credibility: High</option>
                      <option value="Medium">Credibility: Medium</option>
                      <option value="Low">Credibility: Low</option>
                    </select>
                    <select
                      value={item.impact}
                      onChange={e => updateNewsItem(idx, 'impact', e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2 py-1 text-[10px] font-mono text-gray-300 focus:outline-none"
                    >
                      <option value="Positive">Impact: + Pos</option>
                      <option value="Neutral">Impact: = Neut</option>
                      <option value="Negative">Impact: - Neg</option>
                    </select>
                    {newsItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNewsItem(idx)}
                        className="text-gray-500 hover:text-brand-coral transition-all cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Hypothesis & EOD Reality Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-black/30 border border-brand-purple/20 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-black uppercase text-brand-purple tracking-wider">
                💡 My Market Hypothesis (Morning)
              </label>
              <textarea
                value={dayData.marketHypothesis || ''}
                onChange={e => onChange({ marketHypothesis: e.target.value })}
                rows={3}
                placeholder="“I expect the market to rally toward 24,400 in the morning session then consolidate because global futures are strong and IT earnings were positive...”"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-brand-purple resize-none font-medium"
              />
            </div>

            <div className="bg-black/30 border border-brand-lime/20 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-black uppercase text-brand-lime tracking-wider">
                🔍 End-Of-Day Reality Check
              </label>
              <textarea
                value={dayData.eodRealityCheck || ''}
                onChange={e => onChange({ eodRealityCheck: e.target.value })}
                rows={3}
                placeholder="“Did reality match my hypothesis? (Prediction ➔ Reality ➔ Why did it deviate or conform?)”"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-brand-lime resize-none font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: 9:30 - 12:45 TRADING / FINANCE LEARNING */}
      {activeSubTab === 'learning' && (
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-wider">
                9:30–12:45 — TRADING / FINANCE LEARNING LABORATORY
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                Measure learning output, not raw time. Active synthesis via the Feynman Technique.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase">Study Time:</span>
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
                <input
                  type="number"
                  value={dayData.tradingStudyMinutes ?? 90}
                  onChange={e => onChange({ tradingStudyMinutes: parseInt(e.target.value) || 0 })}
                  className="w-12 bg-transparent text-xs font-mono font-black text-brand-lime text-center focus:outline-none"
                />
                <span className="text-[10px] font-mono text-gray-500">min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="block text-[10px] font-mono uppercase text-gray-400">Topic / Domain Studied</label>
              <input
                type="text"
                value={dayData.tradingTopic || ''}
                onChange={e => onChange({ tradingTopic: e.target.value })}
                placeholder="e.g. Market structure, Liquidity hunts, Order flow, Risk-of-ruin mathematics"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-medium"
              />
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="block text-[10px] font-mono uppercase text-gray-400">
                Could I explain it without notes?
              </label>
              <div className="flex gap-1 pt-0.5">
                {(['Yes', 'Partially', 'No'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ tradingExplainWithoutNotes: opt })}
                    className={`flex-1 py-1.5 rounded-xl text-[10px] font-mono font-black transition-all cursor-pointer ${
                      dayData.tradingExplainWithoutNotes === opt
                        ? opt === 'Yes'
                          ? 'bg-brand-lime text-black'
                          : opt === 'Partially'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-brand-coral text-white'
                        : 'bg-black/40 text-gray-500 border border-white/5'
                    }`}
                  >
                    {opt === 'Yes' ? 'YES ✓' : opt === 'Partially' ? 'PARTIAL ⚠️' : 'NO ✗'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Concepts Learned */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
            <label className="block text-xs font-bold text-gray-200">
              Concepts Learned & Core Principles
            </label>
            <textarea
              value={dayData.tradingConceptsLearned || ''}
              onChange={e => onChange({ tradingConceptsLearned: e.target.value })}
              rows={3}
              placeholder="• Liquidity exists above prior day highs and below swing lows&#10;• When high volume breakout lacks follow-through, anticipate mean reversion"
              className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-xs text-white leading-relaxed focus:outline-none focus:border-brand-purple resize-none font-mono"
            />
          </div>

          {/* 🧠 THE FEYNMAN TEST */}
          <div className="bg-brand-purple/10 border border-brand-purple/40 rounded-3xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧪</span>
                <h5 className="text-xs font-black uppercase text-brand-purple tracking-widest">
                  THE FEYNMAN TEST (Teach a 15-year-old)
                </h5>
              </div>
              <span className="text-[9px] font-mono text-gray-400 bg-black/40 px-2.5 py-0.5 rounded-full">
                Simple words only • Zero jargon
              </span>
            </div>
            <p className="text-[10px] text-gray-300">
              Pick ONE concept from today's study. Explain it so simply that a 15-year-old would understand it immediately.
            </p>
            <textarea
              value={dayData.tradingFeynmanTest || ''}
              onChange={e => onChange({ tradingFeynmanTest: e.target.value })}
              rows={3}
              placeholder="e.g. Imagine a fruit market where buyers are lined up at ₹100. If a seller dumps 1,000 apples, the price temporarily drops to fill them all. Big players use this sudden dip to buy cheaply before the normal price returns..."
              className="w-full bg-black/60 border border-brand-purple/30 rounded-2xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-brand-purple resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-bold text-yellow-300">
                ⚠️ One concept I still do NOT fully understand
              </label>
              <input
                type="text"
                value={dayData.tradingConceptStillConfused || ''}
                onChange={e => onChange({ tradingConceptStillConfused: e.target.value })}
                placeholder="e.g. Calculating gamma exposure risk near expiry"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 font-medium"
              />
            </div>

            <div className="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-bold text-brand-lime">
                ⚡ One practical application for my own trading
              </label>
              <input
                type="text"
                value={dayData.tradingPracticalApp || ''}
                onChange={e => onChange({ tradingPracticalApp: e.target.value })}
                placeholder="e.g. Wait for the 15-minute candle close before entering pullbacks"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-lime font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: LIVE TRADES LOG */}
      {activeSubTab === 'trades' && (
        <div className="bg-brand-card border border-brand-border/60 rounded-3xl p-6 space-y-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-wider">
                DISCIPLINED TRADE JOURNAL & EXECUTION
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                “Good trade ≠ profitable trade. Bad trade ≠ losing trade. Was the decision good according to your system?”
              </p>
            </div>
            <button
              type="button"
              onClick={addTrade}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-lime text-black font-mono text-xs font-black uppercase rounded-xl tracking-wider hover:bg-brand-lime/90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log New Trade
            </button>
          </div>

          {trades.length === 0 ? (
            <div className="bg-black/30 border border-dashed border-white/10 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-500">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-bold text-gray-300">No trades logged for today</h5>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                No setup = No trade. Sitting on your hands is an elite trading skill. If you took trades today, log them to audit execution quality.
              </p>
              <button
                type="button"
                onClick={addTrade}
                className="px-4 py-2 bg-brand-purple/20 hover:bg-brand-purple text-brand-purple hover:text-white border border-brand-purple/40 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
              >
                + Record Trade
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade, idx) => (
                <div
                  key={trade.id}
                  className="bg-black/40 border border-white/10 rounded-3xl p-5 space-y-4 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-lg">
                        TRADE #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={trade.setup}
                        onChange={e => updateTrade(trade.id, 'setup', e.target.value)}
                        placeholder="Setup Name (e.g. 15m Liquidity Sweep Reversal)"
                        className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-purple px-1"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-gray-400">P&L:</span>
                        <input
                          type="text"
                          value={trade.result}
                          onChange={e => updateTrade(trade.id, 'result', e.target.value)}
                          placeholder="+₹2,500"
                          className={`w-20 bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-xs font-mono font-black text-center ${
                            trade.result.includes('-') ? 'text-brand-coral' : 'text-brand-lime'
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono text-gray-400">R:</span>
                        <input
                          type="text"
                          value={trade.rMultiple}
                          onChange={e => updateTrade(trade.id, 'rMultiple', e.target.value)}
                          placeholder="+2.5R"
                          className="w-16 bg-black/60 border border-white/10 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-center text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteTrade(trade.id)}
                        className="text-gray-500 hover:text-brand-coral transition-all cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Entry Price</label>
                      <input
                        type="text"
                        value={trade.entry}
                        onChange={e => updateTrade(trade.id, 'entry', e.target.value)}
                        placeholder="24,320"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Stop Loss</label>
                      <input
                        type="text"
                        value={trade.stop}
                        onChange={e => updateTrade(trade.id, 'stop', e.target.value)}
                        placeholder="24,295"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-brand-coral font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Target</label>
                      <input
                        type="text"
                        value={trade.target}
                        onChange={e => updateTrade(trade.id, 'target', e.target.value)}
                        placeholder="24,380"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-brand-lime font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Risk Amount</label>
                      <input
                        type="text"
                        value={trade.risk}
                        onChange={e => updateTrade(trade.id, 'risk', e.target.value)}
                        placeholder="₹1,000"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-1">Time</label>
                      <input
                        type="text"
                        value={trade.time}
                        onChange={e => updateTrade(trade.id, 'time', e.target.value)}
                        placeholder="10:15 AM"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* Followed plan toggle */}
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Followed Plan?</span>
                      <button
                        type="button"
                        onClick={() => updateTrade(trade.id, 'followedPlan', !trade.followedPlan)}
                        className={`px-3 py-1 text-[10px] font-mono font-black rounded-lg border transition-all cursor-pointer ${
                          trade.followedPlan
                            ? 'bg-brand-lime text-black border-brand-lime'
                            : 'bg-brand-coral text-white border-brand-coral'
                        }`}
                      >
                        {trade.followedPlan ? 'YES ✓' : 'NO (Violated)'}
                      </button>
                    </div>

                    {/* Was decision good according to system */}
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Good System Decision?</span>
                      <button
                        type="button"
                        onClick={() => updateTrade(trade.id, 'wasDecisionGood', !trade.wasDecisionGood)}
                        className={`px-3 py-1 text-[10px] font-mono font-black rounded-lg border transition-all cursor-pointer ${
                          trade.wasDecisionGood
                            ? 'bg-brand-purple text-white border-brand-purple'
                            : 'bg-yellow-400 text-black border-yellow-400'
                        }`}
                      >
                        {trade.wasDecisionGood ? 'YES (Valid)' : 'BAD DECISION'}
                      </button>
                    </div>

                    {/* Emotional state */}
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
                      <label className="block text-[9px] font-mono uppercase text-gray-500 mb-0.5">Emotional State</label>
                      <input
                        type="text"
                        value={trade.emotionalState}
                        onChange={e => updateTrade(trade.id, 'emotionalState', e.target.value)}
                        placeholder="Calm / Hesitant / FOMO"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
