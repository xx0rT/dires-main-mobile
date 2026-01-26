"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  imageSrc?: string;
}

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  imageSrc,
}: LinkPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getPreviewImage = () => {
    if (imageSrc) {
      return imageSrc;
    }
    return `https://api.microlink.io/?url=${encodeURIComponent(
      url
    )}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.width=${width}&viewport.height=${height}&quality=${quality}`;
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isMounted && (
        <div className="hidden">
          <img
            src={getPreviewImage()}
            alt="Preview"
            className="hidden"
          />
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative font-bold text-primary transition-colors hover:text-primary/80",
          className
        )}
      >
        {children}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 15,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="absolute left-1/2 top-full z-50 mt-2 hidden -translate-x-1/2 md:block"
            >
              <div className="rounded-xl border-2 border-neutral-200 bg-white p-1 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                <img
                  src={getPreviewImage()}
                  alt="Preview"
                  width={width}
                  height={height}
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </a>
    </>
  );
};
