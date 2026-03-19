"use client";

import Link from "next/link";
import { ArrowRight, Scissors } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  
  useEffect(() => {
    fetch("/api/auth/session")
      .then(res => res.json())
      .then((session: { user?: unknown } | null) => {
        if (session && typeof session === "object" && "user" in session && session.user) {
          setIsLoggedIn(true);
        }
        setAuthChecking(false);
      })
      .catch(() => setAuthChecking(false));
  }, []);

  return (
    <motion.header 
        initial={{ y: -100, opacity: 0, rotateX: 90 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none origin-top"
    >
        <div className="pointer-events-auto flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <Link href="/" className="flex items-center gap-3 pl-3 group">
                <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-xl rotate-3 group-hover:-rotate-12 transition-transform duration-500 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                    <Scissors className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">PodClip<span className="text-white/50">.ai</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
                {['Features'].map((item) => {
                  const href = `/${item.toLowerCase()}`;
                  const isActive = pathname === href;
                  return (
                    <motion.div key={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href={href} className={`text-sm font-semibold hover:text-white hover:bg-white/5 px-5 py-2 rounded-full transition-all ${isActive ? 'text-primary' : 'text-zinc-300'}`}>
                        {item}
                      </Link>
                    </motion.div>
                  )
                })}
            </nav>

            <div className="flex items-center gap-4 pr-1">
                {!authChecking && !isLoggedIn && (
                  <Link href="/login" className="hidden md:block text-sm font-semibold text-zinc-400 hover:text-white transition-colors pl-2">
                    Log in
                  </Link>
                )}
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(var(--primary), 0.5)", backgroundColor: "#ffffff" }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-black transition-all text-sm font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-opacity duration-300 ${authChecking ? "opacity-0" : "opacity-100"}`}
                  >
                    {isLoggedIn ? "Dashboard" : "Get Started"} <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2 }}><ArrowRight className="w-4 h-4" /></motion.div>
                  </motion.button>
                </Link>
            </div>
        </div>
    </motion.header>
  );
}
