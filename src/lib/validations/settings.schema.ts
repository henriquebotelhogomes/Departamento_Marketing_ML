import { z } from "zod";

export const segmentPatchSchema = z.object({
  clusterId: z.number().int().nonnegative(),
  label: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  recommendation: z.array(z.string().min(2)).optional(),
});

export const settingsPatchSchema = z.object({
  activeModelVersion: z.string().min(1).optional(),
  segments: z.array(segmentPatchSchema).optional(),
});

export type SettingsPatchInput = z.infer<typeof settingsPatchSchema>;
