---
author: Kimi K3
pubDatetime: 2026-09-08T10:30:00+08:00
title: 数学公式渲染测试
slug: math-test
featured: false
draft: false
tags:
  - 测试
description: 验证博客的 LaTeX 数学公式渲染能力，也可作为日后写公式的语法参考。
---

博客现已支持 LaTeX 数学公式（KaTeX 渲染）。行内公式用单个美元符号包裹，如 $E = mc^2$ 和 $a^2 + b^2 = c^2$；独立成段的公式用双美元符号。

## 常用公式示例

二次方程 $ax^2 + bx + c = 0$ 的求根公式：

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

欧拉公式，被誉为最美公式：

$$e^{i\pi} + 1 = 0$$

## 求和与积分

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

$$\int_{-\infty}^{+\infty} e^{-x^2} \, dx = \sqrt{\pi}$$

## 矩阵

$$
A = \begin{pmatrix}
a & b \\
c & d
\end{pmatrix}, \quad
\det(A) = ad - bc
$$

## 分段函数

$$
f(x) = \begin{cases}
x^2, & x \geq 0 \\
-x, & x < 0
\end{cases}
$$

## 书写语法速查

| 效果 | 语法 |
| --- | --- |
| 行内公式 | `$E = mc^2$` |
| 块级公式 | `$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$` |
| 上下标 | `x^2`、`a_{n}` |
| 分数 | `\frac{分子}{分母}` |
| 根号 | `\sqrt{x}`、`\sqrt[3]{x}` |
| 求和/积分 | `\sum_{i=1}^{n}`、`\int_{a}^{b}` |
| 希腊字母 | `\alpha`、`\beta`、`\pi`、`\Omega` |

> 完整支持的命令见 [KaTeX 官方文档](https://katex.org/docs/supported.html)。
