import { z } from "zod";

const demoEmail = "demo123";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .refine(
      (value) => value === demoEmail || z.string().email().safeParse(value).success,
      "Informe um email válido ou use demo123",
    ),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Informe um email válido").refine((value) => value !== demoEmail, {
      message: "demo123 é reservado para acesso demo",
    }),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmação de senha obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
