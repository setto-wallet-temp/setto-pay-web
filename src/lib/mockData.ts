// ==================== DB Entity Types (스키마 1:1 매핑) ====================

// Merchants 테이블
export interface Merchant {
  merchant_id: string;        // PK
  short_code: string;
  name: string;
  logo_url: string;
  description: string;
  fee_rate: string;
  status: "active" | "suspended";
  created_at?: number;
  updated_at?: number;
}

// Products 테이블
export interface Product {
  product_id: string;         // PK
  short_code: string;
  merchant_id: string;
  name: string;
  description: string;
  price: string;
  thumbnail_urls: string[];
  detail_urls: string[];
  tag: "HOT" | "NEW" | "RECOMMEND" | "NONE";
  status: "active" | "inactive" | "deleted";
  created_at?: number;
  updated_at?: number;
}

// Chains 테이블
export interface Chain {
  chain_id: string;           // PK
  chain_type: "evm" | "svm";
  display_name: string;
  icon_url: string;
  network_chain_id: number;
  pool_address: string;
  is_active: boolean;
  // RPC 정보는 서버 전용이므로 클라이언트에서 생략
  // ws_url, http_url, grpc_url, rpc_timeout_ms, block_time_sec, has_confirmed_stage, reorg_check
}

// Tokens 테이블
export interface Token {
  chain_id: string;           // PK
  token_symbol: string;       // SK
  contract_address: string;
  decimals: number;
  is_active: boolean;
}

// ==================== 조인/확장 타입 ====================

export interface ProductDetail extends Product {
  merchant_name: string;
  merchant_logo_url: string;
}

// ==================== Mock Chains 테이블 데이터 ====================

export const mockChains: Chain[] = [
  {
    chain_id: "bsc",
    chain_type: "evm",
    display_name: "BNB Chain",
    icon_url: "/chains/bsc.svg",
    network_chain_id: 56,
    pool_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    is_active: true
  },
  {
    chain_id: "solana",
    chain_type: "svm",
    display_name: "Solana",
    icon_url: "/chains/solana.svg",
    network_chain_id: 0,
    pool_address: "5ep7Hvfxpp7VkqDn3bEsCyEzfzy8QradgvYXf5AEB6WW",
    is_active: true
  },
  {
    chain_id: "base",
    chain_type: "evm",
    display_name: "Base",
    icon_url: "/chains/base.png",
    network_chain_id: 8453,
    pool_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    is_active: true
  },
  {
    chain_id: "avalanche",
    chain_type: "evm",
    display_name: "Avalanche",
    icon_url: "/chains/avalanche.svg",
    network_chain_id: 43114,
    pool_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    is_active: true
  },
  {
    chain_id: "arbitrum",
    chain_type: "evm",
    display_name: "Arbitrum",
    icon_url: "/chains/arbitrum.svg",
    network_chain_id: 42161,
    pool_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    is_active: true
  },
  {
    chain_id: "optimism",
    chain_type: "evm",
    display_name: "Optimism",
    icon_url: "/chains/optimism.svg",
    network_chain_id: 10,
    pool_address: "0x6d5d44da188169d2449f7d55f2780bd746bf387f",
    is_active: true
  }
];

// ==================== Mock Tokens 테이블 데이터 ====================

