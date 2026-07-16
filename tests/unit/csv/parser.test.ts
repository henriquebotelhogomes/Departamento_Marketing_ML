import { describe, expect, it } from "vitest";

import { parseCsv } from "@/lib/csv/parser";

describe("csv/parser", () => {
  it("parseia csv com header", () => {
    const rows = parseCsv<{ CUST_ID: string }>("CUST_ID\nC10001\nC10002\n");
    expect(rows).toHaveLength(2);
    expect(rows[0]?.CUST_ID).toBe("C10001");
  });

  it("falha quando csv esta invalido", () => {
    expect(() => parseCsv("\"nao fechado")).toThrow();
  });
});
