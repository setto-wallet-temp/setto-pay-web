import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Setto Pay - Prototype</h1>
      <p className="text-gray-600 mb-8">테스트 상품 페이지로 이동하세요</p>

      <div className="space-y-4">
        <Link
          href="/p/INFLU1"
          className="block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition shadow-lg transform hover:-translate-y-0.5"
        >
          ✨ NEW: Influencer Sponsorship - $0.01
        </Link>
        <Link
          href="/p/A3X9K2"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          테스트 상품 1 - $10.00
        </Link>
        <Link
          href="/p/B4Y0L3"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          테스트 상품 2 - $25.00
        </Link>
        <Link
          href="/p/C5Z1M4"
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          테스트 상품 3 - $99.99
        </Link>
      </div>
    </div>
  );
}
