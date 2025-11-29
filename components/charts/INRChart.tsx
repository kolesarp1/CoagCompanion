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
  Area,
  ComposedChart,
} from "recharts";
import { Log } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface INRChartProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
  showArea?: boolean;
}

export const INRChart: React.FC<INRChartProps> = ({
  logs,
  targetMin,
  targetMax,
  showArea = false,
}) => {
  const chartData = logs
    .filter((log) => log.labINR !== null || log.homeINR !== null)
    .map((log) => ({
      date: formatDate(log.date),
      fullDate: log.date,
      labINR: log.labINR,
      homeINR: log.homeINR,
      targetMin,
      targetMax,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No INR data available yet. Add your first reading to see the trend.
      </div>
    );
  }

  const ChartComponent = showArea ? ComposedChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ChartComponent data={chartData}>
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
          domain={[0, 5]}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            color: "#1f2937",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} />
        {showArea && (
          <>
            <defs>
              <linearGradient id="lowZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.15}/>
              </linearGradient>
              <linearGradient id="targetZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#86efac" stopOpacity={0.15}/>
              </linearGradient>
              <linearGradient id="highZone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdba74" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#fdba74" stopOpacity={0.15}/>
              </linearGradient>
            </defs>
            {/* Low zone: 0-2 (light red) */}
            <Area
              type="stepAfter"
              dataKey={() => 2}
              stroke="none"
              fill="url(#lowZone)"
              fillOpacity={1}
            />
            {/* Target zone: 2-3 (light green) */}
            <Area
              type="stepAfter"
              dataKey={() => targetMax}
              stroke="none"
              fill="url(#targetZone)"
              fillOpacity={1}
              baseValue={2}
            />
            {/* High zone: 3-5 (light orange) */}
            <Area
              type="stepAfter"
              dataKey={() => 5}
              stroke="none"
              fill="url(#highZone)"
              fillOpacity={1}
              baseValue={targetMax}
            />
          </>
        )}
        <ReferenceLine
          y={targetMin}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: `Min ${targetMin}`, fill: "#10b981", fontSize: 11 }}
        />
        <ReferenceLine
          y={targetMax}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: `Max ${targetMax}`, fill: "#10b981", fontSize: 11 }}
        />
        <Line
          type="monotone"
          dataKey="labINR"
          stroke="#3b82f6"
          strokeWidth={3}
          name="Lab INR"
          dot={{ fill: "#3b82f6", r: 5 }}
          activeDot={{ r: 7 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="homeINR"
          stroke="#8b5cf6"
          strokeWidth={3}
          name="Home INR"
          dot={{ fill: "#8b5cf6", r: 5 }}
          activeDot={{ r: 7 }}
          connectNulls
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
};
