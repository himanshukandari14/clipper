import Link from "next/link";
import { ArrowRight, LayoutDashboard, Menu, Play, Scissors, Sparkles, Youtube } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-green-400 to-primary rounded-md group-hover:scale-105 transition-transform overflow-hidden relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <Scissors className="w-4 h-4 text-black relative z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">PodClip</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-muted-foreground">
            {['Features', 'Showcase', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={item === 'Features' ? '/features' : item === 'Showcase' ? '/showcase' : '/pricing'}
                className="hover:text-primary transition-colors"
                style={{
                  color: item === 'Features' || item === 'Showcase' ? 'white' : undefined
                }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all text-sm font-medium group text-zinc-300 hover:text-white">
              <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
              <span>Dashboard</span>
            </Link>

            <button className="lg:hidden p-2 text-zinc-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-32 pb-16 relative w-full overflow-hidden justify-center min-h-[90vh]">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 flex flex-col items-center text-center z-10">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-fade-in-up hover:bg-white/10 transition-colors cursor-pointer border-t border-t-white/10 shadow-lg shadow-primary/5">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            <span className="text-zinc-300">New: Auto-Captioning v2.0 is live</span>
            <span className="hover:underline flex items-center gap-1 font-semibold ml-2">
              Try it now <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl mb-8 leading-[1.1] animate-fade-in-up delay-100">
            Turn Podcasts into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-200 to-primary animate-shine bg-[length:200%_auto]">Viral Shorts</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 animate-fade-in-up delay-200 leading-relaxed">
            AI-powered clipper that instantly finds, crops, and captions the best moments from your long-form content. Ready for TikTok, Reels, and Shorts.
          </p>

          {/* <div className="w-full max-w-md relative group animate-fade-in-up delay-300 mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center bg-black border border-white/10 rounded-lg p-2 shadow-2xl">
              <div className="pl-3 pr-2 text-zinc-500">
                <Youtube className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube URL to start..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 py-2"
              />
              <button className="bg-primary text-black font-semibold px-4 py-2 rounded-md hover:bg-primary/90 transition-all flex items-center gap-2">
                <span>Clip It</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div> */}

          {/* Visual Element: The Transformation Engine */}
          <div className="relative w-full max-w-4xl h-64 md:h-96 animate-fade-in-up delay-300 mt-8 perspective-1000">

            {/* Central "Processing" Stage */}
            <div className="absolute inset-0 flex items-center justify-center">

              {/* Background Waveform (Input) */}
              <div className="absolute w-[120%] h-32 opacity-20 flex items-center gap-1 left-1/2 -translate-x-1/2 overflow-hidden mask-linear-fade">
                {[...Array(60)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-primary rounded-full animate-wave"
                    style={{
                      height: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.05}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>

              {/* Floating Cards (Output) */}
              <div className="relative z-10 flex gap-6 md:gap-12 transform-style-3d">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-32 h-56 md:w-48 md:h-80 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:-translate-y-4 transition-transform duration-500 ease-out"
                    style={{
                      transform: `rotate(${i === 0 ? '-12deg' : i === 1 ? '0deg' : '12deg'}) translateY(${i === 1 ? '-20px' : '0px'})`,
                      zIndex: i === 1 ? 20 : 10
                    }}
                  >
                    {/* Card Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Mock Content */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <div className="flex gap-1">
                        <div className="w-full h-1 bg-white/20 rounded-full" />
                        <div className="w-1/3 h-1 bg-white/20 rounded-full" />
                      </div>

                      {/* Fake Captions */}
                      <div className="space-y-2 mb-8">
                        <div className="bg-primary/90 text-black text-[10px] md:text-xs font-bold px-2 py-1 rounded w-fit mx-auto shadow-lg shadow-primary/20">
                          VIRAL MOMENT
                        </div>
                        <div className="text-center">
                          <span className="bg-black/50 text-white font-bold text-lg md:text-2xl px-1">"Absolutely</span>
                          <br />
                          <span className="bg-black/50 text-primary font-bold text-lg md:text-2xl px-1">Insane!"</span>
                        </div>
                      </div>

                      {/* UI Elements */}
                      <div className="flex justify-between items-end">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="space-y-1">
                          <div className="w-4 h-4 rounded-full bg-red-500/80 ml-auto" />
                          <div className="w-4 h-4 rounded-full bg-white/20 ml-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer / Platforms */}
      <footer className="border-t border-white/5 py-12 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Optimized for</div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 group cursor-default">
              <span className="font-bold text-xl text-zinc-300 font-sans tracking-tight">TikTok</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="font-bold text-xl text-zinc-300 font-sans tracking-tight">Instagram Reels</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="font-bold text-xl text-zinc-300 font-sans tracking-tight">YouTube Shorts</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <span className="font-bold text-xl text-zinc-300 font-sans tracking-tight">LinkedIn Video</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
