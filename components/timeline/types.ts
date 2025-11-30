import { Log } from "@/lib/types";

export interface DayHistoryItem {
  date: string; // ISO format
  dayOfWeek: string; // "Mon", "Tue", etc.
  shortDate: string; // "Nov 29"
  log: Log | null;
  inr: number | null; // Prioritize homeINR, fallback to labINR
  dose: number | null;
  inrStatus: "in-range" | "near-miss" | "out-of-range" | "unknown";
}

export interface SevenDayHistoryProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
}

export interface TimelineDayItemProps {
  dayItem: DayHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  sparklineData: number[];
  targetMin: number;
  targetMax: number;
  isLast: boolean;
}

export interface MiniSparklineProps {
  values: number[];
  width?: number; // default 40
  height?: number; // default 16
  color?: string; // default blue
}
