"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VitaminKEducation - Educational component about Vitamin K role in Warfarin therapy
 * Comprehensive guide for patients with mechanical heart valves
 */
export function VitaminKEducation(): React.ReactElement {
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
            🥬 Role of Vitamin K in Warfarin Therapy
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
                <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                  For Patients with Mechanical Heart Valves on Warfarin
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Warfarin works by blocking vitamin K-dependent clotting factors (II, VII, IX, X, and
                  proteins C & S). To keep your INR stable on warfarin, the most important variable you
                  can control (besides taking your doses consistently) is <strong>maintaining consistent
                  day-to-day vitamin K intake</strong>.
                </p>
              </div>

              {/* Key Facts */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Critical Facts You Need to Understand
                </h4>
                <div className="space-y-3">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                      1️⃣ Vitamin K is the Direct Antagonist of Warfarin
                    </p>
                    <ul className="text-sm text-red-800 dark:text-red-400 space-y-1 ml-4 list-disc">
                      <li>
                        Suddenly eat <strong>more</strong> vitamin K → INR drops (blood less
                        anticoagulated) → higher risk of valve thrombosis or stroke
                      </li>
                      <li>
                        Suddenly eat <strong>less</strong> vitamin K → INR rises → higher bleeding risk
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <p className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">
                      2️⃣ The Effect is Dose-Dependent and Has a Delay
                    </p>
                    <p className="text-sm text-orange-800 dark:text-orange-400">
                      Large changes in vitamin K intake affect INR most noticeably{" "}
                      <strong>24-72 hours later</strong> (sometimes up to 5-7 days if the change is
                      extreme). Plan ahead and track your intake daily.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
                      3️⃣ Consistency Over Total Avoidance
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-400">
                      Official guidelines (American College of Chest Physicians, European Society of
                      Cardiology) recommend: <strong>"Maintain consistent intake of vitamin K-containing
                      foods rather than markedly restricting them."</strong>
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                      In practice: Eat roughly the same amount of vitamin K every day. Most patients do
                      well in the <strong>60-150 mcg/day range</strong>; some need 200-300 mcg if
                      vitamin K-resistant.
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
                      4️⃣ Your Body Needs Vitamin K
                    </p>
                    <p className="text-sm text-purple-800 dark:text-purple-400 mb-2">
                      Vitamin K1 (phylloquinone) from green vegetables is essential for:
                    </p>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1 ml-4 list-disc">
                      <li>Normal blood-clotting factor synthesis</li>
                      <li>Bone health (osteocalcin production)</li>
                      <li>
                        Vascular health (matrix Gla protein prevents arterial calcification - crucial
                        for valve patients!)
                      </li>
                    </ul>
                    <p className="text-sm text-purple-800 dark:text-purple-400 mt-2">
                      Long-term very low vitamin K intake (&lt;30-40 mcg/day) has been linked to increased
                      vascular calcification, lower bone density, and higher fracture risk.{" "}
                      <strong>Aggressively avoiding vitamin K is NOT recommended and can harm you.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Practical Management */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Practical Vitamin K Management
                </h4>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
                    Target for Most Patients on Stable Warfarin:
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    60-150 mcg/day
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Eaten consistently every day (some patients need higher, some a bit lower)
                  </p>
                </div>
              </div>

              {/* Food Reference Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Vitamin K Content in Common Foods
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Food
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Serving
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Vitamin K (mcg)
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr className="bg-red-50 dark:bg-red-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Kale, cooked
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ cup
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-400">
                          500-600
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full">
                            Very High
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-red-50 dark:bg-red-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Spinach, cooked
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ cup
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-400">
                          400-500
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full">
                            Very High
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-orange-50 dark:bg-orange-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Broccoli, cooked
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ cup
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                          110
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 rounded-full">
                            High
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-orange-50 dark:bg-orange-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Brussels sprouts
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ cup
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                          100-150
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 rounded-full">
                            High
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Green beans
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ cup
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                          20-30
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full">
                            Low-Moderate
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Avocado
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          ½ medium
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                          20-25
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full">
                            Low
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-yellow-50 dark:bg-yellow-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Kiwi
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          1 fruit
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                          30-40
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full">
                            Low-Moderate
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Butter / Olive oil
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          1 Tbsp
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400">
                          ~10
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full">
                            Very Low
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-green-50 dark:bg-green-900/20">
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">
                          Most meats, dairy, grains
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-400">
                          -
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400">
                          &lt;5
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full">
                            Negligible
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
                  ✅ Key Takeaways for Your App
                </h4>
                <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>
                      You <strong>must eat vitamin K regularly and consistently</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>
                      Aim for the <strong>same amount every day</strong> (most patients: 80-150 mcg)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>
                      Track it in your app and <strong>flag big deviations</strong> the same way you flag
                      missed doses
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                    <span>
                      Combine recent vitamin K changes with latest INR when the algorithm suggests
                      next dose or next test date
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
