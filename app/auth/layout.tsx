// app/auth/layout.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen justify-center gap-4 overflow-hidden">
      {/* Left side - Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hidden w-5/12 lg:flex lg:items-center"
      >
        <div className="relative h-[95%] w-full overflow-hidden rounded-3xl">
          <Image
            src="/auth-background.jpg"
            alt="Background"
            fill
            className="object-cover z-0"
            priority
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/30 z-10"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 p-8 text-white z-20"
          >
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold leading-tight tracking-tight"
              >
                KS Consulting
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg opacity-50"
              >
                Access your client space to follow your projects and monitor
                their progress in real time
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Auth Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-full lg:w-5/12 h-screen"
      >
        <div className="w-full max-w-md mx-auto px-4">{children}</div>
      </motion.div>
    </div>
  );
}
