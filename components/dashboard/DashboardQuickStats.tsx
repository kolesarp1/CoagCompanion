"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { supabaseStorage } from '@/lib/supabase-storage';
import { calculateDoseSuggestion } from '@/lib/dose-algorithm';
import { getINRColor, getINRStatus } from '@/lib/utils';
import { Log, DoseSuggestion } from '@/lib/types';
import toast from 'react-hot-toast';

interface DashboardQuickStatsProps {
  logs: Log[];
  targetMin: number;
  targetMax: number;
  testTime: string;
  doseTime: string;
  isAuthenticated: boolean;
  onNewReading: () => void;
}

export const DashboardQuickStats: React.FC<DashboardQuickStatsProps> = ({
  logs,
  targetMin,
  targetMax,
  testTime,
  doseTime,
  isAuthenticated,
  onNewReading,
}) => {
  const [inrInput, setInrInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [doseSuggestion, setDoseSuggestion] = useState<DoseSuggestion | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Get last INR
  const getLastINR = (): { value: number | null; date: string | null; type: string } => {
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const log of sortedLogs) {
      if (log.homeINR !== null && log.homeINR !== undefined) {
        return { value: log.homeINR, date: log.date, type: 'Home' };
      } else if (log.labINR !== null && log.labINR !== undefined) {
        return { value: log.labINR, date: log.date, type: 'Lab' };
      }
    }

    return { value: null, date: null, type: 'N/A' };
  };

  // Get last dose
  const getLastDose = (): { value: number | null; date: string | null } => {
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const log of sortedLogs) {
      if (log.warfarinDose !== null && log.warfarinDose !== undefined) {
        return { value: log.warfarinDose, date: log.date };
      }
    }

    return { value: null, date: null };
  };

  const lastINR = getLastINR();
  const lastDose = getLastDose();
  const inrStatus = getINRStatus(lastINR.value, targetMin, targetMax);
  const inrColor = getINRColor(inrStatus);

  const handleSaveReading = async () => {
    const inrValue = parseFloat(inrInput);

    // Validation
    if (isNaN(inrValue)) {
      toast.error('Please enter a valid INR value');
      return;
    }

    if (inrValue < 0.5 || inrValue > 10.0) {
      toast.error('INR must be between 0.5 and 10.0');
      return;
    }

    setIsSaving(true);

    try {
      // Create new log with only homeINR and current date
      const newLog: Partial<Log> = {
        date: new Date().toISOString(),
        homeINR: inrValue,
        labINR: null,
        warfarinDose: null,
        injections: null,
        comment: null,
        vitaminKIntake: null,
      };

      await supabaseStorage.addLog(newLog as Log);

      // Calculate dose suggestion
      const suggestion = calculateDoseSuggestion(inrValue, logs);
      setDoseSuggestion(suggestion);
      setShowSuggestion(true);

      // Success feedback
      toast.success(`INR ${inrValue.toFixed(1)} recorded ✓`);

      // Clear input
      setInrInput('');

      // Refocus input
      inputRef.current?.focus();

      // Notify parent to reload data
      onNewReading();
    } catch (error) {
      console.error('Error saving INR reading:', error);
      toast.error('Failed to save reading. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inrInput.trim() !== '') {
      handleSaveReading();
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {/* Card 1: Last INR */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0 }}
      >
        <Card className="p-8 text-center hover:shadow-2xl transition-shadow duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Last INR
          </h3>
          <p className={`text-4xl font-bold ${inrColor} mb-2`}>
            {lastINR.value !== null ? lastINR.value.toFixed(1) : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Target: {targetMin.toFixed(1)} - {targetMax.toFixed(1)}
          </p>
          {lastINR.date && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {new Date(lastINR.date).toLocaleDateString()}
            </p>
          )}
        </Card>
      </motion.div>

      {/* Card 2: Test Time (Interactive) */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
      >
        <Card className="p-8 text-center hover:shadow-2xl transition-shadow duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-400 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Test Time
          </h3>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {testTime}
          </p>

          {/* INR Input */}
          {isAuthenticated ? (
            <>
              <div className="mb-4">
                <input
                  ref={inputRef}
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10.0"
                  value={inrInput}
                  onChange={(e) => setInrInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter INR"
                  disabled={isSaving}
                  className="w-full px-4 py-3 text-center text-2xl font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-all disabled:opacity-50"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveReading}
                disabled={isSaving || inrInput.trim() === ''}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isSaving ? 'Saving...' : 'Save Reading'}
              </button>
            </>
          ) : (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Sign in to add readings
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Blood sample collection
          </p>
        </Card>
      </motion.div>

      {/* Card 3: Dose Time */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
      >
        <Card className="p-8 text-center hover:shadow-2xl transition-shadow duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-400 rounded-full mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Dose Time
          </h3>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {doseTime}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Daily Warfarin
          </p>

          {/* Show suggestion if just entered INR, otherwise show last dose */}
          {showSuggestion && doseSuggestion ? (
            <div className="mt-2">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Suggested: {doseSuggestion.suggestedDose}mg
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {doseSuggestion.suggestedDose > doseSuggestion.currentDose && '(↑ increase)'}
                {doseSuggestion.suggestedDose < doseSuggestion.currentDose && '(↓ decrease)'}
                {doseSuggestion.suggestedDose === doseSuggestion.currentDose && '(no change)'}
              </p>
            </div>
          ) : (
            lastDose.value !== null && (
              <div className="mt-2">
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  Last: {lastDose.value}mg
                </p>
                {lastDose.date && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(lastDose.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )
          )}
        </Card>
      </motion.div>
    </div>
  );
};
