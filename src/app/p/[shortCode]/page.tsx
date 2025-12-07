"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getProductByShortCode, ProductResponse } from "@/lib/api";
import { useProductStore } from "@/lib/store";
import PaymentModal from "@/components/PaymentModal";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;

  // Zustand store
  const { getProduct: getCachedProduct, setProduct: cacheProduct } = useProductStore();

  // States
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 상품 정보 로드 (캐시 우선, 없으면 fetch)
  useEffect(() => {
    setMounted(true);

    // 1. 캐시에서 먼저 확인
    const cached = getCachedProduct(shortCode);
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }

    // 2. 캐시에 없으면 서버에서 fetch
    async function loadProduct() {
      const result = await getProductByShortCode(shortCode);
      if (result.success && result.data) {
        setProduct(result.data);
        cacheProduct(shortCode, result.data); // 캐시에 저장
      } else {
        setError(result.error?.message || "상품을 찾을 수 없습니다.");
      }
      setLoading(false);
    }

    loadProduct();
  }, [shortCode, getCachedProduct, cacheProduct]);

  // Loading state
  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0c]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Product not found state
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#0a0a0c] text-white font-sans">
        <div className="text-6xl mb-6 animate-bounce">🤔</div>
        <h1 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Product Not Found
        </h1>
        <p className="text-gray-400">{error || "The link might be invalid or expired."}</p>
        <Link href="/" className="mt-8 px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">

      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">

        {/* Header / Nav */}
        <header className="p-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Setto.
          </Link>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400 backdrop-blur-md">
            Verified Creator
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 pb-32">

          {/* Top Image Carousel */}
          <ImageCarousel images={product.thumbnail_urls} productName={product.name}>
            <h1 className="text-3xl font-bold leading-tight mb-1 drop-shadow-md">{product.name}</h1>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                Limited
              </span>
              <span className="text-gray-300 text-sm drop-shadow-sm">Ends in 2 days</span>
            </div>
          </ImageCarousel>

          {/* Description */}
          <div className="space-y-6">
            <div className="p-6 rounded-[1.5rem] bg-[#121214] border border-white/5 shadow-inner">
              <h3 className="text-lg font-bold mb-3 text-white">About</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            {/* Detail Images */}
            {product.detail_urls.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white px-2">Details</h3>
                <div className="space-y-4">
                  {product.detail_urls.map((url, idx) => (
                    <div key={idx} className="rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#121214]">
                      <img
                        src={url}
                        alt={`Detail ${idx + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </main>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-6 left-6 right-6 max-w-[calc(28rem-3rem)] mx-auto z-40">
          <div className="p-2 pl-6 pr-2 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Total Amount</span>
              <span className="text-xl font-bold font-mono">${product.price}</span>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-all hover:brightness-110"
            >
              Support Now
            </button>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        productPrice={product.price}
        productShortCode={product.short_code}
        poolAddresses={product.pool_addresses}
      />

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }

        /* Hide Scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
