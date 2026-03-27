import { describe, it, expect, vi, afterEach } from "vitest";
import { formatPeriod } from "../formatPeriod";

const NOW_SEC = 1700000000; // fixed "now" in seconds

function mockNow() {
  vi.spyOn(Date, "now").mockReturnValue(NOW_SEC * 1000);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("formatPeriod", () => {
  it('returns "0 minutes" when the period has already passed', () => {
    mockNow();
    expect(formatPeriod(NOW_SEC - 1)).toBe("0 minutes");
  });

  it('returns "0 minutes" when periodEndTs equals now', () => {
    mockNow();
    expect(formatPeriod(NOW_SEC)).toBe("0 minutes");
  });

  it("formats minutes only (< 1 hour)", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 5 * 60)).toBe("5 minutes");
  });

  it('returns "1 minute" (singular) for exactly 1 minute', () => {
    mockNow();
    // 60–119 seconds → 1 minute
    expect(formatPeriod(NOW_SEC + 60)).toBe("1 minute");
  });

  it("formats hours and minutes", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 2 * 3600 + 15 * 60)).toBe("2h 15m");
  });

  it("formats hours only when minutes are 0", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 3 * 3600)).toBe("3h");
  });

  it("formats days, hours, and minutes", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 3 * 86400 + 4 * 3600 + 12 * 60)).toBe(
      "3 days 4h 12m",
    );
  });

  it("formats 1 day (singular)", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 86400)).toBe("1 day");
  });

  it("formats days and hours without minutes", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 2 * 86400 + 5 * 3600)).toBe("2 days 5h");
  });

  it("formats days only", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 7 * 86400)).toBe("7 days");
  });

  it("handles large values (365 days)", () => {
    mockNow();
    expect(formatPeriod(NOW_SEC + 365 * 86400)).toBe("365 days");
  });

  it('shows "0 minutes" for less than 60 seconds remaining', () => {
    mockNow();
    // 30 seconds remaining → 0 full minutes, but parts is empty → shows "0 minutes"
    expect(formatPeriod(NOW_SEC + 30)).toBe("0 minutes");
  });
});
