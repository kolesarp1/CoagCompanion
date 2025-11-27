"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { migrateLocalStorageToSupabase, needsMigration } from "@/lib/migrate-to-supabase";

export function MigrationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    logsCount: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    checkMigration();
  }, []);

  const checkMigration = async () => {
    const needs = await needsMigration();
    setShowPrompt(needs);
  };

  const handleMigrate = async () => {
    setMigrating(true);
    const migrationResult = await migrateLocalStorageToSupabase();
    setResult(migrationResult);
    setMigrating(false);

    if (migrationResult.success) {
      // Hide prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(false);
      }, 3000);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Migrate Your Data
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We found existing data in your browser. Would you like to migrate it to your new account?
          </p>
        </div>

        {result ? (
          <div>
            {result.success ? (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200 text-sm">
                ✓ Successfully migrated {result.logsCount} log entries!
              </div>
            ) : (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 text-sm">
                Error: {result.error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleMigrate}
              disabled={migrating}
              className="flex-1"
            >
              {migrating ? "Migrating..." : "Migrate Data"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleDismiss}
              disabled={migrating}
              className="flex-1"
            >
              Skip
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
