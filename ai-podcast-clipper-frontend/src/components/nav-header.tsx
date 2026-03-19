"use client";

import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

export const NavHeader = ({ credits, email }: { credits: number; email: string }) => {
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

        <div className="flex items-center gap-4 pr-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="h-8 px-4 py-1.5 text-xs font-bold rounded-full border border-white/10 bg-white/5 text-zinc-300"
            >
              {credits} Credits
            </Badge>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs font-bold rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <Link href="/dashboard/billing">Buy more</Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0 border border-white/10 hover:border-white/20 transition-all opacity-80 hover:opacity-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-black font-bold uppercase">{email.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl text-white">
              <DropdownMenuLabel>
                <p className="text-muted-foreground text-xs">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirectTo: "/login" })}
                className="text-destructive cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};

export default NavHeader;
