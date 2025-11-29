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
import { formatDate, getVitaminKWithLag } from "@/lib/utils";
import { getVitaminKColor, getVitaminKLabel } from "@/lib/vitamin-k-colors";

interface INRChartProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
  showArea?: boolean;
  showVitaminKLag?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
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
        {data.labINR !== null && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Lab INR: <span className="font-semibold">{data.labINR}</span>
          </p>
        )}
        {data.homeINR !== null && (
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Home INR: <span className="font-semibold">{data.homeINR}</span>
          </p>
        )}
        {data.vitaminKLag && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: getVitaminKColor(data.vitaminKLag, 'light') }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Vitamin K 2 days ago: <span className="font-medium">{getVitaminKLabel(data.vitaminKLag)}</span>
              </p>
            </div>
          </div>
        )}
        {data.comment && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
            {data.comment}
          </p>
        )}
      </div>
    </div>
  );
};

export const INRChart: React.FC<INRChartProps> = ({
  logs,
  targetMin,
  targetMax,
  showArea = false,
  showVitaminKLag = false,
}) => {
  const chartData = logs
    .filter((log) => log.labINR !== null || log.homeINR !== null)
    .map((log) => ({
      date: formatDate(log.date),
      fullDate: log.date,
      labINR: log.labINR,
      homeINR: log.homeINR,
      comment: log.comment,
      vitaminKLag: showVitaminKLag ? getVitaminKWithLag(logs, log.date, 2) : null,
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
        <Tooltip content={<CustomTooltip />} />
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
