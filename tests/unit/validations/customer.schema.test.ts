import { describe, expect, it } from "vitest";

import { customerQuerySchema } from "@/lib/validations/customer.schema";

describe("validations/customer.schema", () => {
  it("aplica defaults da query", () => {
    const result = customerQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(50);
  });
});
