import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "01A LABS | AI Layer-2 Terminal",
  description: "Terminal interface for AI Layer-2 blockchain - Decentralized subnets for LLM, Vision, and Embedding tasks",
  keywords: ["01A LABS", "AI", "Layer-2", "BNB Chain", "Blockchain", "Terminal"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${interTight.variable} font-sans`}>
        <Providers>
          <div className="relative min-h-screen">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

