import Link from "next/link";
import { siteConfig } from "@/app/site.config";

export function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          © {new Date().getFullYear()} {siteConfig.author} · Powered by Next.js
        </div>
        <div className="flex items-center gap-4">
          {siteConfig.github && (
            <Link href={siteConfig.github} target="_blank" rel="noopener" className="hover:text-indigo-500">
              GitHub
            </Link>
          )}
          {siteConfig.twitter && (
            <Link href={siteConfig.twitter} target="_blank" rel="noopener" className="hover:text-indigo-500">
              Twitter
            </Link>
          )}
          <Link href="/rss.xml" className="hover:text-indigo-500">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}