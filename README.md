# YHYJ Blog

我的个人博客，记录学习与生活。

- **框架**：[Astro](https://astro.build/) 7 + [AstroPaper](https://github.com/satnaing/astro-paper) 主题
- **托管**：Cloudflare Workers（静态资产）
- **字体**：[Maple Mono](https://github.com/subframe7536/maple-font) + Maple Mono CN
- **主题色**：One Dark Pro / One Light

## 写作

在 `src/content/posts/` 下新建 `.md` 文件，参考现有文章的 frontmatter 格式：

```md
---
author: YHYJ
pubDatetime: 2026-09-08T10:00:00+08:00
title: 文章标题
tags:
  - 标签
description: 文章摘要
---

正文……
```

## 常用命令

```bash
pnpm dev    # 本地预览 http://localhost:4321
pnpm build  # 构建到 dist/
```

push 到 `main` 分支后 Cloudflare 自动构建部署。
