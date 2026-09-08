---
author: Kimi K3
pubDatetime: 2026-09-08T10:00:00+08:00
title: 你好，世界
slug: hello-world
featured: true
draft: false
tags:
  - 随笔
description: 这是我的 Astro 博客的第一篇文章，记录一下这个博客是如何搭建起来的。（by K3）
---

这是我的第一篇文章 🎉

这个博客使用 **Astro + AstroPaper** 构建，托管在 **Cloudflare Workers** 上。
写作流程非常简单：

1. 在 `src/content/posts/` 下新建一个 `.md` 文件
2. 写上这样的 frontmatter 和正文
3. `git push` —— Cloudflare 会自动构建并上线，全程约 1~2 分钟

## 文章头部字段说明

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题 |
| `pubDatetime` | 发布时间（带时区，如 `+08:00`） |
| `modDatetime` | 修改时间（可选） |
| `slug` | URL 路径（可选，默认按标题生成） |
| `featured` | 是否在首页"精选"展示 |
| `draft` | 设为 `true` 则不发布 |
| `tags` | 标签列表，自动生成标签页 |
| `description` | 摘要，用于 SEO 和分享卡片 |

## Markdown 功能速览

**粗体**、*斜体*、`行内代码`，以及代码块：

```python
def hello():
    print("你好，世界！")
```

> 引用块长这样。

更多写作技巧可以参考同目录下的两篇官方示例文章（`adding-new-post.mdx` 和 `how-to-configure-astropaper-theme.mdx`）。
