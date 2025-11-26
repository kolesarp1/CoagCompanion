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
  Cell,
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
      fullDate: log.date,
      dose: log.warfarinDose!,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No dose data available yet. Add your first dose to see the history.
      </div>
    );
  }

  // Color coding based on dose ranges
  const getBarColor = (dose: number) => {
    if (dose <= 5) return "#ef4444"; // red - low dose
    if (dose <= 8) return "#10b981"; // green - normal dose
    if (dose <= 10) return "#f59e0b"; // amber - moderate dose
    return "#dc2626"; // dark red - high dose
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          dataKey="date"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          fontSize={11}
          angle={-45}
          textAnchor="end"
          height={80}
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
          labelFormatter={(label, payload) => {
            if (payload && payload.length > 0) {
              return new Date(payload[0].payload.fullDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }
            return label;
          }}
          formatter={(value: any) => [`${value} mg`, 'Warfarin Dose']}
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} />
        <Bar
          dataKey="dose"
          name="Warfarin Dose (mg)"
          radius={[8, 8, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.dose)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
