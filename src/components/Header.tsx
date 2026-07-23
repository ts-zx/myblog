"use client";

import Link from "next/link";
import { useTheme } from "@/lib/useTheme";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { siteConfig } from "@/app/site.config";

export function Header() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
      <div className="mx-auto max-w-4xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <button
            aria-label="切换主题"
            onClick={toggle}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}