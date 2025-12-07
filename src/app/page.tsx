import { mockProducts, mockMerchants } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const products = Object.values(mockProducts);

  // merchant_id로 merchant 정보 찾기
  const getMerchantInfo = (merchantId: string) => {
    const merchant = Object.values(mockMerchants).find(m => m.merchant_id === merchantId);
    return {
      name: merchant?.name || "",
      logoUrl: merchant?.logo_url || "",
    };
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white selection:bg-purple-500/30 pb-20">

      {/* Header (Insta-like) */}
      <div className="sticky top-0 z-50 w-full max-w-md bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Setto.
        </h1>
      </div>

      <div className="w-full max-w-md px-1 mt-2">

        {/* Product Grid (Dynamic) */}
        <div className="grid grid-cols-2 gap-1">
          {products.map((product) => {
            const merchantInfo = getMerchantInfo(product.merchant_id);
            return (
              <ProductCard
                key={product.short_code}
                product={product}
                merchantName={merchantInfo.name}
                merchantLogoUrl={merchantInfo.logoUrl}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
