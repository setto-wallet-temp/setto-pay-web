/**
 * API Client for Pay Web
 *
 * 환경에 따라 Mock 또는 실제 Wallet Server API 호출
 * - Local/Dev: Mock 데이터 사용 (USE_MOCK_API=true)
 * - Staging/Prod: Wallet Server gRPC-Web API 호출
 */

import {
  Chain,
  Token,
  Product,
  TOKEN_META,
  getChainById,
  getActiveChains,
  getTokenByChainAndSymbol,
  getTokensByChain,
  getAllPoolAddresses,
  getMerchantByShortCode as getMerchantMock,
  getProductsByMerchantId as getProductsMock,
  getProductByShortCode as getProductMock,
} from "./mockData";

// 환경 설정
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:50051";

// API Response 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ==================== Re-export DB Entity Types ====================

export type { Chain, Token, Product } from "./mockData";

// 클라이언트용 토큰 메타 (icon_url, color 포함)
export interface TokenWithMeta extends Token {
  icon_url: string;
  color: string;
}

// ==================== Merchant API ====================

export interface MerchantResponse {
  merchant_id: string;
  short_code: string;
  name: string;
  logo_url: string;
  description: string;
  products: Product[];
  next_cursor: string;
  pool_addresses: Record<string, string>;
}

/**
 * 스토어 정보 + 상품 리스트 조회
 */
export async function getMerchantByShortCode(
  shortCode: string,
  cursor: string = "",
  limit: number = 10
): Promise<ApiResponse<MerchantResponse>> {
  if (USE_MOCK_API) {
    const merchant = getMerchantMock(shortCode);
    if (!merchant) {
      return {
        success: false,
        error: {
          code: "PAYMENT_MERCHANT_NOT_FOUND",
          message: "스토어를 찾을 수 없습니다.",
        },
      };
    }

    const products = getProductsMock(merchant.merchant_id);

    return {
      success: true,
      data: {
        merchant_id: merchant.merchant_id,
        short_code: merchant.short_code,
        name: merchant.name,
        logo_url: merchant.logo_url,
        description: merchant.description,
        products: products,
        next_cursor: "",
        pool_addresses: getAllPoolAddresses(),
      },
    };
  }

  // 실제 API 호출
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/merchants/${shortCode}?cursor=${cursor}&limit=${limit}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.payment_error || "SYSTEM_ERROR",
          message: errorData.message || "서버 오류가 발생했습니다.",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      },
    };
  }
}

// ==================== Product API ====================

export interface ProductResponse {
  product_id: string;
  short_code: string;
  name: string;
  description: string;
  price: string;
  thumbnail_urls: string[];
  detail_urls: string[];
  tag: string;
  status: string;
  merchant_id: string;
  merchant_name: string;
  merchant_logo_url: string;
  pool_addresses: Record<string, string>;
}

/**
 * 상품 상세 조회 (short_code로)
 */
