"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Chain,
  WALLETS,
  WalletType,
  TOKEN_META,
  generateWalletDeeplink,
  getSupportedChainsForWallet,
  getTokensByChain,
} from "@/lib/mockData";

type TokenKey = "USDT" | "USDC";
type PaymentStep = "wallet" | "chain" | "processing" | "success";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productPrice: string;
  productShortCode: string;
  poolAddresses: Record<string, string>;
}

export default function PaymentModal({
  isOpen,
  onClose,
  productPrice,
  productShortCode,
  poolAddresses,
}: PaymentModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenKey | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("wallet");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setPaymentStep("wallet");
    setSelectedWallet(null);
    setSelectedChain(null);
    setSelectedToken(null);
    onClose();
  };

  const handleWalletSelect = (wallet: WalletType) => {
    const walletInfo = WALLETS[wallet];
    if (!walletInfo.enabled) return;

    setSelectedWallet(wallet);

    if (wallet === "phantom") {
      // Phantom은 Solana만 지원
      const solanaChain = getSupportedChainsForWallet(wallet).find(c => c.chain_id === "solana");
      setSelectedChain(solanaChain || null);
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

    const recipientAddress = poolAddresses[selectedChain.chain_id];

    try {
      const deeplink = generateWalletDeeplink(
        selectedWallet,
        selectedChain.chain_id,
        selectedToken,
        recipientAddress,
        productPrice,
        `order:${productShortCode}`
      );

      console.log("Wallet Deeplink:", deeplink);

      const link = document.createElement("a");
      link.href = deeplink;
      link.rel = "noopener noreferrer";
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

  const availableChains = selectedWallet
    ? getSupportedChainsForWallet(selectedWallet)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-md bg-[#161618] border-t sm:border border-white/10 sm:rounded-[2rem] rounded-t-[2rem] max-h-[90vh] overflow-hidden animate-slide-up shadow-2xl">
        {/* Decorative top bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-700 rounded-full sm:hidden" />

        {/* Step 1: Wallet Selection */}
        {paymentStep === "wallet" && (
          <WalletSelectionStep
            onSelect={handleWalletSelect}
            onClose={resetAndClose}
          />
        )}

        {/* Step 2: Chain & Token Selection */}
        {paymentStep === "chain" && (
          <ChainTokenSelectionStep
            selectedWallet={selectedWallet}
            selectedChain={selectedChain}
            selectedToken={selectedToken}
            availableChains={availableChains}
            productPrice={productPrice}
            onSelectChain={(chain) => setSelectedChain(chain)}
            onSelectToken={(token) => setSelectedToken(token)}
            onBack={handleBackToWallet}
            onClose={resetAndClose}
            onPay={handlePayment}
          />
        )}

        {/* Processing State */}
        {paymentStep === "processing" && <ProcessingStep />}

        {/* Success State */}
        {paymentStep === "success" && (
          <SuccessStep productPrice={productPrice} onClose={resetAndClose} />
        )}
      </div>
    </div>
  );
}

// ==================== Sub Components ====================

function WalletSelectionStep({
  onSelect,
  onClose,
}: {
  onSelect: (wallet: WalletType) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8 mt-2">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Select Wallet
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {Object.values(WALLETS).map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => onSelect(wallet.id)}
            disabled={!wallet.enabled}
            className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 relative overflow-hidden ${
              wallet.id === "setto"
                ? "border-purple-500/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20 hover:from-purple-900/30 hover:to-blue-900/30"
                : !wallet.enabled
                ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 active:scale-[0.98]"
            }`}
          >
            {wallet.id === "setto" && (
              <div className="absolute top-1 right-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-bold text-white rounded-lg uppercase tracking-wider shadow-lg">
                Recommended
              </div>
            )}
            <img
              src={wallet.icon_url}
              alt={wallet.name}
              className="w-10 h-10 rounded-xl object-contain"
            />
            <div className="flex flex-col items-start flex-1">
              <span className="font-bold text-white">{wallet.name}</span>
              <span className="text-xs text-gray-500">
                {wallet.id === "phantom"
                  ? "Solana"
                  : wallet.id === "setto"
                  ? "All Chains"
                  : "EVM Chains"}
              </span>
              {wallet.id === "setto" && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-[10px] text-green-400 font-medium">
                    Zero Gas Fee
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-400 font-medium">
                    Mileage
                  </span>
                </div>
              )}
            </div>
            {!wallet.enabled && (
              <span className="px-2 py-1 rounded-full bg-gray-800 text-[10px] text-gray-400 uppercase">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChainTokenSelectionStep({
  selectedWallet,
  selectedChain,
  selectedToken,
  availableChains,
  productPrice,
  onSelectChain,
  onSelectToken,
  onBack,
  onClose,
  onPay,
}: {
  selectedWallet: WalletType | null;
  selectedChain: Chain | null;
  selectedToken: TokenKey | null;
  availableChains: Chain[];
  productPrice: string;
  onSelectChain: (chain: Chain) => void;
  onSelectToken: (token: TokenKey) => void;
  onBack: () => void;
  onClose: () => void;
  onPay: () => void;
}) {
  // 선택된 체인의 토큰 목록
  const availableTokens = selectedChain ? getTokensByChain(selectedChain.chain_id) : [];

  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {selectedWallet ? WALLETS[selectedWallet].name : ""}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* Chain Selection */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
          Select Network
        </label>
        <div className="grid grid-cols-3 gap-3">
          {availableChains.map((chain) => (
            <button
              key={chain.chain_id}
              onClick={() => onSelectChain(chain)}
              className={`group relative p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden ${
                selectedChain?.chain_id === chain.chain_id
                  ? "border-purple-500 bg-purple-500/10 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <Image
                src={chain.icon_url}
                alt={chain.display_name}
                width={28}
                height={28}
                className="relative z-10 filter drop-shadow-lg group-hover:scale-110 transition"
              />
              <span
                className={`text-[10px] font-medium tracking-wide uppercase ${
                  selectedChain?.chain_id === chain.chain_id ? "text-purple-300" : "text-gray-400"
                }`}
              >
                {chain.display_name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Token Selection */}
      <div className="mb-8">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 block">
          Select Token
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(["USDT", "USDC"] as TokenKey[]).map((tokenSymbol) => {
            const tokenMeta = TOKEN_META[tokenSymbol];
            const tokenExists = availableTokens.some(t => t.token_symbol === tokenSymbol);

            return (
              <button
                key={tokenSymbol}
                onClick={() => tokenExists && onSelectToken(tokenSymbol)}
                disabled={!tokenExists}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  selectedToken === tokenSymbol
                    ? "border-purple-500 bg-purple-500/10 shadow-lg"
                    : !tokenExists
                    ? "border-white/5 bg-white/5 opacity-50 cursor-not-allowed"
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <Image
                  src={tokenMeta.icon_url}
                  alt={tokenSymbol}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="font-bold text-white">{tokenSymbol}</span>
                  <span className="text-xs text-gray-500">Stablecoin</span>
                </div>
                {selectedToken === tokenSymbol && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-purple-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onPay}
        disabled={!selectedChain || !selectedToken}
        className={`w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all transform ${
          selectedChain && selectedToken
            ? "bg-white text-black hover:scale-[1.02]"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
        }`}
      >
        {selectedChain && selectedToken
          ? `Pay $${productPrice}`
          : "Select Chain & Token"}
      </button>
    </div>
  );
}

function ProcessingStep() {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Connecting Wallet</h3>
      <p className="text-gray-400">
        Please confirm the transaction in your wallet app.
      </p>
    </div>
  );
}

function SuccessStep({
  productPrice,
  onClose,
}: {
  productPrice: string;
  onClose: () => void;
}) {
  return (
    <div className="p-8 flex flex-col items-center text-center h-full justify-center">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-scale-in">
        ✓
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Payment Sent!</h3>
      <p className="text-gray-400 mb-8">Thank you for your purchase.</p>

      <div className="w-full bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-500 text-sm">Amount</span>
          <span className="font-mono">${productPrice}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-500 text-sm">Tx Hash</span>
          <span className="text-purple-400 text-sm font-mono truncate max-w-[150px]">
            0x71a...9b2c
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-[#222] rounded-2xl font-bold hover:bg-[#333] transition border border-white/10"
      >
        Close
      </button>
    </div>
  );
}
