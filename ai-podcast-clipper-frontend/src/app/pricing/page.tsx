"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Menu, Scissors, Check, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Background Noise & Glows */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] bg-primary/10 blur-[150px] rounded-[100%] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[500px] bg-blue-500/10 blur-[120px] rounded-[100%] pointer-events-none z-0" />

      {/* Floating Navbar */}
      <div className="fixed top-0 w-full z-50 flex justify-center px-4 pt-6 pointer-events-none">
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="pointer-events-auto flex items-center justify-between px-6 h-14 w-full max-w-4xl rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary/80 to-emerald-600 rounded-full group-hover:scale-110 shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 overflow-hidden relative border border-white/20">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <Scissors className="w-3.5 h-3.5 text-black relative z-10 group-hover:-rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors">PodClip<span className="text-primary">.ai</span></span>
          </Link>

          {/* Nav Links - Centered Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
            {['Features', 'Showcase', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${item === 'Pricing' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors text-sm font-bold shadow-lg"
               >
                 <span>Dashboard</span>
                 <ArrowRight className="w-3.5 h-3.5" />
               </motion.button>
            </Link>

            <button className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </motion.header>
      </div>

      <main className="flex-1 flex flex-col pt-40 pb-20 relative w-full items-center z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simple, transparent pricing</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Scale your content, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">not your budget.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-zinc-400 font-medium"
            >
              Start for free, upgrade when you need more power. Cancel anytime.
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center"
          >
            {/* Starter Plan */}
            <motion.div variants={fadeUpItem} className="relative group rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 hover:bg-black/60 transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <p className="text-sm text-zinc-400 mb-6">Perfect to try out the AI tools.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-sm font-medium text-zinc-500">/ forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['3 Videos / month', '720p Export Quality', 'Standard AI Captioning', 'Community Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors">
                Get Started
              </button>
            </motion.div>

            {/* Creator Plan (Most Popular) */}
            <motion.div variants={fadeUpItem} className="relative group rounded-3xl border border-primary/50 bg-black/80 backdrop-blur-xl p-8 transform md:-translate-y-4 shadow-[0_0_40px_rgba(var(--primary),0.15)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Creator
                </h3>
                <p className="text-sm text-zinc-400 mb-6">For regular content creators.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$29</span>
                  <span className="text-sm font-medium text-zinc-500">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['50 Videos / month', '1080p & 4K Export Quality', 'Advanced Dynamic Captions', 'Remove Watermark', 'Priority Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full bg-primary hover:bg-primary/90 text-black font-bold transition-colors shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                Upgrade to Creator
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={fadeUpItem} className="relative group rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 hover:bg-black/60 transition-colors">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Agency</h3>
                <p className="text-sm text-zinc-400 mb-6">Ultimate power for pros & teams.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-sm font-medium text-zinc-500">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Videos', 'API Access', 'Custom Brand Fonts', 'Team Collaboration', '24/7 Dedicated Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors">
                Contact Sales
              </button>
            </motion.div>

          </motion.div>
        </div>
      </main>

    </div>
  );
}
