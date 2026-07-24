export const siteConfig = {
  name: "我的小站",
  description: "记录、思考、分享",
  author: "Your Name",
  email: "you@example.com",
  github: "https://github.com/yourname",
  url: "https://myblog-xr5.pages.dev",
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
    repo: "yourname/yourname.github.io",
    repoId: "",
    category: "Announcements",
    categoryId: "",
  },
};

export type SiteConfig = typeof siteConfig;