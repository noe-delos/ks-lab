/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create an array for the repeating logos
  const logoColumns = Array.from({ length: 5 }); // 4 columns for closer spacing
  const logosPerColumn = Array.from({ length: 8 }); // 8 logos per column for more density

  return (
    <div className="flex min-h-screen justify-center gap-4 overflow-hidden">
      {/* Left side - Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative hidden w-4/12 lg:flex lg:items-center"
      >
        {/* Container for the diagonal shape */}
        <div className="relative h-[95%] w-[85%]">
          {/* SVG mask for properly rounded corners */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="diagonalClip" clipPathUnits="objectBoundingBox">
                <path d="M0.025 0 H0.975 C0.9875 0 1 0.0125 1 0.025 V0.975 C1 0.9875 0.9875 1 0.975 1 H0.025 C0.0125 1 0 0.9875 0 0.975 V0.025 C0 0.0125 0.0125 0 0.025 0 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Content container with the clip-path */}
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              transform: "skew(-10deg)",
              clipPath: "url(#diagonalClip)",
            }}
          >
            {/* Image container to counter-skew the image */}
            <div
              className="relative h-full w-full"
              style={{ transform: "skew(10deg) scale(1.5)" }}
            >
              <Image
                src="/images/ks-bg.png"
                alt="Background"
                fill
                className="object-cover z-0"
                priority
              />

              {/* Repeating logo pattern */}
              <div className="absolute inset-0 z-[1]">
                {logoColumns.map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={`absolute h-full ${
                      colIndex % 2 === 0 ? "mt-12" : ""
                    }`}
                    style={{
                      left: `${(colIndex + 1) * 20}%`, // Closer horizontal spacing
                      transform: "translateX(-50%)",
                    }}
                  >
                    {logosPerColumn.map((_, rowIndex) => {
                      // Calculate varied sizes and offsets for each logo
                      const isAlternate = rowIndex % 2 === 0;
                      const size = "size-[4rem]"; // Alternating sizes
                      const offsetX = isAlternate
                        ? "translate-x-4"
                        : "-translate-x-4"; // Horizontal zigzag
                      const verticalSpacing = 11; // Closer vertical spacing

                      return (
                        <div
                          key={rowIndex}
                          className={`relative ${size} opacity-10`}
                          style={{
                            position: "absolute",
                            top: `${(rowIndex + 1) * verticalSpacing}%`,
                            transform: `translateY(-50%) ${offsetX}`,
                          }}
                        >
                          <Image
                            src="/logo/ks-transparant.png"
                            alt="KS Logo"
                            fill
                            className="object-contain"
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text content - placed outside the skewed container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-8 left-0 right-0 p-8 text-white z-20"
          >
            <div className="space-y-1 mr-20">
              <Image
                src="/logo/ks-logo-final-transparent-single.png"
                alt="Background"
                className="object-cover z-0"
                width={200}
                height={200}
                priority
              />
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl opacity-50 italic font-light text-white/50"
              >
                Révolutionnez votre Business avec l'IA.
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
