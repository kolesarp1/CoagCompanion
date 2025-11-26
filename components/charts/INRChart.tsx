"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Log } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface INRChartProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
}

export const INRChart: React.FC<INRChartProps> = ({
  logs,
  targetMin,
  targetMax,
}) => {
  const chartData = logs
    .filter((log) => log.labINR !== null || log.homeINR !== null)
    .map((log) => ({
      date: formatDate(log.date),
      labINR: log.labINR,
      homeINR: log.homeINR,
      targetMin,
      targetMax,
    }))
    .slice(-30); // Show last 30 readings

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No INR data available yet. Add your first reading to see the trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
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
          domain={[0, 5]}
          fontSize={12}
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
        <ReferenceLine
          y={targetMin}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: "Target Min", fill: "#10b981", fontSize: 12 }}
        />
        <ReferenceLine
          y={targetMax}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: "Target Max", fill: "#10b981", fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="labINR"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Lab INR"
          dot={{ fill: "#3b82f6", r: 4 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="homeINR"
          stroke="#8b5cf6"
          strokeWidth={2}
          name="Home INR"
          dot={{ fill: "#8b5cf6", r: 4 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
