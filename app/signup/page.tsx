"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/SignupForm";

// Force dynamic rendering - required for authentication
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Get Started
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create your CoagCompanion account
        </p>
      </div>

      <Card>
        <SignupForm />

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