export async function getProductByShortCode(
  shortCode: string
): Promise<ApiResponse<ProductResponse>> {
  if (USE_MOCK_API) {
    const product = getProductMock(shortCode);
    if (!product) {
      return {
        success: false,
        error: {
          code: "PAYMENT_PRODUCT_NOT_FOUND",
          message: "상품을 찾을 수 없습니다.",
        },
      };
    }

    return {
      success: true,
      data: {
        product_id: product.product_id,
        short_code: product.short_code,
        name: product.name,
        description: product.description,
        price: product.price,
        thumbnail_urls: product.thumbnail_urls,
        detail_urls: product.detail_urls,
        tag: product.tag,
        status: product.status,
        merchant_id: product.merchant_id,
        merchant_name: product.merchant_name,
        merchant_logo_url: product.merchant_logo_url,
        pool_addresses: getAllPoolAddresses(),
      },
    };
  }

  // 실제 API 호출
  try {
    const response = await fetch(`${API_BASE_URL}/v1/products/${shortCode}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.payment_error || "SYSTEM_ERROR",
          message: errorData.message || "서버 오류가 발생했습니다.",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      },
    };
  }
}

// ==================== Payment API ====================

export interface PaymentInfo {
  order_id: string;
  to_address: string;
  amount: string;
  signature: string;
  expires_at: number;
  chain: string;
  token: string;
  contract_address: string;
  tx_data: string;
}

/**
 * 결제 정보 요청 (주문 생성)
 */
export async function getPaymentInfo(
  productId: string,
  chainId: string,
  tokenSymbol: string
): Promise<ApiResponse<PaymentInfo>> {
  if (USE_MOCK_API) {
    // Mock: 가상 결제 정보 생성
    const chain = getChainById(chainId);
    if (!chain) {
      return {
        success: false,
        error: { code: "INVALID_CHAIN", message: "지원하지 않는 체인입니다." },
      };
    }

    const token = getTokenByChainAndSymbol(chainId, tokenSymbol);
    if (!token) {
      return {
        success: false,
        error: { code: "INVALID_TOKEN", message: "지원하지 않는 토큰입니다." },
      };
    }

    return {
      success: true,
      data: {
        order_id: `mock_order_${Date.now()}`,
        to_address: chain.pool_address,
        amount: "1.00",
        signature: "mock_signature_" + Date.now(),
        expires_at: Date.now() + 15 * 60 * 1000, // 15분 후 만료
        chain: chainId,
        token: tokenSymbol,
        contract_address: token.contract_address,
        tx_data: `order:${productId}`,
      },
    };
  }

  // 실제 API 호출
  try {
    const response = await fetch(`${API_BASE_URL}/v1/payments/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        chain: chainId,
        token: tokenSymbol,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.payment_error || "SYSTEM_ERROR",
          message: errorData.message || "결제 정보를 가져올 수 없습니다.",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      },
    };
  }
}

/**
 * 결제 제출 (tx_hash 등록)
 */
export interface SubmitPaymentResult {
  status: string;
}

export async function submitPayment(
  orderId: string,
  txHash: string,
  walletAddress: string
): Promise<ApiResponse<SubmitPaymentResult>> {
  if (USE_MOCK_API) {
    // Mock: 즉시 성공
    return {
      success: true,
      data: { status: "submitted" },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/payments/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        tx_hash: txHash,
        wallet_address: walletAddress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.payment_error || "SYSTEM_ERROR",
          message: errorData.message || "결제 제출에 실패했습니다.",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      },
    };
  }
}

// ==================== Order API ====================

export interface OrderStatus {
  order_id: string;
  status: "pending" | "submitted" | "detected" | "confirmed" | "finalized" | "failed";
  detected_at?: number;
  confirmed_at?: number;
}

/**
 * 주문 상태 조회
 */
export async function getOrderStatus(orderId: string): Promise<ApiResponse<OrderStatus>> {
  if (USE_MOCK_API) {
    // Mock: 가상 상태
    return {
      success: true,
      data: {
        order_id: orderId,
        status: "pending",
      },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/orders/${orderId}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: {
          code: errorData.payment_error || "SYSTEM_ERROR",
          message: errorData.message || "주문 상태를 조회할 수 없습니다.",
        },
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "네트워크 오류가 발생했습니다.",
      },
    };
  }
}

// ==================== Chain/Token Helper Functions ====================

/**
 * 지원 체인 목록 (DB Chains 테이블)
 */
export function getSupportedChains(): Chain[] {
  return getActiveChains();
}

/**
 * 체인별 토큰 목록 (DB Tokens 테이블)
 */
export function getTokensForChain(chainId: string): Token[] {
  return getTokensByChain(chainId);
}

/**
 * 토큰 메타데이터 포함 목록 (클라이언트용)
 */
export function getTokensWithMeta(chainId: string): TokenWithMeta[] {
  const tokens = getTokensByChain(chainId);
  return tokens.map(token => ({
    ...token,
    icon_url: TOKEN_META[token.token_symbol]?.icon_url || "",
    color: TOKEN_META[token.token_symbol]?.color || "#000000",
  }));
}

/**
 * 지원 토큰 심볼 목록 (USDT, USDC)
 */
export function getSupportedTokenSymbols(): string[] {
  return Object.keys(TOKEN_META);
}
