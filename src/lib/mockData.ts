// ==================== Types ====================

export interface Merchant {
  merchant_id: string;
  short_code: string;
  name: string;
  logo_url: string;
  description: string;
  fee_rate: string;
  status: "active" | "suspended";
}

export interface Product {
  product_id: string;
  short_code: string;
  merchant_id: string;
  name: string;
  price: string;
  description: string;
  thumbnail_urls: string[];
  detail_urls: string[];
  tag: "HOT" | "NEW" | "RECOMMEND" | "NONE";
  status: "active" | "inactive" | "deleted";
}

export interface ProductDetail extends Product {
  merchant_name: string;
  merchant_logo_url: string;
}

// ==================== Pool Addresses (Chains 테이블에서 관리) ====================

export const POOL_ADDRESSES: Record<string, string> = {
  bsc: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
  solana: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
  base: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
  avalanche: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
  arbitrum: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
  optimism: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
};

// 체인 정보
export const CHAINS = {
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    chainId: 56,
    type: "evm",
    iconUrl: "/chains/bsc.svg",
    tokens: {
      USDT: "0x55d398326f99059fF775485246999027B3197955",
      USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
    },
    decimals: 18
  },
  solana: {
    id: "solana",
    name: "Solana",
    chainId: 0,
    type: "svm",
    iconUrl: "/chains/solana.svg",
    tokens: {
      USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
      USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    decimals: 6
  },
  base: {
    id: "base",
    name: "Base",
    chainId: 8453,
    type: "evm",
    iconUrl: "/chains/base.png",
    tokens: {
      USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    },
    decimals: 6
  },
  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    chainId: 43114,
    type: "evm",
    iconUrl: "/chains/avalanche.svg",
    tokens: {
      USDT: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
    },
    decimals: 6
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    chainId: 42161,
    type: "evm",
    iconUrl: "/chains/arbitrum.svg",
    tokens: {
      USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
    },
    decimals: 6
  },
  optimism: {
    id: "optimism",
    name: "Optimism",
    chainId: 10,
    type: "evm",
    iconUrl: "/chains/optimism.svg",
    tokens: {
      USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"
    },
    decimals: 6
  }
} as const;

export const TOKENS = [
  { id: "USDT", name: "USDT", icon: "💵", color: "#26A17B" },
  { id: "USDC", name: "USDC", icon: "💲", color: "#2775CA" }
] as const;

// 지갑 정보
export type WalletType = "setto" | "metamask" | "trust" | "phantom";

export const WALLETS: Record<WalletType, {
  id: WalletType;
  name: string;
  iconUrl: string;
  supportedChainTypes: ("evm" | "svm")[];
  enabled: boolean;
}> = {
  setto: {
    id: "setto",
    name: "Setto Wallet",
    iconUrl: "/wallets/setto.svg",
    supportedChainTypes: ["evm", "svm"],
    enabled: false  // 준비중
  },
  metamask: {
    id: "metamask",
    name: "MetaMask",
    iconUrl: "/wallets/metamask.svg",
    supportedChainTypes: ["evm"],
    enabled: true
  },
  trust: {
    id: "trust",
    name: "Trust Wallet",
    iconUrl: "/wallets/trust.svg",
    supportedChainTypes: ["evm", "svm"],  // Solana도 지원
    enabled: true
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    iconUrl: "/wallets/phantom.svg",
    supportedChainTypes: ["svm"],
    enabled: true
  }
};

// Trust Wallet SLIP44 코드 매핑
const SLIP44_CODES: Record<string, number> = {
  bsc: 20000714,
  base: 8453,        // Base는 EIP-155 chain ID 사용
  avalanche: 9005,   // Avalanche C-Chain
  arbitrum: 60,      // Arbitrum은 Ethereum 계열
  optimism: 60,      // Optimism도 Ethereum 계열
};

