"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WarfarinEducation - Educational component about Warfarin
 * Provides information about what it is, history, alternatives, and usual dosage
 */
export function WarfarinEducation(): React.ReactElement {
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
            📚 About Warfarin
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
              {/* What is Warfarin */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What is Warfarin?
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Warfarin is an anticoagulant medication (blood thinner) that prevents blood clots
                  from forming or growing larger. It works by blocking vitamin K-dependent clotting
                  factors (II, VII, IX, X, and proteins C & S) in your blood. This makes your blood
                  take longer to clot, which is essential for patients with mechanical heart valves,
                  atrial fibrillation, or those at risk of stroke or deep vein thrombosis (DVT).
                </p>
              </div>

              {/* History */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Historical Background
                </h4>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
                  <p>
                    Warfarin was initially developed as a rat poison in the 1940s after scientists
                    discovered that spoiled sweet clover hay caused fatal bleeding in cattle. The
                    compound responsible was dicoumarol, which led to the synthesis of warfarin.
                  </p>
                  <p>
                    In 1954, warfarin was approved for medical use in humans after President Dwight
                    D. Eisenhower was successfully treated with it following a heart attack. It has
                    since become one of the most widely prescribed anticoagulants worldwide.
                  </p>
                  <p>
                    The name "warfarin" comes from WARF (Wisconsin Alumni Research Foundation) +
                    "-arin" (indicating its link to coumarin).
                  </p>
                </div>
              </div>

              {/* Alternatives */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Alternative Anticoagulants
                </h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Direct Oral Anticoagulants (DOACs)
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      <strong>Examples:</strong> Apixaban (Eliquis), Rivaroxaban (Xarelto),
                      Dabigatran (Pradaxa), Edoxaban (Savaysa)
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      <strong>Pros:</strong> No INR monitoring required, fewer dietary restrictions,
                      more predictable dosing
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      <strong>Cons:</strong> More expensive, NOT approved for mechanical heart valves,
                      limited reversal agents
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <p className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
                      Injectable Anticoagulants
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-400">
                      <strong>Examples:</strong> Enoxaparin (Lovenox), Dalteparin (Fragmin),
                      Fondaparinux (Arixtra)
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-2">
                      <strong>Use:</strong> Bridging therapy when INR is low, short-term treatment,
                      pregnancy (warfarin crosses placenta)
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="font-semibold text-red-900 dark:text-red-300 mb-1">
                      ⚠️ Important for Mechanical Valve Patients
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Warfarin remains the ONLY approved oral anticoagulant for patients with
                      mechanical heart valves. DOACs are contraindicated and have been associated
                      with increased risk of clot formation and stroke in this population.
                    </p>
                  </div>
                </div>
              </div>

              {/* Usual Dosage */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Typical Dosing Guidelines
                </h4>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Warfarin dosing is highly individualized based on genetics, diet, age, weight,
                    other medications, and the reason for anticoagulation. There is no "standard dose"
                    - your dose is determined by regular INR monitoring.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Average Maintenance Dose
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Most patients: <strong>3-8 mg/day</strong><br />
                        Common range: <strong>5-7 mg/day</strong><br />
                        Some patients need as little as 1-2 mg or as much as 15-20 mg
                      </p>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Initial Loading Dose
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Typical starting dose: <strong>5 mg/day</strong><br />
                        Elderly or frail: <strong>2.5 mg/day</strong><br />
                        Takes 3-7 days to reach therapeutic effect
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      <strong>⚠️ Never adjust your dose without consulting your doctor.</strong>
                      Small changes in warfarin dose can have significant effects on INR 2-7 days later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
