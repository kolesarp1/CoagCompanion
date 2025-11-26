import { linearRegression, linearRegressionLine } from "simple-statistics";
import { Log, INRPrediction } from "./types";

export function predictINR(recentLogs: Log[]): INRPrediction[] {
  // Get last 7 logs with INR values (prefer homeINR, fallback to labINR)
  const logsWithINR = recentLogs
    .filter((log) => log.homeINR !== null || log.labINR !== null)
    .slice(-7);

  if (logsWithINR.length < 3) {
    // Need at least 3 data points for meaningful prediction
    return [];
  }

  // Prepare data for linear regression
  const dataPoints: [number, number][] = logsWithINR.map((log, index) => {
    const inr = log.homeINR ?? log.labINR ?? 0;
    return [index, inr];
  });

  try {
    // Calculate linear regression
    const regression = linearRegression(dataPoints);
    const regressionLine = linearRegressionLine(regression);

    // Predict next 3 days
    const predictions: INRPrediction[] = [];
    const lastIndex = dataPoints.length - 1;

    for (let i = 1; i <= 3; i++) {
      const predictedINR = regressionLine(lastIndex + i);

      // Clamp predictions to reasonable range (0.5 to 6.0)
      const clampedINR = Math.max(0.5, Math.min(6.0, predictedINR));

      // Calculate date for prediction
      const lastDate = new Date(logsWithINR[logsWithINR.length - 1].date);
      const predictionDate = new Date(lastDate);
      predictionDate.setDate(predictionDate.getDate() + i);

      predictions.push({
        date: predictionDate.toISOString().split("T")[0],
        predictedINR: parseFloat(clampedINR.toFixed(2)),
      });
    }

    return predictions;
  } catch (error) {
    console.error("Error calculating INR prediction:", error);
    return [];
  }
}
