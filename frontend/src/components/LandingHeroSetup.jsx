import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, Plus, ArrowRight, Flame, Globe, Shield, Zap, Layers, Swords, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { GLOBAL_COMPANIES, FUN_BATTLE_PACKS } from '../companyDatabase';
import { playPop, playLaunch, playChime } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import ShinyText from './reactbits/ShinyText';
import DecryptedText from './reactbits/DecryptedText';

export default function LandingHeroSetup({ onLaunchDashboard }) {
  const [query, setQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Recommendations filtered from global database
  const recommendations = query.trim().length > 0
    ? GLOBAL_COMPANIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    setIsOpen(recommendations.length > 0);
    setHighlightIndex(0);
  }, [query]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // XSS protection sanitize
  const sanitize = (text) => text.replace(/[<>'"`;]/g, '').trim();

  const handleAddCompany = (name) => {
    const clean = sanitize(name);
    if (!clean) return;

    if (!selectedCompanies.includes(clean)) {
      if (selectedCompanies.length >= 10) {
        alert('You can select up to 10 companies at a time!');
        return;
      }
      playPop();
      setSelectedCompanies([...selectedCompanies, clean]);
    }
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveCompany = (name) => {
    playPop();
    setSelectedCompanies(selectedCompanies.filter((c) => c !== name));
  };

  const handleKeyDown = (e) => {
    if (!isOpen || recommendations.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        handleAddCompany(query.trim());
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % recommendations.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = recommendations[highlightIndex];
      if (chosen) handleAddCompany(chosen.name);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handlePackClick = (pack) => {
    playPop();
    setSelectedCompanies(pack.companies);
  };

  const handleLaunch = () => {
    if (selectedCompanies.length < 2) {
      alert('Please add at least 2 companies to compare and monitor!');
      return;
    }

    playLaunch();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#818cf8', '#f43f5e', '#34d399'],
    });

    onLaunchDashboard(selectedCompanies);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Hero Intro Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTONOMOUS COMPETITOR SURVEILLANCE AGENT</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">Ready to Monitor Any Sector</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          Track Any Rivals With <br className="hidden sm:inline" />
          <ShinyText text="Autonomous Intelligence" shimmerColor="#38bdf8" />
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No manual news scrolling. Enter <strong>any 2 to 10 companies</strong> from any industry — our AI agent sweeps global newsrooms, cleans clickbait, categorizes strategic moves, and builds executive briefs.
        </p>
      </div>

      {/* 4 Superpower Feature Cards (Friendly & Visual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl hover:border-cyan-500/40 transition-all space-y-2.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">1. Universal Crawler</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Works for any company worldwide — Tech, Fast Food, Sneakers, Cars, or Banks.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/40 transition-all space-y-2.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">2. Zero Clickbait Spam</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates stock price ticker bots and merges 10 identical news copies into 1 clean card.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl hover:border-purple-500/40 transition-all space-y-2.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/60 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">3. Smart Categorization</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sorts moves into Product Launches, Price Cuts, Executive Hires, and Partnerships.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl hover:border-rose-500/40 transition-all space-y-2.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60 flex items-center justify-center font-bold">
            <Swords className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-100 text-sm">4. Rival Clash Arena</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pits rivals head-to-head with momentum power bars, threat scores, and victory verdicts.
          </p>
        </div>
      </div>

      {/* Company Input Station (User Inputs Companies Here First!) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a0f1e] to-slate-900/90 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Step 1 of 2: Set Your Target Companies
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100">
              Which companies do you want to compare?
            </h3>
          </div>

          <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
            Minimum 2 companies • Recommended 3 to 10
          </span>
        </div>

        {/* Google-like Autocomplete Search Input */}
        <div ref={dropdownRef} className="relative">
          <div className="relative flex items-center rounded-2xl bg-slate-950 border-2 border-slate-700 focus-within:border-cyan-400 transition-all shadow-inner">
            <Search className="w-5 h-5 text-cyan-400 ml-4 shrink-0" />

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any company worldwide (e.g. type 'mic' for Micromax, 'tes', 'nik', 'app')..."
              className="w-full px-4 py-4 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 mr-2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => query.trim() && handleAddCompany(query.trim())}
              disabled={!query.trim()}
              className="px-4 py-2 mr-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 disabled:opacity-40 transition-all"
            >
              Add Company
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          <AnimatePresence>
            {isOpen && recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-50 divide-y divide-slate-800"
              >
                <div className="px-4 py-2 bg-slate-950/80 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Smart Recommendations ({recommendations.length})</span>
                  <span className="text-[10px]">Click or press Enter to add</span>
                </div>

                {recommendations.map((item, idx) => {
                  const isHighlighted = idx === highlightIndex;
                  const isSelected = selectedCompanies.includes(item.name);

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddCompany(item.name)}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        isHighlighted ? 'bg-cyan-950/60 text-cyan-200' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                            <span>{item.name}</span>
                            {isSelected && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                                Queued
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{item.sector}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 hidden sm:inline">{item.domain}</span>
                        <Plus className="w-4 h-4 text-cyan-400" />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Companies Badge Queue */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Selected Companies: <strong className="text-cyan-300">{selectedCompanies.length}</strong> / 10
            </span>
            {selectedCompanies.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setSelectedCompanies([]);
                }}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {selectedCompanies.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs italic">
              No companies chosen yet. Type above (e.g. &ldquo;Micromax&rdquo;, &ldquo;Tesla&rdquo;) or click a Fun Pack below!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCompanies.map((comp) => (
                <motion.span
                  key={comp}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-200 border border-cyan-500/40 shadow-sm"
                >
                  <span>{comp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(comp)}
                    className="hover:text-rose-400 transition-colors p-0.5 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* 1-Click Fun Battle Packs (For Quick Inspiration) */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Need inspiration? Pick a 1-Click Starter Pack:</span>
          </span>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FUN_BATTLE_PACKS.map((pack) => (
              <motion.button
                key={pack.name}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => handlePackClick(pack)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all shrink-0 shadow-sm"
              >
                <span>{pack.emoji}</span>
                <span>{pack.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Big Launch Surveillance Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: selectedCompanies.length >= 2 ? 1.02 : 1 }}
            whileTap={{ scale: selectedCompanies.length >= 2 ? 0.98 : 1 }}
            type="button"
            onClick={handleLaunch}
            disabled={selectedCompanies.length < 2}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl ${
              selectedCompanies.length >= 2
                ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/30 ring-2 ring-cyan-400/40 cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
            <span>
              {selectedCompanies.length >= 2
                ? `🚀 Launch AI Surveillance & Compare ${selectedCompanies.length} Companies`
                : 'Add At Least 2 Companies to Launch Dashboard'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
