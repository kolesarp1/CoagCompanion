"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts";
import { Log } from "@/lib/types";

interface INRDoseCorrelationProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
}

export const INRDoseCorrelation: React.FC<INRDoseCorrelationProps> = ({
  logs,
  targetMin,
  targetMax,
}) => {
  const chartData = logs
    .filter((log) => {
      const inr = log.homeINR || log.labINR;
      return log.warfarinDose !== null && inr !== null;
    })
    .map((log) => {
      const inr = log.homeINR || log.labINR;
      return {
        dose: log.warfarinDose!,
        inr: inr!,
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        Not enough data for correlation analysis. Need both INR and dose data.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          type="number"
          dataKey="dose"
          name="Warfarin Dose"
          unit=" mg"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          label={{ value: "Warfarin Dose (mg)", position: "insideBottom", offset: -5, fill: "#9ca3af" }}
        />
        <YAxis
          type="number"
          dataKey="inr"
          name="INR"
          stroke="#9ca3af"
          tick={{ fill: "#9ca3af" }}
          domain={[0, 5]}
          label={{ value: "INR Level", angle: -90, position: "insideLeft", fill: "#9ca3af" }}
        />
        <ZAxis range={[100, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value: any, name: string) => {
            if (name === "inr") return [value.toFixed(1), "INR"];
            if (name === "dose") return [`${value} mg`, "Dose"];
            return [value, name];
          }}
        />
        <ReferenceLine
          y={targetMin}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: `Target Min`, fill: "#10b981", fontSize: 11 }}
        />
        <ReferenceLine
          y={targetMax}
          stroke="#10b981"
          strokeDasharray="5 5"
          label={{ value: `Target Max`, fill: "#10b981", fontSize: 11 }}
        />
        <Scatter
          name="INR vs Dose"
          data={chartData}
          fill="#8b5cf6"
          shape="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
