import { describe, expect, it } from "vitest";

import { mapCsvRowToCustomer } from "@/lib/csv/mapping";

describe("csv/mapping", () => {
  it("mapeia row para objeto customer basico", () => {
    const mapped = mapCsvRowToCustomer({
      CUST_ID: "C10001",
      BALANCE: "100.5",
      PURCHASES: "200.0",
      CREDIT_LIMIT: "1500",
    });

    expect(mapped.custId).toBe("C10001");
    expect(mapped.balance).toBe(100.5);
    expect(mapped.creditLimit).toBe(1500);
  });

  it("mapeia credit limit vazio como null", () => {
    const mapped = mapCsvRowToCustomer({
      CUST_ID: "C10002",
      BALANCE: "0",
      PURCHASES: "0",
      CREDIT_LIMIT: "",
    });

    expect(mapped.creditLimit).toBeNull();
  });
});
