import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Setto Pay",
  description: "Cross-chain stablecoin payment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function forceOpenInChrome() {
  const ua = navigator.userAgent;
  const isKakao = /KAKAOTALK/i.test(ua);

  if (isKakao) {
    location.href = \`intent://\${window.location.href.replace("https://", "")}#Intent;scheme=https;package=com.android.chrome;end;\`;
    setTimeout(() => {
      if (window.history.length > 1) {
        history.back();
      } else {
        window.close();
      }
    }, 1000);
  }
})();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
