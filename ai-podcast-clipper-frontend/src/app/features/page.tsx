import Link from "next/link";
import { LayoutDashboard, Menu, Scissors, Sparkles, Zap, Type, Palette, MonitorPlay, Wand2, Share2, BarChart3, Layers } from "lucide-react";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-float opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-float delay-1000 opacity-40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Navbar */}
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
                                className={`hover:text-primary transition-all hover:glow-text ${item === 'Features' ? 'text-white' : ''}`}
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

                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary mb-8 shadow-lg shadow-primary/5 backdrop-blur-md">
                            <Sparkles className="w-4 h-4" />
                            <span>Next-Gen AI Editor</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                            Craft Viral Content <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600">at Light Speed.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Unleash the power of our multi-modal AI engine that understands context, emotion, and viral hooks better than a human editor.
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">

                        {/* Large Feature 1 */}
                        <div className="md:col-span-6 lg:col-span-8 row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 hover:border-primary/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Context-Aware Auto Clipping</h3>
                                <p className="text-zinc-400 text-lg max-w-md">Our AI doesn't just look for silence. It analyzes sentiment, laughter, and speaker intensity to identify purely gold moments.</p>
                            </div>
                            {/* Visual Representation */}
                            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 opacity-50 group-hover:opacity-80 transition-opacity">
                                <div className="w-full h-full bg-gradient-to-t from-black to-transparent z-10 absolute bottom-0" />
                                {/* Abstract waveforms */}
                                <div className="flex items-end justify-center gap-1 h-full pb-8 pr-8">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-4 bg-primary rounded-t-sm animate-wave" style={{
                                            height: `${30 + Math.random() * 70}%`,
                                            animationDelay: `${i * 0.1}s`,
                                            opacity: 0.2 + (i / 20) * 0.8
                                        }} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Small Feature 1 */}
                        <div className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                                <Type className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Dynamic Captions</h3>
                            <p className="text-zinc-500 text-sm">Karaoke-style animations that keep retention high.</p>
                        </div>

                        {/* Small Feature 2 */}
                        <div className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                                <MonitorPlay className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Smart Face Cropping</h3>
                            <p className="text-zinc-500 text-sm">Automatically centers the speaker in 9:16 vertical format.</p>
                        </div>

                        {/* Tall Feature */}
                        <div className="md:col-span-3 lg:col-span-4 row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:border-pink-500/30 transition-all duration-500 flex flex-col justify-end">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-6 left-6 w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                                <Palette className="w-5 h-5" />
                            </div>
                            <div className="relative z-10 mt-20">
                                <h3 className="text-2xl font-bold text-white mb-3">Brand Kits</h3>
                                <p className="text-zinc-400">Upload your own fonts, logos, and intros/outros. Apply them to every clip with a single click.</p>
                            </div>
                        </div>

                        {/* Medium Feature 1 */}
                        <div className="md:col-span-3 lg:col-span-4 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:border-yellow-500/30 transition-all duration-500">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Virality Prediction</h3>
                            <p className="text-zinc-500 text-sm">Score your clips before you post based on millions of data points.</p>
                        </div>

                        {/* Medium Feature 2 */}
                        <div className="md:col-span-6 lg:col-span-4 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 hover:border-emerald-500/30 transition-all duration-500">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">One-Click Publish</h3>
                            <p className="text-zinc-500 text-sm">Direct integrations with TikTok, YT Shorts, and Instagram Reels.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
