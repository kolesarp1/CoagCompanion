"use client";

import React from "react";
import { motion } from "framer-motion";
import { WarfarinEducation } from "@/components/education/WarfarinEducation";
import { VitaminKEducation } from "@/components/education/VitaminKEducation";
import { TypicalPatientEducation } from "@/components/education/TypicalPatientEducation";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function EducationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Educational Resources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Educational Resources
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Learn about warfarin therapy, vitamin K, and anticoagulation management
          </p>
          <div className="space-y-4">
            <WarfarinEducation />
            <VitaminKEducation />
            <TypicalPatientEducation />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
