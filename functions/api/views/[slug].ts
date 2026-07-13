// Cloudflare Pages Function — 文章阅读量统计
// 路由: GET  /api/views/:slug  → 获取当前阅读量
//       POST /api/views/:slug  → 阅读量 +1
// 存储: Cloudflare KV (namespace: VIEWS)

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

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: CORS });

// GET — 只读，不增加
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = String(context.params.slug ?? "").trim();
  if (!slug || slug.length > 200) return json({ error: "bad slug" }, 400);
  const raw = await context.env.VIEWS.get(slug);
  const count = raw ? parseInt(raw, 10) || 0 : 0;
  return json({ slug, count });
};

// POST — 增加一次阅读量
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const slug = String(context.params.slug ?? "").trim();
  if (!slug || slug.length > 200) return json({ error: "bad slug" }, 400);
  const current = parseInt((await context.env.VIEWS.get(slug)) ?? "0", 10) || 0;
  const next = current + 1;
  // expirationTTL: 永不过期；想限制只统计近期可以加，比如 60*60*24*30
  await context.env.VIEWS.put(slug, String(next));
  return json({ slug, count: next });
};
