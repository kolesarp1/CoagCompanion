"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import { DoseSuggestion, Log } from "@/lib/types";
import { supabaseStorage } from "@/lib/supabase-storage";
import toast from "react-hot-toast";

interface DoseSuggestionCardProps {
  suggestion: DoseSuggestion;
  currentLog?: Log | null;
  onDoseAccepted?: () => void;
  isAuthenticated?: boolean;
}

export const DoseSuggestionCard: React.FC<DoseSuggestionCardProps> = ({
  suggestion,
  currentLog = null,
  onDoseAccepted,
  isAuthenticated = false,
}) => {
  const [customDose, setCustomDose] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAcceptDose = async () => {
    if (!currentLog || !currentLog.id || !isAuthenticated) {
      toast.error("Cannot save dose. Please log in.");
      return;
    }

    setIsSaving(true);
    try {
      await supabaseStorage.updateLog(currentLog.id, {
        warfarinDose: suggestion.suggestedDose,
      });
      toast.success(`Dose ${suggestion.suggestedDose}mg saved ✓`);

      if (onDoseAccepted) {
        onDoseAccepted();
      }
    } catch (error) {
      console.error("Error saving dose:", error);
      toast.error("Failed to save dose. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCustomDose = async () => {
    if (!currentLog || !currentLog.id || !isAuthenticated) {
      toast.error("Cannot save dose. Please log in.");
      return;
    }

    const doseValue = parseInt(customDose);

    // Validation
    if (isNaN(doseValue)) {
      toast.error("Please enter a valid dose value");
      return;
    }

    if (doseValue < 1 || doseValue > 100) {
      toast.error("Dose must be between 1 and 100 mg");
      return;
    }

    setIsSaving(true);
    try {
      await supabaseStorage.updateLog(currentLog.id, {
        warfarinDose: doseValue,
      });
      toast.success(`Custom dose ${doseValue}mg saved ✓`);
      setCustomDose("");

      if (onDoseAccepted) {
        onDoseAccepted();
      }
    } catch (error) {
      console.error("Error saving custom dose:", error);
      toast.error("Failed to save custom dose. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customDose.trim() !== "") {
      handleSaveCustomDose();
    }
  };
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

        {suggestion.vitaminKSuggestion && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">
              💊 Vitamin K Recommendation:
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              {suggestion.vitaminKSuggestion}
            </p>
          </div>
        )}

        {suggestion.warning && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              {suggestion.warning}
            </p>
          </div>
        )}

        {/* Dose Acceptance Section */}
        {isAuthenticated && currentLog && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Quick Dose Entry
            </h5>

            {/* Accept Suggested Dose Button */}
            <button
              onClick={handleAcceptDose}
              disabled={isSaving}
              className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isSaving ? "Saving..." : `✓ Accept ${suggestion.suggestedDose}mg`}
            </button>

            {/* Custom Dose Input */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={customDose}
                onChange={(e) => setCustomDose(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Or enter custom dose"
                disabled={isSaving}
                className="flex-1 px-4 py-2 text-center font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all disabled:opacity-50"
              />
              <button
                onClick={handleSaveCustomDose}
                disabled={isSaving || customDose.trim() === ""}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Save
              </button>
            </div>
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
