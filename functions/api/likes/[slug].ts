// Cloudflare Pages Function — 文章点赞
// 路由: GET  /api/likes/:slug  → 获取点赞数
//       POST /api/likes/:slug  → 点赞数 +1
// 存储: Cloudflare KV (namespace: VIEWS) — 复用 views 的 KV，加 likes: 前缀

export interface Env {
  VIEWS: KVNamespace;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });

const key = (slug: string) => `likes:${slug}`;

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: CORS });

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = String(context.params.slug ?? "").trim();
  if (!slug || slug.length > 200) return json({ error: "bad slug" }, 400);
  const raw = await context.env.VIEWS.get(key(slug));
  const count = raw ? parseInt(raw, 10) || 0 : 0;
  return json({ slug, count });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const slug = String(context.params.slug ?? "").trim();
  if (!slug || slug.length > 200) return json({ error: "bad slug" }, 400);
  const current = parseInt((await context.env.VIEWS.get(key(slug))) ?? "0", 10) || 0;
  const next = current + 1;
  await context.env.VIEWS.put(key(slug), String(next));
  return json({ slug, count: next, liked: true });
};
