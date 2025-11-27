/**
 * Migration script to move existing localStorage data to Supabase
 * This should be run ONCE after the user creates their account
 */

import { storage } from "./storage";
import { supabaseStorage } from "./supabase-storage";

export async function migrateLocalStorageToSupabase(): Promise<{
  success: boolean;
  logsCount: number;
  error?: string;
}> {
  try {
    // Get data from localStorage
    const localLogs = storage.getLogs();
    const localSettings = storage.getSettings();

    console.log(`Found ${localLogs.length} logs in localStorage`);

    if (localLogs.length === 0) {
      return {
        success: true,
        logsCount: 0,
      };
    }

    // Save to Supabase
    await supabaseStorage.saveLogs(localLogs);
    await supabaseStorage.saveSettings(localSettings);

    console.log(`Successfully migrated ${localLogs.length} logs to Supabase`);

    // Optionally clear localStorage after successful migration
    // Uncomment the line below if you want to clear localStorage after migration
    // storage.clearLogs();

    return {
      success: true,
      logsCount: localLogs.length,
    };
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      logsCount: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Check if migration is needed (has localStorage data but no Supabase data)
export async function needsMigration(): Promise<boolean> {
  const localLogs = storage.getLogs();
  const supabaseLogs = await supabaseStorage.getLogs();

  return localLogs.length > 0 && supabaseLogs.length === 0;
}
