import { Calendar, Check, Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type Subscription,
  getSubscriptionLabel,
  getRemainingTrialDays,
  getUserSubscription,
  isSubscriptionActive,
} from "@/lib/subscription";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionCardProps {
  userId: string;
}

export function SubscriptionCard({ userId }: SubscriptionCardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscription();
  }, [userId]);

  async function loadSubscription() {
    setLoading(true);
    const sub = await getUserSubscription(userId);
    setSubscription(sub);
    setLoading(false);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const active = isSubscriptionActive(subscription);
  const label = getSubscriptionLabel(subscription);
  const trialDays = getRemainingTrialDays(subscription);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {subscription?.plan_type === "lifetime" ? (
              <Crown className="size-5 text-yellow-500" />
            ) : subscription?.plan_type === "free_trial" ? (
              <Zap className="size-5 text-blue-500" />
            ) : (
              <Check className="size-5 text-green-500" />
            )}
            Subscription
          </span>
          <Badge
            variant={active ? "default" : "secondary"}
            className={
              active
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                : ""
            }
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-lg font-semibold">{label}</p>
            </div>

            {subscription.plan_type === "free_trial" && trialDays > 0 && (
              <div className="rounded-lg bg-blue-500/10 p-3">
                <p className="text-sm font-medium text-blue-600">
                  {trialDays} day{trialDays !== 1 ? "s" : ""} remaining in trial
                </p>
                <p className="mt-1 text-xs text-blue-600/80">
                  Upgrade now to continue access after trial ends
                </p>
              </div>
            )}

            {subscription.plan_type !== "lifetime" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  {subscription.plan_type === "free_trial"
                    ? "Trial ends"
                    : "Renews"}{" "}
                  on{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              </div>
            )}

            {subscription.cancel_at_period_end && (
              <div className="rounded-lg bg-amber-500/10 p-3">
                <p className="text-sm font-medium text-amber-600">
                  Subscription will cancel at period end
                </p>
              </div>
            )}

            {subscription.plan_type !== "lifetime" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/#pricing")}
              >
                {subscription.plan_type === "free_trial"
                  ? "Upgrade Plan"
                  : "Change Plan"}
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You don't have an active subscription
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/#pricing")}
            >
              View Plans
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
