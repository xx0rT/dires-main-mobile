"use client";

import {
  BadgeCheck,
  BadgeDollarSign,
  Briefcase,
  Building,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pricingPlans = [
  {
    icon: Rocket,
    name: "Zkušební verze zdarma",
    planType: "free_trial" as const,
    price: 0,
    duration: "3 dny",
    features: [
      "3denní zkušební verze zdarma",
      "Plný přístup ke všem funkcím",
      "Základní nástroje pro správu úkolů",
      "Synchronizace kalendáře s omezenými integracemi",
      "Přístup k 1 dashboardu pro sledování úkolů",
      "Základní podpora a přístup do komunity",
    ],
  },
  {
    icon: Briefcase,
    name: "Měsíční plán",
    planType: "monthly" as const,
    price: 30,
    duration: "měsíčně",
    features: [
      "Všechny funkce zkušební verze a navíc:",
      "Neomezené seznamy úkolů",
      "Pokročilá synchronizace kalendáře",
      "Poznatky řízené AI",
      "Přístup k vlastním dashboardům",
      "Prioritní e-mailová podpora",
      "Zrušit kdykoli",
    ],
  },
  {
    icon: Building,
    name: "Doživotní přístup",
    planType: "lifetime" as const,
    price: 200,
    duration: "jednorázově",
    features: [
      "Všechny měsíční funkce a navíc:",
      "Doživotní přístup - zaplaťte jednou",
      "Dedikovaný account manager",
      "Vlastní integrace",
      "Spolupráce v reálném čase",
      "Oprávnění založená na rolích",
      "Prioritní podpora 24/7",
    ],
  },
];

interface Pricing20Props {
  className?: string;
}

const Pricing20 = ({ className }: Pricing20Props) => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleGetStarted = async (plan: typeof pricingPlans[0]) => {
    if (!user || !session) {
      toast.error("Pro pokračování se prosím přihlaste");
      navigate("/auth/sign-in");
      return;
    }

    setLoadingPlan(plan.planType);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planType: plan.planType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Nepodařilo se zahájit pokladnu. Zkuste to prosím znovu.');
    } finally {
      setLoadingPlan(null);
    }
  };

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
              <span>Cenové plány</span>
            </Badge>
            <h2 className="mt-6 text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
              Ceny pro každého
            </h2>
            <p className="mt-4 max-w-[600px] tracking-[-0.32px] text-muted-foreground">
              Vyberte si plán, který vyhovuje vašim potřebám produktivity
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

                <div className="flex items-baseline font-medium">
                  <span className="text-[3.5rem] leading-[120%] tracking-[-3.92px]">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground-subtle text-2xl tracking-[-0.96px]">
                    {plan.planType === "free_trial" ? "" : plan.planType === "monthly" ? "/mo" : ""}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {plan.duration}
                </p>
              </div>

              <div className="pt-6">
                <h4 className="text-muted-foreground-subtle">
                  Zahrnuté funkce
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
                onClick={() => handleGetStarted(plan)}
                disabled={loadingPlan === plan.planType}
              >
                {loadingPlan === plan.planType ? "Načítání..." : "Začít"}
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
