"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { fadeInUp } from './animations';

interface QuickStatsSectionProps {
  lastINR: number | null;
  targetMin: number;
  targetMax: number;
}

const getINRColor = (inr: number | null, targetMin: number, targetMax: number): string => {
  if (inr === null) return 'text-gray-600 dark:text-gray-400';
  if (inr >= targetMin && inr <= targetMax) return 'text-green-600 dark:text-green-400';
  if ((inr >= targetMin - 0.3 && inr < targetMin) || (inr > targetMax && inr <= targetMax + 0.3)) {
    return 'text-yellow-600 dark:text-yellow-400';
  }
  return 'text-red-600 dark:text-red-400';
};

export const QuickStatsSection: React.FC<QuickStatsSectionProps> = ({
  lastINR,
  targetMin,
  targetMax
}) => {
  const inrColor = getINRColor(lastINR, targetMin, targetMax);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Last INR */}
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0 }}
        viewport={{ once: true }}
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
            {lastINR !== null ? lastINR.toFixed(1) : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Target: {targetMin.toFixed(1)} - {targetMax.toFixed(1)}
          </p>
        </Card>
      </motion.div>

      {/* Test Time */}
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Card className="p-8 text-center hover:shadow-2xl transition-shadow duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full mb-6">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Test Time
          </h3>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            10:00 AM
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Blood sample collection
          </p>
        </Card>
      </motion.div>

      {/* Dose Time */}
      <motion.div
        initial={fadeInUp.initial}
        whileInView={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.2 }}
        viewport={{ once: true }}
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
            1:00 PM
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Daily Warfarin dose
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
