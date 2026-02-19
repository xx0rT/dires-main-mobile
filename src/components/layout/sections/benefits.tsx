"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="relative py-32">
      <img
        src="/rameno.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.2] pointer-events-none select-none object-contain dark:opacity-[0.12] mix-blend-multiply"
      />
      <div className="container flex flex-col items-center justify-center mx-auto">
        <div className="flex max-w-4xl mx-auto w-full justify-center">
          <TextReveal
            title=" { Dires Fyzio }"
            className="items-center justify-center text-center"
          >
            Získáš systematické know-how, které používají profesionálové, naučíš se správně vyšetřovat pohybový aparát, rozpoznat skutečné příčiny potíží a zvolit účinnou terapii na míru každému klientovi. Kurz je navržen tak, aby byl srozumitelný i pro úplné začátečníky, ale zároveň přínosný i pro trenéry, maséry a zdravotnické pracovníky, kteří chtějí rozšířit své dovednosti.
          </TextReveal>
        </div>
      </div>
    </section>
  );
};

// Below is the modified component from Magic UI
// Original source: https://magicui.design/docs/components/text-reveal
// Modified to follow our coding standards and design system
// We respect copyright and attribution to the original creators

interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string;
  title?: string;
  maxWidth?: string;
}

const TextReveal: FC<TextRevealProps> = ({
  children,
  title,
  className,
  maxWidth,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const words = children.split(" ");

  return (
    <div
      ref={targetRef}
      className={cn("relative z-0 h-[300vh] mx-auto", className)}
      style={{ maxWidth: maxWidth || "56rem" }}
    >
      <div className="sticky top-0 mx-auto flex h-screen items-center justify-center bg-transparent px-[1rem] py-[5rem]">
        <div className="flex flex-col justify-center items-center w-full">
          <span className="text-center text-lg font-medium tracking-tight text-foreground">
            {title}
          </span>
          <span
            className={cn(
              "flex flex-wrap justify-center p-5 text-2xl font-semibold text-black/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl dark:text-white/20",
              className,
            )}
          >
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-30">{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className="text-black dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};