export const mockTokens: Token[] = [
  // BSC
  { chain_id: "bsc", token_symbol: "USDT", contract_address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, is_active: true },
  { chain_id: "bsc", token_symbol: "USDC", contract_address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18, is_active: true },
  // Solana
  { chain_id: "solana", token_symbol: "USDT", contract_address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6, is_active: true },
  { chain_id: "solana", token_symbol: "USDC", contract_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6, is_active: true },
  // Base
  { chain_id: "base", token_symbol: "USDT", contract_address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2", decimals: 6, is_active: true },
  { chain_id: "base", token_symbol: "USDC", contract_address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, is_active: true },
  // Avalanche
  { chain_id: "avalanche", token_symbol: "USDT", contract_address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7", decimals: 6, is_active: true },
  { chain_id: "avalanche", token_symbol: "USDC", contract_address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", decimals: 6, is_active: true },
  // Arbitrum
  { chain_id: "arbitrum", token_symbol: "USDT", contract_address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6, is_active: true },
  { chain_id: "arbitrum", token_symbol: "USDC", contract_address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6, is_active: true },
  // Optimism
  { chain_id: "optimism", token_symbol: "USDT", contract_address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", decimals: 6, is_active: true },
  { chain_id: "optimism", token_symbol: "USDC", contract_address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", decimals: 6, is_active: true }
];

// ==================== 클라이언트 전용 메타데이터 (DB에 없음) ====================

export const TOKEN_META: Record<string, { icon_url: string; color: string }> = {
  USDT: { icon_url: "/tokens/usdt.svg", color: "#26A17B" },
  USDC: { icon_url: "/tokens/usdc.svg", color: "#2775CA" }
};

// 지갑 정보 (DB에 없음 - 클라이언트 전용)
export type WalletType = "setto" | "metamask" | "trust" | "phantom";

export const WALLETS: Record<WalletType, {
  id: WalletType;
  name: string;
  icon_url: string;
  supported_chain_types: ("evm" | "svm")[];
  enabled: boolean;
}> = {
  setto: {
    id: "setto",
    name: "Setto Wallet",
    icon_url: "/wallets/setto.svg",
    supported_chain_types: ["evm", "svm"],
    enabled: false  // 준비중
  },
  metamask: {
    id: "metamask",
    name: "MetaMask",
    icon_url: "/wallets/metamask.svg",
    supported_chain_types: ["evm"],
    enabled: true
  },
  trust: {
    id: "trust",
    name: "Trust Wallet",
    icon_url: "/wallets/trust.svg",
    supported_chain_types: ["evm", "svm"],
    enabled: true
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    icon_url: "/wallets/phantom.svg",
    supported_chain_types: ["svm"],
    enabled: true
  }
};

// Trust Wallet SLIP44 코드 매핑
const SLIP44_CODES: Record<string, number> = {
  bsc: 20000714,
  base: 8453,
  avalanche: 9005,
  arbitrum: 60,
  optimism: 60,
};

// ==================== Helper Functions ====================

// 체인 조회
export function getChainById(chainId: string): Chain | null {
  return mockChains.find(c => c.chain_id === chainId && c.is_active) || null;
}

export function getActiveChains(): Chain[] {
  return mockChains.filter(c => c.is_active);
}

// 토큰 조회
export function getTokenByChainAndSymbol(chainId: string, tokenSymbol: string): Token | null {
  return mockTokens.find(t => t.chain_id === chainId && t.token_symbol === tokenSymbol && t.is_active) || null;
}

export function getTokensByChain(chainId: string): Token[] {
  return mockTokens.filter(t => t.chain_id === chainId && t.is_active);
}

// Pool 주소 조회 (Chains 테이블에서)
export function getPoolAddress(chainId: string): string | null {
  const chain = getChainById(chainId);
  return chain?.pool_address || null;
}

// 모든 Pool 주소 (API 응답용)
export function getAllPoolAddresses(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const chain of mockChains) {
    if (chain.is_active) {
      result[chain.chain_id] = chain.pool_address;
    }
  }
  return result;
}

// ==================== 지갑 딥링크 생성 ====================

export function generateWalletDeeplink(
  wallet: WalletType,
  chainId: string,
  tokenSymbol: string,
  recipient: string,
  amount: string,
  memo?: string
): string {
  const chain = getChainById(chainId);
  const token = getTokenByChainAndSymbol(chainId, tokenSymbol);

  if (!chain || !token) {
    throw new Error(`Invalid chain or token: ${chainId}/${tokenSymbol}`);
  }

  const amountInSmallestUnit = BigInt(
    Math.floor(parseFloat(amount) * Math.pow(10, token.decimals))
  );

  switch (wallet) {
    case "metamask":
      return `https://metamask.app.link/send/${token.contract_address}@${chain.network_chain_id}/transfer?address=${recipient}&uint256=${amountInSmallestUnit}`;

    case "trust":
      const slip44 = chain.chain_type === "svm" ? 501 : (SLIP44_CODES[chainId] || chain.network_chain_id);
      let trustUrl = `https://link.trustwallet.com/send?asset=c${slip44}_t${token.contract_address}&address=${recipient}&amount=${amount}`;
      if (memo) {
        trustUrl += `&memo=${encodeURIComponent(memo)}`;
      }
      return trustUrl;

    case "phantom":
      if (chain.chain_type !== "svm") {
        throw new Error("Phantom only supports Solana");
      }
      let phantomUrl = `solana:${recipient}?amount=${amount}&spl-token=${token.contract_address}`;
      if (memo) {
        phantomUrl += `&memo=${encodeURIComponent(memo)}`;
      }
      return phantomUrl;

    case "setto":
      throw new Error("Setto Wallet is not yet available");

    default:
      throw new Error(`Unknown wallet: ${wallet}`);
  }
}

// 지갑이 특정 체인을 지원하는지 확인
export function isChainSupportedByWallet(wallet: WalletType, chainId: string): boolean {
  const walletInfo = WALLETS[wallet];
  const chain = getChainById(chainId);
  if (!chain) return false;
  return walletInfo.supported_chain_types.includes(chain.chain_type);
}

// 지갑에서 지원하는 체인 목록 반환
export function getSupportedChainsForWallet(wallet: WalletType): Chain[] {
  const walletInfo = WALLETS[wallet];
  return mockChains.filter(chain =>
    chain.is_active && walletInfo.supported_chain_types.includes(chain.chain_type)
  );
}

// 레거시 URI 생성 함수
export function generatePaymentUri(
  chainId: string,
  tokenSymbol: string,
  recipient: string,
  amount: string,
  memo?: string
): string {
  const chain = getChainById(chainId);
  const token = getTokenByChainAndSymbol(chainId, tokenSymbol);

  if (!chain || !token) {
    throw new Error(`Invalid chain or token: ${chainId}/${tokenSymbol}`);
  }

  const amountInSmallestUnit = BigInt(
    Math.floor(parseFloat(amount) * Math.pow(10, token.decimals))
  );

  if (chain.chain_type === "svm") {
    let uri = `solana:${recipient}?amount=${amount}&spl-token=${token.contract_address}`;
    if (memo) {
      uri += `&memo=${encodeURIComponent(memo)}`;
    }
    return uri;
  } else {
    return `ethereum:${token.contract_address}@${chain.network_chain_id}/transfer?address=${recipient}&uint256=${amountInSmallestUnit}`;
  }
}

// ==================== Mock Merchants 테이블 데이터 ====================

export const mockMerchants: Record<string, Merchant> = {
  "SHOP01": {
    merchant_id: "01MERCHANT0001",
    short_code: "SHOP01",
    name: "cửa hàng thử nghiệm",
    logo_url: "https://cdn.vectorstock.com/i/1000v/14/07/stylish-woman-biting-lip-vector-20641407.jpg",
    description: `그동안 SNS에서 보여드리지 못했던 조금 더 대담하고 섬세한 무드의 섹시 컨셉 화보를 담았어요!

사진 한 장 한 장에 제 스타일과 분위기를 가득 채웠고, 고화질로 감상하실 수 있도록 준비했습니다.

후원해주시는 모든 분들께 더 많은 매력과 새로운 모습 보여드릴게요.`,
    fee_rate: "2.5",
    status: "active"
  },
};

// ==================== Mock Products 테이블 데이터 ====================

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
    merchant_id: "01MERCHANT0001",
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

// ==================== Merchant/Product Helper Functions ====================

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
