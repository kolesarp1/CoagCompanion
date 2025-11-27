import { createClient } from "@/lib/supabase/client";
import type { Log } from "./types";
import type { AppSettings } from "./storage";
import type { Database } from "./database.types";

type DbLog = Database['public']['Tables']['logs']['Row'];
type DbSettings = Database['public']['Tables']['settings']['Row'];

// Convert database log to app log format
function dbLogToAppLog(dbLog: DbLog): Log {
  return {
    id: dbLog.id,
    date: dbLog.date,
    labINR: dbLog.lab_inr,
    homeINR: dbLog.home_inr,
    warfarinDose: dbLog.warfarin_dose,
    injections: dbLog.injections,
    comment: dbLog.comment,
    vitaminKIntake: dbLog.vitamin_k_intake,
  };
}

// Convert app log to database log format
function appLogToDbLog(log: Partial<Log>, userId: string): Database['public']['Tables']['logs']['Insert'] {
  return {
    user_id: userId,
    date: log.date || new Date().toISOString(),
    lab_inr: log.labINR ?? null,
    home_inr: log.homeINR ?? null,
    warfarin_dose: log.warfarinDose ?? null,
    injections: log.injections ?? null,
    comment: log.comment ?? null,
    vitamin_k_intake: log.vitaminKIntake ?? null,
  };
}

// Convert database settings to app settings format
function dbSettingsToAppSettings(dbSettings: DbSettings): AppSettings {
  return {
    targetINRMin: Number(dbSettings.target_inr_min),
    targetINRMax: Number(dbSettings.target_inr_max),
    inrTestTime: dbSettings.inr_test_time,
    doseTime: dbSettings.dose_time,
    notificationsEnabled: dbSettings.notifications_enabled,
  };
}

export const supabaseStorage = {
  getLogs: async (): Promise<Log[]> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return (data || []).map(dbLogToAppLog);
  },

  saveLogs: async (logs: Log[]): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Delete all existing logs for this user
    await supabase.from('logs').delete().eq('user_id', user.id);

    // Insert new logs
    if (logs.length > 0) {
      const dbLogs = logs.map(log => appLogToDbLog(log, user.id));
      const { error } = await supabase.from('logs').insert(dbLogs);

      if (error) {
        console.error('Error saving logs:', error);
      }
    }
  },

  addLog: async (log: Log): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbLog = appLogToDbLog(log, user.id);
    const { error } = await supabase.from('logs').insert([dbLog]);

    if (error) {
      console.error('Error adding log:', error);
    }
  },

  updateLog: async (id: string, updatedLog: Partial<Log>): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updateData: Database['public']['Tables']['logs']['Update'] = {
      date: updatedLog.date,
      lab_inr: updatedLog.labINR ?? null,
      home_inr: updatedLog.homeINR ?? null,
      warfarin_dose: updatedLog.warfarinDose ?? null,
      injections: updatedLog.injections ?? null,
      comment: updatedLog.comment ?? null,
      vitamin_k_intake: updatedLog.vitaminKIntake ?? null,
    };

    const { error } = await supabase
      .from('logs')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating log:', error);
    }
  },

  deleteLog: async (id: string): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting log:', error);
    }
  },

  clearLogs: async (): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('logs')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing logs:', error);
    }
  },

  getSettings: async (): Promise<AppSettings> => {
    const supabase = createClient();

    const defaultSettings: AppSettings = {
      targetINRMin: 2.0,
      targetINRMax: 3.0,
      inrTestTime: "10:00",
      doseTime: "13:00",
      notificationsEnabled: true,
    };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return defaultSettings;

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return defaultSettings;
    }

    return dbSettingsToAppSettings(data);
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const dbSettings: Database['public']['Tables']['settings']['Update'] = {
      target_inr_min: settings.targetINRMin,
      target_inr_max: settings.targetINRMax,
      inr_test_time: settings.inrTestTime,
      dose_time: settings.doseTime,
      notifications_enabled: settings.notificationsEnabled,
    };

    const { error } = await supabase
      .from('settings')
      .upsert({ user_id: user.id, ...dbSettings });

    if (error) {
      console.error('Error saving settings:', error);
    }
  },

  exportData: async (): Promise<string> => {
    const logs = await supabaseStorage.getLogs();
    const settings = await supabaseStorage.getSettings();

    return JSON.stringify({
      logs,
      settings,
      exportDate: new Date().toISOString(),
    });
  },

  importData: async (jsonData: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonData);

      if (data.logs && Array.isArray(data.logs)) {
        await supabaseStorage.saveLogs(data.logs);
      }

      if (data.settings) {
        await supabaseStorage.saveSettings(data.settings);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
};
