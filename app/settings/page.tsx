"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Medical Settings state
  const [testTime, setTestTime] = useState("10:00");
  const [doseTime, setDoseTime] = useState("13:00");
  const [targetINRMin, setTargetINRMin] = useState(2.0);
  const [targetINRMax, setTargetINRMax] = useState(3.0);
  const [inrRangePreset, setInrRangePreset] = useState<"1.5-2.0" | "2.0-3.0" | "2.5-3.5" | "custom">("2.0-3.0");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Load user settings
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settings) {
        setTestTime(settings.inr_test_time || '10:00');
        setDoseTime(settings.dose_time || '13:00');
        setTargetINRMin(Number(settings.target_inr_min) || 2.0);
        setTargetINRMax(Number(settings.target_inr_max) || 3.0);

        // Determine preset based on min/max values
        if (settings.target_inr_min === 1.5 && settings.target_inr_max === 2.0) {
          setInrRangePreset("1.5-2.0");
        } else if (settings.target_inr_min === 2.0 && settings.target_inr_max === 3.0) {
          setInrRangePreset("2.0-3.0");
        } else if (settings.target_inr_min === 2.5 && settings.target_inr_max === 3.5) {
          setInrRangePreset("2.5-3.5");
        } else {
          setInrRangePreset("custom");
        }
      }

      setIsLoading(false);
    };

    getUser();
  }, [router]);

  const handleChangePassword = async (data: ChangePasswordForm) => {
    setIsChangingPassword(true);

    try {
      const supabase = createClient();

      // First, verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setIsChangingPassword(false);
        return;
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        toast.error(`Failed to change password: ${updateError.message}`);
        setIsChangingPassword(false);
        return;
      }

      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast.error("No email address found");
      return;
    }

    setIsResettingPassword(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) {
        toast.error(`Failed to send reset email: ${error.message}`);
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handlePresetChange = (preset: string) => {
    setInrRangePreset(preset as any);

    if (preset === "1.5-2.0") {
      setTargetINRMin(1.5);
      setTargetINRMax(2.0);
    } else if (preset === "2.0-3.0") {
      setTargetINRMin(2.0);
      setTargetINRMax(3.0);
    } else if (preset === "2.5-3.5") {
      setTargetINRMin(2.5);
      setTargetINRMax(3.5);
    }
    // For custom, don't change values - user will set them manually
  };

  const handleSaveSettings = async () => {
    // Validate that min < max
    if (targetINRMin >= targetINRMax) {
      toast.error("Minimum INR must be less than maximum INR");
      return;
    }

    setIsSavingSettings(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('settings')
        .update({
          inr_test_time: testTime,
          dose_time: doseTime,
          target_inr_min: targetINRMin,
          target_inr_max: targetINRMax,
        })
        .eq('user_id', user.id);

      if (error) {
        toast.error(`Failed to save settings: ${error.message}`);
        return;
      }

      toast.success("Medical settings saved successfully!");
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isOAuthUser = user.app_metadata?.provider === 'github' || user.app_metadata?.providers?.includes('github');
  const hasPassword = !isOAuthUser || user.app_metadata?.providers?.includes('email');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Account Settings
        </h1>

        {/* Account Details */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Email</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Login Method</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {isOAuthUser ? 'GitHub OAuth' : 'Email/Password'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 dark:text-gray-400">Account Created</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Password Management */}
        {hasPassword && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h2>
            <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                variant="primary"
              >
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </Card>
        )}

        {/* Password Reset */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Password Reset
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {isOAuthUser
              ? "You signed up with GitHub. You can set a password by requesting a password reset email."
              : "Forgot your password? We'll send you a reset link via email."
            }
          </p>
          <Button
            onClick={handleResetPassword}
            disabled={isResettingPassword}
            variant="secondary"
          >
            {isResettingPassword ? "Sending..." : "Send Password Reset Email"}
          </Button>
        </Card>

        {/* Medical Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Medical Settings
          </h2>
          <div className="space-y-6">
            {/* Test Time */}
            <div>
              <label
                htmlFor="testTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                INR Test Time
              </label>
              <input
                id="testTime"
                type="time"
                value={testTime}
                onChange={(e) => setTestTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Preferred time for blood sample collection
              </p>
            </div>

            {/* Dose Time */}
            <div>
              <label
                htmlFor="doseTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Warfarin Dose Time
              </label>
              <input
                id="doseTime"
                type="time"
                value={doseTime}
                onChange={(e) => setDoseTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Preferred time for daily warfarin intake
              </p>
            </div>

            {/* INR Range Preset Dropdown */}
            <div>
              <label
                htmlFor="inrRangePreset"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Target INR Range
              </label>
              <select
                id="inrRangePreset"
                value={inrRangePreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="1.5-2.0">1.5 - 2.0 (Low intensity)</option>
                <option value="2.0-3.0">2.0 - 3.0 (Standard)</option>
                <option value="2.5-3.5">2.5 - 3.5 (High intensity)</option>
                <option value="custom">Custom Range</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your therapeutic INR target range
              </p>
            </div>

            {/* Custom Range Inputs (shown only when Custom is selected) */}
            {inrRangePreset === "custom" && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <label
                    htmlFor="targetINRMin"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Minimum INR
                  </label>
                  <input
                    id="targetINRMin"
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="10.0"
                    value={targetINRMin}
                    onChange={(e) => setTargetINRMin(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="targetINRMax"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Maximum INR
                  </label>
                  <input
                    id="targetINRMax"
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="10.0"
                    value={targetINRMax}
                    onChange={(e) => setTargetINRMax(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              variant="primary"
            >
              {isSavingSettings ? "Saving..." : "Save Medical Settings"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
