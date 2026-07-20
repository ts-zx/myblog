export const siteConfig = {
  name: "我的小站",
  description: "记录、思考、分享",
  author: "TSZX.",
  email: "399172250@qq.com",
  github: "https://github.com/ts-zx",
  twitter: "https://twitter.com/yourname",
  url: "https://tszx.zh.kg",
  language: "zh-CN",
  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于" },
  ],
  // 阅读量统计 (需配合 Cloudflare Pages + KV)
  views: {
    enabled: true,
  },
  // giscus 评论 (可选：填了就启用)
  giscus: {
    enabled: false,
    repo: "yourname/yourname.github.io",
    repoId: "",
    category: "Announcements",
    categoryId: "",
  },
};

export type SiteConfig = typeof siteConfig;
