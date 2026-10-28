export const siteConfig = {
  name: "天寿的小站",
  description: "记录、思考、分享",
  author: "TSZX.",
  email: "me@furui.de5.net",
  github: "https://github.com/ts-zx",
  url: "https://tszx.zh.kg",
  language: "zh-CN",
  nav: [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于" },
  ],

  // ============================================================
  // 多站点配置 - 按访问域名自动识别显示哪个站点
  // ============================================================
  // hosts: 该站点接受的域名（用于浏览器端判断当前在哪个站）
  // url:   该站点的规范地址（切换站点时跳转用）
  // defaultLocale: 该站点的默认语言
  // locales: 该站点支持的语言（切换器里只列出这些）
  defaultSite: "cn" as "cn" | "intl",
  sites: {
    cn: {
      label: "中国站",
      description: "中国大陆访问 · EdgeOne 加速",
      url: "https://tszx.zh.kg",
      hosts: ["tszx.zh.kg"],
      defaultLocale: "zh-CN" as const,
      locales: ["zh-CN", "zh-TW"] as const,
    },
    intl: {
      label: "国际站",
      description: "海外访问 · Cloudflare 直连",
      url: "https://www.tszx.zh.kg",
      hosts: ["www.tszx.zh.kg"],
      defaultLocale: "en" as const,
      locales: ["zh-CN", "zh-TW", "en"] as const,
    },
  },

  // 阅读量统计
  views: {
    enabled: true,
  },
  // 点赞功能
  likes: {
    enabled: true,
  },
  // 评论系统：twikoo（自托管，国内快）| giscus（基于 GitHub Discussions）
  commentSystem: "twikoo" as "twikoo" | "giscus",
  // Twikoo - 自托管，全 Cloudflare 栈，国内访问快
  twikoo: {
    enabled: true,
    // 👇 部署 Twikoo 后端（Cloudflare Worker）拿到的地址
    envId: "https://twikoo.tszx.zh.kg",
    // 可选：自托管的 twikoo JS 路径（更快，不依赖 CDN）
    // 放到 public/twikoo/twikoo.all.min.js
    jsUrl: "",
    lang: "zh-CN",
    // 区域：ap-shanghai（上海）/ ap-guangzhou（广州）/ ap-beijing（北京）
    region: "ap-shanghai",
  },
  // giscus - 备用方案，评论区存在公开 GitHub 仓库
  giscus: {
    enabled: true,
    repo: "ts-zx/myblog-comments",
    repoId: "R_kgDOUas_Sg",
    category: "Announcements",
    categoryId: "DIC_kwDOUas_Ss4DFl4N",
  },
};

export type SiteConfig = typeof siteConfig;
