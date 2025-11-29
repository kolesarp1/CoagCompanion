"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Log } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getVitaminKColor, getVitaminKFoodExamples, getVitaminKLabel } from "@/lib/vitamin-k-colors";

interface VitaminKChartProps {
  logs: Log[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
        {new Date(data.fullDate).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </p>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: getVitaminKColor(data.category, 'light') }}
          />
          <p className="text-sm font-semibold" style={{ color: getVitaminKColor(data.category, 'light') }}>
            {getVitaminKLabel(data.category)}
          </p>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {getVitaminKFoodExamples(data.category)}
        </p>
        {data.comment && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            {data.comment}
          </p>
        )}
      </div>
    </div>
  );
};

export const VitaminKChart: React.FC<VitaminKChartProps> = ({ logs }) => {
  const chartData = logs
    .filter((log) => log.vitaminKIntake !== null && log.vitaminKIntake !== undefined && log.vitaminKIntake !== "")
    .map((log) => ({
      date: formatDate(log.date),
      fullDate: log.date,
      category: log.vitaminKIntake!,
      // Convert category to numeric value for bar height
      value: getCategoryValue(log.vitaminKIntake!),
      comment: log.comment,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No vitamin K data tracked yet. Start logging your vitamin K intake to see patterns.
      </div>
    );
  }

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
          domain={[0, 4]}
          ticks={[0, 1, 2, 3, 4]}
          tickFormatter={(value) => {
            const labels = ['', 'Low', 'Medium', 'High', 'Extra High'];
            return labels[value] || '';
          }}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          name="Vitamin K Intake"
          radius={[8, 8, 0, 0]}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getVitaminKColor(entry.category, 'light')} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

/**
 * Convert vitamin K category to numeric value for bar chart height
 */
function getCategoryValue(category: string): number {
  switch (category) {
    case 'Low': return 1;
    case 'Medium': return 2;
    case 'High': return 3;
    case 'ExtraHigh': return 4;
    default: return 0;
  }
}
