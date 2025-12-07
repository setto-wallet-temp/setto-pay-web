import Link from "next/link";
import { mockProducts } from "@/lib/mockData";

export default function Home() {
  const products = Object.values(mockProducts);

  const getBadgeColor = (tag?: string) => {
    switch (tag) {
      case "HOT": return "bg-pink-600/90 border-pink-500/30";
      case "NEW": return "bg-blue-600/90 border-blue-500/30";
      case "RECOMMEND": return "bg-orange-500/90 border-orange-500/30";
      default: return "bg-gray-600/90 border-gray-500/30";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white selection:bg-purple-500/30 pb-20">

      {/* Header (Insta-like) */}
      <div className="sticky top-0 z-50 w-full max-w-md bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Setto.
        </h1>
      </div>

      <div className="w-full max-w-md px-1 mt-2">

        {/* Product Grid (Dynamic) */}
        <div className="grid grid-cols-2 gap-1">
          {products.map((product) => (
            <Link
              key={product.short_code}
              href={`/p/${product.short_code}`}
              className="relative aspect-[4/5] group overflow-hidden bg-gray-900 rounded-xl"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 filter grayscale-[20%] group-hover:grayscale-0"
                style={{ backgroundImage: `url("${product.thumbnail_urls[0]}")` }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:via-transparent transition-opacity duration-500" />

              {/* Top Left Badge */}
              {product.tag && (
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-sm backdrop-blur-sm text-white text-[10px] font-bold tracking-wide shadow-lg border ${getBadgeColor(product.tag)}`}>
                    {product.tag}
                  </span>
                </div>
              )}

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-bold text-white leading-tight mb-1 text-shadow-md drop-shadow-md">{product.name}</h3>
                <p className="text-[10px] text-gray-200 line-clamp-1 mb-1 font-medium text-shadow-sm">{product.description}</p>
                <span className="text-sm font-mono font-bold text-white text-shadow-sm">${product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
