import { Log, DoseSuggestion } from "./types";

// Helper function to generate alternating dose pattern
function generateAlternatingPattern(avgDose: number): { dose: number; pattern?: string } {
  const lowerDose = Math.floor(avgDose);
  const upperDose = Math.ceil(avgDose);

  // If it's already a whole number, no alternating needed
  if (lowerDose === upperDose) {
    return { dose: lowerDose };
  }

  const decimal = avgDose - lowerDose;

  // Calculate the ratio for alternating pattern
  // For example: 6.33 = (2*6 + 1*7) / 3 → "2 days 6mg, then 7mg, repeat"
  //              6.5 = (1*6 + 1*7) / 2 → "Alternate 6mg and 7mg"
  //              6.67 = (1*6 + 2*7) / 3 → "1 day 6mg, 2 days 7mg, repeat"

  if (decimal < 0.2) {
    // Very close to lower, just round down
    return { dose: lowerDose };
  } else if (decimal > 0.8) {
    // Very close to upper, just round up
    return { dose: upperDose };
  } else if (decimal >= 0.45 && decimal <= 0.55) {
    // Around 0.5 - alternate evenly
    return {
      dose: Math.round(avgDose),
      pattern: `Alternate ${lowerDose}mg and ${upperDose}mg`
    };
  } else if (decimal < 0.45) {
    // Closer to lower - more days on lower dose
    const lowerDays = Math.round(1 / (1 - decimal));
    const upperDays = 1;
    return {
      dose: Math.round(avgDose),
      pattern: `${lowerDays} days ${lowerDose}mg, then ${upperDays} day ${upperDose}mg, repeat`
    };
  } else {
    // Closer to upper - more days on upper dose
    const lowerDays = 1;
    const upperDays = Math.round(1 / decimal);
    return {
      dose: Math.round(avgDose),
      pattern: `${lowerDays} day ${lowerDose}mg, then ${upperDays} days ${upperDose}mg, repeat`
    };
  }
}

export function calculateDoseSuggestion(
  currentINR: number,
  recentLogs: Log[]
): DoseSuggestion {
  // Calculate current maintenance dose as average of last 7 days
  const last7Days = recentLogs.slice(-7);
  const doses = last7Days
    .map((log) => log.warfarinDose)
    .filter((dose): dose is number => dose !== null && dose !== undefined);

  const avgMaintenanceDose =
    doses.length > 0
      ? doses.reduce((sum, dose) => sum + dose, 0) / doses.length
      : 5.0; // Default to 5mg if no history

  const maintenancePattern = generateAlternatingPattern(avgMaintenanceDose);
  const currentMaintenanceDose = maintenancePattern.dose;

  let suggestedDose = currentMaintenanceDose;
  let suggestedPattern: string | undefined = maintenancePattern.pattern;
  let maintenanceDoseChange = "No change";
  let reasoning = "";
  let warning: string | undefined;

  if (currentINR < 1.5) {
    const suggestedAvg = avgMaintenanceDose * 1.75; // 75% increase (middle of 50-100%)
    const suggestion = generateAlternatingPattern(suggestedAvg);
    suggestedDose = suggestion.dose;
    suggestedPattern = suggestion.pattern;
    maintenanceDoseChange = "Increase maintenance by 15% (10-20% range)";
    reasoning = `INR is critically low (${currentINR.toFixed(
      1
    )}). Suggested one-time dose increase of 75% and maintenance increase of 15%.`;
    warning =
      "INR is critically low. Contact your doctor immediately and consider bridging with injections.";
  } else if (currentINR >= 1.5 && currentINR < 2.0) {
    const suggestedAvg = avgMaintenanceDose * 1.5; // 50% increase
    const suggestion = generateAlternatingPattern(suggestedAvg);
    suggestedDose = suggestion.dose;
    suggestedPattern = suggestion.pattern;
    maintenanceDoseChange = "Increase maintenance by 10% (5-15% range)";
    reasoning = `INR is below target range (${currentINR.toFixed(
      1
    )}). Suggested one-time dose increase of 50% and maintenance increase of 10%.`;
    warning = "Consider bridging with Fraxiparine injections until INR is in range.";
  } else if (currentINR >= 2.0 && currentINR <= 3.0) {
    suggestedDose = currentMaintenanceDose;
    suggestedPattern = maintenancePattern.pattern;
    maintenanceDoseChange = "No change";
    reasoning = `INR is within target range (${currentINR.toFixed(
      1
    )}). Continue current maintenance dose.${suggestedPattern ? ' ' + suggestedPattern : ''}`;
  } else if (currentINR > 3.0 && currentINR <= 4.0) {
    const suggestedAvg = avgMaintenanceDose * 0.5; // 50% decrease
    const suggestion = generateAlternatingPattern(suggestedAvg);
    suggestedDose = suggestion.dose;
    suggestedPattern = suggestion.pattern;
    maintenanceDoseChange = "Decrease maintenance by 7.5% (5-10% range)";
    reasoning = `INR is above target range (${currentINR.toFixed(
      1
    )}). Suggested one-time dose reduction of 50% and maintenance decrease of 7.5%.`;
    warning = "INR is elevated. Monitor closely and avoid high vitamin K foods.";
  } else if (currentINR > 4.0) {
    suggestedDose = 0; // Hold dose
    suggestedPattern = undefined;
    maintenanceDoseChange = "HOLD dose and consult doctor immediately";
    reasoning = `INR is dangerously high (${currentINR.toFixed(1)}). DO NOT take today's dose.`;
    warning =
      "⚠️ CRITICAL: INR is dangerously high. HOLD today's dose and contact your doctor IMMEDIATELY. Risk of bleeding.";
  }

  return {
    currentDose: currentMaintenanceDose,
    suggestedDose,
    alternatingPattern: suggestedPattern,
    maintenanceDoseChange,
    reasoning,
    warning,
  };
}
