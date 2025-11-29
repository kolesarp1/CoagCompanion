export interface Log {
  id: string;
  date: string; // ISO format
  labINR: number | null;
  homeINR: number | null;
  warfarinDose: number | null; // in mg
  injections: string | null;
  comment: string | null;
  vitaminKIntake?: string | null; // High, Medium, Low, or custom
}

export interface DoseSuggestion {
  currentDose: number;
  suggestedDose: number;
  alternatingPattern?: string; // e.g., "2 days 6mg, then 7mg, repeat"
  maintenanceDoseChange: string;
  reasoning: string;
  warning?: string;
}

export interface INRPrediction {
  date: string;
  predictedINR: number;
}

export interface DashboardStats {
  currentTarget: string;
  averageINR30Days: number | null;
  totalDosesLogged: number;
  recentAlerts: string[];
  lastINR: number | null;
  lastINRDate: string | null;
  lastINRType: 'lab' | 'home' | null;
  testTime: string;
  doseTime: string;
}

export type VitaminKCategory = 'Low' | 'Medium' | 'High' | 'ExtraHigh' | 'Custom';
