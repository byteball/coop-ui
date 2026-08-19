// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";

import { env } from "#/shared/config/env";
import { initClarity, setClarityTag, trackClarityEvent } from "../clarity";

vi.mock("#/shared/config/env", () => ({
  env: { VITE_CLARITY_PROJECT_ID: undefined },
}));

vi.mock("#/shared/i18n", () => ({ getLocale: () => "en" }));

const mutableEnv = env as { VITE_CLARITY_PROJECT_ID: string | undefined };

const clarityScript = () =>
  document.getElementById("clarity-script") as HTMLScriptElement | null;

describe("clarity", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    delete window.clarity;
    mutableEnv.VITE_CLARITY_PROJECT_ID = undefined;
  });

  it("does nothing without a project id", () => {
    initClarity();
    expect(clarityScript()).toBeNull();
    expect(window.clarity).toBeUndefined();
  });

  it("commands are no-ops while Clarity is disabled", () => {
    expect(() => {
      setClarityTag("locale", "en");
      trackClarityEvent("deposit");
    }).not.toThrow();
  });

  it("injects the tag and queues the session tag", () => {
    mutableEnv.VITE_CLARITY_PROJECT_ID = "abc123";
    initClarity();

    expect(clarityScript()?.src).toBe("https://www.clarity.ms/tag/abc123");
    expect(clarityScript()?.async).toBe(true);
    expect(window.clarity?.q).toEqual([["set", "locale", "en"]]);
  });

  it("queues later commands until the remote tag takes over", () => {
    mutableEnv.VITE_CLARITY_PROJECT_ID = "abc123";
    initClarity();
    trackClarityEvent("deposit");

    expect(window.clarity?.q).toContainEqual(["event", "deposit"]);
  });

  it("does not inject the tag twice", () => {
    mutableEnv.VITE_CLARITY_PROJECT_ID = "abc123";
    initClarity();
    initClarity();

    expect(document.querySelectorAll("#clarity-script")).toHaveLength(1);
    expect(window.clarity?.q).toHaveLength(1);
  });
});
