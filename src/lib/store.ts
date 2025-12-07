import { create } from "zustand";
import { ProductResponse } from "./api";

interface ProductStore {
  // 캐시된 상품 데이터 (short_code → ProductResponse)
  products: Record<string, ProductResponse>;

  // pool_addresses (한 번 받으면 캐싱)
  poolAddresses: Record<string, string> | null;

  // Actions
  setProduct: (shortCode: string, product: ProductResponse) => void;
  getProduct: (shortCode: string) => ProductResponse | null;
  setPoolAddresses: (addresses: Record<string, string>) => void;
  clearCache: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: {},
  poolAddresses: null,

  setProduct: (shortCode, product) =>
    set((state) => ({
      products: { ...state.products, [shortCode]: product },
      // pool_addresses도 같이 저장
      poolAddresses: state.poolAddresses || product.pool_addresses,
    })),

  getProduct: (shortCode) => get().products[shortCode] || null,

  setPoolAddresses: (addresses) => set({ poolAddresses: addresses }),

  clearCache: () => set({ products: {}, poolAddresses: null }),
}));
