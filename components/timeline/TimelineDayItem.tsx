"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimelineDayItemProps } from "./types";
import { MiniSparkline } from "./MiniSparkline";
import { formatVitaminK, getVitaminKColor } from "@/lib/timeline-utils";

/**
 * TimelineDayItem - Individual day entry in the 7-day timeline
 * Displays date, INR, dose, sparkline, and expandable details
 */
export const TimelineDayItem = React.memo(function TimelineDayItem({
  dayItem,
  isExpanded,
  onToggle,
  sparklineData,
  targetMin,
  targetMax,
  isLast,
}: TimelineDayItemProps): React.ReactElement {
  // Determine dot color based on Vitamin K intake (4 hues of green)
  const getDotColor = (): string => {
    if (!dayItem.log || !dayItem.log.vitaminKIntake) {
      return "bg-gray-400 dark:bg-gray-600 border-gray-500 dark:border-gray-700";
    }

    const vitaminK = dayItem.log.vitaminKIntake.toLowerCase();

    if (vitaminK.includes("none")) {
      return "bg-green-200 dark:bg-green-300 border-green-300 dark:border-green-400";
    } else if (vitaminK.includes("low")) {
      return "bg-green-400 dark:bg-green-500 border-green-500 dark:border-green-600";
    } else if (vitaminK.includes("medium")) {
      return "bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700";
    } else if (vitaminK.includes("high") && !vitaminK.includes("very")) {
      return "bg-green-600 dark:bg-green-700 border-green-700 dark:border-green-800";
    } else if (vitaminK.includes("very")) {
      return "bg-green-800 dark:bg-green-900 border-green-900 dark:border-green-950";
    }

    return "bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700"; // Default green
  };

  const hasData = dayItem.log !== null;
  const hasExpandableData =
    hasData &&
    dayItem.log !== null &&
    (dayItem.log.comment ||
      dayItem.log.injections ||
      dayItem.log.vitaminKIntake ||
      dayItem.log.labINR !== null ||
      dayItem.log.homeINR !== null);

  // Screen reader announcement
  const getAriaLabel = (): string => {
    if (!hasData) {
      return `${dayItem.dayOfWeek}, ${dayItem.shortDate}. No data recorded.`;
    }

    const inrText = dayItem.inr
      ? `INR ${dayItem.inr.toFixed(1)}, ${dayItem.inrStatus === "in-range" ? "in therapeutic range" : dayItem.inrStatus === "near-miss" ? "near therapeutic range" : "out of therapeutic range"}`
      : "No INR";

    const doseText = dayItem.dose ? `Warfarin dose ${dayItem.dose} milligrams` : "No dose recorded";

    const vitaminKText = dayItem.log?.vitaminKIntake
      ? `Vitamin K intake: ${formatVitaminK(dayItem.log.vitaminKIntake)}`
      : "No vitamin K data";

    return `${dayItem.dayOfWeek}, ${dayItem.shortDate}. ${inrText}. ${doseText}. ${vitaminKText}. ${hasExpandableData ? "Press Enter for details." : ""}`;
  };

  return (
    <div className="relative">
      {/* Vertical connecting line */}
      {!isLast && (
        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />
      )}

      {/* Timeline entry */}
      <div
        className={`relative pl-8 pb-4 ${hasExpandableData ? "cursor-pointer" : ""} group`}
        onClick={hasExpandableData ? onToggle : undefined}
        onKeyDown={(e) => {
          if (hasExpandableData && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onToggle();
          }
        }}
        role={hasExpandableData ? "button" : undefined}
        tabIndex={hasExpandableData ? 0 : undefined}
        aria-expanded={hasExpandableData ? isExpanded : undefined}
        aria-label={getAriaLabel()}
      >
        {/* Colored dot */}
        <div
          className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${getDotColor()} shadow-sm`}
          aria-hidden="true"
        />

        {/* Day content */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          {/* Date */}
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[90px]">
            {dayItem.dayOfWeek}, {dayItem.shortDate}
          </div>

          {/* Data or "No data" message */}
          {hasData ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
              {/* INR */}
              {dayItem.inr !== null ? (
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  INR: {dayItem.inr.toFixed(1)}
                </span>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  No INR
                </span>
              )}

              {/* Dose */}
              {dayItem.dose !== null ? (
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Dose: {dayItem.dose}mg
                </span>
              ) : (
                <span className="text-sm text-gray-400 dark:text-gray-600">
                  No dose
                </span>
              )}

              {/* Expand indicator */}
              {hasExpandableData && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-auto text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-600 italic">
              No data
            </span>
          )}
        </div>

        {/* Expanded details section */}
        <AnimatePresence>
          {isExpanded && hasData && dayItem.log && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pl-2 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                {/* Lab vs Home INR */}
                {(dayItem.log.labINR !== null || dayItem.log.homeINR !== null) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dayItem.log.labINR !== null && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Lab INR:</span>{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {dayItem.log.labINR.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {dayItem.log.homeINR !== null && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Home INR:</span>{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {dayItem.log.homeINR.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Vitamin K Intake */}
                {dayItem.log.vitaminKIntake && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Vitamin K:</span>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getVitaminKColor(dayItem.log.vitaminKIntake)}`}
                    >
                      {formatVitaminK(dayItem.log.vitaminKIntake)}
                    </span>
                  </div>
                )}

                {/* Injections */}
                {dayItem.log.injections && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Injections:</span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {dayItem.log.injections}
                    </span>
                  </div>
                )}

                {/* Comments */}
                {dayItem.log.comment && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Note:</span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      {dayItem.log.comment}
                    </span>
                  </div>
                )}

                {/* Sparkline on mobile (hidden on desktop) */}
                <div className="block sm:hidden pt-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                    INR Trend:
                  </div>
                  <MiniSparkline values={sparklineData} width={80} height={24} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
