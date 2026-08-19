import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { ogPrerender } from "./vite-og-prerender";
import { paraglideCompilerOptions } from "./paraglide.config.mjs";

/**
 * index.html ships a strict CSP via <meta>. A couple of allowed origins are
 * deploy-specific (the contribution-log API, Microsoft Clarity), so they can't
 * be hardcoded there — append them to the relevant directives at dev/build time
 * when the corresponding env var is set. Unset var → the CSP stays as tight as
 * it is in index.html.
 */
const cspExtraSources = (): Plugin => {
  const extra: Record<string, Array<string>> = {};
  const allow = (directive: string, ...sources: Array<string>) => {
    (extra[directive] ??= []).push(...sources);
  };
  return {
    name: "csp-extra-sources",
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), "VITE_");

      const url = env.VITE_CONTRIBUTION_LOG_URL;
      if (url) {
        try {
          allow("connect-src", new URL(url).origin);
        } catch {
          // invalid URL — the app's T3 env validation will fail loudly anyway
        }
      }

      if (env.VITE_CLARITY_PROJECT_ID) {
        // The tag is served from www.clarity.ms and telemetry is load-balanced
        // across regional *.clarity.ms hosts; c.bing.com is Clarity's Bing
        // integration. https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp
        allow("script-src", "https://*.clarity.ms");
        allow("connect-src", "https://*.clarity.ms", "https://c.bing.com");
      }
    },
    transformIndexHtml(html) {
      return Object.entries(extra).reduce(
        (acc, [directive, sources]) =>
          acc.replace(
            new RegExp(`${directive} ([^;]*);`),
            `${directive} $1 ${sources.join(" ")};`,
          ),
        html,
      );
    },
  };
};

const config = defineConfig({
  plugins: [
    cspExtraSources(),
    ogPrerender(),
    devtools(),
    paraglideVitePlugin(paraglideCompilerOptions),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    TanStackRouterVite({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});

export default config;
