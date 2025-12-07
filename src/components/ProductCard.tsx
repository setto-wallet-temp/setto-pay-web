"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, getAllPoolAddresses } from "@/lib/mockData";
import { ProductResponse } from "@/lib/api";
import { useProductStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  merchantName?: string;
  merchantLogoUrl?: string;
}

const getBadgeColor = (tag?: string) => {
  switch (tag) {
    case "HOT": return "bg-pink-600/90 border-pink-500/30";
    case "NEW": return "bg-blue-600/90 border-blue-500/30";
    case "RECOMMEND": return "bg-orange-500/90 border-orange-500/30";
    case "NONE": return "bg-gray-600/90 border-gray-500/30";
    default: return "bg-gray-600/90 border-gray-500/30";
  }
};

export default function ProductCard({ product, merchantName = "", merchantLogoUrl = "" }: ProductCardProps) {
  const router = useRouter();
  const { setProduct } = useProductStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // ProductResponse 형태로 변환하여 store에 저장
    const productResponse: ProductResponse = {
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
      merchant_name: merchantName,
      merchant_logo_url: merchantLogoUrl,
      pool_addresses: getAllPoolAddresses(),
    };

    setProduct(product.short_code, productResponse);
    router.push(`/p/${product.short_code}`);
  };

  return (
    <Link
      href={`/p/${product.short_code}`}
      onClick={handleClick}
      className="relative aspect-[4/5] group overflow-hidden bg-gray-900 rounded-xl"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 filter grayscale-[20%] group-hover:grayscale-0"
        style={{ backgroundImage: `url("${product.thumbnail_urls[0]}")` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:via-transparent transition-opacity duration-500" />

      {/* Top Left Badge */}
      {product.tag && product.tag !== "NONE" && (
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-sm backdrop-blur-sm text-white text-[10px] font-bold tracking-wide shadow-lg border ${getBadgeColor(product.tag)}`}>
            {product.tag}
          </span>
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-bold text-white leading-tight mb-1 text-shadow-md drop-shadow-md">{product.name}</h3>
        <p className="text-[10px] text-gray-200 line-clamp-1 mb-1 font-medium text-shadow-sm">{product.description}</p>
        <span className="text-sm font-mono font-bold text-white text-shadow-sm">${product.price}</span>
      </div>
    </Link>
  );
}
