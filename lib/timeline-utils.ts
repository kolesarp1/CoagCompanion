import { Log } from "./types";
import { DayHistoryItem } from "@/components/timeline/types";
import { getINRStatus } from "./utils";

/**
 * Get local date string in YYYY-MM-DD format without timezone conversion
 * @param date Date object
 * @returns Date string in YYYY-MM-DD format
 */
function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get last 7 days of history including today
 * @param logs Array of log entries
 * @param targetMin Minimum target INR
 * @param targetMax Maximum target INR
 * @returns Array of 7 DayHistoryItem objects (most recent first)
 */
export function getLast7Days(
  logs: Log[],
  targetMin: number,
  targetMax: number
): DayHistoryItem[] {
  const result: DayHistoryItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to midnight for date comparison

  // Create a map of logs by date (YYYY-MM-DD format) for quick lookup
  // If multiple logs exist for same day, keep the one with latest timestamp
  const logsByDate = new Map<string, Log>();
  logs.forEach((log) => {
    const logDate = new Date(log.date);
    const dateKey = getLocalDateString(logDate);

    const existing = logsByDate.get(dateKey);
    if (!existing || new Date(log.date) > new Date(existing.date)) {
      logsByDate.set(dateKey, log);
    }
  });

  // Iterate backward from today to today-6 (7 days total)
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dateKey = getLocalDateString(date);
    const log = logsByDate.get(dateKey) || null;

    // Get INR value (prioritize homeINR, fallback to labINR)
    let inr: number | null = null;
    if (log) {
      inr = log.homeINR ?? log.labINR ?? null;
    }

    const inrStatus = getINRStatus(inr, targetMin, targetMax);

    result.push({
      date: date.toISOString(),
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      shortDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      log,
      inr,
      dose: log?.warfarinDose ?? null,
      inrStatus,
    });
  }

  return result;
}

/**
 * Get sparkline data (INR values) for the last 7 days up to and including the specified day
 * @param logs Array of log entries
 * @param currentDayIndex Index of the current day (0 = today, 6 = 7 days ago)
 * @returns Array of INR values for sparkline (filtered to remove nulls)
 */
export function getSparklineData(logs: Log[], currentDayIndex: number): number[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the date for the current day being displayed
  const currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - currentDayIndex);

  // Get all logs up to and including currentDate
  const relevantLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate <= currentDate;
  });

  // Sort by date ascending
  const sortedLogs = [...relevantLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get last 7 INR values (or fewer if not enough data)
  const inrValues: number[] = [];
  for (let i = sortedLogs.length - 1; i >= 0 && inrValues.length < 7; i--) {
    const log = sortedLogs[i];
    const inr = log.homeINR ?? log.labINR;
    if (inr !== null && inr !== undefined) {
      inrValues.unshift(inr); // Add to beginning to maintain chronological order
    }
  }

  return inrValues;
}

/**
 * Format vitamin K intake category for display
 * @param vitaminKIntake Raw vitamin K intake value
 * @returns Formatted display string
 */
export function formatVitaminK(vitaminKIntake: string | null | undefined): string {
  if (!vitaminKIntake) return "None";

  const normalized = vitaminKIntake.toLowerCase();
  if (normalized.includes("low")) return "Low";
  if (normalized.includes("medium")) return "Medium";
  if (normalized.includes("high")) return "High";
  if (normalized.includes("extra")) return "Extra High";

  return vitaminKIntake; // Return original if custom value
}

/**
 * Get background color class for vitamin K badge
 * @param vitaminKIntake Raw vitamin K intake value
 * @returns Tailwind CSS classes for background color
 */
export function getVitaminKColor(vitaminKIntake: string | null | undefined): string {
  if (!vitaminKIntake) return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";

  const normalized = vitaminKIntake.toLowerCase();
  if (normalized.includes("low")) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
  if (normalized.includes("medium")) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
  if (normalized.includes("high") && !normalized.includes("extra")) return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
  if (normalized.includes("extra")) return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";

  return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"; // Custom values
}
