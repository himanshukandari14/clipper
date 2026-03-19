/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Link from "next/link";
import { ArrowRight, Menu, Play, Scissors, Wand2, Share2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const fadeUpText = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden" ref={containerRef}>
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
                className="px-4 py-1.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
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

      <main className="flex-1 flex flex-col pt-32 pb-20 relative w-full justify-center min-h-[100vh] z-10">
        <motion.div style={{ y, opacity }} className="container mx-auto px-4 flex flex-col items-center text-center">

      

          {/* Hero Headline */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-5xl mb-8"
          >
            <motion.h1 variants={fadeUpText} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]">
              Turn Podcasts into <br />
              <div className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-primary/20 blur-2xl rounded-full" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-300 to-emerald-400 drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">Viral Shorts</span>
              </div>
            </motion.h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed"
          >
            AI-powered clipper that instantly finds, crops, and captions the best moments from your long-form content. <span className="text-zinc-200">Ready for TikTok, Reels, and Shorts.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link href="/dashboard">
              <button className="relative group px-8 py-4 rounded-full bg-primary text-black font-bold text-lg hover:scale-105 transition-all w-full sm:w-auto overflow-hidden">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Wand2 className="w-5 h-5" />
                  Start Clipping Free
                </span>
              </button>
            </Link>
            <Link href="/showcase">
              <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 backdrop-blur-md">
                <Play className="w-5 h-5 fill-white" />
                Watch Demo
              </button>
            </Link>
          </motion.div>

        </motion.div>

        {/* Continuous Video Marquee Carousel */}
        <div className="w-full relative overflow-hidden py-10 before:absolute before:left-0 before:top-0 before:w-16 md:before:w-64 before:h-full before:bg-gradient-to-r before:from-background before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-16 md:after:w-64 after:h-full after:bg-gradient-to-l after:from-background after:to-transparent after:z-10">
          <motion.div
            className="flex gap-4 md:gap-8 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          >
            {[...Array(14)].map((_, i) => (
              <div key={i} className="relative w-48 h-[360px] md:w-72 md:h-[500px] rounded-3xl overflow-hidden border border-white/5 flex-shrink-0 bg-zinc-900 group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <video
                  src={i % 2 === 0 ? "/videos/video1.mp4" : "/videos/video2.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-80" />
                
                {/* Content */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/90 text-black text-[10px] font-black px-2.5 py-1 rounded w-fit uppercase shadow-[0_0_15px_rgba(var(--primary),0.4)] backdrop-blur-sm">
                      VIRAL CLIP
                    </div>
                    
                    {/* Fake Audio Wave */}
                    <div className="flex items-center justify-center gap-[2px] opacity-70">
                      <span className="w-[3px] h-2 bg-white rounded-full animate-wave" style={{ animationDelay: '0ms' }} />
                      <span className="w-[3px] h-4 bg-white rounded-full animate-wave" style={{ animationDelay: '150ms' }} />
                      <span className="w-[3px] h-3 bg-white rounded-full animate-wave" style={{ animationDelay: '300ms' }} />
                      <span className="w-[3px] h-5 bg-white rounded-full animate-wave" style={{ animationDelay: '450ms' }} />
                    </div>
                  </div>
                  
                  <p className="text-white text-sm md:text-lg font-bold line-clamp-2 leading-tight drop-shadow-lg">
                    {i % 2 === 0 
                      ? "\"This insight completely changed the way I look at content...\""
                      : "\"The number one mistake creators make is...\""
                    }
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Visual Element: The Transformation Engine */}
        <div className="container mx-auto px-4 flex flex-col items-center text-center mt-20 md:mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-5xl h-[400px] perspective-[1200px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              
              {/* Central Glowing Core container */}
              <div className="absolute w-[140%] md:w-[120%] h-64 opacity-30 flex items-center justify-center mask-linear-fade">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [20, Math.random() * 150 + 50, 20],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5 + Math.random() * 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.05
                    }}
                    className="w-1.5 mx-[2px] md:w-2 md:mx-1 rounded-full bg-gradient-to-t from-primary/20 via-primary to-primary/20"
                  />
                ))}
              </div>

              {/* Floating Cards (Output) */}
              <div className="relative z-10 flex gap-4 md:gap-14 transform-style-3d items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ rotate: i === 0 ? '-15deg' : i === 1 ? '0deg' : '15deg', y: i === 1 ? -30 : 20, z: i === 1 ? 50 : 0 }}
                    animate={{ 
                      y: i === 1 ? [-30, -45, -30] : [20, 10, 20],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: i === 1 ? -50 : 0, 
                      z: 100,
                      rotate: 0,
                      transition: { duration: 0.3 }
                    }}
                    className={`w-36 h-64 md:w-56 md:h-96 rounded-2xl border ${i===1 ? 'border-primary/50 bg-black/90 shadow-[0_0_40px_rgba(var(--primary),0.2)]' : 'border-white/10 bg-black/60 shadow-2xl'} backdrop-blur-xl relative overflow-hidden group cursor-pointer`}
                    style={{ zIndex: i === 1 ? 20 : 10 }}
                  >
                    {/* Glowing Accent */}
                    {i === 1 && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />}

                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                    {/* Mock Content */}
                    <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="h-full bg-primary"
                          />
                        </div>
                        <div className="w-1/4 h-1.5 bg-white/10 rounded-full" />
                      </div>

                      {/* Fake Captions */}
                      <div className="space-y-3 mb-10 w-full relative">
                        <motion.div 
                           animate={{ scale: [1, 1.05, 1] }} 
                           transition={{ duration: 2, repeat: Infinity }}
                           className={`mx-auto w-max px-3 py-1 rounded-md text-[10px] md:text-xs font-bold ${i===1 ? 'bg-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.4)]' : 'bg-white/10 text-white/70'}`}
                        >
                          {i === 1 ? "VIRAL HOOK" : "HIGHLIGHT"}
                        </motion.div>
                        <div className="text-center flex flex-col items-center gap-1">
                          <span className="bg-black/60 backdrop-blur-md rounded text-white font-extrabold text-xl md:text-3xl px-2 py-0.5 inline-block shadow-lg leading-tight uppercase">THE SECRET</span>
                          <span className={`bg-black/60 backdrop-blur-md rounded font-extrabold text-xl md:text-3xl px-2 py-0.5 inline-block shadow-lg leading-tight uppercase ${i === 1 ? "text-primary text-shadow-glow" : "text-emerald-400"}`}>TO SUCCESS</span>
                        </div>
                      </div>

                      {/* UI Elements */}
                      <div className="flex justify-between items-end">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/20 transition-colors">
                          <Play className="w-4 h-4 text-white fill-white group-hover:text-primary group-hover:fill-primary transition-colors" />
                        </div>
                        <div className="flex gap-2">
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm">
                              <Share2 className="w-3 h-3 text-white/50" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Platforms */}
      <footer className="relative border-t border-white/5 py-16 bg-black/80 backdrop-blur-xl z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-sm font-semibold text-zinc-500 mb-10 uppercase tracking-[0.2em]">Optimized for everywhere</div>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn Video'].map((platform, i) => (
              <motion.div 
                key={platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, opacity: 1 }}
                className="flex items-center gap-2 group cursor-default opacity-60 transition-opacity"
              >
                <span className="font-bold text-2xl text-zinc-300 font-sans tracking-tight group-hover:text-white transition-colors">{platform}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
