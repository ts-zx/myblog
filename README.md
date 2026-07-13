# 我的小站 · Next.js + MDX + Cloudflare 全栈博客

一个开箱即用的博客，**前端 Cloudflare Pages + 后端 Pages Functions + KV 存储**，全部白嫖，10 分钟上线。

## ✨ 特性

- ⚡ **Next.js 14** App Router，静态导出，部署到 Cloudflare 全球边缘网络
- 📝 **MDX** 写作 —— Markdown 里直接嵌入 React 组件
- 🌗 **暗色模式**（跟随系统 / 手动切换 / 持久化）
- 📡 **RSS / Sitemap / Robots** 全配齐
- 💬 **Giscus 评论**（基于 GitHub Discussions，可选）
- 👀 **阅读量统计**（Cloudflare Workers + KV，免费、实时、零运维）
- ⏱️ **自动计算阅读时长**
- 🏷️ **标签系统**
- 📱 响应式设计

## 🧱 架构

```
┌──────────────────────────────────────────┐
│           Cloudflare 边缘网络             │
│                                          │
│  ┌─────────────────┐    ┌─────────────┐  │
│  │  Pages (静态站)  │ →  │ Functions   │  │
│  │  - HTML/CSS/JS  │    │ (Workers)   │  │
│  │  - MDX 渲染结果  │    │ /api/views  │  │
│  └─────────────────┘    └──────┬──────┘  │
│                                │         │
│                         ┌──────▼──────┐  │
│                         │   KV 存储    │  │
│                         │  阅读量数据  │  │
│                         └─────────────┘  │
└──────────────────────────────────────────┘
```

## 🚀 快速开始

### 1. 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000

### 2. 写新文章

在 `content/posts/` 目录新建 `.mdx` 文件：

```mdx
---
title: "我的第一篇"
description: "简介"
date: "2026-07-01"
tags: ["随笔"]
---

## 正文

内容、代码、图片、引用……
```

### 3. 部署到 Cloudflare Pages（无需手机号 ✅）

#### 准备

1. 注册 https://github.com（如果还没有）
2. 注册 https://dash.cloudflare.com（**只要邮箱，不要手机号**）

#### 推送代码

```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/my-blog.git
git push -u origin main
```

**或者用 GitHub 网页直接拖文件**（参考之前的教程）

#### 在 Cloudflare 创建 KV

1. 登录 https://dash.cloudflare.com
2. 左侧菜单 → **Workers & Pages** → **KV**
3. 点 **Create a namespace**
4. 名字填 `VIEWS`（必须跟 `wrangler.toml` 里的 binding 名一致）
5. 创建完点进去，记下 **Namespace ID**

#### 部署项目

1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选你的 GitHub 仓库 → **Begin setup**
3. 构建设置：
   - **Framework preset**: Next.js (Static Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Environment variables**: 不用加
4. 点 **Save and Deploy**

#### 绑定 KV

部署完之后：

1. 项目页 → **Settings** → **Functions**
2. 滚到 **KV namespace bindings**
3. 点 **Add binding**：
   - **Variable name**: `VIEWS`（必须大写，必须跟代码里一致）
   - **KV namespace**: 选你刚创建的 `VIEWS`
4. 保存

#### 重新部署让 binding 生效

1. 项目页 → **Deployments** → 最新那次的右侧 **⋯** → **Retry deployment**
2. 等 1-2 分钟，重新部署

现在访问你的 Pages 域名，文章页应该能看到 👀 阅读量了。每次有人访问，数字 +1。

#### 绑定自己的域名（可选）

项目页 → **Custom domains** → **Set up a custom domain** → 按提示操作

## 💻 本地调试 Worker

需要先有 KV namespace（参考上面步骤）：

1. 修改 `wrangler.toml`，把 `REPLACE_WITH_YOUR_KV_ID` 替换成你的实际 ID
2. 跑：
   ```bash
   npm run build      # 先构建静态站
   npm run worker:dev # 启动本地 Pages 模拟环境
   ```
3. 打开 http://localhost:8788 测试

## ⚙️ 个性化配置

编辑 `src/app/site.config.ts`：

```ts
export const siteConfig = {
  name: "你的博客名",
  description: "博客简介",
  author: "你的名字",
  email: "you@example.com",
  github: "https://github.com/xxx",
  url: "https://my-blog.pages.dev",  // ← 改成你的 Pages 域名
  // ...
  views: { enabled: true },  // 关闭后文章页不再调用 API
  giscus: { enabled: false, ... },
};
```

## 🔧 进阶玩法

### 加一个"今日访问量"统计

在 `functions/api/views/[slug].ts` 里加个 daily namespace，或者在 KV 里存成 `slug:2026-07-13` 这种 key。

### 加访问来源记录

```ts
const referer = context.request.headers.get("referer") ?? "direct";
await context.env.VIEWS.put(`${slug}:refs`, JSON.stringify({ ... }));
```

### 加一个简易管理面板

在 `functions/admin/` 下加路由，用 Cloudflare Access 保护，自己能看到所有统计数据。

### 接入 Cloudflare Analytics

项目页 → **Analytics** → 开启，零配置，全球访问数据一目了然。

## 📁 项目结构

```
.
├── content/posts/             # 所有文章（.mdx）
├── functions/                 # Cloudflare Pages Functions
│   ├── api/views/[slug].ts   # 阅读量 API
│   └── types.d.ts            # Workers 类型声明
├── scripts/
│   └── generate-rss.mjs      # build 时生成 RSS
├── src/
│   ├── app/                  # Next.js 页面
│   ├── components/           # React 组件（含 ViewCounter）
│   └── lib/                  # 工具函数
├── wrangler.toml             # Cloudflare 配置
├── next.config.mjs           # 静态导出配置
└── package.json
```

## 💰 成本：完全免费

| 服务 | 免费额度 |
| --- | --- |
| Pages | 无限请求、无限流量 |
| Functions | 每天 10 万次请求 |
| KV | 10 万次读/天、1 万次写/天 |

个人博客**几年都用不完免费额度**。

## 📜 常用命令

```bash
npm run dev           # 本地开发
npm run build         # 构建生产版本（输出到 out/）
npm run worker:dev    # 本地调试 Worker（需要先 build）
npm run worker:deploy # 部署到 Cloudflare Pages
```

## 📄 License

MIT - 随便用，开心就好 ✨