import { z } from "zod";

export const logSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  labINR: z
    .number()
    .min(0, "Lab INR must be at least 0")
    .max(10, "Lab INR must be at most 10")
    .nullable()
    .optional()
    .or(z.literal(undefined)),
  homeINR: z
    .number()
    .min(0, "Home INR must be at least 0")
    .max(10, "Home INR must be at most 10")
    .nullable()
    .optional()
    .or(z.literal(undefined)),
  warfarinDose: z
    .number()
    .int("Warfarin dose must be a whole number")
    .min(0, "Warfarin dose must be at least 0")
    .max(50, "Warfarin dose must be at most 50")
    .nullable()
    .optional()
    .or(z.literal(undefined)),
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
