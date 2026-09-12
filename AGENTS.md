# AGENTS.md — 给 AI Agent 的项目指南

> 本文档面向在本仓库中工作的 AI coding agent。读完这份文档，你应该能在不重新踩坑的前提下完成本博客的任何常见任务。
> 人类读者请移步 [README.md](./README.md)。

## 1. 项目概况

- **是什么**：YHYJ 的个人博客，Astro 7 + AstroPaper 6.1 主题（深度定制版）
- **线上地址**：https://my-blog.yhyjbpxrf.workers.dev/
- **托管**：Cloudflare Workers 静态资产（非 Pages），GitHub 仓库 `YHYJBPXR/my-blog` 连接自动构建
- **语言/主题**：全站中文 UI，配色 One Dark Pro（暗）/ One Light（亮），字体 Maple Mono + Maple Mono CN
- **包管理**：**pnpm**（不要用 npm/yarn，存在 pnpm-lock.yaml）

## 2. 关键路径

| 路径 | 说明 |
| --- | --- |
| `src/content/posts/` | 博客文章（.md/.mdx），frontmatter schema 见 `src/content.config.ts` |
| `src/content/pages/` | 独立页面（如 about.md） |
| `astro-paper.config.ts` | **站点主配置**（标题/作者/URL/socials/功能开关） |
| `astro.config.ts` | Astro 配置（i18n、markdown 管线、shiki、自定义集成） |
| `wrangler.jsonc` | Cloudflare 部署配置（**必须存在**，见 4.1） |
| `src/styles/theme.css` | 主题色 CSS 变量（7 个变量 × 亮/暗两套） |
| `src/styles/typography.css` | 文章排版样式（prose 定制，含数学公式修复） |
| `src/i18n/lang/zh-CN.ts` | 中文 UI 语言包（自建的，主题原本只有 en.ts） |
| `src/layouts/Layout.astro` | 全站布局（字体 CSS 引入、Web Analytics） |
| `src/layouts/PostLayout.astro` | 文章页布局（引入 KaTeX CSS） |

## 3. 常用命令

```bash
pnpm dev      # 本地预览 http://localhost:4321
pnpm build    # 构建（含 astro check + pagefind），输出 dist/
```

**发布文章**：`git add -A && git commit -m "post: 标题" && git push`，Cloudflare 1~2 分钟自动上线。无需其他操作。

## 4. 部署机制（重要）

### 4.1 为什么 wrangler.jsonc 必须存在

没有它时，Cloudflare 的 `wrangler deploy` 会自动执行 `astro add cloudflare` 注入 SSR 适配器并重建——该适配器版本与 Astro 7 不兼容，构建必败。`wrangler.jsonc` 声明纯静态资产模式（`assets.directory = ./dist/`，`not_found_handling = 404-page`）后，auto-config 会跳过。**删除此文件 = 部署爆炸**。

### 4.2 Cloudflare 侧的 UI 配置（不在仓库里）

- Build command: `pnpm build`，Output: `dist`
- 环境变量 `NODE_VERSION=22`（默认 Node 版本过低会导致构建失败）

### 4.3 `_headers` 的生成方式

安全头/缓存头通过 `astro.config.ts` 里的 `cloudflareHeaders()` 集成在 `astro:build:done` 钩子写入 `dist/_headers`。**不要**把 `_headers` 放进 `public/`——Astro 7 会把无扩展名文件当 JS 模块打包导致构建失败。

## 5. 定制点与硬约束（改动前必读）

### 5.1 构建期零外网依赖（国内网络环境）

- **禁止**任何构建时需要访问外网的方案：Google Fonts（被墙）、Astro fonts API（从 cdn.jsdelivr.net 拉字体，失败过）
- 字体一律走本地：英文 Maple Mono 用 `@fontsource/maple-mono` 的 JS CSS 引入（在 `Layout.astro` frontmatter）；中文用 `@chinese-fonts/maple-mono-cn` 分片包（unicode-range 按需加载）
- 中文分片包会产生 400+ 个 woff2 打进 dist，**这是正常的**（浏览器只取所需分片）

### 5.2 数学公式（KaTeX）

- 管线：unified 处理器 + `remark-math` + `rehype-katex`
- **katex 版本必须保持 ^0.16.x**：rehype-katex@7 内部用 katex 0.16 渲染（HTML 类名 `.sizing`），若顶层 katex 升到 0.18（CSS 类名 `.katex-sizing`），sizing 规则全部失配 → 上标/分数布局崩坏。升级 rehype-katex 前检查其对齐的 katex 版本
- KaTeX CSS 只在 `PostLayout.astro` 引入（未分层样式）
- **覆盖 KaTeX 样式时必须写在 `@layer` 外**（见 5.4）
- 公式字号：1.35em（在 `typography.css` 末尾，层外）

