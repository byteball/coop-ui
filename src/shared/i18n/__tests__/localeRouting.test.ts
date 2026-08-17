import { describe, it, expect, vi, beforeEach } from "vitest";

import type * as ParaglideRuntime from "#/paraglide/runtime";
import {
  strategy,
  locales,
  baseLocale,
  localizeUrl,
  deLocalizeUrl,
  extractLocaleFromUrl,
} from "#/paraglide/runtime";
import { getLocaleBasepath } from "#/shared/i18n";

// Make getLocale() controllable for the getLocaleBasepath tests, while keeping
// every other paraglide runtime export real (localizeUrl, strategy, etc.).
const mock = vi.hoisted(() => ({ locale: "en" }));
vi.mock("#/paraglide/runtime", async (importOriginal) => {
  const actual = await importOriginal<typeof ParaglideRuntime>();
  return { ...actual, getLocale: () => mock.locale };
});

const ORIGIN = "http://localhost:4000";

beforeEach(() => {
  mock.locale = "en";
});

/**
 * These tests guard the URL-based i18n routing. The bug they protect against:
 * recompiling Paraglide with the cookie-only default strategy (e.g. via the bare
 * `paraglide-js compile` CLI, which can't express `urlPatterns`) disables URL
 * locale resolution. The router still derives its basepath from the locale, so
 * the locale and the URL prefix drift apart and switching languages produces a
 * stacked prefix like `/ru/uk/user/...` → 404. Always recompile with `pnpm i18n`.
 */
describe("paraglide URL routing config", () => {
  it("resolves the locale from the URL first", () => {
    expect(strategy[0]).toBe("url");
    expect(strategy).toContain("cookie");
  });

  it("exposes the configured locales", () => {
    expect([...locales]).toEqual(["en", "zh", "es", "ru", "uk"]);
    expect(baseLocale).toBe("en");
  });

  it("switches the locale prefix in place, without stacking (the reported bug)", () => {
    // /ru/user/X + switch to uk must become /uk/user/X, NOT /ru/uk/user/X
    expect(localizeUrl(`${ORIGIN}/ru/user/FSJ`, { locale: "uk" }).href).toBe(
      `${ORIGIN}/uk/user/FSJ`,
    );
  });

  it("adds the prefix when localizing from the base locale", () => {
    expect(localizeUrl(`${ORIGIN}/user/FSJ`, { locale: "ru" }).pathname).toBe(
      "/ru/user/FSJ",
    );
  });

  it("drops the prefix when switching back to the base locale (en)", () => {
    expect(
      localizeUrl(`${ORIGIN}/ru/user/FSJ`, { locale: "en" }).pathname,
    ).toBe("/user/FSJ");
  });

  it("extracts the locale from a prefixed URL", () => {
    expect(extractLocaleFromUrl(`${ORIGIN}/uk/governance`)).toBe("uk");
    expect(extractLocaleFromUrl(`${ORIGIN}/governance`)).toBe("en");
  });

  it("de-localizes back to the canonical (unprefixed) path", () => {
    expect(deLocalizeUrl(`${ORIGIN}/uk/user/FSJ`).pathname).toBe("/user/FSJ");
  });
});

describe("getLocaleBasepath", () => {
  it("returns an empty basepath for the base locale", () => {
    mock.locale = "en";
    expect(getLocaleBasepath()).toBe("");
  });

  it("returns a /<locale> basepath for non-base locales", () => {
    mock.locale = "ru";
    expect(getLocaleBasepath()).toBe("/ru");
    mock.locale = "uk";
    expect(getLocaleBasepath()).toBe("/uk");
  });

  it("matches the URL prefix produced by localizeUrl (router/URL consistency)", () => {
    // The router basepath must equal the prefix that localizeUrl puts on the URL,
    // otherwise navigation 404s. Verify they agree for every non-base locale.
    for (const locale of locales) {
      mock.locale = locale;
      const localizedPath = localizeUrl(`${ORIGIN}/governance`, {
        locale,
      }).pathname;
      const basepath = getLocaleBasepath();
      expect(localizedPath).toBe(`${basepath}/governance`);
    }
  });
});
