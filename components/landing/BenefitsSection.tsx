"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import {
  TrendingUpIcon,
  PillIcon,
  ShieldCheckIcon,
  BellIcon,
  CloudIcon,
  ShareIcon
} from './IconComponents';
import { fadeInUp } from './animations';

interface Benefit {
  title: string;
  description: string;
  gradient: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
}

const iconMap: Record<number, React.FC<{ className?: string }>> = {
  0: TrendingUpIcon,
  1: PillIcon,
  2: ShieldCheckIcon,
  3: BellIcon,
  4: CloudIcon,
  5: ShareIcon,
};

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({ benefits }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => {
        const IconComponent = iconMap[index];

        return (
          <motion.div
            key={index}
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="h-full"
          >
            <Card className="h-full p-8 hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`pattern-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-gray-900 dark:text-white" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill={`url(#pattern-${index})`} />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="benefit-title mb-4 text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
