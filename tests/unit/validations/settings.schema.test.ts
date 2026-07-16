import { describe, expect, it } from "vitest";

import { settingsPatchSchema } from "@/lib/validations/settings.schema";

describe("validations/settings.schema", () => {
  it("valida payload de patch", () => {
    const result = settingsPatchSchema.safeParse({
      activeModelVersion: "v1",
      segments: [{ clusterId: 1, label: "Novo label" }],
    });

    expect(result.success).toBe(true);
  });
});
