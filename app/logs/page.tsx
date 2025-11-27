"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LogForm } from "@/components/forms/LogForm";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { supabaseStorage } from "@/lib/supabase-storage";
import { Log } from "@/lib/types";
import { LogFormData } from "@/lib/schemas";
import { formatDate, exportToCSV } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Papa from "papaparse";

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "inr" | "dose" | "injections">(
    "all"
  );

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, filterType]);

  const loadLogs = async () => {
    const allLogs = await supabaseStorage.getLogs();
    const sortedLogs = [...allLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setLogs(sortedLogs);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (filterType !== "all") {
      filtered = filtered.filter((log) => {
        switch (filterType) {
          case "inr":
            return log.labINR !== null || log.homeINR !== null;
          case "dose":
            return log.warfarinDose !== null;
          case "injections":
            return log.injections !== null && log.injections !== "";
          default:
            return true;
        }
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.date.includes(searchQuery) ||
          log.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.injections?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const handleAddLog = async (data: LogFormData) => {
    const newLog: Log = {
      id: `log-${Date.now()}`,
      date: data.date.toISOString().split("T")[0],
      labINR: data.labINR ?? null,
      homeINR: data.homeINR ?? null,
      warfarinDose: data.warfarinDose ?? null,
      injections: data.injections ?? null,
      comment: data.comment ?? null,
      vitaminKIntake: data.vitaminKIntake ?? null,
    };

    await supabaseStorage.addLog(newLog);
    await loadLogs();
    setIsAddModalOpen(false);
    toast.success("Log added successfully!");
  };

  const handleEditLog = async (data: LogFormData) => {
    if (!selectedLog) return;

    const updatedLog: Partial<Log> = {
      date: data.date.toISOString().split("T")[0],
      labINR: data.labINR ?? null,
      homeINR: data.homeINR ?? null,
      warfarinDose: data.warfarinDose ?? null,
      injections: data.injections ?? null,
      comment: data.comment ?? null,
      vitaminKIntake: data.vitaminKIntake ?? null,
    };

    await supabaseStorage.updateLog(selectedLog.id, updatedLog);
    await loadLogs();
    setIsEditModalOpen(false);
    setSelectedLog(null);
    toast.success("Log updated successfully!");
  };

  const handleDeleteLog = async () => {
    if (!selectedLog) return;

    await supabaseStorage.deleteLog(selectedLog.id);
    await loadLogs();
    setIsDeleteModalOpen(false);
    setSelectedLog(null);
    toast.success("Log deleted successfully!");
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(logs);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coag-companion-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported successfully!");
  };

  const handleExportJSON = async () => {
    const data = await supabaseStorage.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coag-companion-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("JSON backup exported successfully!");
  };

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const success = await supabaseStorage.importData(content);
      if (success) {
        await loadLogs();
        toast.success("Data imported successfully!");
      } else {
        toast.error("Failed to import data. Please check the file format.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Disclaimer />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Logs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your INR, doses, and injections
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
            + Add Log
          </Button>
          <Button onClick={handleExportCSV} variant="secondary">
            Export CSV
          </Button>
          <Button onClick={handleExportJSON} variant="secondary">
            Backup JSON
          </Button>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <span className="inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
              Import JSON
            </span>
          </label>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by date, comment, or injections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Logs</option>
            <option value="inr">INR Only</option>
            <option value="dose">Doses Only</option>
            <option value="injections">Injections Only</option>
          </select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No logs found. Add your first log to get started!
            </div>
          </Card>
        ) : (
          filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(log.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lab / Home INR
                      </p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">
                        {log.labINR !== null ? log.labINR.toFixed(1) : "-"} /{" "}
                        {log.homeINR !== null ? log.homeINR.toFixed(1) : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Warfarin Dose
                      </p>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        {log.warfarinDose !== null
                          ? `${log.warfarinDose} mg`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Injections
                      </p>
                      <p className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                        {log.injections || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedLog(log);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedLog(log);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                {(log.comment || log.vitaminKIntake) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {log.vitaminKIntake && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Vitamin K:</span>{" "}
                        {log.vitaminKIntake}
                      </p>
                    )}
                    {log.comment && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Notes:</span> {log.comment}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Log"
      >
        <LogForm
          onSubmit={handleAddLog}
          onCancel={() => setIsAddModalOpen(false)}
          mode="add"
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLog(null);
        }}
        title="Edit Log"
      >
        {selectedLog && (
          <LogForm
            onSubmit={handleEditLog}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedLog(null);
            }}
            initialData={selectedLog}
            mode="edit"
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLog(null);
        }}
        title="Delete Log"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this log? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleDeleteLog} className="flex-1">
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedLog(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
