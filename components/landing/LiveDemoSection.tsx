"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { INRChart } from '@/components/charts/INRChart';
import { DoseChart } from '@/components/charts/DoseChart';
import { getSampleLogs, getSampleSettings } from '@/lib/sample-data';
import { landingContent } from '@/lib/landing-content';
import { fadeInScale } from './animations';

interface LiveDemoSectionProps {
  showINRChart?: boolean;
  showDoseChart?: boolean;
}

export const LiveDemoSection: React.FC<LiveDemoSectionProps> = ({
  showINRChart = true,
  showDoseChart = true
}) => {
  // Use sample data - take last 30 entries for cleaner demo
  const allLogs = getSampleLogs();
  const demoLogs = allLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30)
    .reverse(); // Reverse back to chronological order

  const demoSettings = getSampleSettings();

  return (
    <div className="space-y-8">
      {/* Badge */}
      <motion.div
        className="flex justify-center"
        initial={fadeInScale.initial}
        whileInView={fadeInScale.animate}
        transition={fadeInScale.transition}
        viewport={{ once: true }}
      >
        <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
          {landingContent.demo.badge}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {showINRChart && (
          <motion.div
            initial={fadeInScale.initial}
            whileInView={fadeInScale.animate}
            transition={{ ...fadeInScale.transition, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-900 dark:bg-black border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {landingContent.demo.inrChartLabel}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {landingContent.demo.inrChartSubtitle}
              </p>
              <INRChart
                logs={demoLogs}
                targetMin={demoSettings.targetINRMin}
                targetMax={demoSettings.targetINRMax}
                showArea={true}
              />
            </Card>
          </motion.div>
        )}

        {showDoseChart && (
          <motion.div
            initial={fadeInScale.initial}
            whileInView={fadeInScale.animate}
            transition={{ ...fadeInScale.transition, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-900 dark:bg-black border border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {landingContent.demo.doseChartLabel}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {landingContent.demo.doseChartSubtitle}
              </p>
              <DoseChart logs={demoLogs} />
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
