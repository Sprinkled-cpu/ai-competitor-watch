import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Utensils, CreditCard, ShoppingBag, Cpu, Plus, Sparkles, ArrowRight, Layers } from 'lucide-react';

const PRESETS = [
  { id: 'automotive', label: 'Automotive & EVs', icon: Car, hint: 'Tesla, BYD, Rivian, Toyota, Ford' },
  { id: 'food', label: 'Food, Dining & QSR', icon: Utensils, hint: 'McDonald\'s, Starbucks, Chipotle, Domino\'s, Wendy\'s' },
  { id: 'fintech', label: 'Fintech & Banking', icon: CreditCard, hint: 'Stripe, Revolut, Block, Robinhood, Plaid' },
  { id: 'retail', label: 'Retail & E-Commerce', icon: ShoppingBag, hint: 'Amazon, Walmart, Shopify, Target, Costco' },
  { id: 'tech', label: 'AI & Cloud Hyperscalers', icon: Cpu, hint: 'OpenAI, Anthropic, Google, Microsoft, Meta' },
];

export default function IndustryQuickSwitcher({ activePreset, onSelectPreset, onBulkImport }) {
  const [customInput, setCustomInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const companies = customInput
      .split(/[,|\n]+/)
      .map((c) => c.trim())
      .filter(Boolean);

    if (companies.length > 0) {
      setIsImporting(true);
      onBulkImport(companies);
      setCustomInput('');
      setTimeout(() => setIsImporting(false), 500);
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-wider font-bold">Universal Sector Switcher</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Supports any industry worldwide</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Click a preset or enter any 5–10 companies below</span>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          const isActive = activePreset === p.id;

          return (
            <motion.button
              key={p.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectPreset(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/30'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/60'
              }`}
              title={p.hint}
            >
              <Icon className="w-4 h-4" />
              <span>{p.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Universal Input Bar */}
      <form
        onSubmit={handleBulkSubmit}
        className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Or enter any 5-10 custom companies (e.g., Nike, Adidas, Puma, Lululemon, Under Armour)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-cyan-400 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isImporting || !customInput.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Monitor Any Sector</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
