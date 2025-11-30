"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { INRChart } from "@/components/charts/INRChart";
import { DoseChart } from "@/components/charts/DoseChart";
import { INRDoseCorrelation } from "@/components/charts/INRDoseCorrelation";
import { TimeInRange } from "@/components/charts/TimeInRange";
import { INRVariability } from "@/components/charts/INRVariability";
import { VitaminKChart } from "@/components/charts/VitaminKChart";
import { supabaseStorage } from "@/lib/supabase-storage";
import { getSampleLogs, getSampleSettings } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";
import { calculateDashboardStats, getINRColor, getINRStatus } from "@/lib/utils";
import { calculateDoseSuggestion } from "@/lib/dose-algorithm";
import { predictINR } from "@/lib/linear-regression";
import { Log, DashboardStats, DoseSuggestion, INRPrediction } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

type DateRange = "7d" | "30d" | "90d" | "6m" | "1y" | "all";
type ViewMode = "overview" | "detailed" | "correlation" | "variability";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [doseSuggestion, setDoseSuggestion] = useState<DoseSuggestion | null>(null);
  const [predictions, setPredictions] = useState<INRPrediction[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [targetMin, setTargetMin] = useState(2.0);
  const [targetMax, setTargetMax] = useState(3.0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLogsByDateRange();
  }, [logs, dateRange]);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

  const filterLogsByDateRange = () => {
    const now = new Date();
    let cutoffDate: Date;

    switch (dateRange) {
      case "7d":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "6m":
        cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case "all":
      default:
        setFilteredLogs(logs);
        return;
    }

    const filtered = logs.filter((log) => new Date(log.date) >= cutoffDate);
    setFilteredLogs(filtered);
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
    targetMin,
    targetMax
  );
  const inrColor = getINRColor(inrStatus);

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" },
    { value: "all", label: "All Time" },
  ];

  const viewModes: { value: ViewMode; label: string; icon: string }[] = [
    { value: "overview", label: "Overview", icon: "📊" },
    { value: "detailed", label: "Detailed", icon: "📈" },
    { value: "correlation", label: "Correlation", icon: "🔗" },
    { value: "variability", label: "Variability", icon: "📉" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Disclaimer />

      {!isAuthenticated && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Sample Data (Read-Only)</strong> - You are viewing demo data.{" "}
            <Link href="/login" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">
              Log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">
              sign up
            </Link>{" "}
            to track your own data.
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analysis of your anticoagulation therapy
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateRange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateRange === option.value
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                viewMode === mode.value
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span className="mr-2">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>
      </motion.div>

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

      {viewMode === "overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card title={`INR Trend - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
                <INRChart
                  logs={filteredLogs}
                  targetMin={targetMin}
                  targetMax={targetMax}
                  showArea={true}
                  showVitaminKLag={true}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card title={`Warfarin Dose History - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
                <DoseChart logs={filteredLogs} />
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card title="Vitamin K Intake Timeline">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Track your vitamin K intake over time. Green foods affect INR levels approximately 2 days later.
                  Hover over INR data points above to see vitamin K intake from 2 days prior.
                </p>
                <VitaminKChart logs={filteredLogs} />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card title="Time in Therapeutic Range">
                <TimeInRange logs={filteredLogs} targetMin={targetMin} targetMax={targetMax} />
              </Card>
            </motion.div>
          </div>
        </>
      )}

      {viewMode === "detailed" && (
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card title={`Detailed INR Analysis - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
              <INRChart
                logs={filteredLogs}
                targetMin={targetMin}
                targetMax={targetMax}
                showArea={true}
              />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card title={`Detailed Dose Analysis - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
              <DoseChart logs={filteredLogs} />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card title="Time in Therapeutic Range">
              <TimeInRange logs={filteredLogs} targetMin={targetMin} targetMax={targetMax} />
            </Card>
          </motion.div>
        </div>
      )}

      {viewMode === "correlation" && (
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card title={`INR vs Warfarin Dose Correlation - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This scatter plot shows the relationship between your Warfarin doses and resulting INR levels.
                Each point represents a measurement where both dose and INR were recorded.
              </p>
              <INRDoseCorrelation logs={filteredLogs} targetMin={targetMin} targetMax={targetMax} />
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card title="INR Trend with Vitamin K Indicators">
                <INRChart
                  logs={filteredLogs}
                  targetMin={targetMin}
                  targetMax={targetMax}
                  showVitaminKLag={true}
                />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card title="Dose Pattern">
                <DoseChart logs={filteredLogs} />
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Vitamin K Intake Timeline">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Vitamin K from green foods affects your INR approximately 2 days later.
                Compare this timeline with the INR trend above to see correlations.
              </p>
              <VitaminKChart logs={filteredLogs} />
            </Card>
          </motion.div>
        </div>
      )}

      {viewMode === "variability" && (
        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card title={`INR Variability Analysis - ${dateRangeOptions.find(o => o.value === dateRange)?.label}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                This chart shows how your INR changes between measurements. High variability may indicate
                inconsistent dosing, dietary changes, or other factors affecting your anticoagulation stability.
              </p>
              <INRVariability logs={filteredLogs} targetMin={targetMin} targetMax={targetMax} />
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card title="Distribution of Time in Range">
                <TimeInRange logs={filteredLogs} targetMin={targetMin} targetMax={targetMax} />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card title="INR Trend">
                <INRChart
                  logs={filteredLogs}
                  targetMin={targetMin}
                  targetMax={targetMax}
                />
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
