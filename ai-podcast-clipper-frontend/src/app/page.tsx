"use client";

import Link from "next/link";
import { ArrowRight, Play, Scissors, Wand2, Sparkles, Video, Zap, Share2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { SiteHeader } from "~/components/site-header";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
};

const blockReveal = {
  hidden: { y: 80, opacity: 0, scale: 0.9, rotateX: 20, filter: "blur(15px)" },
  show: { y: 0, opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)", transition: { type: "spring" as const, bounce: 0.4, duration: 1.2 } }
};

const badgeEnter = {
  hidden: { x: 50, opacity: 0, scale: 0.5, rotate: -20 },
  show: { x: 0, opacity: 1, scale: 1, rotate: 0, transition: { type: "spring" as const, damping: 12, mass: 0.5, delay: 0.8 } }
};

const cardHover = {
  rest: { scale: 1, y: 0, z: 0 },
  hover: { scale: 1.02, y: -10, z: 50, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
};

export default function HomePage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  // Advanced Scroll Parallax Config
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 50, damping: 15, mass: 0.1 });

  // Deep Parallax Layers
  const opacityFade = useTransform(smoothScroll, [0, 0.2], [1, 0]);
  const scaleDown = useTransform(smoothScroll, [0, 0.3], [1, 0.8]);
  const blurOut = useTransform(smoothScroll, [0, 0.3], ["blur(0px)", "blur(20px)"]);

  // Accuracy State
  const [accuracy, setAccuracy] = useState(2);
  useEffect(() => {
    let current = 2;
    const interval = setInterval(() => {
      if (current < 100) {
        current += Math.floor(Math.random() * 8) + 1;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
        }
        setAccuracy(current);
      }
    }, 40); 
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden overflow-y-clip" ref={containerRef}>
      
      {/* Dynamic Grid Background with fixed placement */}
      <motion.div style={{ opacity: 0.15 }} className="fixed inset-0 z-0 pointer-events-none" >
        <div style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]" />
      </motion.div>
      
      {/* Intense Lime Yellow Glow with floating parallax */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 blur-[150px] rounded-[100%] pointer-events-none z-0" 
      />

      {/* Modern Floating Header with Drop-in */}
      <SiteHeader />

      <main className="flex-1 flex flex-col pt-40 pb-20 relative w-full items-center z-10 overflow-hidden">
        {/* Extreme Hero Section with Scroll Hook */}
        <motion.section 
          ref={heroRef}
          style={{ opacity: opacityFade, scale: scaleDown, filter: blurOut }}
          className="container max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 min-h-[70vh] transform-style-3d origin-bottom"
        >
          {/* Elite Text Container */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col items-start text-left perspective-[1000px]"
          >
            <motion.div 
              variants={blockReveal}
              className="inline-flex items-center gap-3 px-2 py-1.5 pr-4 rounded-full bg-white/[0.03] border border-white/10 text-zinc-300 font-medium text-sm mb-8 hover:bg-white/10 transition-colors shadow-2xl backdrop-blur-md group cursor-default"
            >
              <motion.div 
                 whileHover={{ rotate: 180, scale: 1.2 }}
                 transition={{ type: "spring", bounce: 0.6 }}
                 className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40"
              >
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                 </span>
                 <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
              </motion.div>
              <span className="font-sans">AI-Powered Video Clipping Engine</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-primary group-hover:translate-x-1.5 transition-all" />
            </motion.div>
            
            <motion.h1 
              variants={blockReveal}
              className="text-6xl sm:text-7xl lg:text-[100px] font-black tracking-tighter leading-[0.9] mb-8 relative z-10"
            >
              MULTIPLY <br/>
              YOUR <motion.span 
                 initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
                 animate={{ opacity: 1, rotate: -3, scale: 1 }}
                 transition={{ type: "spring", bounce: 0.6, delay: 0.6, duration: 1 }}
                 className="font-script font-medium text-[1.2em] tracking-normal text-primary inline-block origin-bottom-left"
              >Reach.</motion.span>
            </motion.h1>

            <motion.p 
              variants={blockReveal}
              className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 font-medium leading-relaxed border-l-4 border-primary/50 pl-6 rounded-l-sm bg-gradient-to-r from-primary/5 to-transparent py-2"
            >
              Transform your 2-hour podcasts into 30 viral shorts in seconds. 
              Built for <span className="text-white">TikTok, Reels, and Shorts</span> using bleeding-edge AI models.
            </motion.p>

            <motion.div variants={blockReveal} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgb(0,0,0)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto group relative px-8 py-5 rounded-2xl bg-primary text-black font-black text-lg transition-all overflow-hidden shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_60px_rgba(var(--primary),0.8)]"
                >
                  <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 w-1/4 h-full bg-white/40 skew-x-12 blur-sm" />
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Start Creating Free
                  </span>
                </motion.button>
              </Link>
              <Link href="/showcase" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-transparent border-2 border-white/10 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <Play className="w-5 h-5 fill-white/20" />
                  See it in Action
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual Pipeline Architecture */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotateY: 15, filter: "blur(20px)" }}
            animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", damping: 25, mass: 1, stiffness: 100, delay: 0.4 }}
            className="flex-1 w-full relative h-[650px] flex items-center perspective-[2000px] mt-10 lg:mt-0"
          >
            {/* Glowing background blob */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-emerald-500/10 rounded-[4rem] blur-[100px] z-[-1]" />
            
            {/* Massive Origin Video (Landscape) */}
            <motion.div 
               animate={{ y: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute left-0 md:-left-4 w-[65%] aspect-video bg-zinc-950 border border-white/20 rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-20 group"
            >
               <video src="/videos/hero-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 border border-white/10 flex items-center gap-2 shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  RAW_PODCAST.MP4 
                  <span className="text-zinc-500 ml-2 hidden sm:inline">02:14:00</span>
               </div>
               
               {/* 100% Accuracy Floating Mini-Badge */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
                  className="absolute -bottom-5 -right-5 bg-primary text-black font-black px-5 py-2.5 rounded-xl text-sm shadow-[0_15px_30px_rgba(var(--primary),0.6)] rotate-6 border-[3px] border-black"
               >
                  100% ACCURACY
               </motion.div>
            </motion.div>

            {/* Glowing Pipeline Connector SVG (from right edge of main video to left edges of shorts) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
               {[15, 38, 62, 85].map((y, i) => (
                  <motion.path 
                     key={i}
                     d={`M 60 50 C 70 50, 70 ${y}, 75 ${y}`}
                     fill="none" 
                     stroke="#bef264" 
                     strokeWidth="0.5"
                     strokeOpacity="0.4"
                     strokeDasharray="2 2"
                     animate={{ strokeDashoffset: [20, 0] }}
                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
               ))}
            </svg>

            {/* 4 Extracted Viral Shorts (Portrait) */}
            <div className="absolute right-0 md:-right-6 top-0 h-full w-[30%] flex flex-col justify-between py-6 z-20">
               {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                     key={i}
                     initial={{ x: 50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ type: "spring", delay: 0.8 + (i * 0.1) }}
                     whileHover={{ scale: 1.05, zIndex: 50, x: -10 }}
                     className="w-full h-[22%] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.8)] group flex items-center p-2 cursor-pointer backdrop-blur-xl hover:border-primary/50 transition-colors"
                  >
                     <div className="w-[45%] h-full bg-zinc-900 rounded-lg overflow-hidden relative border border-white/5">
                       <video src="/videos/hero-video.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" style={{ animationDelay: `-${i * 15}s` }} />
                     </div>
                     <div className="pl-3 flex-1 flex flex-col justify-center">
                        <div className="text-[11px] font-black text-primary mb-0.5 uppercase tracking-widest drop-shadow-[0_0_5px_rgba(var(--primary),0.5)]">Clip {i}</div>
                        <div className="text-[10px] text-zinc-400 font-bold mb-1.5 line-clamp-1 break-words leading-tight">Viral Hook Extracted</div>
                        <div className="flex items-center gap-1.5 w-full">
                           <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${99 - (i * 3)}%` }} />
                           </div>
                           <span className="text-[8px] text-zinc-500 font-mono font-bold leading-none">{99 - (i * 3)}</span>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

          </motion.div>
        </motion.section>

        {/* Continuous Video Marquee Carousel */}
        <section className="w-full relative py-32 mb-16 perspective-[1500px]">
          <motion.div 
            initial={{ opacity: 0, rotateX: 30, y: 100 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1.5 }}
            className="text-center mb-16"
          >
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">Join the <span className="font-script text-[1.4em] font-medium text-primary tracking-normal normal-case inline-block -rotate-3 text-shadow-glow">Creator</span> Revolution</h2>
             <p className="text-zinc-500 text-lg font-medium">Scroll down to see the magic in action.</p>
          </motion.div>

          <div className="w-full relative overflow-visible before:absolute before:left-0 before:top-0 before:w-16 md:before:w-64 before:h-full before:bg-gradient-to-r before:from-[#050505] before:to-transparent before:z-20 after:absolute after:right-0 after:top-0 after:w-16 md:after:w-64 after:h-full after:bg-gradient-to-l after:from-[#050505] after:to-transparent after:z-20">
            <motion.div
              className="flex gap-6 md:gap-10 w-max pl-6 md:pl-10 pb-8 pt-8"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            >
              {[...Array(14)].map((_, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05, z: 50, zIndex: 30 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative w-56 h-[400px] md:w-72 md:h-[500px] rounded-3xl overflow-hidden border-2 border-white/5 flex-shrink-0 bg-zinc-900 group shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_40px_80px_rgba(var(--primary),0.3)] hover:border-primary/50 cursor-pointer origin-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-90 group-hover:opacity-60 transition-opacity duration-700 z-10" />
                  
                  <motion.div 
                     animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }} 
                     transition={{ duration: 4, repeat: Infinity }}
                     className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <Video className="w-16 h-16 text-white" />
                  </motion.div>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 pointer-events-none transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                    <motion.div 
                       whileHover={{ scale: 1.1 }}
                       className="bg-primary text-black text-[11px] font-black px-3 py-1.5 rounded-md w-fit uppercase shadow-[0_0_20px_rgba(var(--primary),0.6)] backdrop-blur-md"
                    >
                      VIRAL CLIP
                    </motion.div>
                    
                    <p className="text-white text-base md:text-lg font-bold line-clamp-3 leading-tight drop-shadow-2xl">
                      {i % 2 === 0 ? "\"This insight completely changed the way I post content entirely...\"" : "\"The number one mistake creators are making on TikTok right now...\""}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Engineering / Pipeline Section */}
        <section className="container max-w-6xl mx-auto px-4 mb-32 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-10"
          >
            <div>
               <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.9]">Built for scale. <br/><span className="text-zinc-600">Engineered for perfection.</span></h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex flex-col gap-1 w-8">
                 {[1,2,3,4].map(i => <div key={i} className="w-full h-0.5 bg-primary/50" />)}
               </div>
               <p className="text-zinc-400 font-mono text-sm max-w-xs uppercase tracking-widest leading-relaxed">A transparent look at our computing pipeline. Designed for absolute zero-bottleneck video rendering.</p>
            </div>
          </motion.div>

          <div className="relative">
             {/* Glowing connector line */}
             <div className="absolute left-[24px] md:left-[50%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-white/5 to-transparent md:-translate-x-1/2">
                <motion.div 
                   animate={{ y: ["-100%", "500%"] }} 
                   transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 w-full h-[150px] bg-gradient-to-b from-transparent via-primary to-transparent blur-[3px]" 
                />
             </div>

             <div className="flex flex-col gap-16 relative z-10">
               {[
                 { step: "01", icon: <Video className="w-5 h-5 text-zinc-900" />, title: "Media Ingestion Engine", desc: "Raw 4K video is chunked and temporarily buffered into fast NVMe clusters. Audio channels are isolated and normalized automatically via FFmpeg." },
                 { step: "02", icon: <Share2 className="w-5 h-5 text-zinc-900" />, title: "WhisperX Transcription", desc: "State-of-the-art ASR models process semantic audio with word-level timestamps and perform 99.9% accurate multi-speaker diarization." },
                 { step: "03", icon: <Zap className="w-5 h-5 text-zinc-900" />, title: "LLaMA Context Analysis", desc: "Custom-trained LLMs analyze the transcript topology to locate high-retention 'viral hooks', skipping dead air and irrelevant tangents." },
                 { step: "04", icon: <Scissors className="w-5 h-5 text-zinc-900" />, title: "Computer Vision Tracking", desc: "OpenCV tracks facial mapping and body semantics across all frames to auto-crop ultra-smooth vertical 9:16 portrait shots without losing subjects." },
               ].map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.5 }}
                   transition={{ type: "spring", bounce: 0.4 }}
                   className={`flex flex-col md:flex-row items-center gap-6 md:gap-16 w-full group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                 >
                   {/* Card */}
                   <div className={`flex-1 w-full bg-zinc-950 border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-xl relative overflow-hidden transition-all duration-500 hover:border-primary/40 ${i % 2 === 0 ? 'md:text-right text-left' : 'text-left'}`}>
                     <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors duration-500" />
                     <motion.div className="flex items-center gap-4 mb-4" style={{ flexDirection: i % 2 === 0 ? 'row-reverse' : 'row' }}>
                       <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                         {item.icon}
                       </div>
                       <h4 className="text-2xl font-black text-white tracking-tight">{item.title}</h4>
                     </motion.div>
                     <p className="text-zinc-500 font-medium leading-relaxed text-lg">{item.desc}</p>
                   </div>
                   
                   {/* Middle Node Timeline Dot */}
                   <div className="hidden md:flex flex-col items-center justify-center">
                     <div className="w-12 h-12 rounded-full bg-black border-[4px] border-[#18181b] flex items-center justify-center text-primary font-black z-10 font-mono group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,0,0,1)] relative">
                       <span className="absolute inset-0 bg-primary/20 rounded-full blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                       {item.step}
                     </div>
                   </div>
                   
                   <div className="flex-1 w-full hidden md:block" />
                 </motion.div>
               ))}
             </div>
          </div>
        </section>

        {/* Feature Bento Box with Deep 3D Triggers */}
        <section className="container max-w-6xl mx-auto px-4 z-10 relative perspective-[2000px] mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-[0.9]">Don't just clip. <br/><span className="font-script text-[1.2em] font-medium text-primary tracking-normal normal-case inline-block -rotate-6 transform hover:rotate-0 transition-transform duration-500 text-shadow-glow">Create.</span></h2>
            <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium">Everything you need to turn a 2 hour podcast into a month of highly engaging content. Handled by machines, mastered by you.</p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[340px] transform-style-3d mb-16">
            
            {/* Feature 1: Smart Framing (Wide) */}
            <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-2 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden group hover:border-primary/40 transition-colors shadow-2xl min-h-[340px]">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute right-0 top-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 sm:w-1/2 flex flex-col h-full justify-between">
                <div>
                  <motion.div whileHover={{ scale: 1.1, rotate: 15 }} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shadow-lg">
                    <Video className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-4xl font-black mb-4 text-white tracking-tight leading-tight">Smart AI Framing</h3>
                  <p className="text-zinc-400 text-base leading-relaxed font-medium">Our vision models track faces and dynamically crop 16:9 landscape video to perfect 9:16 vertical shorts—never losing the subject.</p>
                </div>
              </div>
              <div className="hidden sm:block relative z-10 w-full sm:w-1/2 h-full pl-10 border-l border-white/10">
                 {/* Decorative Visual element inside the wide card */}
                 <div className="w-full h-full bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden relative shadow-inner flex items-center justify-center p-6 text-[10px] sm:text-xs">
                    <div className="w-3/4 h-3/4 border-2 border-dashed border-white/20 rounded-lg relative overflow-hidden">
                       <motion.div animate={{ x: ["-100%", "300%", "-100%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 bottom-0 w-1/3 border-x border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)] backdrop-blur-sm" />
                       <motion.div animate={{ x: [-10, 10, -10], y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-primary/50 rounded flex items-center justify-center">
                          <div className="w-1 h-1 bg-primary rounded-full absolute top-1 left-1" />
                          <div className="w-1 h-1 bg-primary rounded-full absolute bottom-1 right-1" />
                       </motion.div>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Feature 2: Pro Captions (Square) */}
            <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-1 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors shadow-2xl min-h-[340px]">
              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <motion.div whileHover={{ scale: 1.1, rotate: 180 }} transition={{ duration: 0.5 }} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/50 transition-all shadow-lg">
                  <Wand2 className="w-5 h-5 text-primary" />
                </motion.div>
                <div className="mt-auto">
                   <h3 className="text-3xl font-black mb-3 text-white tracking-tight leading-tight">Pro Captions</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed font-medium">Generate 99.9% accurate word-by-word animated subtitles instantly, styled to explicitly maximize viewer retention and engagement.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Master Rendering (Super Wide) */}
            <motion.div variants={cardHover} initial="rest" whileHover="hover" className="md:col-span-3 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-10 flex flex-col sm:flex-row-reverse items-start sm:items-center justify-between relative overflow-hidden group hover:border-primary/40 transition-colors shadow-2xl min-h-[340px]">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10 sm:w-1/2 flex flex-col h-full justify-between pl-0 sm:pl-10">
                <div>
                  <motion.div whileHover={{ scale: 1.1, rotate: 45 }} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shadow-lg">
                    <Share2 className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>
                <div className="mt-auto max-w-lg">
                  <h3 className="text-4xl font-black mb-4 text-white tracking-tight leading-tight">Master Rendering Engine</h3>
                  <p className="text-zinc-400 text-base leading-relaxed font-medium">Render native 1080p and 4K assets customized specifically for differing algorithmic constraints across TikTok, YouTube, and Instagram simultaneously.</p>
                </div>
              </div>
              <div className="hidden sm:flex relative z-10 w-full sm:w-1/2 h-full pr-10 border-r border-white/10 items-center justify-center">
                 {/* Decorative Platform blocks inside the wide card */}
                 <div className="w-full flex justify-center gap-6 py-6 pr-10">
                    {[
                      { name: "TikTok", ratio: "9:16", h: "h-36", w: "w-20" }, 
                      { name: "YouTube", ratio: "16:9", h: "h-20", w: "w-36" }, 
                      { name: "Instagram", ratio: "4:5", h: "h-28", w: "w-24" }
                    ].map((item, idx) => (
                      <motion.div key={idx} whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }} className={`bg-[#0a0a0a] border border-white/5 rounded-xl flex flex-col items-center justify-center text-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-default transition-all duration-300 relative group/card ${item.h} ${item.w}`}>
                         <span className="text-zinc-500 font-black text-xs uppercase tracking-widest group-hover/card:text-white transition-colors">{item.ratio}</span>
                         <div className="absolute -bottom-6 opacity-0 group-hover/card:opacity-100 transition-opacity text-[10px] text-primary font-mono">{item.name}</div>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* Creator Testimonials Grid */}
        <section className="container max-w-6xl mx-auto px-4 relative z-10 mb-40 mt-32">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.2 }}
             className="text-center mb-16"
           >
             <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">Trusted by <span className="text-primary text-shadow-glow">Elites</span></h2>
             <p className="text-zinc-500 font-medium max-w-xl mx-auto">Top podcasters and growth hackers are using our pipeline to automate their entire distribution.</p>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Alex Hormozi", tag: "@AlexHormozi", quote: "This pipeline literally replaced a full-time editor for us. The automated hook extraction is terrifyingly good.", views: "+2.4M Views/Mo" },
                { name: "Chris Williamson", tag: "@ChrisWillx", quote: "I drop my 3-hour episodes in here and wake up to 30 completely finished, viral-ready shorts. It feels like cheating.", views: "+5.1M Views/Mo" },
                { name: "My First Million", tag: "@MFMPod", quote: "We've tested every AI clipper on the market. This is the only one that actually understands the nuance of business comedy.", views: "+1.8M Views/Mo" }
              ].map((t, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.2 }}
                   transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                   whileHover={{ y: -5, borderColor: "rgba(var(--primary), 0.4)" }}
                   className="bg-[#0a0a0a] backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-default"
                 >
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                       <Video className="w-24 h-24 text-primary" />
                    </div>
                    
                    <div className="mb-10 relative z-10">
                       <div className="flex gap-1 mb-4">
                          {[1,2,3,4,5].map(star => <Sparkles key={star} className="w-4 h-4 text-primary" />)}
                       </div>
                       <p className="text-zinc-300 text-lg leading-relaxed font-medium">"{t.quote}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/10 pt-6 relative z-10">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                             <div className="w-full h-full bg-gradient-to-tr from-primary/40 to-black/80" />
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-sm tracking-wide">{t.name}</h4>
                             <p className="text-zinc-500 text-[10px] font-mono">{t.tag}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-primary font-black text-xs uppercase tracking-widest text-shadow-glow">{t.views}</div>
                          <div className="text-zinc-600 text-[9px] uppercase tracking-wider font-bold">Generated</div>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>
        </section>

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
