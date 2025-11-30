"use client";

import React from "react";
import { MiniSparklineProps } from "./types";

/**
 * MiniSparkline - Lightweight inline SVG sparkline chart
 * Shows trend of INR values over time
 */
export function MiniSparkline({
  values,
  width = 40,
  height = 16,
  color = "#3b82f6", // blue-600
}: MiniSparklineProps): React.ReactElement {
  // Need at least 2 points to draw a line
  if (values.length < 2) {
    return (
      <span className="inline-block text-gray-400 dark:text-gray-600 text-xs">
        ─
      </span>
    );
  }

  // Calculate min and max for normalization
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // Avoid division by zero if all values are the same
  const effectiveRange = range === 0 ? 1 : range;

  // Calculate SVG points
  const padding = 2; // Small padding to prevent clipping
  const effectiveHeight = height - padding * 2;
  const effectiveWidth = width - padding * 2;

  const points = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * effectiveWidth;
      // Invert Y axis (SVG coordinates start from top)
      const normalizedValue = (value - minValue) / effectiveRange;
      const y = padding + effectiveHeight - normalizedValue * effectiveHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="inline-block align-middle"
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`INR trend: ${values.length} readings from ${minValue.toFixed(1)} to ${maxValue.toFixed(1)}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Add small dots at each data point */}
      {values.map((value, index) => {
        const x = padding + (index / (values.length - 1)) * effectiveWidth;
        const normalizedValue = (value - minValue) / effectiveRange;
        const y = padding + effectiveHeight - normalizedValue * effectiveHeight;

        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="1"
            fill={color}
            opacity="0.7"
          />
        );
      })}
    </svg>
  );
}
