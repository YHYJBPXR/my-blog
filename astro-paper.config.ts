import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://my-blog.yhyjbpxrf.workers.dev/",
    title: "YHYJ Blog",
    description: "从零开始的异世界生活！",
    author: "YHYJ",
    profile: "https://example.com",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
      // 如需恢复，设置 enabled: true 并加上:
      // url: "https://github.com/YHYJBPXR/my-blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/YHYJBPXR" },
    { name: "mail",     url: "mailto:YHYJBPXR@outlook.com" },
    // { name: "x",        url: "https://x.com/username" },
    // { name: "linkedin", url: "https://www.linkedin.com/in/username/" },
  ],
  shareLinks: [
    // { name: "whatsapp", url: "https://wa.me/?text=" },
    // { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    // { name: "x",        url: "https://x.com/intent/post?url=" },
    // { name: "telegram", url: "https://t.me/share/url?url=" },
    // { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    // { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});