// 지갑별 딥링크 생성 함수
export function generateWalletDeeplink(
  wallet: WalletType,
  chain: keyof typeof CHAINS,
  token: "USDT" | "USDC",
  recipient: string,
  amount: string,
  memo?: string
): string {
  const chainInfo = CHAINS[chain];
  const tokenAddress = chainInfo.tokens[token];
  const amountInSmallestUnit = BigInt(
    Math.floor(parseFloat(amount) * Math.pow(10, chainInfo.decimals))
  );

  switch (wallet) {
    case "metamask":
      // MetaMask Universal Link
      // https://metamask.app.link/send/{tokenAddress}@{chainId}/transfer?address={to}&uint256={amount}
      return `https://metamask.app.link/send/${tokenAddress}@${chainInfo.chainId}/transfer?address=${recipient}&uint256=${amountInSmallestUnit}`;

    case "trust":
      // Trust Wallet Deeplink
      // https://link.trustwallet.com/send?asset=c{SLIP44}_t{token}&address={to}&amount={amount}&memo={memo}
      // Solana SLIP44 = 501
      const slip44 = chainInfo.type === "svm" ? 501 : (SLIP44_CODES[chain] || chainInfo.chainId);
      let trustUrl = `https://link.trustwallet.com/send?asset=c${slip44}_t${tokenAddress}&address=${recipient}&amount=${amount}`;
      if (memo) {
        trustUrl += `&memo=${encodeURIComponent(memo)}`;
      }
      return trustUrl;

    case "phantom":
      // Phantom - Solana Pay URL (Phantom 앱에서 직접 인식)
      // solana:<recipient>?amount=<amount>&spl-token=<token_mint>&memo=<memo>
      if (chainInfo.type !== "svm") {
        throw new Error("Phantom only supports Solana");
      }
      let phantomUrl = `solana:${recipient}?amount=${amount}&spl-token=${tokenAddress}`;
      if (memo) {
        phantomUrl += `&memo=${encodeURIComponent(memo)}`;
      }
      return phantomUrl;

    case "setto":
      // Setto Wallet (준비중)
      throw new Error("Setto Wallet is not yet available");

    default:
      throw new Error(`Unknown wallet: ${wallet}`);
  }
}

// 지갑이 특정 체인을 지원하는지 확인
export function isChainSupportedByWallet(wallet: WalletType, chain: keyof typeof CHAINS): boolean {
  const walletInfo = WALLETS[wallet];
  const chainInfo = CHAINS[chain];
  return walletInfo.supportedChainTypes.includes(chainInfo.type as "evm" | "svm");
}

// 지갑에서 지원하는 체인 목록 반환
export function getSupportedChainsForWallet(wallet: WalletType): (keyof typeof CHAINS)[] {
  const walletInfo = WALLETS[wallet];
  return (Object.keys(CHAINS) as (keyof typeof CHAINS)[]).filter(chainId => {
    const chainInfo = CHAINS[chainId];
    return walletInfo.supportedChainTypes.includes(chainInfo.type as "evm" | "svm");
  });
}

// 레거시 URI 생성 함수 (기존 호환성 유지)
export function generatePaymentUri(
  chain: keyof typeof CHAINS,
  token: "USDT" | "USDC",
  recipient: string,
  amount: string,
  memo?: string
): string {
  const chainInfo = CHAINS[chain];
  const tokenAddress = chainInfo.tokens[token];
  const amountInSmallestUnit = BigInt(
    Math.floor(parseFloat(amount) * Math.pow(10, chainInfo.decimals))
  );

  if (chainInfo.type === "svm") {
    // Solana Pay
    let uri = `solana:${recipient}?amount=${amount}&spl-token=${tokenAddress}`;
    if (memo) {
      uri += `&memo=${encodeURIComponent(memo)}`;
    }
    return uri;
  } else {
    // EIP-681
    return `ethereum:${tokenAddress}@${chainInfo.chainId}/transfer?address=${recipient}&uint256=${amountInSmallestUnit}`;
  }
}

// ==================== Mock Merchants ====================

export const mockMerchants: Record<string, Merchant> = {
  "SHOP01": {
    merchant_id: "01MERCHANT0001",
    short_code: "SHOP01",
    name: "테스트 스토어",
    logo_url: "https://picsum.photos/seed/logo1/200/200",
    description: "다양한 디지털 상품을 판매하는 테스트 스토어입니다.",
    fee_rate: "2.5",
    status: "active"
  },
  "CREATOR": {
    merchant_id: "01MERCHANT0002",
    short_code: "CREATOR",
    name: "Global Hope Foundation",
    logo_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=200&auto=format&fit=crop",
    description: "International non-profit organization dedicated to saving children's lives and defending their rights.",
    fee_rate: "0.0",
    status: "active"
  }
};

