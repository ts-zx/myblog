// Build-time RSS generator
// Run via: node scripts/generate-rss.mjs
// Output: public/rss.xml (will be copied to out/rss.xml by next build)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

// Mirror src/app/site.config.ts — keep in sync
const SITE = {
  name: "我的小站",
  description: "记录、思考、分享",
  author: "Your Name",
  url: "https://my-blog.pages.dev", // <-- 改成你的 Pages 域名
  language: "zh-CN",
};

const postsDir = path.join(root, "content", "posts");
const outDir = path.join(root, "public");
fs.mkdirSync(outDir, { recursive: true });

const escape = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const files = fs
  .readdirSync(postsDir)
  .filter((f) => /\.(md|mdx)$/.test(f));

const items = files
  .map((file) => {
    const slug = file.replace(/\.(md|mdx)$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data } = matter(raw);
    if (data.draft) return null;
    return { slug, ...data };
  })
  .filter(Boolean)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const lastBuildDate = new Date().toUTCString();

const itemsXml = items
  .map(
    (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <description>${escape(p.description ?? "")}</description>
      <link>${escape(SITE.url)}/posts/${escape(p.slug)}</link>
      <guid isPermaLink="false">${escape(p.slug)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <author>${escape(SITE.author)}</author>
      ${(p.tags ?? [])
        .map((t) => `<category>${escape(t)}</category>`)
        .join("\n      ")}
    </item>`
  )
  .join("");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)}</title>
    <description>${escape(SITE.description)}</description>
    <link>${escape(SITE.url)}</link>
    <atom:link href="${escape(SITE.url)}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${escape(SITE.language)}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>
`;

const out = path.join(outDir, "rss.xml");
fs.writeFileSync(out, xml, "utf8");
console.log(`✓ Generated ${out} with ${items.length} items`);
