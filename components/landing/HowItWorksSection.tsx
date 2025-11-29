"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import {
  DeviceIcon,
  TestIcon,
  LogIcon,
  ChartIcon,
  DoctorIcon
} from './IconComponents';
import { fadeInUp } from './animations';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps: Step[];
}

const iconMap: Record<number, React.FC<{ className?: string }>> = {
  1: DeviceIcon,
  2: TestIcon,
  3: LogIcon,
  4: ChartIcon,
  5: DoctorIcon,
};

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ steps }) => {
  return (
    <div className="relative">
      {/* Timeline line - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 -translate-y-1/2 z-0" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
        {steps.map((step, index) => {
          const IconComponent = iconMap[step.number];

          return (
            <motion.div
              key={step.number}
              initial={fadeInUp.initial}
              whileInView={fadeInUp.animate}
              transition={{ ...fadeInUp.transition, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              {/* Step Number Circle */}
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg relative z-20"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </motion.div>

              <Card className="p-6 text-center h-full bg-white dark:bg-gray-800">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="step-title mb-3 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
