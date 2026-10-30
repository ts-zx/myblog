import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PagefindLoader } from "@/components/PagefindLoader";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { MetaUpdater } from "@/components/MetaUpdater";
import { siteConfig } from "@/app/site.config";
import "./globals.css";

// SEO: 站点级默认关键词（各文章页会用文章自己的 tags 覆盖）
const DEFAULT_KEYWORDS = [
  "个人博客",
  "技术笔记",
  "生活随笔",
  "Next.js",
  "MDX",
  "Cloudflare Pages",
  siteConfig.name,
  siteConfig.author,
];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.description}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: `${siteConfig.description}。这里记录我的学习、生活和思考，分享技术笔记与日常感悟。`,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  applicationName: siteConfig.name,
  // SEO: 显式声明索引策略
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // SEO: 社交分享图
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: `${siteConfig.description}。这里记录我的学习、生活和思考，分享技术笔记与日常感悟。`,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.description}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.description}`,
    description: `${siteConfig.description}。这里记录我的学习、生活和思考，分享技术笔记与日常感悟。`,
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

// SEO: Schema.org 结构化数据（WebSite + Person + SearchAction）
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "zh-CN",
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.author,
        url: siteConfig.url,
        ...(siteConfig.github ? { sameAs: [siteConfig.github] } : {}),
      },
      {
        "@type": "Blog",
        "@id": `${siteConfig.url}/#blog`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "zh-CN",
        blogPost: {
          "@type": "BlogPosting",
          headline: siteConfig.name,
          url: siteConfig.url,
          author: { "@id": `${siteConfig.url}/#person` },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased relative">
        {/* 用户自定义背景（纯本地，不上传） */}
        <BackgroundLayer />
        {/* Pagefind ESM loader - 必须在 server component 里才会被渲染到 body */}
        <PagefindLoader />
        <JsonLd />
        <MetaUpdater />
        <Header />
        <main className="flex-1 mx-auto w-full max-w-5xl px-6 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
