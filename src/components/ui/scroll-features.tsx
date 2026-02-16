import {
  AnimatePresence,
  motion,
  type MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const getAnimationRange = (index: number, totalFeatures: number) => {
  const cardPosition = index / totalFeatures;
  return [0, cardPosition, 1];
};

interface Statistics {
  value: string;
  label: string;
}

export interface ScrollFeature {
  title: string;
  subtitle: string;
  statistics: Statistics;
  visual: string;
}

export interface ScrollTestimonial {
  quote: string;
  author: string;
  designation: string;
}

function AnimationWrapper({
  children,
  delay = 0,
  className,
  duration = 0.3,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -10, opacity: 0 }}
      transition={{ duration, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: ScrollTestimonial }) {
  return (
    <div className="hidden h-96 flex-1/2 shrink-0 flex-col items-start justify-end rounded-lg border bg-muted p-6 sm:flex lg:h-full">
      <p className="mt-8 text-lg leading-tight">&ldquo;{testimonial.quote}&rdquo;</p>
      <p className="mt-4 text-sm font-medium">
        &mdash; {testimonial.author}{" "}
        <span className="font-light">{testimonial.designation}</span>
      </p>
    </div>
  );
}

function ScrollProgressIndicator({
  totalFeatures,
  activeIndex,
  scrollYProgress,
}: {
  totalFeatures: number;
  activeIndex: number;
  scrollYProgress: MotionValue<number>;
}) {
  const range = getAnimationRange(
    Math.max(0, activeIndex - 0.5),
    totalFeatures,
  );
  const nextRange = getAnimationRange(
    Math.min(totalFeatures, activeIndex + 0.5),
    totalFeatures,
  );
  const currentRange = [range[1], nextRange[1]];
  const width = useTransform(scrollYProgress, currentRange, ["0%", "100%"]);

  return (
    <div className="mt-14 hidden w-fit items-center justify-center gap-3 rounded-full bg-muted px-6 py-4 lg:flex">
      {Array.from({ length: totalFeatures }).map((_, index) => (
        <div
          key={`scroll-progress-${index}`}
          className={cn(
            "relative h-1.5 w-1.5 rounded-full bg-foreground/20",
            activeIndex === index && "w-10",
            activeIndex > index && "bg-foreground",
          )}
        >
          {activeIndex === index && (
            <motion.div
              style={{ width }}
              className="absolute top-0 left-0 h-full rounded-full bg-foreground"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FeatureCard({
  feature,
  index,
  testimonial,
  totalFeatures,
  scrollYProgress,
}: {
  feature: ScrollFeature;
  index: number;
  testimonial: ScrollTestimonial;
  totalFeatures: number;
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse justify-between gap-8 px-10 py-4 lg:absolute lg:top-1/2 lg:left-1/2 lg:h-full lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex-row lg:items-center lg:border-l",
      )}
    >
      <div className="flex flex-2/5 flex-col gap-8 lg:h-full lg:gap-0">
        <div className="flex flex-col gap-1">
          <AnimationWrapper>
            <p className="text-xl font-semibold">{feature.title}</p>
          </AnimationWrapper>
          <AnimationWrapper delay={0.15}>
            <p className="font-light">{feature.subtitle}</p>
          </AnimationWrapper>
        </div>

        <ScrollProgressIndicator
          totalFeatures={totalFeatures}
          activeIndex={index}
          scrollYProgress={scrollYProgress}
        />

        <div className="flex flex-col gap-1 lg:mt-auto">
          <AnimationWrapper delay={0.3}>
            <p className="text-6xl font-medium">{feature.statistics.value}</p>
          </AnimationWrapper>
          <AnimationWrapper delay={0.45}>
            <p className="text-sm font-light">{feature.statistics.label}</p>
          </AnimationWrapper>
        </div>
      </div>

      <AnimationWrapper
        duration={0.6}
        className="flex h-96 w-full flex-3/5 items-center gap-6 lg:h-full"
      >
        <img
          src={feature.visual}
          alt={feature.title}
          className={cn(
            "h-96 w-full overflow-hidden rounded-lg border object-cover lg:h-full",
            index === 0 && "flex-1/2",
          )}
        />
        {index === 0 && <TestimonialCard testimonial={testimonial} />}
      </AnimationWrapper>
    </div>
  );
}

interface ScrollFeaturesProps {
  features: ScrollFeature[];
  testimonial: ScrollTestimonial;
  className?: string;
}

export function ScrollFeatures({
  features,
  testimonial,
  className,
}: ScrollFeaturesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let minDistance = Infinity;
      let temp = 0;
      features.forEach((_, index) => {
        const range = getAnimationRange(index, features.length);
        const position = range[1];
        const distance = Math.abs(latest - position);
        if (distance < minDistance) {
          minDistance = distance;
          temp = index;
        }
      });
      setActiveIndex(temp);
    });
    return () => unsubscribe();
  }, [features, scrollYProgress]);

  return (
    <section ref={ref} className={cn("h-screen overflow-y-auto", className)}>
      <div className="container">
        <div className="sticky top-0 hidden h-screen w-full flex-col items-center justify-center gap-10 lg:flex">
          <div className="relative h-full w-full lg:h-1/2">
            <AnimatePresence mode="popLayout">
              <FeatureCard
                key={`feature-${activeIndex}`}
                index={activeIndex}
                feature={features[activeIndex]}
                testimonial={testimonial}
                totalFeatures={features.length}
                scrollYProgress={scrollYProgress}
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-10 overflow-y-auto py-32 lg:hidden">
          <div className="relative h-full w-full lg:h-1/2">
            {features.map((feature, index) => (
              <FeatureCard
                key={`feature-mobile-${index}`}
                index={index}
                feature={feature}
                testimonial={testimonial}
                totalFeatures={features.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
        <div
          style={{ height: `${features.length * 75}vh` }}
          className="hidden lg:block"
        />
      </div>
    </section>
  );
}