### 5.3 暗色模式公式颜色

`--tw-prose-body`（Tailwind Typography 默认 gray-700，不随主题）已在 `typography.css` 覆盖为 `var(--foreground)`。删除会导致暗色模式下块级公式几乎不可见。

### 5.4 CSS 层叠层（Cascade Layers）陷阱

`typography.css` 主体在 `@layer base` 内，而 `katex.min.css` 是未分层样式。**未分层 > 任何分层**，与特异性无关。凡是覆盖第三方（未分层）样式的规则，一律写到层外。

### 5.5 OG 图生成（satori + sharp）

- `src/pages/og.png.ts` 与 `src/pages/posts/[...slug]/index.png.ts`
- 字体从 node_modules 直接读 woff（**satori 不支持 woff2**）：Maple Mono（拉丁）+ Noto Sans SC（中文回退，satori 逐字符回退）
- 不要改回 Astro fonts API 的 `fontData`/`experimental_getFontFileURL`（依赖 5.1 所述的被禁方案）

### 5.6 其他

- `editPost` 已禁用（astro-paper.config.ts）；type 是联合类型，`enabled: false` 时不允许带 `url` 字段
- `socials`/`shareLinks` 支持注释掉不需要的项
- Cloudflare Web Analytics token 硬编码在 `Layout.astro`（无密级，可提交）
- `src/components/Breadcrumb.astro` 改过：分页文案用 `tplStr` 占位符（`第 {{page}} 页`），同步改了 `en.ts`/`zh-CN.ts` 的 `pagination.page` 格式

## 6. 写作规范

frontmatter（schema 强制校验，构建时报错）：

```yaml
---
author: Kimi K3           # 可省，默认取全局 author
pubDatetime: 2026-09-08T10:00:00+08:00  # 必须带时区；未来时间 = 定时发布（>15min 容差不构建）
title: 标题
slug: url-slug            # 可选
featured: true            # 可选，首页精选
draft: true               # 可选，草稿不发布
tags: [标签1, 标签2]
description: 摘要（必填，SEO 用）
---
```

- 文件名以 `_` 开头会被 loader 完全忽略（真隐藏）
- 数学公式：`$行内$`、`$$块级$$`，`$` 与内容间不留空格
- Callout：`> [!note]` / `> [!warning]` / `> [!tip]`
- 代码块行内标记：`// [!code highlight]`、`// [!code ++]`、`// [!code --]`、`// [!code word:xxx]`
- 折叠目录：标题写 `## Table of contents`

## 7. 本机环境（Windows + Scoop）

- Node 24 / pnpm 均通过 Scoop 安装；**bash 会话不保留 cwd，每条命令都要先 `cd /c/Users/YHYJ/my-blog`**
- Git 认证：系统 gitconfig 已修 `credential.helper = manager`（原 `helper-selector` 会在非交互终端挂起 push）；首次 push 需用户在 GCM 弹窗中完成浏览器授权
- Headless Chrome（截图验证用）：`C:\Users\YHYJ\scoop\apps\googlechrome\current\chrome.exe`
  - 截图：`chrome --headless --disable-gpu --virtual-time-budget=25000 --window-size=1000,2400 --screenshot=out.png <url>`
  - 注意系统深色模式下截图即暗色主题；图片查看/裁剪可用项目内 `sharp`
  - 调样式问题可用 `--remote-debugging-port` + CDP `Runtime.evaluate` 查计算样式（Node 24 自带 WebSocket）

## 8. 排障速查表

| 症状 | 先看 |
| --- | --- |
| Cloudflare 构建失败 `renderForPrerender` | `wrangler.jsonc` 是否被删 |
| 构建失败 CannotFetchFontFile | 引入了构建期外网字体方案（禁止，见 5.1） |
| 文章 404 但构建成功 | `pubDatetime` 是否在未来；文件名是否 `_` 开头 |
| 公式上标/分数布局崩 | katex 是否被升到 0.18（必须 ^0.16） |
| 改了 CSS 不生效 | 规则是否写在 `@layer` 内（见 5.4）；线上 CSS hash 是否已更新 |
| OG 图中文豆腐块 | OG 路由的中文字体回退是否被移除 |
| push 挂起无响应 | `credential.helper` 是否变回 helper-selector |
