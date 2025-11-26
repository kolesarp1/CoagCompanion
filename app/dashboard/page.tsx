"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { INRChart } from "@/components/charts/INRChart";
import { DoseChart } from "@/components/charts/DoseChart";
import { DoseSuggestionCard } from "@/components/ui/DoseSuggestionCard";
import { storage } from "@/lib/storage";
import { calculateDashboardStats, getINRColor, getINRStatus } from "@/lib/utils";
import { calculateDoseSuggestion } from "@/lib/dose-algorithm";
import { predictINR } from "@/lib/linear-regression";
import { Log, DashboardStats, DoseSuggestion, INRPrediction } from "@/lib/types";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [doseSuggestion, setDoseSuggestion] = useState<DoseSuggestion | null>(null);
  const [predictions, setPredictions] = useState<INRPrediction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allLogs = storage.getLogs();
    const settings = storage.getSettings();

    const sortedLogs = [...allLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setLogs(sortedLogs);

    const dashboardStats = calculateDashboardStats(sortedLogs, settings);
    setStats(dashboardStats);

    // Calculate dose suggestion if we have a recent home INR
    const recentHomeINR = sortedLogs
      .filter((log) => log.homeINR !== null)
      .slice(-1)[0];

    if (recentHomeINR && recentHomeINR.homeINR !== null) {
      const suggestion = calculateDoseSuggestion(recentHomeINR.homeINR, sortedLogs);
      setDoseSuggestion(suggestion);
    }

    // Calculate predictions
    const inrPredictions = predictINR(sortedLogs);
    setPredictions(inrPredictions);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  const inrStatus = getINRStatus(
    stats.lastINR,
    parseFloat(stats.currentTarget.split(" - ")[0]),
    parseFloat(stats.currentTarget.split(" - ")[1])
  );
  const inrColor = getINRColor(inrStatus);

  return (
    <div className="max-w-7xl mx-auto">
      <Disclaimer />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your anticoagulation therapy
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card animate>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Current INR Target
            </p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.currentTarget}
            </p>
          </div>
        </Card>

        <Card animate>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Last INR ({stats.lastINRType === "home" ? "Home" : "Lab"})
            </p>
            <p className={`text-2xl font-bold ${inrColor}`}>
              {stats.lastINR !== null ? stats.lastINR.toFixed(1) : "N/A"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {stats.lastINRDate
                ? new Date(stats.lastINRDate).toLocaleDateString()
                : ""}
            </p>
          </div>
        </Card>

        <Card animate>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Avg INR (30 days)
            </p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.averageINR30Days !== null
                ? stats.averageINR30Days.toFixed(1)
                : "N/A"}
            </p>
          </div>
        </Card>

        <Card animate>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Total Doses Logged
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalDosesLogged}
            </p>
          </div>
        </Card>
      </div>

      {stats.recentAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Alerts
            </h3>
            <ul className="space-y-2">
              {stats.recentAlerts.map((alert, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {doseSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DoseSuggestionCard suggestion={doseSuggestion} />
        </motion.div>
      )}

      {predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {new Date(prediction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card title="INR Trend (Last 30 Readings)">
            <INRChart
              logs={logs}
              targetMin={parseFloat(stats.currentTarget.split(" - ")[0])}
              targetMax={parseFloat(stats.currentTarget.split(" - ")[1])}
            />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title="Warfarin Dose History (Last 30 Days)">
            <DoseChart logs={logs} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
