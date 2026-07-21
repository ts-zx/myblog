import { siteConfig } from "@/app/site.config";
import { Mail, BookOpen } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

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
          我会在这个网站写一些关于技术、生活、阅读、思考的笔记。如果你也对其中某些话题感兴趣，欢迎留言交流
          <BookOpen className="w-4 h-4 inline-block -mt-0.5 text-indigo-500" aria-hidden />
        </p>

        <h2>联系</h2>
        <ul className="!my-4">
          {siteConfig.email && (
            <li className="flex items-center gap-2 !my-2">
              <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" aria-hidden />
              <span>邮箱：<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></span>
            </li>
          )}
          {siteConfig.github && (
            <li className="flex items-center gap-2 !my-2">
              <GithubIcon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>GitHub：<a href={siteConfig.github} target="_blank" rel="noopener">{siteConfig.github}</a></span>
            </li>
          )}
        </ul>

        <h2>本站技术栈</h2>
        <ul>
          <li>Next.js 14 (App Router)</li>
          <li>MDX（写作时熟悉的 Markdown + 可嵌入 React 组件）</li>
          <li>Tailwind CSS</li>
          <li>Lucide 图标库（开源免费）</li>
          <li>部署在 Cloudflare Pages（全球 CDN、自动 HTTPS）</li>
        </ul>
      </div>
    </div>
  );
}