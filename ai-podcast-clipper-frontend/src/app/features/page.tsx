"use client";

import Link from "next/link";
import { Scissors, Sparkles, Zap, Type, Palette, MonitorPlay, Share2, BarChart3, ArrowRight } from "lucide-react";
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

export default function FeaturesPage() {
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

            <main className="flex-1 pt-40 pb-32 relative z-10 perspective-[2000px]">
                <div className="container max-w-6xl mx-auto px-4">

                    {/* Elite Hero Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="text-center max-w-4xl mx-auto mb-24"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold font-mono text-primary mb-8 shadow-lg shadow-primary/5 backdrop-blur-md uppercase tracking-widest cursor-default">
                            <Sparkles className="w-4 h-4" /> Next-Gen Pipeline
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tighter leading-[0.9]">
                            Viral Content <br />
                            <span className="text-primary font-script lowercase tracking-normal text-[1.2em] font-medium leading-[0.5] mix-blend-lighten text-shadow-glow">multiplied.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium mt-6">
                            Unleash the power of our multi-modal AI engine that understands context, emotion, and viral hooks better than a human editor.
                        </p>
                    </motion.div>

                    {/* Elite Bento Grid */}
                    <motion.div 
                        variants={staggerContainer} 
                        initial="hidden" 
                        whileInView="show" 
                        viewport={{ once: true }} 
                        className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto transform-style-3d"
                    >
                        {/* Large Feature 1 */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-6 lg:col-span-8 row-span-2 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-10 hover:border-primary/40 transition-colors duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.5)] h-[450px] flex flex-col justify-start">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute right-0 bottom-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                            
                            <div className="relative z-10 max-w-lg">
                                <motion.div whileHover={{ scale: 1.1, rotate: 10 }} className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all shadow-lg text-primary">
                                    <Zap className="w-8 h-8" />
                                </motion.div>
                                <h3 className="text-4xl font-black tracking-tight text-white mb-4">Context-Aware AI</h3>
                                <p className="text-zinc-400 text-lg leading-relaxed font-medium">Our models don't just look for loud noises. They parse sentiment, tension, and micro-expressions to extract statistically certified algorithmic gold.</p>
                            </div>

                            {/* Decorative Visual element inside the wide card */}
                            <div className="absolute right-0 bottom-0 w-1/2 h-2/3 opacity-30 group-hover:opacity-80 transition-opacity">
                                <div className="w-full h-full bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 absolute bottom-0" />
                                <div className="flex items-end justify-center gap-1.5 h-full pb-8 pr-12">
                                    {Array.from({ length: 16 }).map((_, i) => (
                                        <motion.div key={i} animate={{ height: [`${30 + Math.random() * 40}%`, `${60 + Math.random() * 40}%`, `${30 + Math.random() * 40}%`] }} transition={{ duration: 1.5 + Math.random(), repeat: Infinity }} className="w-4 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] rounded-t-sm" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Small Feature 1 */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 shadow-2xl h-[215px]">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:bg-primary/10 transition-all text-primary">
                                <Type className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Kinetic Subtitles</h3>
                            <p className="text-zinc-400 text-sm font-medium">Karaoke-style hyper-animated typography globally proven to boost massive retention.</p>
                        </motion.div>

                        {/* Small Feature 2 */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 shadow-2xl h-[215px]">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:bg-primary/10 transition-all text-primary">
                                <MonitorPlay className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Facial Tracking</h3>
                            <p className="text-zinc-400 text-sm font-medium">Auto-pans and zooms seamlessly to keep the speaker perfectly centered in native 9:16.</p>
                        </motion.div>

                        {/* Tall Feature */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-3 lg:col-span-4 row-span-2 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-10 flex flex-col justify-end hover:border-primary/40 transition-all duration-500 shadow-2xl h-[450px]">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity }} className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute top-10 left-10 w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary/10 transition-colors">
                                <Palette className="w-8 h-8" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Custom Brand Kits</h3>
                                <p className="text-zinc-400 font-medium">Upload .otf/.ttf fonts, vector logos, and intro stings to build a preset. Then, apply it to hundreds of clips instantly.</p>
                            </div>
                        </motion.div>

                        {/* Medium Feature 1 */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 shadow-2xl h-[280px]">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary/10 transition-all text-primary">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Virality Scoring</h3>
                            <p className="text-zinc-400 text-base font-medium">Predict algorithmic success before you even export. Pre-screened against 5M+ viral videos.</p>
                        </motion.div>

                        {/* Medium Feature 2 */}
                        <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-6 lg:col-span-4 relative group overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] backdrop-blur-2xl p-8 flex flex-col hover:border-primary/40 transition-all duration-500 shadow-2xl h-[280px]">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary/10 transition-all text-primary">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 tracking-tight">One-Click Dispatch</h3>
                            <p className="text-zinc-400 text-base font-medium">Native API pipelines wired directly into TikTok, Instagram Reels, and YouTube Shorts for headless publishing.</p>
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
