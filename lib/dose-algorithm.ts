import { Log, DoseSuggestion } from "./types";

export function calculateDoseSuggestion(
  currentINR: number,
  recentLogs: Log[]
): DoseSuggestion {
  // Calculate current maintenance dose as average of last 7 days
  const last7Days = recentLogs.slice(-7);
  const doses = last7Days
    .map((log) => log.warfarinDose)
    .filter((dose): dose is number => dose !== null && dose !== undefined);

  const currentMaintenanceDose =
    doses.length > 0
      ? doses.reduce((sum, dose) => sum + dose, 0) / doses.length
      : 5.0; // Default to 5mg if no history

  let suggestedDose = currentMaintenanceDose;
  let maintenanceDoseChange = "No change";
  let reasoning = "";
  let warning: string | undefined;

  if (currentINR < 1.5) {
    suggestedDose = currentMaintenanceDose * 1.75; // 75% increase (middle of 50-100%)
    maintenanceDoseChange = "Increase maintenance by 15% (10-20% range)";
    reasoning = `INR is critically low (${currentINR.toFixed(
      1
    )}). Suggested one-time dose increase of 75% and maintenance increase of 15%.`;
    warning =
      "INR is critically low. Contact your doctor immediately and consider bridging with injections.";
  } else if (currentINR >= 1.5 && currentINR < 2.0) {
    suggestedDose = currentMaintenanceDose * 1.5; // 50% increase
    maintenanceDoseChange = "Increase maintenance by 10% (5-15% range)";
    reasoning = `INR is below target range (${currentINR.toFixed(
      1
    )}). Suggested one-time dose increase of 50% and maintenance increase of 10%.`;
    warning = "Consider bridging with Fraxiparine injections until INR is in range.";
  } else if (currentINR >= 2.0 && currentINR <= 3.0) {
    suggestedDose = currentMaintenanceDose;
    maintenanceDoseChange = "No change";
    reasoning = `INR is within target range (${currentINR.toFixed(
      1
    )}). Continue current maintenance dose.`;
  } else if (currentINR > 3.0 && currentINR <= 4.0) {
    suggestedDose = currentMaintenanceDose * 0.5; // 50% decrease
    maintenanceDoseChange = "Decrease maintenance by 7.5% (5-10% range)";
    reasoning = `INR is above target range (${currentINR.toFixed(
      1
    )}). Suggested one-time dose reduction of 50% and maintenance decrease of 7.5%.`;
    warning = "INR is elevated. Monitor closely and avoid high vitamin K foods.";
  } else if (currentINR > 4.0) {
    suggestedDose = 0; // Hold dose
    maintenanceDoseChange = "HOLD dose and consult doctor immediately";
    reasoning = `INR is dangerously high (${currentINR.toFixed(1)}). DO NOT take today's dose.`;
    warning =
      "⚠️ CRITICAL: INR is dangerously high. HOLD today's dose and contact your doctor IMMEDIATELY. Risk of bleeding.";
  }

  return {
    currentDose: currentMaintenanceDose,
    suggestedDose: parseFloat(suggestedDose.toFixed(2)),
    maintenanceDoseChange,
    reasoning,
    warning,
  };
}
