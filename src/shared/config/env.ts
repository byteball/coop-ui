import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_AA_ADDRESS: z.string().length(32),
    VITE_TESTNET: z
      .enum(["true", "false"])
      .optional()
      .transform((v) => v === "true"),
    VITE_OG_URL: z.url().optional(),
    // Base URL of the contribution-log API; when unset, the Contributions
    // block on the user page is not rendered at all.
    VITE_CONTRIBUTION_LOG_URL: z.url().optional(),
    // Discord forum channel URL (https://discord.com/channels/<guild>/<channel>);
    // shown as a "Forum" link on the Contributions card when set.
    VITE_DISCORD_FORUM_URL: z.url().optional(),
    // Microsoft Clarity project id. When unset, the Clarity tag is never
    // loaded and the CSP is not widened for clarity.ms.
    VITE_CLARITY_PROJECT_ID: z.string().min(1).optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: import.meta.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
