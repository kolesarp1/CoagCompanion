"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon } from './IconComponents';
import { landingContent } from '@/lib/landing-content';
import { fadeInUp, slideInLeft, slideInRight } from './animations';

interface CTASectionProps {
  isAuthenticated: boolean;
}

export const CTASection: React.FC<CTASectionProps> = ({ isAuthenticated }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Device Image */}
      <motion.div
        initial={slideInLeft.initial}
        whileInView={slideInLeft.animate}
        transition={slideInLeft.transition}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
          <Image
            src="/images/coaguchek-device.jpg"
            alt={landingContent.cta.deviceImageAlt}
            fill
            className="object-contain p-8"
            priority
          />
        </div>
      </motion.div>

      {/* Right: Content */}
      <motion.div
        initial={slideInRight.initial}
        whileInView={slideInRight.animate}
        transition={slideInRight.transition}
        viewport={{ once: true }}
        className="text-center lg:text-left"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {landingContent.cta.headline}
        </h2>
        <p className="text-xl text-white/90 mb-8">
          {landingContent.cta.subheadline}
        </p>

        {/* Device Benefits */}
        <ul className="space-y-4 mb-8">
          {landingContent.cta.deviceBenefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-white"
            >
              <CheckCircleIcon className="w-6 h-6 flex-shrink-0 text-green-300" />
              <span className="text-lg">{benefit}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <a
            href={landingContent.cta.ctaPrimaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[200px]"
          >
            <Button variant="primary" size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold">
              {landingContent.cta.ctaPrimary}
            </Button>
          </a>
          {isAuthenticated ? (
            <Link href="/dashboard" className="flex-1 min-w-[200px]">
              <Button variant="primary" size="lg" className="w-full bg-purple-700 text-white hover:bg-purple-800 font-bold">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/signup" className="flex-1 min-w-[200px]">
              <Button variant="primary" size="lg" className="w-full bg-purple-700 text-white hover:bg-purple-800 font-bold">
                {landingContent.cta.ctaSecondary}
              </Button>
            </Link>
          )}
        </div>

        <p className="text-sm text-white/70">
          {landingContent.cta.note}
        </p>
      </motion.div>
    </div>
  );
};
