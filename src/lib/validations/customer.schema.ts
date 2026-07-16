import { z } from "zod";

export const customerQuerySchema = z.object({
  search: z.string().optional(),
  segment: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(50),
  sortBy: z
    .enum([
      "balance",
      "purchases",
      "cashAdvance",
      "creditLimit",
      "payments",
      "prcFullPayment",
      "tenure",
      "custId",
    ])
    .default("custId"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
