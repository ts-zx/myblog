import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PagefindLoader } from "@/components/PagefindLoader";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { siteConfig } from "@/app/site.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased relative">
        {/* 用户自定义背景（纯本地，不上传） */}
        <BackgroundLayer />
        {/* Pagefind ESM loader - 必须在 server component 里才会被渲染到 body */}
        <PagefindLoader />
        <Header />
        <main className="flex-1 mx-auto w-full max-w-4xl px-6 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}