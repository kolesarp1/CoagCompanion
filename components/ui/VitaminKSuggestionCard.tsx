"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import { VitaminKSuggestion, VitaminKLevel, Log } from "@/lib/types";
import { supabaseStorage } from "@/lib/supabase-storage";
import toast from "react-hot-toast";

interface VitaminKSuggestionCardProps {
  suggestion: VitaminKSuggestion;
  currentLog?: Log | null;
  onVitaminKAccepted?: () => void;
  isAuthenticated?: boolean;
}

const LEVEL_LABELS: Record<VitaminKLevel, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
  very_high: "Very High",
};

const LEVEL_COLORS: Record<VitaminKLevel, string> = {
  none: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
  low: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  medium: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  high: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  very_high: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
};

const ALL_LEVELS: VitaminKLevel[] = ["none", "low", "medium", "high", "very_high"];

export const VitaminKSuggestionCard: React.FC<VitaminKSuggestionCardProps> = ({
  suggestion,
  currentLog = null,
  onVitaminKAccepted,
  isAuthenticated = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleAcceptLevel = async (level: VitaminKLevel) => {
    if (!currentLog || !currentLog.id || !isAuthenticated) {
      toast.error("Cannot save. Please log in.");
      return;
    }

    setIsSaving(true);
    try {
      await supabaseStorage.updateLog(currentLog.id, {
        vitaminKIntake: level,
      });
      toast.success(`Vitamin K intake set to ${LEVEL_LABELS[level]}`);

      if (onVitaminKAccepted) {
        onVitaminKAccepted();
      }
    } catch (error) {
      console.error("Error saving vitamin K intake:", error);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatINRImpact = (impact: number, delayDays: number): string => {
    if (impact === 0) return "Stable INR (no change)";
    const direction = impact > 0 ? "+" : "";
    const dayText = delayDays === 1 ? "day" : "days";
    return `INR ${direction}${impact.toFixed(1)} in ${delayDays} ${dayText}`;
  };

  return (
    <Card animate className="border-l-4 border-green-500">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vitamin K Suggestion
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Based on current INR
          </span>
        </div>

        {/* Suggested Level with INR Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Suggested Intake
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${LEVEL_COLORS[suggestion.suggestedLevel]}`}>
              {LEVEL_LABELS[suggestion.suggestedLevel]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Expected Effect
            </span>
            <span className={`text-sm font-medium ${
              suggestion.inrImpact > 0
                ? "text-orange-600 dark:text-orange-400"
                : suggestion.inrImpact < 0
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-green-600 dark:text-green-400"
            }`}>
              {formatINRImpact(suggestion.inrImpact, suggestion.delayDays)}
            </span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Why this level?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {suggestion.reasoning}
          </p>
        </div>

        {/* Food Examples */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-1">
            Food Examples
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {suggestion.examples}
          </p>
        </div>

        {/* Quick Selection - only show if not yet set */}
        {isAuthenticated && currentLog && !currentLog.vitaminKIntake && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Log Today's Vitamin K Intake
            </h5>

            {/* Accept Suggested Level Button */}
            <button
              onClick={() => handleAcceptLevel(suggestion.suggestedLevel)}
              disabled={isSaving}
              className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isSaving ? "Saving..." : `Accept ${LEVEL_LABELS[suggestion.suggestedLevel]}`}
            </button>

            {/* Other Options */}
            <div className="flex flex-wrap gap-2">
              {ALL_LEVELS.filter(level => level !== suggestion.suggestedLevel).map((level) => (
                <button
                  key={level}
                  onClick={() => handleAcceptLevel(level)}
                  disabled={isSaving}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ${LEVEL_COLORS[level]}`}
                >
                  {LEVEL_LABELS[level]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-400">
            Vitamin K affects INR with a 2-3 day delay. Maintain consistent intake rather than avoiding it entirely. Consult your doctor before making significant dietary changes.
          </p>
        </div>
      </div>
    </Card>
  );
};
