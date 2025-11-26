"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Log } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface DoseChartProps {
  logs: Log[];
}

export const DoseChart: React.FC<DoseChartProps> = ({ logs }) => {
  const chartData = logs
    .filter((log) => log.warfarinDose !== null && log.warfarinDose !== undefined)
    .map((log) => ({
      date: formatDate(log.date),
      dose: log.warfarinDose,
    }))
    .slice(-30); // Show last 30 doses

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No dose data available yet. Add your first dose to see the history.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          fontSize={12}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          domain={[0, 15]}
          fontSize={12}
          label={{ value: "Dose (mg)", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} />
        <Bar
          dataKey="dose"
          fill="#10b981"
          name="Warfarin Dose (mg)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
