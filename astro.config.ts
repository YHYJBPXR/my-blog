import { defineConfig, envField, svgoOptimizer } from "astro/config";
import type { AstroIntegration } from "astro";
import { writeFile } from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

// 构建完成后向 dist 写入 Cloudflare Workers 的 _headers 文件
// （不能放 public/：Astro 7 会把无扩展名文件当模块打包导致构建失败）
function cloudflareHeaders(): AstroIntegration {
  return {
    name: "cloudflare-headers",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const headers = `# 全站安全头
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

# 带哈希指纹的构建产物（CSS/JS/字体）：长期缓存
/_astro/*
  Cache-Control: public, max-age=31556952, immutable
`;
        await writeFile(new URL("_headers", dir), headers);
        logger.info("已生成 dist/_headers");
      },
    },
  };
}

export default defineConfig({
  site: config.site.url,
  integrations: [
    mdx(),
    cloudflareHeaders(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["zh-CN"],
    defaultLocale: "zh-CN",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
    shikiConfig: {
      themes: { light: "one-light", dark: "one-dark-pro" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
