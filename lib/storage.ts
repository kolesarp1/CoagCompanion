import { Log } from "./types";

const STORAGE_KEY = "coag-companion-logs";
const SETTINGS_KEY = "coag-companion-settings";

export interface AppSettings {
  targetINRMin: number;
  targetINRMax: number;
  inrTestTime: string;
  doseTime: string;
  notificationsEnabled: boolean;
}

const defaultSettings: AppSettings = {
  targetINRMin: 2.0,
  targetINRMax: 3.0,
  inrTestTime: "10:00",
  doseTime: "13:00",
  notificationsEnabled: true,
};

export const storage = {
  getLogs: (): Log[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading logs from localStorage:", error);
      return [];
    }
  },

  saveLogs: (logs: Log[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Error saving logs to localStorage:", error);
    }
  },

  addLog: (log: Log): void => {
    const logs = storage.getLogs();
    logs.push(log);
    storage.saveLogs(logs);
  },

  updateLog: (id: string, updatedLog: Partial<Log>): void => {
    const logs = storage.getLogs();
    const index = logs.findIndex((log) => log.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...updatedLog };
      storage.saveLogs(logs);
    }
  },

  deleteLog: (id: string): void => {
    const logs = storage.getLogs();
    const filtered = logs.filter((log) => log.id !== id);
    storage.saveLogs(filtered);
  },

  clearLogs: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },

  getSettings: (): AppSettings => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (error) {
      console.error("Error reading settings from localStorage:", error);
      return defaultSettings;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  },

  exportData: (): string => {
    return JSON.stringify({
      logs: storage.getLogs(),
      settings: storage.getSettings(),
      exportDate: new Date().toISOString(),
    });
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.logs && Array.isArray(data.logs)) {
        storage.saveLogs(data.logs);
      }
      if (data.settings) {
        storage.saveSettings(data.settings);
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  },
};
