export interface Product {
  product_id: string;
  short_code: string;
  name: string;
  price: string;
  description: string;
  thumbnail_urls: string[];    // 상단 슬라이드 이미지 (최대 3장)
  detail_urls: string[];       // 상세 이미지 (최대 5장)
  qr_code_url: string;
  merchant_address: string;           // EVM 주소 (0x...)
  merchant_address_solana: string;    // Solana 주소 (Base58)
  is_active: boolean;
}

// 체인 정보
export const CHAINS = {
  bsc: {
    id: "bsc",
    name: "BNB Chain",
    chainId: 56,
    type: "evm",
    icon: "🟡",
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
    icon: "🟣",
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
    icon: "🔵",
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
    icon: "🔴",
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
    icon: "🔷",
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
    icon: "⭕",
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
  icon: string;
  supportedChainTypes: ("evm" | "svm")[];
  enabled: boolean;
}> = {
  setto: {
    id: "setto",
    name: "Setto Wallet",
    icon: "🔷",
    supportedChainTypes: ["evm", "svm"],
    enabled: false  // 준비중
  },
  metamask: {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    supportedChainTypes: ["evm"],
    enabled: true
  },
  trust: {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    supportedChainTypes: ["evm", "svm"],  // Solana도 지원
    enabled: true
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
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
      // Phantom Deeplink (Solana only)
      // https://phantom.app/ul/send?recipient={to}&spl-token={token}&amount={amount}&memo={memo}
      if (chainInfo.type !== "svm") {
        throw new Error("Phantom only supports Solana");
      }
      let phantomUrl = `https://phantom.app/ul/send?recipient=${recipient}&splToken=${tokenAddress}&amount=${amount}`;
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

// Mock 상품 데이터
export const mockProducts: Record<string, Product> = {
  "A3X9K2": {
    product_id: "01HXYZ9ABC123DEF456",
    short_code: "A3X9K2",
    name: "프리미엄 디지털 아트 NFT",
    price: "10.00",
    description: "한정판 디지털 아트워크입니다. 크로스체인 스테이블코인으로 결제하세요. 전 세계 어디서나 USDT, USDC로 간편하게 구매 가능합니다.",
    thumbnail_urls: [
      "https://picsum.photos/seed/product1a/800/800",
      "https://picsum.photos/seed/product1b/800/800",
      "https://picsum.photos/seed/product1c/800/800"
    ],
    detail_urls: [
      "https://picsum.photos/seed/detail1a/800/1200",
      "https://picsum.photos/seed/detail1b/800/1200",
      "https://picsum.photos/seed/detail1c/800/1200"
    ],
    qr_code_url: "",
    merchant_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    merchant_address_solana: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
    is_active: true
  },
  "B4Y0L3": {
    product_id: "01HXYZ9ABC123DEF457",
    short_code: "B4Y0L3",
    name: "게임 아이템 패키지",
    price: "25.00",
    description: "스페셜 게임 아이템 패키지입니다. 레어 스킨, 무기, 부스터가 포함되어 있습니다. USDT 또는 USDC로 결제 가능합니다.",
    thumbnail_urls: [
      "https://picsum.photos/seed/product2a/800/800",
      "https://picsum.photos/seed/product2b/800/800"
    ],
    detail_urls: [
      "https://picsum.photos/seed/detail2a/800/1200",
      "https://picsum.photos/seed/detail2b/800/1200",
      "https://picsum.photos/seed/detail2c/800/1200",
      "https://picsum.photos/seed/detail2d/800/1200"
    ],
    qr_code_url: "",
    merchant_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    merchant_address_solana: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
    is_active: true
  },
  "C5Z1M4": {
    product_id: "01HXYZ9ABC123DEF458",
    short_code: "C5Z1M4",
    name: "프리미엄 연간 구독권",
    price: "99.99",
    description: "프리미엄 서비스 연간 구독권입니다. 모든 기능 무제한 이용, 우선 고객 지원, 독점 콘텐츠 접근 권한이 포함됩니다. 6개 체인에서 결제 가능합니다.",
    thumbnail_urls: [
      "https://picsum.photos/seed/product3a/800/800",
      "https://picsum.photos/seed/product3b/800/800",
      "https://picsum.photos/seed/product3c/800/800"
    ],
    detail_urls: [
      "https://picsum.photos/seed/detail3a/800/1200",
      "https://picsum.photos/seed/detail3b/800/1200",
      "https://picsum.photos/seed/detail3c/800/1200",
      "https://picsum.photos/seed/detail3d/800/1200",
      "https://picsum.photos/seed/detail3e/800/1200"
    ],
    qr_code_url: "",
    merchant_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    merchant_address_solana: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
    is_active: true
  },
  "INFLU1": {
    product_id: "INFLUENCER_SPONSOR_001",
    short_code: "INFLU1",
    name: "✨ Creator Support Visual",
    price: "0.01",
    description: "Support your favorite creator directly with crypto. 100% of the proceeds go to better content creation.",
    thumbnail_urls: [
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2070&auto=format&fit=crop"
    ],
    detail_urls: [],
    qr_code_url: "",
    merchant_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    merchant_address_solana: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
    is_active: true
  }
};

export function getProduct(shortCode: string): Product | null {
  return mockProducts[shortCode] || null;
}
