import { z } from "zod";

export const logSchema = z.object({
  id: z.string().optional(),
  date: z.date({
    required_error: "Date is required",
  }),
  labINR: z
    .number()
    .min(0)
    .max(10)
    .nullable()
    .optional(),
  homeINR: z
    .number()
    .min(0)
    .max(10)
    .nullable()
    .optional(),
  warfarinDose: z
    .number()
    .min(0)
    .max(50)
    .nullable()
    .optional(),
  injections: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  vitaminKIntake: z.string().nullable().optional(),
});

export type LogFormData = z.infer<typeof logSchema>;

export const settingsSchema = z.object({
  targetINRMin: z.number().min(0).max(5),
  targetINRMax: z.number().min(0).max(5),
  inrTestTime: z.string(), // e.g., "10:00"
  doseTime: z.string(), // e.g., "13:00"
  notificationsEnabled: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
