import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  // 从 fontsource 包本地读取字体（satori 不支持 woff2，使用 woff）
  // Maple Mono 负责英文，Noto Sans SC 负责中文（satori 逐字符回退）
  const [regularData, boldData, scRegularData, scBoldData] = await Promise.all([
    readFile(
      "node_modules/@fontsource/maple-mono/files/maple-mono-latin-400-normal.woff"
    ),
    readFile(
      "node_modules/@fontsource/maple-mono/files/maple-mono-latin-700-normal.woff"
    ),
    readFile(
      "node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-400-normal.woff"
    ),
    readFile(
      "node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-700-normal.woff"
    ),
  ]);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          background: "#fefbfb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Maple Mono, Noto Sans SC",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-1px",
                right: "-1px",
                border: "4px solid #000",
                background: "#ecebeb",
                opacity: "0.9",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2.5rem",
                width: "88%",
                height: "80%",
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                border: "4px solid #000",
                background: "#fefbfb",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                margin: "2rem",
                width: "88%",
                height: "80%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "20px",
                    width: "90%",
                    height: "90%",
                  },
                  children: [
                    {
                      type: "p",
                      props: {
                        style: {
                          fontSize: 72,
                          fontWeight: "bold",
                          maxHeight: "84%",
                          overflow: "hidden",
                        },
                        children: props.data.title,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginBottom: "8px",
                          fontSize: 28,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: [
                                "by ",
                                {
                                  type: "span",
                                  props: {
                                    style: { color: "transparent" },
                                    children: '"',
                                  },
                                },
                                {
                                  type: "span",
                                  props: {
                                    style: {
                                      overflow: "hidden",
                                      fontWeight: "bold",
                                    },
                                    children: props.data.author,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { overflow: "hidden", fontWeight: "bold" },
                              children: config.site.title,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: [
        {
          name: "Maple Mono",
          data: regularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Maple Mono",
          data: boldData,
          weight: 700,
          style: "normal",
        },
        {
          name: "Noto Sans SC",
          data: scRegularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Noto Sans SC",
          data: scBoldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