// ==================== Mock Products ====================

export const mockProducts: Record<string, Product> = {
  "A3X9K2": {
    product_id: "01HXYZ9ABC123DEF456",
    short_code: "A3X9K2",
    merchant_id: "01MERCHANT0001",
    name: "Godsehee First Maxim Cover",
    tag: "HOT",
    price: "0.01",
    description: "Support Godsehee's first Maxim cover! This special sponsorship package helps Godsehee create more amazing content. You will get access to exclusive behind-the-scenes digital photos.",
    thumbnail_urls: [
      "https://cdnweb01.wikitree.co.kr/webdata/editor/202412/26/img_20241226151254_83efb0ee.webp"
    ],
    detail_urls: [
      "https://i.namu.wiki/i/BQU9qkDlYIqpewaRQ_LxosDbFOJCO4iTjB_mCEP7QXJ3fgvlap1HYRFA_KciRCvPpHXJ7V9WqAbYATYnOaJwK1mSYBFPZR3mtBC2iV70tHFV_uMe6_CqQWH6qIdXFX7-9otC8WOVkPZzepScAM8adw.webp",
      "/images/godsehee/detail-1.jpg",
      "/images/godsehee/detail-v2-2.jpg",
      "https://image.fomos.kr/contents/images/board/2025/1201/1764551354176542.jpg"
    ],
    status: "active"
  },
  "B4Y0L3": {
    product_id: "01HXYZ9ABC123DEF457",
    short_code: "B4Y0L3",
    merchant_id: "01MERCHANT0001",
    name: "Delicious Taco Set",
    tag: "RECOMMEND",
    price: "0.01",
    description: "Authentic Mexican Tacos with fresh ingredients. Best tacos in town provided by Setto Catering.",
    thumbnail_urls: [
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2070&auto=format&fit=crop"
    ],
    detail_urls: [],
    status: "active"
  },
  "C5Z1M4": {
    product_id: "01HXYZ9ABC123DEF458",
    short_code: "C5Z1M4",
    merchant_id: "01MERCHANT0001",
    name: "Waifu Collectors Pack",
    tag: "NONE",
    price: "0.01",
    description: "Start your collection with 3 Super Rare character cards! Includes exclusive 'Flame Knight', 'Aqua Mage', and 'Wind Archer'. Perfect for new players.",
    thumbnail_urls: [
      "/images/ccg/card-1.png",
      "/images/ccg/card-2.png",
      "/images/ccg/card-3.png"
    ],
    detail_urls: [
      "/images/ccg/promo.png"
    ],
    status: "active"
  },
  "INFLU1": {
    product_id: "DONATION_001",
    short_code: "INFLU1",
    merchant_id: "01MERCHANT0002",
    name: "Emergency Relief Kit",
    tag: "NEW",
    price: "0.01",
    description: "Your donation provides thermal blankets, therapeutic food, and clean water to children in crisis zones. Help us save lives.",
    thumbnail_urls: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2069&auto=format&fit=crop"
    ],
    detail_urls: [],
    status: "active"
  }
};

// ==================== Helper Functions ====================

export function getMerchantByShortCode(shortCode: string): Merchant | null {
  return mockMerchants[shortCode] || null;
}

export function getProductsByMerchantId(merchantId: string): Product[] {
  return Object.values(mockProducts)
    .filter(p => p.merchant_id === merchantId && p.status === "active");
}

export function getProductByShortCode(shortCode: string): ProductDetail | null {
  const product = mockProducts[shortCode];
  if (!product || product.status === "deleted") {
    return null;
  }

  const merchant = Object.values(mockMerchants).find(m => m.merchant_id === product.merchant_id);

  return {
    ...product,
    merchant_name: merchant?.name || "",
    merchant_logo_url: merchant?.logo_url || ""
  };
}

// Legacy function
export function getProduct(shortCode: string): ProductDetail | null {
  return getProductByShortCode(shortCode);
}
