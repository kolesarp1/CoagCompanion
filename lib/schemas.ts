import { z } from "zod";

export const logSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  labINR: z
    .union([z.number().min(0).max(10), z.null()])
    .optional(),
  homeINR: z
    .union([z.number().min(0).max(10), z.null()])
    .optional(),
  warfarinDose: z
    .union([z.number().int("Warfarin dose must be a whole number").min(0).max(50), z.null()])
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
