import React from 'react';
import { ShieldCheck, Mail, GitBranch, Heart, Globe, Radio } from 'lucide-react';
import { playPop } from '../utils/soundEffects';

export default function Footer({ onOpenContact }) {
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-[#06080e]/95 backdrop-blur-xl mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white font-black text-sm">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-200 block text-sm">
                AI Competitor Watch Agent
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Universal Market Surveillance & Intelligence Platform
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button
              onClick={() => {
                playPop();
                onOpenContact();
              }}
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>XSS Sanitized & Secure</span>
            </span>
            <span className="text-slate-700">•</span>
            <a
              href="https://github.com/Sprinkled-cpu/ai-competitor-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>

        {/* Legal Copyright Line */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-[11px] font-mono text-slate-500">
          <p>© 2026 XYZ Company Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for corporate strategy teams, founders, and students worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
