"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { SevenDayHistoryProps } from "./types";
import { TimelineDayItem } from "./TimelineDayItem";
import { getLast7Days, getSparklineData } from "@/lib/timeline-utils";

/**
 * SevenDayHistory - Main container for 7-day timeline view
 * Shows last 7 days of INR, dose, and vitamin K data in a vertical timeline
 */
export function SevenDayHistory({
  logs,
  targetMin,
  targetMax,
}: SevenDayHistoryProps): React.ReactElement {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  // Transform logs into 7-day history items
  const dayItems = useMemo(
    () => getLast7Days(logs, targetMin, targetMax),
    [logs, targetMin, targetMax]
  );

  // Toggle expand/collapse for a specific day
  const handleToggle = useCallback((index: number) => {
    setExpandedDayIndex((current) => (current === index ? null : index));
  }, []);

  // Calculate sparkline data for each day
  const sparklineDataByDay = useMemo(() => {
    return dayItems.map((_, index) => getSparklineData(logs, index));
  }, [logs, dayItems]);

  // Check if there's any data at all
  const hasAnyData = dayItems.some((day) => day.log !== null);

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Last 7 Days
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Click any day to see full details
        </p>
      </div>

      {hasAnyData ? (
        <div role="list" aria-label="7-day history timeline">
          {dayItems.map((dayItem, index) => (
            <motion.div
              key={dayItem.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <TimelineDayItem
                dayItem={dayItem}
                isExpanded={expandedDayIndex === index}
                onToggle={() => handleToggle(index)}
                sparklineData={sparklineDataByDay[index]}
                targetMin={targetMin}
                targetMax={targetMax}
                isLast={index === dayItems.length - 1}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No history yet. Start logging to see your 7-day timeline!
          </p>
        </div>
      )}
    </Card>
  );
}
