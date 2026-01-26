"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { FC, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { LinkPreview } from "@/components/aceternity/link-preview";

export const BenefitsSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  return (
    <section id="benefits" className={cn("overflow-hidden py-32")}>
      <div className="container w-full">
        <h1
          ref={targetRef}
          className="text-center text-3xl font-semibold tracking-tight text-muted-foreground/40 md:text-4xl"
        >
          <Word progress={scrollYProgress} range={[0, 0.02]}>
            Build
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.02, 0.04]}>
            faster
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.04, 0.06]}>
            with
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.06, 0.1]}>
            <LinkPreview url="https://shadcnblocks.com" className="px-1">
              Shadcnblocks
            </LinkPreview>
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.1, 0.12]}>
            designed
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.12, 0.14]}>
            for
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.14, 0.16]}>
            real-world
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.16, 0.18]}>
            apps.
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.18, 0.2]}>
            Whether
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.2, 0.22]}>
            you're
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.22, 0.24]}>
            using
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.24, 0.28]}>
            <LinkPreview url="https://tailwindcss.com" className="px-1">
              TailwindCSS
            </LinkPreview>
          </Word>
          <Word progress={scrollYProgress} range={[0.28, 0.29]}>,</Word>{" "}
          <Word progress={scrollYProgress} range={[0.29, 0.33]}>
            <LinkPreview url="https://www.typescriptlang.org" className="px-1">
              TypeScript
            </LinkPreview>
          </Word>
          <Word progress={scrollYProgress} range={[0.33, 0.34]}>,</Word>{" "}
          <Word progress={scrollYProgress} range={[0.34, 0.36]}>
            or
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.36, 0.38]}>
            integrating
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.38, 0.43]}>
            <LinkPreview url="https://www.framer.com/motion" className="px-1">
              Framer Motion
            </LinkPreview>
          </Word>
          <br />
          <br />
          <Word progress={scrollYProgress} range={[0.43, 0.45]}>
            Every
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.45, 0.47]}>
            block
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.47, 0.49]}>
            is
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.49, 0.51]}>
            customizable,
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.51, 0.53]}>
            responsive,
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.53, 0.55]}>
            and
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.55, 0.57]}>
            optimized
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.57, 0.59]}>
            for
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.59, 0.61]}>
            frameworks
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.61, 0.63]}>
            like
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.63, 0.67]}>
            <LinkPreview url="https://nextjs.org" className="px-1">
              Next.js
            </LinkPreview>
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.67, 0.69]}>
            and
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.69, 0.73]}>
            <LinkPreview url="https://ui.shadcn.com" className="px-1">
              shadcn/ui
            </LinkPreview>
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.73, 0.75]}>
            —
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.75, 0.77]}>
            giving
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.77, 0.79]}>
            you
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.79, 0.81]}>
            a
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.81, 0.83]}>
            powerful
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.83, 0.85]}>
            UI
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.85, 0.87]}>
            toolkit
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.87, 0.89]}>
            that
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.89, 0.91]}>
            scales
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.91, 0.93]}>
            with
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.93, 0.95]}>
            your
          </Word>{" "}
          <Word progress={scrollYProgress} range={[0.95, 1]}>
            project.
          </Word>
        </h1>
      </div>
    </section>
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
    <span className="relative inline-block">
      <motion.span
        style={{ opacity: opacity }}
        className="text-black dark:text-white"
      >
        {children}
      </motion.span>
    </span>
  );
};
