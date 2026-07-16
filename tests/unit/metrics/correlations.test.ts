import { describe, expect, it } from "vitest";

import { pearsonCorrelation } from "@/lib/metrics/correlations";

describe("metrics/correlations", () => {
  it("calcula correlacao positiva", () => {
    const corr = pearsonCorrelation([1, 2, 3], [2, 4, 6]);
    expect(corr).toBeGreaterThan(0.99);
  });

  it("retorna 0 com vetores invalidos", () => {
    expect(pearsonCorrelation([], [])).toBe(0);
  });

  it("retorna 0 quando variancia e zero", () => {
    expect(pearsonCorrelation([1, 1, 1], [2, 2, 2])).toBe(0);
  });
});
