"use client";

import React from "react";
import { Card } from "./Card";
import { DoseSuggestion } from "@/lib/types";

interface DoseSuggestionCardProps {
  suggestion: DoseSuggestion;
}

export const DoseSuggestionCard: React.FC<DoseSuggestionCardProps> = ({
  suggestion,
}) => {
  return (
    <Card animate className="border-l-4 border-blue-500">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dose Suggestion
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Based on AC Forum nomogram
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Maintenance
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {suggestion.currentDose} mg
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suggested Today
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {suggestion.suggestedDose} mg
            </p>
          </div>
        </div>

        {suggestion.alternatingPattern && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">
              Alternating Dose Pattern:
            </p>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {suggestion.alternatingPattern}
            </p>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Maintenance Adjustment:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {suggestion.maintenanceDoseChange}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reasoning:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {suggestion.reasoning}
          </p>
        </div>

        {suggestion.warning && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              {suggestion.warning}
            </p>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-400">
            ⚠️ This is an estimate based on general guidelines. Consult your doctor
            before making any changes to your medication.
          </p>
        </div>
      </div>
    </Card>
  );
};
