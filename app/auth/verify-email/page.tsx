/* eslint-disable react/no-unescaped-entities */
// app/auth/verify-email/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-50 p-3">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Check your email
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            We've sent you a verification link to your email address. Please
            click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive an email? Check your spam folder or{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              try another email address
            </Link>
          </p>

          <Button asChild variant="outline">
            <Link href="/auth/login">Return to login</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
