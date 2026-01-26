"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: string;
  className?: string;
  colors?: string[];
  duration?: number;
}

export function AuroraText({
  children,
  className,
  colors = ["#ff6449", "#ff6449", "#6248fe", "#6248fe"],
  duration = 5,
}: AuroraTextProps) {
  const gradientId = useMemo(() => `aurora-${Math.random()}`, []);

  return (
    <span className={cn("relative inline-block", className)}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {colors.map((color, index) => (
              <motion.stop
                key={index}
                offset={`${(index / (colors.length - 1)) * 100}%`}
                stopColor={color}
                animate={{
                  stopColor: colors,
                }}
                transition={{
                  duration: duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </linearGradient>
        </defs>
      </svg>
      <span
        style={{
          backgroundImage: `url(#${gradientId})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fill: `url(#${gradientId})`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
