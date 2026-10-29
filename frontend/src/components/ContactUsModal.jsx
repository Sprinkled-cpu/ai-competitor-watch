import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, CheckCircle2, ShieldCheck, MessageSquare, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPop, playChime } from '../utils/soundEffects';

export default function ContactUsModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const sanitize = (str) => str.replace(/[<>'"`;]/g, '').trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = sanitize(formData.name);
    const cleanEmail = sanitize(formData.email);
    const cleanMessage = sanitize(formData.message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    playChime();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setSubmitted(true);
    setError('');
  };

  const handleClose = () => {
    playPop();
    setSubmitted(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Contact Us</h3>
                <span className="text-xs text-slate-400 font-mono">XYZ Company Pvt. Ltd. Support</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-100">Message Delivered!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to **XYZ Company Pvt. Ltd.** Our support and intelligence team will review your inquiry and get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-500/50 font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="font-mono text-slate-300 block mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Business Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. rahul@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Custom Company Tracking Request or Feedback"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-slate-300 block mb-1">Your Message / Feedback *</label>
                <textarea
                  rows="3"
                  placeholder="Tell us what companies or sectors you'd like to track..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> End-to-End Encrypted
                </span>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
