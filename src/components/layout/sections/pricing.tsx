"use client";

import {
  BadgeCheck,
  BadgeDollarSign,
  Briefcase,
  Building,
  Rocket,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    icon: Rocket,
    name: "Basic plan",
    price: {
      monthly: 19,
      yearly: 199,
    },
    features: [
      "Basic task management tools",
      "Calendar sync with limited integrations",
      "Access to 1 dashboard for tracking tasks",
      "Limited AI suggestions and insights",
      "Basic support and community access",
    ],
  },
  {
    icon: Briefcase,
    name: "Business plan",
    price: {
      monthly: 29,
      yearly: 299,
    },
    features: [
      "All Free Plan features, plus:",
      "Unlimited task lists",
      "Advanced calendar sync",
      "AI-driven insights",
      "Access to custom dashboards",
      "Priority email support",
    ],
  },
  {
    icon: Building,
    name: "Enterprise plan",
    price: {
      monthly: 49,
      yearly: 499,
    },
    features: [
      "All Pro Plan features, plus:",
      "Dedicated account manager",
      "Custom integrations",
      "Real-time collaboration",
      "Role-based permissions",
      "24/7 priority support",
    ],
  },
];

interface Pricing20Props {
  className?: string;
}

const Pricing20 = ({ className }: Pricing20Props) => {
  const [isMonthly] = useState(true);

  return (
    <section className={cn("py-32", className)}>
      <div className="border-y">
        <div className="container mx-auto flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <div className="flex flex-col items-center text-center">
            <Badge
              variant="outline"
              className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
            >
              <BadgeDollarSign className="size-4" />
              <span>Spenders Lounge</span>
            </Badge>
            <h2 className="mt-6 text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
              Pricing for everyone
            </h2>
            <p className="mt-4 max-w-[600px] tracking-[-0.32px] text-muted-foreground">
              Choose the Plan that Fits Your Productivity Need
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-10 lg:mt-14">
        <section className="grid border max-lg:divide-y lg:grid-cols-3 lg:divide-x">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col justify-between p-6 relative",
                index === 0 && "bg-gradient-to-r from-background to-muted/30",
                index === 1 && "bg-muted/30",
                index === 2 && "bg-gradient-to-l from-background to-muted/30"
              )}
            >
              <div className="space-y-2 border-b pb-6">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <plan.icon className="size-4" />
                  <h3 className="text-xl tracking-[-0.8px]">{plan.name}</h3>
                </div>

                <>
                  <div className="flex items-baseline font-medium">
                    <span className="text-[3.5rem] leading-[120%] tracking-[-3.92px]">
                      ${isMonthly ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-muted-foreground-subtle text-2xl tracking-[-0.96px]">
                      {isMonthly ? "/mo" : "/yr"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {isMonthly
                      ? `or $${plan.price.yearly} yearly`
                      : `or $${plan.price.monthly}/mo monthly`}
                  </p>
                </>
              </div>

              <div className="pt-6">
                <h4 className="text-muted-foreground-subtle">
                  Features Included
                </h4>
                <ul className="mt-4 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <BadgeCheck className="size-6 text-muted-foreground" />
                      <span className="tracking-[-0.32px] text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={index === 1 ? "default" : "secondary"}
                className="mt-12"
              >
                Get started
              </Button>
            </div>
          ))}
        </section>
      </div>

      <div className="mt-12 h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container mx-auto h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export { Pricing20 as PricingSection };
