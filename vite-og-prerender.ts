import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { loadEnv } from "vite";

import {
  SITE_NAME,
  seoRoutes,
  type SeoRoute,
} from "./src/shared/config/seoRoutes";

import type { Plugin } from "vite";

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildHeadBlock = (route: SeoRoute, ogBase: string | undefined): string => {
  const ogUrl = ogBase
    ? new URL(route.ogImagePath, ogBase).toString()
    : null;
  const tags: string[] = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
  ];
  if (ogUrl) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(ogUrl)}" />`,
      `<meta name="twitter:image" content="${escapeHtml(ogUrl)}" />`,
    );
  }
  return tags.join("\n    ");
};

const TITLE_RE = /<title>[^<]*<\/title>/;

export const ogPrerender = (): Plugin => {
  let ogBase: string | undefined;
  return {
    name: "og-prerender",
    apply: "build",
    config(_config, env) {
      const loaded = loadEnv(env.mode, process.cwd(), "VITE_");
      ogBase = loaded.VITE_OG_URL || undefined;
    },
    closeBundle: {
      sequential: true,
      async handler() {
        const distDir = resolve("dist");
        const indexPath = resolve(distDir, "index.html");
        const baseHtml = readFileSync(indexPath, "utf8");

        if (!TITLE_RE.test(baseHtml)) {
          this.warn(
            "og-prerender: <title> placeholder not found in dist/index.html; skipping",
          );
          return;
        }

        for (const route of seoRoutes) {
          const headBlock = buildHeadBlock(route, ogBase);
          const html = baseHtml.replace(TITLE_RE, headBlock);
          const outPath =
            route.path === "/"
              ? indexPath
              : resolve(distDir, route.path.replace(/^\//, ""), "index.html");
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, html);
        }
      },
    },
  };
};
