import { Check, ChevronRight } from "lucide-react";
import { type SVGProps, useId } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: {
    text: string;
    href: string;
  };
};
const ITEMS: PricingTier[] = [
  {
    name: "STARTER",
    price: "$0",
    description: "Free for everyone",
    features: ["Unlimited members", "250 transactions", "No support"],
    cta: {
      text: "Start for free",
      href: "/signup",
    },
  },
  {
    name: "BASIC",
    price: "$29.99",
    description: "per user per month",
    features: [
      "All free plan features and...",
      "Mainline AI",
      "Unlimited teams",
    ],
    cta: {
      text: "7 days free",
      href: "/signup",
    },
  },
  {
    name: "ENTERPRISE",
    price: "$ENT",
    description: "Custom pricing",
    features: [
      "All basic plan features and...",
      "Advanced security controls",
      "Migration support",
    ],
    cta: {
      text: "Book a demo",
      href: "/",
    },
  },
];
export const Pricing29 = () => {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Pricing
          </h1>
          <div className="mx-auto mt-4 max-w-[45rem] space-y-2">
            <p className="text-2xl text-muted-foreground md:text-3xl">
              Use Charter for free with your whole team. Upgrade to enable
              enhanced features.
            </p>
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden md:mt-12 lg:mt-20">
          <div className="absolute inset-0 hidden rounded-3xl bg-linear-to-r from-primary to-primary/80 md:block">
            <PlusSigns className="h-full w-full text-foreground/[0.05]" />
          </div>

          <div className="relative space-y-6 md:grid md:grid-cols-3 md:space-y-0 md:divide-x md:divide-background/20 md:p-6 lg:p-8">
            {ITEMS.map((tier, index) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                isHighlighted={index === 1}
              />
            ))}
          </div>
        </div>
        <div className="absolute -inset-40 z-[-1] [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_75%)]">
          <PlusSigns className="size-full text-foreground/[0.05]" />
        </div>
      </div>
    </section>
  );
};

function PricingCard({
  tier,
  isHighlighted,
}: {
  tier: PricingTier;
  isHighlighted: boolean;
}) {
  const styles = {
    card: cn(
      "flex flex-col gap-6 rounded-xl p-6 sm:rounded-2xl md:rounded-none lg:p-8",
      isHighlighted
        ? "max-md:from-primary max-md:to-primary/80 max-md:bg-linear-to-r"
        : "bg-background max-md:border",
      "md:bg-transparent",
    ),
    title: cn(
      "font-mono text-sm tracking-widest",
      isHighlighted ? "text-background/70" : "text-foreground/70",
      "md:text-background/70",
    ),
    price: cn(
      "text-5xl font-semibold tracking-tight",
      isHighlighted ? "text-background" : "text-foreground",
      "md:text-background",
    ),
    description: cn(
      "mt-2 text-xl font-medium",
      isHighlighted ? "text-background/70" : "text-foreground/70",
      "md:text-background/70",
    ),
    features: cn(
      "space-y-3 text-sm",
      isHighlighted ? "text-background/70" : "text-foreground/70",
      "md:text-background/70",
    ),
    button: cn(
      "group border-foreground/20 relative w-full",
      "after:from-border after:via-border after:absolute after:inset-0 after:bg-linear-to-t after:to-transparent after:content-[''] after:group-hover:opacity-100 isolate after:z-[-1]",
      "md:border-background/40 md:text-background md:bg-transparent md:after:opacity-0",
      isHighlighted &&
        "md:bg-background md:text-primary hover:md:bg-background/90",
    ),
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{tier.name}</h3>
      <div>
        <p className={styles.price}>{tier.price}</p>
        <p className={styles.description}>{tier.description}</p>
      </div>
      <ul className={styles.features}>
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="size-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-1 items-end">
        <Button
          asChild
          variant={isHighlighted ? "secondary" : "outline"}
          size="lg"
          className={styles.button}
        >
          <a href={tier.cta.href}>
            {tier.cta.text}
            <ChevronRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}

interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 16;
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 6;
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width={GAP * 2} height={GAP * 2} className={className} {...props}>
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={GAP}
          height={GAP}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export { Pricing29 as PricingSection };
