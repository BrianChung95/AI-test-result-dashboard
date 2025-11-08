import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Test Results Dashboard",
  description: "Modern AI-powered testing insights dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <div className="min-h-screen gradient-bg">
          <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
