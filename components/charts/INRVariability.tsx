"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
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

interface INRVariabilityProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
}

export const INRVariability: React.FC<INRVariabilityProps> = ({
  logs,
  targetMin,
  targetMax,
}) => {
  const inrLogs = logs.filter((log) => log.homeINR !== null || log.labINR !== null);

  if (inrLogs.length < 2) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        Need at least 2 INR readings to calculate variability.
      </div>
    );
  }

  const chartData = inrLogs.map((log, index) => {
    const inr = log.homeINR || log.labINR!;
    let change = 0;

    if (index > 0) {
      const prevINR = inrLogs[index - 1].homeINR || inrLogs[index - 1].labINR!;
      change = inr - prevINR;
    }

    return {
      date: formatDate(log.date),
      fullDate: log.date,
      inr,
      change: Math.abs(change),
      changeDirection: change,
      targetMin,
      targetMax,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
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
          yAxisId="left"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          domain={[0, 5]}
          fontSize={12}
          label={{ value: "INR Level", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          fontSize={12}
          label={{ value: "Change", angle: 90, position: "insideRight", fill: "#9ca3af" }}
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
          formatter={(value: any, name: string) => {
            if (name === "inr") return [value.toFixed(1), "INR"];
            if (name === "change") return [value.toFixed(2), "Abs Change"];
            return [value, name];
          }}
        />
        <Legend wrapperStyle={{ color: "#9ca3af" }} />
        <ReferenceLine
          y={targetMin}
          stroke="#10b981"
          strokeDasharray="5 5"
          yAxisId="left"
        />
        <ReferenceLine
          y={targetMax}
          stroke="#10b981"
          strokeDasharray="5 5"
          yAxisId="left"
        />
        <Bar
          yAxisId="right"
          dataKey="change"
          fill="#f59e0b"
          name="INR Change"
          opacity={0.6}
          radius={[8, 8, 0, 0]}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="inr"
          stroke="#8b5cf6"
          strokeWidth={3}
          name="INR Level"
          dot={{ fill: "#8b5cf6", r: 5 }}
          activeDot={{ r: 7 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
