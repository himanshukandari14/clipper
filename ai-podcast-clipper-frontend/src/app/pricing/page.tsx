"use client";

import Link from "next/link";
import { Scissors, Check, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "~/components/site-header";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardHover = {
  rest: { scale: 1, y: 0, z: 0 },
  hover: { scale: 1.02, y: -5, z: 50, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* Dynamic Grid Background with fixed placement */}
      <motion.div style={{ opacity: 0.15 }} className="fixed inset-0 z-0 pointer-events-none" >
          <div style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
      </motion.div>
      
      {/* Intense Lime Yellow Glow */}
      <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 blur-[150px] rounded-[100%] pointer-events-none z-0" 
      />

      {/* Elite Navbar */}
      <SiteHeader />

      <main className="flex-1 flex flex-col pt-40 pb-32 relative z-10 perspective-[2000px] w-full items-center">
        <div className="container max-w-6xl mx-auto px-4">
          
          {/* Elite Header */}
          <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-center max-w-4xl mx-auto mb-24"
          >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold font-mono text-primary mb-8 shadow-lg shadow-primary/5 backdrop-blur-md uppercase tracking-widest cursor-default">
                  <Zap className="w-4 h-4" /> Transparent Pricing
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">
                  Scale pipeline <br />
                  <span className="text-primary font-script lowercase tracking-normal text-[1.2em] font-medium leading-[0.5] mix-blend-lighten text-shadow-glow">not budget.</span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium mt-6">
                  Start for free to test the model. Upgrade when your content operation needs industrial strength. Cancel anytime.
              </p>
          </motion.div>

          {/* Pricing Cards Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-center transform-style-3d"
          >
            {/* Starter Plan */}
            <motion.div variants={cardHover} initial="rest" whileHover="hover" className="relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-10 hover:border-white/20 transition-all duration-500 shadow-2xl flex flex-col h-[600px]">
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Standard</h3>
                <p className="text-sm font-medium text-zinc-400 mb-8">Test the AI extraction pipeline.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">$0</span>
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">/ forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-auto relative z-10">
                {['3 Pipeline Executions / mo', '720p Render Quality', 'Standard Kinetic Captions', 'Community Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <Check className="w-4 h-4 text-zinc-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-colors mt-8 relative z-10 uppercase tracking-widest text-xs">
                Deploy Free
              </button>
            </motion.div>

            {/* Elite Plan (Most Popular) */}
            <motion.div variants={cardHover} initial="rest" whileHover="hover" className="relative group overflow-hidden rounded-[2.5rem] border border-primary/40 bg-[#0a0a0a] backdrop-blur-2xl p-10 transition-all duration-500 shadow-[0_20px_60px_rgba(var(--primary),0.15)] flex flex-col h-[650px] md:-translate-y-4">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute top-8 right-8 bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                Most Popular
              </div>
              
              <div className="mb-8 relative z-10">
                <h3 className="text-3xl font-black text-primary mb-2 flex items-center gap-2 tracking-tight">
                  <Sparkles className="w-6 h-6" /> Elite
                </h3>
                <p className="text-sm font-medium text-zinc-400 mb-8">For serious channel operators.</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-white tracking-tighter">$29</span>
                  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">/ month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-auto relative z-10">
                {['50 Pipeline Executions / mo', 'Native 4K Render Quality', 'Advanced Dynamic Subtitles', 'Zero Watermarks', '1-hr Priority Support API'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white">
                    <Check className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-4 rounded-2xl bg-primary hover:bg-white text-black font-black transition-all mt-8 relative z-10 uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]">
                Upgrade to Elite
              </button>
            </motion.div>

          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-16 bg-[#030303] z-10 overflow-hidden mt-auto flex-shrink-0">
          <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
              <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring" }} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <Scissors className="w-5 h-5" />
              </motion.div>
              <span className="font-bold text-2xl text-white tracking-tight">PodClip<span className="text-white/50">.ai</span></span>
          </div>
          <div className="text-zinc-600 text-sm font-semibold tracking-wide">
              © {new Date().getFullYear()} PodClip.ai. All rights reserved. Built by elite engineers.
          </div>
          <div className="flex gap-8">
              {['Twitter', 'Discord', 'YouTube'].map(link => (
              <motion.div key={link} whileHover={{ y: -3 }}>
                  <Link href="#" className="text-zinc-400 hover:text-primary transition-colors text-sm font-bold uppercase tracking-wider">
                  {link}
                  </Link>
              </motion.div>
              ))}
          </div>
          </div>
      </footer>
    </div>
  );
}
