/**
 * API Client for Pay Web
 *
 * 환경에 따라 Mock 또는 실제 Wallet Server API 호출
 * - Local/Dev: Mock 데이터 사용 (USE_MOCK_API=true)
 * - Staging/Prod: Wallet Server gRPC-Web API 호출
 */

import { Product, mockProducts, CHAINS, TOKENS } from "./mockData";

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

// Chain/Token 정보 (서버에서 제공)
export interface ChainInfo {
  id: string;
  name: string;
  chainId: number;
  type: "evm" | "svm";
  icon: string;
  tokens: Record<string, string>;
  decimals: number;
}

export interface TokenInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

/**
 * 상품 정보 조회 (short_code로)
 */
export async function getProductByShortCode(shortCode: string): Promise<ApiResponse<Product>> {
  if (USE_MOCK_API) {
    // Mock: 즉시 반환
    const product = mockProducts[shortCode];
    if (!product) {
      return {
        success: false,
        error: {
          code: "PAYMENT_PRODUCT_NOT_FOUND",
          message: "상품을 찾을 수 없습니다.",
        },
      };
    }
    return { success: true, data: product };
  }

  // 실제 API 호출 (gRPC-Web 또는 REST Gateway)
  try {
    const response = await fetch(`${API_BASE_URL}/v1/products/${shortCode}`, {
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
          message: errorData.message || "서버 오류가 발생했습니다.",
        },
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        product_id: data.product_id,
        short_code: data.short_code,
        name: data.name,
        description: data.description,
        price: data.price,
        thumbnail_urls: data.thumbnail_urls || [],
        detail_urls: data.detail_urls || [],
        qr_code_url: "",
        merchant_address: data.merchant_address,
        merchant_address_solana: data.merchant_address_solana || "",
        is_active: true,
      },
    };
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
 * 결제 정보 요청 (주문 생성)
 */
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

export async function getPaymentInfo(
  productId: string,
  chain: string,
  token: string
): Promise<ApiResponse<PaymentInfo>> {
  if (USE_MOCK_API) {
    // Mock: 가상 결제 정보 생성
    const chainInfo = CHAINS[chain as keyof typeof CHAINS];
    if (!chainInfo) {
      return {
        success: false,
        error: { code: "INVALID_CHAIN", message: "지원하지 않는 체인입니다." },
      };
    }

    const tokenAddress = chainInfo.tokens[token as "USDT" | "USDC"];
    if (!tokenAddress) {
      return {
        success: false,
        error: { code: "INVALID_TOKEN", message: "지원하지 않는 토큰입니다." },
      };
    }

    return {
      success: true,
      data: {
        order_id: `mock_order_${Date.now()}`,
        to_address: "0xPoolWalletAddress1234567890abcdef12345678",
        amount: "10.00",
        signature: "mock_signature_" + Date.now(),
        expires_at: Date.now() + 15 * 60 * 1000, // 15분 후 만료
        chain: chain,
        token: token,
        contract_address: tokenAddress,
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
        chain: chain,
        token: token,
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

/**
 * 주문 상태 조회
 */
export interface OrderStatus {
  order_id: string;
  status: "pending" | "submitted" | "detected" | "confirmed" | "finalized" | "failed";
  detected_at?: number;
  confirmed_at?: number;
}

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

/**
 * 지원 체인 목록
 */
export function getSupportedChains(): ChainInfo[] {
  return Object.values(CHAINS);
}

/**
 * 지원 토큰 목록
 */
export function getSupportedTokens(): TokenInfo[] {
  return [...TOKENS];
}
