"use client";

import React, { useState, useEffect } from "react";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { MigrationPrompt } from "@/components/auth/MigrationPrompt";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { LiveDemoSection } from "@/components/landing/LiveDemoSection";
import { CTASection } from "@/components/landing/CTASection";
import { landingContent } from "@/lib/landing-content";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    initData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="w-full">
      {/* Migration Prompt for Authenticated Users */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <MigrationPrompt />
        </div>
      )}

      {/* Home Page Content at Top */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12,2C12,2 7,7 7,12C7,15.31 9.69,18 13,18C16.31,18 19,15.31 19,12C19,7 14,2 12,2M14.39,15.05C14.03,15.41 13.53,15.6 13,15.6C11.9,15.6 11,14.7 11,13.6C11,13.07 11.19,12.57 11.55,12.21L12,11.76L14.39,14.14C14.4,14.2 14.4,14.29 14.39,15.05Z" />
            </svg>
          </motion.div>

          {/* Welcome Message */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            CoagCompanion
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your Personal INR & Warfarin Tracking Companion
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Monitor your anticoagulation therapy with ease. Track INR levels, manage warfarin doses, and stay in control of your health.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Track INR Levels
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor both lab and home INR readings with visual trends over time
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Manage Doses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Log warfarin doses and get intelligent suggestions based on your history
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stay in Range
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyze time in therapeutic range and optimize your anticoagulation therapy
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 1. Hero Section - Full viewport with gradient background */}
      <section className="min-h-screen flex items-center justify-center gradient-bg-hero">
        <HeroSection isAuthenticated={!!user} />
      </section>

      {/* 2. Live Demo Section - Dark background */}
      <section id="demo" className="py-24 bg-gray-900 dark:bg-black">
        <div className="container max-w-7xl mx-auto px-4">
          <SectionHeader
            title={landingContent.demo.title}
            subtitle={landingContent.demo.subtitle}
            light={true}
          />
          <LiveDemoSection showINRChart showDoseChart />
        </div>
      </section>

      {/* 3. CTA Section - Gradient background */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container max-w-6xl mx-auto px-4">
          <CTASection isAuthenticated={!!user} />
        </div>
      </section>

      {/* 4. Disclaimer Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
