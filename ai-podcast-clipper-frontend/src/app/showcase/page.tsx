import { redirect } from "next/navigation";

// Showcase page disabled - redirect to home
export default function ShowcasePage() {
  redirect("/");
}

/* Showcase tab - commented out
import Link from "next/link";
import { LayoutDashboard, Menu, Scissors, Play, Heart, Share, Loader2 } from "lucide-react";

export default function ShowcasePage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] animate-float opacity-30" />
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float delay-700 opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-400 to-primary rounded-md group-hover:scale-105 transition-transform overflow-hidden relative shadow-[0_0_15px_-3px_var(--primary)]">
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            <Scissors className="w-4 h-4 text-black relative z-10" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">PodClip</span>
                    </Link>

                    <nav className="hidden lg:flex gap-8 text-sm font-medium text-muted-foreground">
                        {['Features', 'Showcase', 'Pricing'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Features' ? '/features' : item === 'Showcase' ? '/showcase' : '/pricing'}
                                className={`hover:text-primary transition-all hover:glow-text ${item === 'Showcase' ? 'text-white' : ''}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-sm font-medium group text-zinc-300 hover:text-white backdrop-blur-md bg-black/20">
                            <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                            <span>Dashboard</span>
                        </Link>
                        <button className="lg:hidden p-2 text-zinc-400 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-32 pb-24 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            The <span className="text-primary">Wall of Viral</span>
                        </h1>
                        <p className="text-xl text-zinc-400">
                            See what creators are generating with PodClip. <br /> Over <span className="text-white font-bold">10M+ views</span> generated last month.
                        </p>
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="break-inside-avoid relative group rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                                <div className="aspect-[9/16] bg-zinc-900 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                                    </div>
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                        <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-white font-medium border border-white/10">
                                            @creator_{i}
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-lg ${i % 2 === 0 ? 'bg-primary text-black' : 'bg-red-500 text-white'}`}>
                                            {i % 2 === 0 ? 'VIRAL • 98%' : 'TRENDING'}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-20 left-0 right-0 text-center px-6">
                                        <span className="bg-primary text-black text-lg font-black uppercase italic px-1 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] transform -rotate-2 inline-block">
                                            Wait for it!
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-2 flex flex-col gap-3 items-center z-10">
                                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-colors">
                                            <Heart className="w-5 h-5 fill-white/50" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-colors">
                                            <Share className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-all duration-300">
                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium backdrop-blur-md">
                            Load More Examples
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
*/
