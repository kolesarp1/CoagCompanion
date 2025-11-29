import { Log, DashboardStats } from "./types";
import { AppSettings } from "./storage";

export function calculateDashboardStats(
  logs: Log[],
  settings: AppSettings
): DashboardStats {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Find last INR value
  let lastINR: number | null = null;
  let lastINRDate: string | null = null;
  let lastINRType: "lab" | "home" | null = null;

  for (let i = sortedLogs.length - 1; i >= 0; i--) {
    const log = sortedLogs[i];
    if (log.homeINR !== null && log.homeINR !== undefined) {
      lastINR = log.homeINR;
      lastINRDate = log.date;
      lastINRType = "home";
      break;
    } else if (log.labINR !== null && log.labINR !== undefined) {
      lastINR = log.labINR;
      lastINRDate = log.date;
      lastINRType = "lab";
      break;
    }
  }

  // Calculate average INR for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentINRs = sortedLogs
    .filter((log) => new Date(log.date) >= thirtyDaysAgo)
    .map((log) => log.homeINR ?? log.labINR)
    .filter((inr): inr is number => inr !== null && inr !== undefined);

  const averageINR30Days =
    recentINRs.length > 0
      ? recentINRs.reduce((sum, inr) => sum + inr, 0) / recentINRs.length
      : null;

  // Count total doses logged
  const totalDosesLogged = logs.filter(
    (log) => log.warfarinDose !== null && log.warfarinDose !== undefined
  ).length;

  // Generate recent alerts
  const recentAlerts: string[] = [];

  if (lastINR !== null) {
    if (lastINR < settings.targetINRMin) {
      recentAlerts.push(
        `INR below target range (${lastINR.toFixed(1)} < ${settings.targetINRMin})`
      );
    } else if (lastINR > settings.targetINRMax) {
      recentAlerts.push(
        `INR above target range (${lastINR.toFixed(1)} > ${settings.targetINRMax})`
      );
    }

    if (lastINR < 2.0) {
      recentAlerts.push("Consider bridging with Fraxiparine injections");
    }

    if (lastINR > 4.0) {
      recentAlerts.push("⚠️ CRITICAL: INR dangerously high - contact doctor immediately");
    }
  }

  // Check for high vitamin K intake in recent logs
  const recentHighVitK = sortedLogs
    .slice(-7)
    .filter(
      (log) =>
        log.vitaminKIntake?.toLowerCase().includes("high") ||
        log.comment?.toLowerCase().includes("kale") ||
        log.comment?.toLowerCase().includes("spinach")
    );

  if (recentHighVitK.length > 2) {
    recentAlerts.push("High vitamin K intake detected in recent days - may affect INR");
  }

  return {
    currentTarget: `${settings.targetINRMin.toFixed(1)} - ${settings.targetINRMax.toFixed(1)}`,
    averageINR30Days: averageINR30Days ? parseFloat(averageINR30Days.toFixed(2)) : null,
    totalDosesLogged,
    recentAlerts,
    lastINR,
    lastINRDate,
    lastINRType,
  };
}

export function getINRStatus(
  inr: number | null,
  targetMin: number,
  targetMax: number
): "in-range" | "near-miss" | "out-of-range" | "unknown" {
  if (inr === null || inr === undefined) return "unknown";

  if (inr >= targetMin && inr <= targetMax) {
    return "in-range";
  } else if (
    (inr >= targetMin - 0.3 && inr < targetMin) ||
    (inr > targetMax && inr <= targetMax + 0.3)
  ) {
    return "near-miss";
  } else {
    return "out-of-range";
  }
}

export function getINRColor(status: ReturnType<typeof getINRStatus>): string {
  switch (status) {
    case "in-range":
      return "text-green-600 dark:text-green-400";
    case "near-miss":
      return "text-yellow-600 dark:text-yellow-400";
    case "out-of-range":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function exportToCSV(logs: Log[]): string {
  const headers = [
    "Date",
    "Lab INR",
    "Home INR",
    "Warfarin Dose (mg)",
    "Injections",
    "Vitamin K Intake",
    "Comment",
  ];

  const rows = logs.map((log) => [
    log.date,
    log.labINR?.toString() ?? "",
    log.homeINR?.toString() ?? "",
    log.warfarinDose?.toString() ?? "",
    log.injections ?? "",
    log.vitaminKIntake ?? "",
    log.comment ?? "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
}

export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
