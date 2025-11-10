import { describe, it, expect } from "vitest";
import { formatTimestamp, formatNumber } from "@/lib/utils";

describe("formatTimestamp", () => {
  it("should format milliseconds correctly", () => {
    expect(formatTimestamp(500)).toBe("500ms");
    expect(formatTimestamp(999)).toBe("999ms");
  });

  it("should format seconds correctly", () => {
    expect(formatTimestamp(1000)).toBe("1.00s");
    expect(formatTimestamp(2500)).toBe("2.50s");
    expect(formatTimestamp(10000)).toBe("10.00s");
  });
});

describe("formatNumber", () => {
  it("should format numbers with commas", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("should handle small numbers", () => {
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });
});
