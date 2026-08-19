import { env } from "#/shared/config/env";
import { getLocale } from "#/shared/i18n";

/**
 * Microsoft Clarity — session recordings and heatmaps.
 *
 * Inactive unless `VITE_CLARITY_PROJECT_ID` is set, so local dev and any
 * self-hosted build send nothing by default. The CSP in `index.html` is
 * likewise widened for clarity.ms only when that variable is present (see the
 * `csp-extra-sources` plugin in `vite.config.ts`).
 *
 * The loader below is the official Clarity snippet, inlined rather than pulled
 * from `@microsoft/clarity`: the package is a ~30-line wrapper that throws when
 * its methods are called before `init`, and the documented `<script>` snippet
 * would need a CSP `'unsafe-inline'` exception — a bundled module is
 * `script-src 'self'`.
 *
 * Clarity proxies `history.pushState`/`replaceState`, so TanStack Router
 * navigations are recorded as page views without any wiring on our side.
 */

type ClarityCommand = ((...args: Array<unknown>) => void) & {
  q?: Array<Array<unknown>>;
};

declare global {
  interface Window {
    clarity?: ClarityCommand;
  }
}

const SCRIPT_ID = "clarity-script";

const call = (...args: Array<unknown>): void => {
  // No-op until (and unless) `initClarity` installed the queueing stub.
  window.clarity?.(...args);
};

/** Attaches a custom dimension to the session — Clarity's `set` command. */
export const setClarityTag = (key: string, value: string): void => {
  call("set", key, value);
};

/** Records a custom event, filterable in the Clarity dashboard. */
export const trackClarityEvent = (name: string): void => {
  call("event", name);
};

export function initClarity(): void {
  const projectId = env.VITE_CLARITY_PROJECT_ID;
  if (!projectId) return;
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;

  // Queues commands issued before the remote tag finishes loading; the tag
  // replays `window.clarity.q` once it takes over the global.
  window.clarity =
    window.clarity ||
    function (...args: Array<unknown>) {
      const stub = window.clarity!;
      (stub.q = stub.q || []).push(args);
    };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  document.head.appendChild(script);

  // Deliberately no wallet address and no `identify` call: sessions stay
  // pseudonymous, tagged only with the UI language they ran on.
  setClarityTag("locale", getLocale());
}
