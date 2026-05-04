import { describe, it, expect } from "vitest";

import { formatRounded } from "../formatRounded";

describe("formatRounded", () => {
  it("returns integers without decimals", () => {
    expect(formatRounded(42, 9)).toBe("42");
  });

  it("preserves all decimals up to the cap", () => {
    expect(formatRounded(0.123456789, 9)).toBe("0.123456789");
  });

  it("trims trailing zeroes", () => {
    expect(formatRounded(1.5, 9)).toBe("1.5");
  });

  it("rounds beyond the decimal cap", () => {
    expect(formatRounded(0.1234567899, 9)).toBe("0.12345679");
  });

  it("respects the cap when given fewer decimals", () => {
    expect(formatRounded(0.123456, 2)).toBe("0.12");
  });

  it("preserves integer part for very large numbers (no significant-digit cap)", () => {
    expect(formatRounded(1234567890.5, 9).replace(/[\s,]/g, "")).toBe(
      "1234567890.5",
    );
  });

  it("handles zero", () => {
    expect(formatRounded(0, 9)).toBe("0");
  });

  it("uses locale grouping separators for thousands", () => {
    // Whatever the test runner locale is, there should be at least one digit-separator
    // glyph (comma, space, dot, NBSP, etc.) inserted between groups.
    const out = formatRounded(1234567, 0);
    expect(/[\d]+[^\d][\d]/.test(out)).toBe(true);
  });
});
