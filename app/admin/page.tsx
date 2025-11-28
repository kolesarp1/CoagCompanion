"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const handleImportSampleData = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const response = await fetch('/api/import-sample-data', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult({
          success: true,
          message: data.message,
          count: data.count,
        });
        toast.success(data.message);
      } else {
        setImportResult({
          success: false,
          message: data.error || 'Failed to import sample data',
        });
        toast.error(data.error || 'Failed to import sample data');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setImportResult({
        success: false,
        message,
      });
      toast.error('Failed to import sample data');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Tools
        </h1>

        <Card className="mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Import Sample Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This will import all sample data (historical INR logs from September-November 2025)
                into your account. This is a one-time operation.
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                ⚠️ Warning: This will add sample data to your account. Make sure this is what you want!
              </p>
            </div>

            <Button
              onClick={handleImportSampleData}
              disabled={isImporting}
              variant="primary"
            >
              {isImporting ? 'Importing...' : 'Import Sample Data'}
            </Button>

            {importResult && (
              <div
                className={`p-4 rounded-lg ${
                  importResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    importResult.success
                      ? 'text-green-800 dark:text-green-400'
                      : 'text-red-800 dark:text-red-400'
                  }`}
                >
                  {importResult.message}
                </p>
                {importResult.count && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    {importResult.count} entries imported
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Quick Access
            </h2>
            <div className="space-y-2">
              <a
                href="/dashboard"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                → Go to Dashboard
              </a>
              <a
                href="/logs"
                className="text-blue-600 dark:text-blue-400 hover:underline block"
              >
                → Go to Logs
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
