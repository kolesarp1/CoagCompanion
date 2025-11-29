"use client";

import React, { useState, useEffect } from "react";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { MigrationPrompt } from "@/components/auth/MigrationPrompt";
import { HeroSection } from "@/components/landing/HeroSection";
import { SectionHeader } from "@/components/landing/SectionHeader";
import { QuickStatsSection } from "@/components/landing/QuickStatsSection";
import { LiveDemoSection } from "@/components/landing/LiveDemoSection";
import { CTASection } from "@/components/landing/CTASection";
import { landingContent } from "@/lib/landing-content";
import { createClient } from "@/lib/supabase/client";
import { supabaseStorage } from "@/lib/supabase-storage";
import { getSampleLogs, getSampleSettings } from "@/lib/sample-data";
import type { User } from "@supabase/supabase-js";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [lastINR, setLastINR] = useState<number | null>(2.5);
  const [targetMin, setTargetMin] = useState(2.0);
  const [targetMax, setTargetMax] = useState(3.0);
  const supabase = createClient();

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Get data for stats
      let logs, settings;
      if (user) {
        logs = await supabaseStorage.getLogs();
        settings = await supabaseStorage.getSettings();
      } else {
        logs = getSampleLogs();
        settings = getSampleSettings();
      }

      setTargetMin(settings.targetINRMin);
      setTargetMax(settings.targetINRMax);

      // Get last INR
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
    };
    initData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        initData();
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

      {/* 1. Hero Section - Full viewport with gradient background */}
      <section className="min-h-screen flex items-center justify-center gradient-bg-hero">
        <HeroSection isAuthenticated={!!user} />
      </section>

      {/* 2. Quick Stats Section - White background */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <SectionHeader
            title="Your Health at a Glance"
            subtitle="Real-time tracking of your anticoagulation therapy"
          />
          <QuickStatsSection
            lastINR={lastINR}
            targetMin={targetMin}
            targetMax={targetMax}
          />
        </div>
      </section>

      {/* 3. Live Demo Section - Dark background */}
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

      {/* 4. CTA Section - Gradient background */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container max-w-6xl mx-auto px-4">
          <CTASection isAuthenticated={!!user} />
        </div>
      </section>

      {/* 5. Disclaimer Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <Disclaimer />
        </div>
      </section>
    </main>
  );
}
