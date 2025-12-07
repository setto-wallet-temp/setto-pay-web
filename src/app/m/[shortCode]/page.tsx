"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { getMerchantByShortCode, getProductsByMerchantId } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

export default function MerchantShopPage() {
    const params = useParams();
    const shortCode = params.shortCode as string;

    // Data Fetching directly from mock (since it's client-side mock for now)
    const merchant = getMerchantByShortCode(shortCode);
    const products = merchant ? getProductsByMerchantId(merchant.merchant_id) : [];

    if (!merchant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white font-sans">
                <div className="text-6xl mb-6 grayscale">🏪</div>
                <h1 className="text-2xl font-bold mb-3 text-gray-200">
                    Merchant Not Found
                </h1>
                <p className="text-gray-500 mb-8">The shop link might be invalid.</p>
                <Link href="/" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition text-sm">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 pb-20">

            <main className="max-w-md md:max-w-5xl mx-auto px-4 mt-8">

                {/* Merchant Profile */}
                <ProfileSection merchant={merchant} />

                {/* Product Grid */}
                <div className="mb-4">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.short_code}
                                    product={product}
                                    merchantName={merchant.name}
                                    merchantLogoUrl={merchant.logo_url}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-600 bg-white/5 rounded-2xl border border-white/5">
                            <p>No products available yet.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

function ProfileSection({ merchant }: { merchant: any }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Split by newlines to handle "2 lines" request
    const lines = merchant.description.split('\n');
    const isLongText = lines.length > 2;

    // If collpased, show first 2 lines. Join back with newline to preserve formatting.
    const displayDescription = !isExpanded && isLongText
        ? lines.slice(0, 2).join('\n') + "..."
        : merchant.description;

    return (
        <div className="flex items-start gap-5 mb-5">
            <div className="w-20 h-20 rounded-full border border-white/10 overflow-hidden shadow-lg shrink-0">
                <img
                    src={merchant.logo_url}
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col -mt-4 flex-1">
                <h1 className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">{merchant.name}</h1>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {displayDescription}
                    {isLongText && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-500 hover:text-white transition-colors ml-1"
                        >
                            {isExpanded ? 'Show less' : 'more'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
