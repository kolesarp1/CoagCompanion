"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { MigrationPrompt } from "@/components/auth/MigrationPrompt";
import { createClient } from "@/lib/supabase/client";
import { supabaseStorage } from "@/lib/supabase-storage";
import { getSampleLogs, getSampleSettings } from "@/lib/sample-data";
import { getINRStatus, getINRColor } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lastINR, setLastINR] = useState<number | null>(null);
  const [targetMin, setTargetMin] = useState(2.0);
  const [targetMax, setTargetMax] = useState(3.0);
  const supabase = createClient();

  useEffect(() => {
    initializeData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        await initializeData();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeData = async () => {
    // Check authentication status
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    let logs, settings;

    if (user) {
      // Authenticated user - use Supabase storage
      logs = await supabaseStorage.getLogs();
      settings = await supabaseStorage.getSettings();
    } else {
      // Non-authenticated user - show sample data
      logs = getSampleLogs();
      settings = getSampleSettings();
    }

    // Get settings and last INR
    setTargetMin(settings.targetINRMin);
    setTargetMax(settings.targetINRMax);

    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const log of sortedLogs) {
      if (log.homeINR !== null && log.homeINR !== undefined) {
        setLastINR(log.homeINR);
        break;
      } else if (log.labINR !== null && log.labINR !== undefined) {
        setLastINR(log.labINR);
        break;
      }
    }

    setIsInitialized(true);

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  };

  const inrStatus = getINRStatus(lastINR, targetMin, targetMax);
  const inrColor = getINRColor(inrStatus);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Disclaimer />

      {user && (
        <div className="mb-6">
          <MigrationPrompt />
        </div>
      )}

      {!user && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            You're viewing sample data.{" "}
            <Link href="/signup" className="font-semibold hover:underline">
              Sign up
            </Link>{" "}
            or{" "}
            <Link href="/login" className="font-semibold hover:underline">
              sign in
            </Link>{" "}
            to save your own data.
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to CoagCompanion
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your personal Warfarin tracking companion
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card animate>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
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
              Last INR
            </h3>
            <p className={`text-3xl font-bold ${inrColor}`}>
              {lastINR !== null ? lastINR.toFixed(1) : "N/A"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Target: {targetMin.toFixed(1)} - {targetMax.toFixed(1)}
            </p>
          </div>
        </Card>

        <Card animate>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Test Time
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              10:00 AM
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Blood sample collection
            </p>
          </div>
        </Card>

        <Card animate>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
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
              Dose Time
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              1:00 PM
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Daily Warfarin dose
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button variant="primary" className="w-full">
                  View Dashboard
                </Button>
              </Link>
              <Link href="/logs">
                <Button variant="secondary" className="w-full">
                  Manage Logs
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Important Reminders
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Take blood sample at 10:00 AM for accurate INR readings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Take Warfarin dose at 1:00 PM after knowing your INR</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>
                  If INR is below 2.0, consider bridging with Fraxiparine injections
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Monitor vitamin K intake (green leafy vegetables)</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
