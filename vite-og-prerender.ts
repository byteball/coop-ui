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

/**
 * Marker attribute placed on every prerender-emitted head tag. The client-side
 * head manager (`src/app/main.tsx`) removes elements carrying this attribute
 * on hydration so TanStack Router's `<HeadContent />` can render its own copy
 * without duplicates — same contract react-helmet uses with `data-rh`.
 */
const PRERENDER_ATTR = "data-prerender";

const buildHeadBlock = (route: SeoRoute, ogBase: string | undefined): string => {
  const ogUrl = ogBase
    ? new URL(route.ogImagePath, ogBase).toString()
    : null;
  const a = PRERENDER_ATTR;
  const tags: string[] = [
    `<title ${a}>${escapeHtml(route.title)}</title>`,
    `<meta ${a} name="description" content="${escapeHtml(route.description)}" />`,
    `<meta ${a} property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta ${a} property="og:type" content="website" />`,
    `<meta ${a} property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta ${a} property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta ${a} name="twitter:card" content="summary_large_image" />`,
    `<meta ${a} name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta ${a} name="twitter:description" content="${escapeHtml(route.description)}" />`,
  ];
  if (ogUrl) {
    tags.push(
      `<meta ${a} property="og:image" content="${escapeHtml(ogUrl)}" />`,
      `<meta ${a} name="twitter:image" content="${escapeHtml(ogUrl)}" />`,
    );
  }
  return tags.join("\n    ");
};

const TITLE_RE = /<title[^>]*>[\s\S]*?<\/title>/i;

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
