import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#050505] selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2">
            Setto.
          </h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-xs">Crypto Payment Prototype</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Influencer Sponsorship (Generic) */}
          <Link
            href="/p/INFLU1"
            className="group relative px-6 py-5 rounded-xl bg-[#161618] border border-white/5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold tracking-wider uppercase border border-purple-500/20">
                  New
                </span>
                <span className="text-lg font-mono text-white">$0.01</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">Creator Support</h2>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">Support specific creators directly.</p>
            </div>
          </Link>

          {/* 2. Godsehee Maxim Support */}
          <Link
            href="/p/A3X9K2"
            className="group relative px-6 py-5 rounded-xl bg-[#161618] border border-white/5 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px] font-bold tracking-wider uppercase border border-pink-500/20">
                  Hot
                </span>
                <span className="text-lg font-mono text-white">$0.01</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-pink-200 transition-colors">Godsehee Maxim</h2>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">Exclusive sponsorship for cover model.</p>
            </div>
          </Link>

          {/* 3. Delicious Taco Set */}
          <Link
            href="/p/B4Y0L3"
            className="group relative px-6 py-5 rounded-xl bg-[#161618] border border-white/5 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[9px] font-bold tracking-wider uppercase border border-orange-500/20">
                  Food
                </span>
                <span className="text-lg font-mono text-white">$0.01</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-orange-200 transition-colors">Delicious Taco Set</h2>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">Authentic Mexican flavor delivery.</p>
            </div>
          </Link>

          {/* 4. Waifu Collectors Pack */}
          <Link
            href="/p/C5Z1M4"
            className="group relative px-6 py-5 rounded-xl bg-[#161618] border border-white/5 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-0.5 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold tracking-wider uppercase border border-cyan-500/20">
                  Game
                </span>
                <span className="text-lg font-mono text-white">$0.01</span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">Waifu Collectors</h2>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">SSR Anime Girl Cards Collection.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>

  );
}
