"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { FC, ReactNode, useRef } from "react";
import { LinkPreview } from "@/components/aceternity/link-preview";

export const BenefitsSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const textContent = `Build faster with Shadcnblocks designed for real-world apps. Whether you're using TailwindCSS, TypeScript, or integrating Framer Motion. Every block is customizable, responsive, and optimized for frameworks like Next.js and shadcn/ui — giving you a powerful UI toolkit that scales with your project.`;

  const words = textContent.split(" ");

  return (
    <section id="benefits" className="overflow-hidden py-32">
      <div
        ref={targetRef}
        className="relative z-0 h-[200vh]"
      >
        <div className="sticky top-0 mx-auto flex h-[50%] items-center bg-transparent px-4">
          <div className="container w-full">
            <div className="flex flex-col items-center justify-center">
              <h1 className="mt-10 text-center text-3xl font-semibold tracking-tight md:text-4xl">
                <span className="flex flex-wrap justify-center p-5 text-2xl font-semibold md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl">
                  {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + 1 / words.length;

                    if (word === "Shadcnblocks") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://shadcnblocks.com" className="px-1">
                            {word}
                          </LinkPreview>
                        </Word>
                      );
                    }

                    if (word === "TailwindCSS,") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://tailwindcss.com" className="px-1">
                            TailwindCSS
                          </LinkPreview>
                          <span>,</span>
                        </Word>
                      );
                    }

                    if (word === "TypeScript,") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://www.typescriptlang.org" className="px-1">
                            TypeScript
                          </LinkPreview>
                          <span>,</span>
                        </Word>
                      );
                    }

                    if (word === "Framer" && words[i + 1] === "Motion.") {
                      return null;
                    }

                    if (word === "Motion.") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://www.framer.com/motion" className="px-1">
                            Framer Motion
                          </LinkPreview>
                          <span>.</span>
                        </Word>
                      );
                    }

                    if (word === "Next.js") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://nextjs.org" className="px-1">
                            {word}
                          </LinkPreview>
                        </Word>
                      );
                    }

                    if (word === "shadcn/ui") {
                      return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                          <LinkPreview url="https://ui.shadcn.com" className="px-1">
                            {word}
                          </LinkPreview>
                        </Word>
                      );
                    }

                    return (
                      <Word key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                      </Word>
                    );
                  })}
                </span>
              </h1>
            </div>
          </div>
        </div>
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
