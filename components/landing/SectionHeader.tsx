"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from './animations';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, light = false }) => {
  return (
    <motion.div
      className="text-center mb-16"
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      transition={fadeInUp.transition}
      viewport={{ once: true }}
    >
      <h2 className={`section-headline mb-4 ${light ? 'text-white' : 'gradient-text'}`}>
        {title}
      </h2>
      <p className={`text-lg md:text-xl max-w-3xl mx-auto ${light ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
        {subtitle}
      </p>
    </motion.div>
  );
};
