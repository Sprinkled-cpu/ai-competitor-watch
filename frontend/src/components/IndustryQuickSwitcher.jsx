import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, Plus, Check, ArrowRight, Flame, Layers } from 'lucide-react';
import { GLOBAL_COMPANIES, FUN_BATTLE_PACKS } from '../companyDatabase';
import { playPop, playChime } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function IndustryQuickSwitcher({ activePreset, onSelectPreset, onBulkImport }) {
  const [query, setQuery] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter recommendations based on input (fuzzy matching)
  const recommendations = query.trim().length > 0
    ? GLOBAL_COMPANIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.sector.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  useEffect(() => {
    setIsOpen(recommendations.length > 0);
    setHighlightIndex(0);
  }, [query]);

  // Click outside listener to close suggestion pop-up
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sanitize input to prevent XSS / malicious code
  const sanitize = (text) => text.replace(/[<>'"`;]/g, '').trim();

  const handleAddCompany = (companyName) => {
    const cleanName = sanitize(companyName);
    if (!cleanName) return;

    if (!selectedChips.includes(cleanName)) {
      if (selectedChips.length >= 10) {
        alert('You can select up to 10 companies to monitor at a time!');
        return;
      }
      playPop();
      setSelectedChips([...selectedChips, cleanName]);
    }
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveChip = (companyName) => {
    playPop();
    setSelectedChips(selectedChips.filter((c) => c !== companyName));
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
      if (chosen) {
        handleAddCompany(chosen.name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleLaunchSearch = () => {
    if (selectedChips.length === 0 && !query.trim()) return;

    const finalCompanies = [...selectedChips];
    if (query.trim() && !finalCompanies.includes(query.trim())) {
      finalCompanies.push(query.trim());
    }

    playChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });

    onBulkImport(finalCompanies);
    setSelectedChips([]);
    setQuery('');
  };

  const handlePackClick = (pack) => {
    playChime();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    onBulkImport(pack.companies);
  };

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-2xl shadow-2xl relative z-30">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wider font-bold">Smart Company Finder</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">Google-Style Autocomplete</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5">
            Type any company name (e.g. &ldquo;Micromax&rdquo;, &ldquo;Tesla&rdquo;, &ldquo;Nike&rdquo;, &ldquo;Apple&rdquo;)
          </h3>
        </div>

        {/* Selected chips count badge */}
        {selectedChips.length > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5 self-start sm:self-auto">
            <span>{selectedChips.length}/10 Companies Queued</span>
          </span>
        )}
      </div>

      {/* Google-like Search Bar & Autocomplete Dropdown */}
      <div ref={dropdownRef} className="relative">
        <div className="relative flex items-center rounded-2xl bg-slate-950 border-2 border-slate-700 focus-within:border-cyan-400 transition-all shadow-inner">
          <Search className="w-5 h-5 text-cyan-400 ml-4 shrink-0" />

          {/* Autocomplete Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search any company worldwide (type 'mic', 'tes', 'nik', 'app')..."
            className="w-full px-3.5 py-3.5 bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 mr-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Launch / Add Action Button */}
          <button
            type="button"
            onClick={handleLaunchSearch}
            disabled={selectedChips.length === 0 && !query.trim()}
            className="flex items-center gap-2 px-5 py-3 mr-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <span>Track Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Google-style Autocomplete Dropdown */}
        <AnimatePresence>
          {isOpen && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl shadow-cyan-950/50 overflow-hidden z-50 divide-y divide-slate-800"
            >
              <div className="px-3.5 py-2 bg-slate-950/70 text-[11px] font-mono text-slate-400 flex justify-between items-center">
                <span>Matching Companies ({recommendations.length})</span>
                <span className="text-[10px] text-slate-500">Press Enter or click to add</span>
              </div>

              {recommendations.map((item, idx) => {
                const isHighlighted = idx === highlightIndex;
                const isAlreadySelected = selectedChips.includes(item.name);

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleAddCompany(item.name)}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      isHighlighted ? 'bg-cyan-950/50 text-cyan-200' : 'hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <span>{item.name}</span>
                          {isAlreadySelected && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                              Added
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{item.sector}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        {item.domain}
                      </span>
                      <Plus className="w-4 h-4 text-cyan-400 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Companies Chip Cloud */}
      {selectedChips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-1 flex flex-wrap items-center gap-2"
        >
          <span className="text-xs font-mono text-slate-400 mr-1">Queued Targets:</span>
          {selectedChips.map((comp) => (
            <motion.span
              key={comp}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-200 border border-cyan-500/40 shadow-sm"
            >
              <span>{comp}</span>
              <button
                type="button"
                onClick={() => handleRemoveChip(comp)}
                className="hover:text-rose-400 transition-colors p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          ))}
          <button
            type="button"
            onClick={() => setSelectedChips([])}
            className="text-[11px] font-mono text-slate-500 hover:text-slate-300 underline ml-1"
          >
            Clear all
          </button>
        </motion.div>
      )}

      {/* Fun & Popular Battle Packs (Instant 1-Click Exploration for Anyone) */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular 1-Click Fun Packs:</span>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Explore without typing!</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FUN_BATTLE_PACKS.map((pack) => (
            <motion.button
              key={pack.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePackClick(pack)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all shrink-0 shadow-sm"
            >
              <span>{pack.emoji}</span>
              <span>{pack.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
