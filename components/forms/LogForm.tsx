"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { logSchema, LogFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Log } from "@/lib/types";

interface LogFormProps {
  onSubmit: (data: LogFormData) => void;
  onCancel: () => void;
  initialData?: Log;
  mode?: "add" | "edit";
}

export const LogForm: React.FC<LogFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode = "add",
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
        }
      : {
          date: new Date(),
        },
  });

  const inputClasses =
    "w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="date" className={labelClasses}>
          Date *
        </label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="yyyy-MM-dd"
              className={inputClasses}
              maxDate={new Date()}
              placeholderText="Select date"
            />
          )}
        />
        {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="labINR" className={labelClasses}>
            Lab INR (Laboratoř)
          </label>
          <input
            id="labINR"
            type="number"
            step="0.01"
            {...register("labINR", { valueAsNumber: true, setValueAs: v => v === "" ? null : parseFloat(v) })}
            className={inputClasses}
            placeholder="e.g., 2.5"
          />
          {errors.labINR && <p className={errorClasses}>{errors.labINR.message}</p>}
        </div>

        <div>
          <label htmlFor="homeINR" className={labelClasses}>
            Home INR (CoaguCheck)
          </label>
          <input
            id="homeINR"
            type="number"
            step="0.01"
            {...register("homeINR", { valueAsNumber: true, setValueAs: v => v === "" ? null : parseFloat(v) })}
            className={inputClasses}
            placeholder="e.g., 2.4"
          />
          {errors.homeINR && <p className={errorClasses}>{errors.homeINR.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="warfarinDose" className={labelClasses}>
          Warfarin Dose (mg)
        </label>
        <input
          id="warfarinDose"
          type="number"
          step="0.5"
          {...register("warfarinDose", { valueAsNumber: true, setValueAs: v => v === "" ? null : parseFloat(v) })}
          className={inputClasses}
          placeholder="e.g., 5.0"
        />
        {errors.warfarinDose && (
          <p className={errorClasses}>{errors.warfarinDose.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="injections" className={labelClasses}>
          Injections (Fraxiparine)
        </label>
        <input
          id="injections"
          type="text"
          {...register("injections", { setValueAs: v => v === "" ? null : v })}
          className={inputClasses}
          placeholder="e.g., ráno večer 0.9 ml"
        />
        {errors.injections && (
          <p className={errorClasses}>{errors.injections.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="vitaminKIntake" className={labelClasses}>
          Vitamin K Intake
        </label>
        <select
          id="vitaminKIntake"
          {...register("vitaminKIntake", { setValueAs: v => v === "" ? null : v })}
          className={inputClasses}
        >
          <option value="">None/Not tracked</option>
          <option value="Low">Low (Apples, Bananas, etc.)</option>
          <option value="Medium">Medium (Broccoli, Carrots, etc.)</option>
          <option value="High">High (Kale, Spinach, etc.)</option>
        </select>
      </div>

      <div>
        <label htmlFor="comment" className={labelClasses}>
          Notes / Side Effects
        </label>
        <textarea
          id="comment"
          {...register("comment", { setValueAs: v => v === "" ? null : v })}
          rows={3}
          className={inputClasses}
          placeholder="Any symptoms, dietary changes, or observations..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {mode === "edit" ? "Update Log" : "Add Log"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};
