export const siteConfig = {
  name: "天寿小站",
  description: "记录、思考、分享",
  author: "Your Name",
  email: "you@example.com",
  github: "https://github.com/ts-zx",
  url: "https://tszx.zh.kg",
  language: "zh-CN",
  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于" },
  ],
  // 阅读量统计
  views: {
    enabled: true,
  },
  // 点赞功能
  likes: {
    enabled: true,
  },
  // giscus 评论 (基于 GitHub Discussions，去 https://giscus.app/zh-CN 配置)
  giscus: {
    enabled: false,
    repo: "ts-zx/myblog",
    repoId: "R_kgDOTXmh0Q",
    category: "Announcements",
    categoryId: "DIC_kwDOTXmh0c4DB3kT",
  },
};

export type SiteConfig = typeof siteConfig;
