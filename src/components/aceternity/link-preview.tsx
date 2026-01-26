"use client";

import { motion } from "motion/react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  children: React.ReactNode;
  url: string;
  className?: string;
}

export const LinkPreview = ({
  children,
  url,
  className,
}: LinkPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-block font-bold text-primary transition-colors hover:text-primary/80",
        className
      )}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] w-full bg-primary origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </a>
  );
};
