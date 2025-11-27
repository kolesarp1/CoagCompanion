import { parseSeedData } from "./toml-parser";
import type { Log } from "./types";
import type { AppSettings } from "./storage";

// Get sample logs for non-authenticated users
export function getSampleLogs(): Log[] {
  return parseSeedData();
}

// Get sample settings for non-authenticated users
export function getSampleSettings(): AppSettings {
  return {
    targetINRMin: 2.0,
    targetINRMax: 3.0,
    inrTestTime: "10:00",
    doseTime: "13:00",
    notificationsEnabled: true,
  };
}

// Sample data is read-only - these functions are no-ops for non-authenticated users
export const sampleStorage = {
  getLogs: getSampleLogs,
  getSettings: getSampleSettings,
  saveLogs: () => {},
  addLog: () => {},
  updateLog: () => {},
  deleteLog: () => {},
  clearLogs: () => {},
  saveSettings: () => {},
  exportData: () => JSON.stringify({
    logs: getSampleLogs(),
    settings: getSampleSettings(),
    exportDate: new Date().toISOString(),
    note: "This is sample data. Sign up to save your own data."
  }),
  importData: () => false,
};
