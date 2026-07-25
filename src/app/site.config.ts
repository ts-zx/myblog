export const siteConfig = {
  name: "中出博客",
  description: "记录、思考、分享",
  author: "TSZX.",
  email: "399172250@qq.com",
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
  // giscus 评论 (基于 GitHub Discussions)
  giscus: {
    enabled: true,
    repo: "ts-zx/myblog",
    repoId: "R_kgDOTXmh0Q",
    category: "Announcements",          // ← 改成你仓库里的分类
    categoryId: "",                      // ← 留空，下面有获取方法
  },
};

export type SiteConfig = typeof siteConfig;