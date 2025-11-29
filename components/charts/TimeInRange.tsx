"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Log } from "@/lib/types";

interface TimeInRangeProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
}

export const TimeInRange: React.FC<TimeInRangeProps> = ({
  logs,
  targetMin,
  targetMax,
}) => {
  const inrReadings = logs
    .filter((log) => log.homeINR !== null || log.labINR !== null)
    .map((log) => log.homeINR || log.labINR!);

  if (inrReadings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No INR data available for analysis.
      </div>
    );
  }

  const belowRange = inrReadings.filter((inr) => inr < targetMin).length;
  const inRange = inrReadings.filter((inr) => inr >= targetMin && inr <= targetMax).length;
  const aboveRange = inrReadings.filter((inr) => inr > targetMax).length;

  const total = inrReadings.length;
  const data = [
    {
      name: "Below Range",
      value: belowRange,
      percentage: ((belowRange / total) * 100).toFixed(1),
    },
    {
      name: "In Range",
      value: inRange,
      percentage: ((inRange / total) * 100).toFixed(1),
    },
    {
      name: "Above Range",
      value: aboveRange,
      percentage: ((aboveRange / total) * 100).toFixed(1),
    },
  ];

  const COLORS = ["#ef4444", "#10b981", "#f59e0b"];

  const renderLabel = (entry: any) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="h-full flex flex-col">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#1f2937",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value: any, name: string, props: any) => [
              `${value} readings (${props.payload.percentage}%)`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ color: "#9ca3af" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Below Range</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{belowRange}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">&lt; {targetMin}</p>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">In Range</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{inRange}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{targetMin} - {targetMax}</p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Above Range</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{aboveRange}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">&gt; {targetMax}</p>
        </div>
      </div>
    </div>
  );
};
