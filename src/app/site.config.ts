export const siteConfig = {
  // ====== 基础信息 ======
  name: "天寿的小站",
  description: "记录、思考、分享",
  author: "TSZX.",
  email: "me@furui.de5.net",
  github: "https://github.com/ts-zx",
  url: "https://tszx.zh.kg",
  language: "zh-CN",

  // ====== 导航菜单 ======
  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于" },
  ],

  // ====== 阅读量统计 ======
  views: {
    enabled: true,
  },

  // ====== 点赞功能 ======
  likes: {
    enabled: true,
  },

  // ====== giscus 评论系统 ======
  giscus: {
    enabled: true,
    repo: "ts-zx/myblog-comments",        // ← 改了（原来 myblog，现在 -comments）
    repoId: "R_kgDOUas_Sg",                // ← 改了（新 ID）
    category: "Announcements",
    categoryId: "DIC_kwDOUas_Ss4DFl4N", // ← 改了（新 ID）
  },
};

export type SiteConfig = typeof siteConfig;
