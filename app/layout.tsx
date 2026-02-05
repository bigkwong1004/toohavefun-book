import type { Metadata } from "next";
import { Manrope, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"], variable: '--font-manrope' });
const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"], variable: '--font-noto-sans-kr' });

export const metadata: Metadata = {
  title: "Reading Flow",
  description: "몰입을 위한 독서 타이머 & 포커스 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} ${notoSansKr.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
