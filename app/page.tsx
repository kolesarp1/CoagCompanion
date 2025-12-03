"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { DashboardQuickStats } from "@/components/dashboard/DashboardQuickStats";
import { DoseSuggestionCard } from "@/components/ui/DoseSuggestionCard";
import { VitaminKSuggestionCard } from "@/components/ui/VitaminKSuggestionCard";
import { SevenDayHistory } from "@/components/timeline/SevenDayHistory";
import { createClient } from "@/lib/supabase/client";
import { supabaseStorage } from "@/lib/supabase-storage";
import { getSampleLogs, getSampleSettings } from "@/lib/sample-data";
import { calculateDashboardStats } from "@/lib/utils";
import { calculateDoseSuggestion } from "@/lib/dose-algorithm";
import { predictINR } from "@/lib/linear-regression";
import { Log, DoseSuggestion, INRPrediction } from "@/lib/types";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [doseSuggestion, setDoseSuggestion] = useState<DoseSuggestion | null>(null);
  const [predictions, setPredictions] = useState<INRPrediction[]>([]);
  const [targetMin, setTargetMin] = useState(2.0);
  const [targetMax, setTargetMax] = useState(3.0);
  const [testTime, setTestTime] = useState("10:00");
  const [doseTime, setDoseTime] = useState("13:00");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentLog, setCurrentLog] = useState<Log | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    let allLogs: Log[];
    let settings;

    if (user) {
      // User is authenticated - load their data
      setIsAuthenticated(true);
      allLogs = await supabaseStorage.getLogs();
      settings = await supabaseStorage.getSettings();
    } else {
      // User is not authenticated - load sample data
      setIsAuthenticated(false);
      allLogs = getSampleLogs();
      settings = getSampleSettings();
    }

    setTargetMin(settings.targetINRMin);
    setTargetMax(settings.targetINRMax);
    setTestTime(settings.inrTestTime);
    setDoseTime(settings.doseTime);

    const sortedLogs = [...allLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setLogs(sortedLogs);

    // Calculate dose suggestion if we have a recent home INR
    const recentHomeINR = sortedLogs
      .filter((log) => log.homeINR !== null)
      .slice(-1)[0];

    if (recentHomeINR && recentHomeINR.homeINR !== null) {
      const suggestion = calculateDoseSuggestion(recentHomeINR.homeINR, sortedLogs);
      setDoseSuggestion(suggestion);
      setCurrentLog(recentHomeINR);
    } else {
      setCurrentLog(null);
    }

    // Calculate predictions
    const inrPredictions = predictINR(sortedLogs);
    setPredictions(inrPredictions);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadData();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Your Health at a Glance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Your Health at a Glance
          </h2>
          <DashboardQuickStats
            logs={logs}
            targetMin={targetMin}
            targetMax={targetMax}
            testTime={testTime}
            doseTime={doseTime}
            isAuthenticated={isAuthenticated}
            onNewReading={loadData}
          />
        </motion.div>

        {/* Dose Suggestion Section */}
        {doseSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <DoseSuggestionCard
              suggestion={doseSuggestion}
              currentLog={currentLog}
              onDoseAccepted={loadData}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        )}

        {/* Vitamin K Suggestion Section */}
        {doseSuggestion?.vitaminKSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <VitaminKSuggestionCard
              suggestion={doseSuggestion.vitaminKSuggestion}
              currentLog={currentLog}
              onVitaminKAccepted={loadData}
              isAuthenticated={isAuthenticated}
            />
          </motion.div>
        )}

        {/* 7-Day History Timeline */}
        {logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <SevenDayHistory
              logs={logs}
              targetMin={targetMin}
              targetMax={targetMax}
            />
          </motion.div>
        )}

        {/* INR Predictions Section */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                INR Predictions (Next 3 Days)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Based on linear regression of your last 7 readings
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {new Date(prediction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {prediction.predictedINR.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Predicted INR
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}
