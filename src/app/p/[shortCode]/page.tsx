"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CHAINS, TOKENS, WALLETS, WalletType, generateWalletDeeplink, getSupportedChainsForWallet, Product } from "@/lib/mockData";
import { getProductByShortCode } from "@/lib/api";
import Link from "next/link";

type ChainKey = keyof typeof CHAINS;
type TokenKey = "USDT" | "USDC";

export default function PaymentPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainKey | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenKey | null>(null);
  const [paymentStep, setPaymentStep] = useState<"wallet" | "chain" | "processing" | "success">("wallet");
  const [mounted, setMounted] = useState(false);

  // 상품 정보 로드
  useEffect(() => {
    setMounted(true);

    async function loadProduct() {
      const result = await getProductByShortCode(shortCode);
      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        setError(result.error?.message || "상품을 찾을 수 없습니다.");
      }
      setLoading(false);
    }

    loadProduct();
  }, [shortCode]);

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

  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setPaymentStep("wallet");
    setSelectedWallet(null);
    setSelectedChain(null);
    setSelectedToken(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleWalletSelect = (wallet: WalletType) => {
    const walletInfo = WALLETS[wallet];
    if (!walletInfo.enabled) return;

    setSelectedWallet(wallet);

    // Phantom은 Solana만 지원하므로 자동 선택
    if (wallet === "phantom") {
      setSelectedChain("solana");
    } else {
      setSelectedChain(null);
    }
    setSelectedToken(null);
    setPaymentStep("chain");
  };

  const handleBackToWallet = () => {
    setPaymentStep("wallet");
    setSelectedWallet(null);
    setSelectedChain(null);
    setSelectedToken(null);
  };

  const handlePayment = () => {
    if (!selectedWallet || !selectedChain || !selectedToken) return;

    setPaymentStep("processing");

    // 체인 타입에 따라 올바른 주소 선택
    const chainInfo = CHAINS[selectedChain as ChainKey];
    const recipientAddress = chainInfo.type === "svm"
      ? product.merchant_address_solana
      : product.merchant_address;

    try {
      const deeplink = generateWalletDeeplink(
        selectedWallet,
        selectedChain,
        selectedToken,
        recipientAddress,
        product.price,
        `order:${product.short_code}`
      );

      console.log("Wallet Deeplink:", deeplink);

      // 딥링크를 a 태그로 열기 (브라우저 보안 정책 우회)
      const link = document.createElement('a');
      link.href = deeplink;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mock success simulation
      setTimeout(() => {
        setPaymentStep("success");
      }, 3000);
    } catch (err) {
      console.error("Deeplink generation error:", err);
      setPaymentStep("wallet");
    }
  };

  // 선택된 지갑에서 지원하는 체인 목록
  const availableChains = selectedWallet
    ? getSupportedChainsForWallet(selectedWallet)
    : [];

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
          <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-900/20 group mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none" />

            {/* Scrollable Container */}
            <div
              id="slider-container"
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = e.currentTarget.offsetWidth;
                const newIndex = Math.round(scrollLeft / width);
                setCurrentSlide(newIndex);
              }}
            >
              {product.thumbnail_urls.map((url, idx) => (
                <div key={idx} className="min-w-full w-full h-full snap-center relative">
                  <img
                    src={url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {product.thumbnail_urls.length > 1 && (
              <>
                <button
                  onClick={() => {
                    const container = document.getElementById('slider-container');
                    if (container) {
                      const width = container.offsetWidth;
                      const currentScroll = container.scrollLeft;
                      container.scrollTo({
                        left: currentScroll - width,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition active:scale-95 border border-white/10"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    const container = document.getElementById('slider-container');
                    if (container) {
                      const width = container.offsetWidth;
                      const currentScroll = container.scrollLeft;
                      container.scrollTo({
                        left: currentScroll + width,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition active:scale-95 border border-white/10"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            {/* Overlay Grid / Indicators */}
            <div className="absolute top-0 bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end pointer-events-none">
              <div className="flex gap-1.5 mb-2">
                {product.thumbnail_urls.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 backdrop-blur-sm ${i === currentSlide ? "bg-white" : "bg-white/20"
                      }`}
                  />
                ))}
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-1 drop-shadow-md">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Limited
                </span>
                <span className="text-gray-300 text-sm drop-shadow-sm">Ends in 2 days</span>
              </div>
            </div>
          </div>

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
              onClick={openPaymentModal}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold shadow-lg shadow-purple-500/30 active:scale-95 transition-all hover:brightness-110"
            >
              Support Now
            </button>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
            onClick={closePaymentModal}
          />

          <div className="relative w-full max-w-md bg-[#161618] border-t sm:border border-white/10 sm:rounded-[2rem] rounded-t-[2rem] max-h-[90vh] overflow-hidden animate-slide-up shadow-2xl">

            {/* Decorative top bar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full sm:hidden" />

            {/* Step 1: Wallet Selection */}
            {paymentStep === "wallet" && (
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8 mt-2">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Select Wallet</h2>
                  <button onClick={closePaymentModal} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
                </div>

                {/* Wallet Selection */}
                <div className="space-y-3">
                  {Object.values(WALLETS).map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleWalletSelect(wallet.id)}
                      disabled={!wallet.enabled}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        !wallet.enabled
                          ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 active:scale-[0.98]"
                      }`}
                    >
                      <span className="text-3xl">{wallet.icon}</span>
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-bold text-white">{wallet.name}</span>
                        <span className="text-xs text-gray-500">
                          {wallet.id === "phantom" ? "Solana" : wallet.id === "setto" ? "Coming Soon" : "EVM Chains"}
                        </span>
                      </div>
                      {!wallet.enabled && (
                        <span className="px-2 py-1 rounded-full bg-gray-800 text-[10px] text-gray-400 uppercase">Soon</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Chain & Token Selection */}
            {paymentStep === "chain" && (
              <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6 mt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToWallet}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
                    >
                      ←
                    </button>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      {selectedWallet ? WALLETS[selectedWallet as WalletType].name : ""}
                    </h2>
                  </div>
                  <button onClick={closePaymentModal} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
                </div>

                {/* Chain Selection */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">Select Network</label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableChains.map((chainId) => {
                      const chain = CHAINS[chainId];
                      return (
                        <button
                          key={chain.id}
                          onClick={() => setSelectedChain(chain.id as ChainKey)}
                          className={`group relative p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${selectedChain === chain.id
                            ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"
                            : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                            }`}
                        >
                          <span className="text-2xl relative z-10 filter drop-shadow-lg group-hover:scale-110 transition">{chain.icon}</span>
                          <span className={`text-[10px] font-medium tracking-wide uppercase ${selectedChain === chain.id ? "text-purple-300" : "text-gray-400"}`}>{chain.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Token Selection */}
                <div className="mb-8">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">Select Token</label>
                  <div className="grid grid-cols-2 gap-3">
                    {TOKENS.map((token) => (
                      <button
                        key={token.id}
                        onClick={() => setSelectedToken(token.id as TokenKey)}
                        className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${selectedToken === token.id
                          ? "border-purple-500 bg-purple-500/10 shadow-lg"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-inner"
                          style={{ backgroundColor: token.color, color: 'white' }}
                        >
                          {token.id === "USDT" ? "T" : "C"}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-white">{token.name}</span>
                          <span className="text-xs text-gray-500">Stablecoin</span>
                        </div>
                        {selectedToken === token.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-purple-500 glow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={handlePayment}
                  disabled={!selectedChain || !selectedToken}
                  className={`nav-button-glow w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all transform ${selectedChain && selectedToken
                    ? "bg-white text-black hover:scale-[1.02]"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {selectedChain && selectedToken ? `Pay $${product.price}` : "Select Chain & Token"}
                </button>
              </div>
            )}

            {/* Processing State */}
            {paymentStep === "processing" && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Connecting Wallet</h3>
                <p className="text-gray-400">Please confirm the transaction in your wallet app.</p>
              </div>
            )}

            {/* Success State */}
            {paymentStep === "success" && (
              <div className="p-8 flex flex-col items-center text-center h-full justify-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-scale-in">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Donation Sent!</h3>
                <p className="text-gray-400 mb-8">Thank you for supporting the creator.</p>

                <div className="w-full bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
                  <div className="flex justify-between py-2 border-b border-white/10">
                    <span className="text-gray-500 text-sm">Amount</span>
                    <span className="font-mono">${product.price}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-sm">Tx Hash</span>
                    <span className="text-purple-400 text-sm font-mono truncate max-w-[150px]">0x71a...9b2c</span>
                  </div>
                </div>

                <button
                  onClick={closePaymentModal}
                  className="w-full py-4 bg-[#222] rounded-2xl font-bold hover:bg-[#333] transition border border-white/10"
                >
                  Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

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
