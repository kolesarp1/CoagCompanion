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

        {/* Quick Links */}
        <Card>
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
        </Card>
      </div>
    </div>
  );
}
