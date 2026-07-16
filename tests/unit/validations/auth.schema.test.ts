import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";

describe("validations/auth.schema", () => {
  it("aceita demo123 no login", () => {
    const result = loginSchema.safeParse({ email: "demo123", password: "demo123" });
    expect(result.success).toBe(true);
  });

  it("rejeita confirmacao de senha diferente", () => {
    const result = registerSchema.safeParse({
      name: "Henri",
      email: "henri@teste.com",
      password: "123456",
      confirmPassword: "999999",
    });
    expect(result.success).toBe(false);
  });
});
