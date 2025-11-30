"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TypicalPatientEducation - Educational component about INR target ranges
 * Information about different patient types and their therapeutic ranges
 */
export function TypicalPatientEducation(): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🎯 Target INR Ranges by Patient Type
          </h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400 dark:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-6">
              {/* Introduction */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                  Your target INR range depends on your specific medical condition and the type of
                  mechanical valve (if applicable). <strong>Never adjust your target range without
                  consulting your doctor.</strong> The ranges below are general guidelines from
                  clinical practice.
                </p>
              </div>

              {/* Mechanical Heart Valves */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  🫀 Mechanical Heart Valves
                </h4>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-green-900 dark:text-green-300">
                        On-X Valve (Aortic Position)
                      </h5>
                      <span className="px-3 py-1 text-lg font-bold bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 rounded-full">
                        1.5 - 2.0
                      </span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-400">
                      The On-X valve is approved for a lower INR range (1.5-2.0) in the aortic position
                      for low-risk patients without atrial fibrillation. This is the ONLY mechanical
                      valve with FDA approval for this reduced range.
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                      <strong>Note:</strong> On-X in mitral position or with additional risk factors
                      typically requires 2.0-3.0 range (see below).
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-blue-900 dark:text-blue-300">
                        St. Jude Medical Valve (Standard Range)
                      </h5>
                      <span className="px-3 py-1 text-lg font-bold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200 rounded-full">
                        2.0 - 3.0
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      Most common target range for St. Jude Medical mechanical valves (aortic or
                      mitral position). This range is also standard for most other modern bileaflet
                      mechanical valves (e.g., ATS, Medtronic Hall, Carbomedics).
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-purple-900 dark:text-purple-300">
                        Older Mechanical Valves (Tilting Disk, Ball-and-Cage)
                      </h5>
                      <span className="px-3 py-1 text-lg font-bold bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full">
                        2.5 - 3.5
                      </span>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-400">
                      Older valve designs (e.g., Bjork-Shiley tilting disk, Starr-Edwards ball-and-cage)
                      are more thrombogenic and require higher INR targets. If you have an older valve,
                      follow your cardiologist's specific recommendations.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                      ⚠️ Additional Risk Factors May Increase Target Range
                    </p>
                    <ul className="text-sm text-red-800 dark:text-red-400 space-y-1 ml-4 list-disc">
                      <li>Atrial fibrillation (AFib)</li>
                      <li>Previous thromboembolism or stroke</li>
                      <li>Left atrial enlargement</li>
                      <li>Low ejection fraction (heart failure)</li>
                      <li>Hypercoagulable state</li>
                    </ul>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                      If you have any of these, your doctor may target 2.5-3.5 even with a modern valve.
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Indications */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  💊 Other Common Warfarin Indications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Atrial Fibrillation (Stroke Prevention)
                      </p>
                      <span className="px-2 py-1 text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded">
                        2.0 - 3.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      For non-valvular AFib. May use DOACs instead if no mechanical valve.
                    </p>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Deep Vein Thrombosis (DVT) / Pulmonary Embolism (PE)
                      </p>
                      <span className="px-2 py-1 text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded">
                        2.0 - 3.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Treatment and prevention of venous thromboembolism.
                    </p>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Antiphospholipid Syndrome (APS)
                      </p>
                      <span className="px-2 py-1 text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded">
                        2.0 - 3.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      May require higher target (2.5-3.5) for recurrent events.
                    </p>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        Elderly / Frail / High Bleeding Risk
                      </p>
                      <span className="px-2 py-1 text-sm font-bold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded">
                        1.8 - 2.5
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Lower range balances clot prevention with bleeding risk. Individualized by doctor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Understanding INR Numbers */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  📊 What Do INR Numbers Mean?
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="px-3 py-1 font-bold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 rounded">
                      1.0
                    </span>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Normal blood (no anticoagulation) - Not safe for mechanical valves
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="px-3 py-1 font-bold text-green-900 dark:text-green-300 bg-green-200 dark:bg-green-800 rounded">
                      2.0-3.0
                    </span>
                    <p className="text-sm text-green-800 dark:text-green-400">
                      Therapeutic range for most patients - Blood takes 2-3 times longer to clot
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <span className="px-3 py-1 font-bold text-yellow-900 dark:text-yellow-300 bg-yellow-200 dark:bg-yellow-800 rounded">
                      3.5-4.5
                    </span>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      Above target - Increased bleeding risk, dose adjustment needed
                    </p>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span className="px-3 py-1 font-bold text-red-900 dark:text-red-300 bg-red-200 dark:bg-red-800 rounded">
                      &gt;5.0
                    </span>
                    <p className="text-sm text-red-800 dark:text-red-400">
                      Dangerously high - Contact doctor immediately, may need vitamin K reversal
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Reminders */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
                <h4 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-3">
                  ⚠️ Important Reminders
                </h4>
                <ul className="space-y-2 text-sm text-yellow-900 dark:text-yellow-300">
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                    <span>
                      <strong>Your target range is determined by your doctor</strong> based on your
                      specific valve type, position, and risk factors
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                    <span>
                      Never change your target range or warfarin dose without medical supervision
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                    <span>
                      INR testing frequency: Weekly when starting, then every 2-4 weeks when stable
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                    <span>
                      Time in Therapeutic Range (TTR) &gt;70% is the goal for good outcomes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 dark:text-yellow-400 mr-2">•</span>
                    <span>
                      If you miss a dose or have an INR out of range, contact your anticoagulation
                      clinic or doctor immediately
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
