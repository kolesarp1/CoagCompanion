"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { landingContent } from '@/lib/landing-content';
import { heroAnimation, heroStagger } from './animations';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      className="container max-w-5xl mx-auto px-4 py-20 md:py-32"
      variants={heroStagger}
      initial="initial"
      animate="animate"
    >
      <motion.div className="text-center" variants={heroAnimation}>
        <p className="text-sm md:text-base text-blue-600 dark:text-blue-400 font-semibold mb-6 uppercase tracking-wide">
          {landingContent.hero.preHeadline}
        </p>
      </motion.div>

      <motion.h1
        className="hero-headline gradient-text text-center mb-8"
        variants={heroAnimation}
      >
        {landingContent.hero.headline}
      </motion.h1>

      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        variants={heroAnimation}
      >
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          {landingContent.hero.story.split('**').map((part, index) => {
            // Even indices are normal text, odd indices are bold
            if (index % 2 === 0) {
              return <span key={index}>{part}</span>;
            } else {
              return <strong key={index} className="font-bold text-gray-900 dark:text-white">{part}</strong>;
            }
          })}
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        variants={heroAnimation}
      >
        {isAuthenticated ? (
          <>
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/logs">
              <Button variant="secondary" size="lg">
                View Logs
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signup">
              <Button variant="primary" size="lg">
                {landingContent.hero.ctaPrimary}
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={scrollToDemo}>
              {landingContent.hero.ctaSecondary}
            </Button>
          </>
        )}
      </motion.div>

      <motion.p
        className="text-center text-sm text-gray-600 dark:text-gray-400"
        variants={heroAnimation}
      >
        {landingContent.hero.trustSignal}
      </motion.p>
    </motion.div>
  );
};
