import { siteConfig } from "@/app/site.config";

export const metadata = { title: "关于" };

export default function AboutPage() {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold tracking-tight">关于我</h1>
      <div className="mt-6 prose dark:prose-invert max-w-none">
        <p>
          你好，我是 <strong>{siteConfig.author}</strong>。这里是 {siteConfig.name} —— 一个记录与分享的小角落。
        </p>
        <p>
          我会在这个网站写一些关于技术、生活、阅读、思考的笔记。如果你也对其中某些话题感兴趣，欢迎留言交流 ✨
        </p>

        <h2>联系</h2>
        <ul>
          {siteConfig.email && (
            <li>📧 邮箱：<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></li>
          )}
          {siteConfig.github && (
            <li>🐙 GitHub：<a href={siteConfig.github} target="_blank" rel="noopener">{siteConfig.github}</a></li>
          )}
          {siteConfig.twitter && (
            <li>🐦 Twitter：<a href={siteConfig.twitter} target="_blank" rel="noopener">{siteConfig.twitter}</a></li>
          )}
        </ul>

        <h2>本站技术栈</h2>
        <ul>
          <li>Next.js 14 (App Router)</li>
          <li>MDX（写作时熟悉的 Markdown + 可嵌入 React 组件）</li>
          <li>Tailwind CSS</li>
          <li>部署在 Vercel（全球 CDN、自动 HTTPS）</li>
        </ul>
      </div>
    </div>
  );
}