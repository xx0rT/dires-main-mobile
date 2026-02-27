import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiRefreshLine, RiTimeLine, RiCalendarLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import type { Subscription } from "@/lib/subscription";
import { Crown, Zap, Calendar } from "lucide-react";

interface SubscriptionTimerCardProps {
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function SubscriptionTimerCard({
  subscription,
  hasActiveSubscription,
  onRefresh,
  refreshing = false,
}: SubscriptionTimerCardProps) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!subscription?.current_period_end) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(subscription.current_period_end!);
      const diff = Math.max(0, end.getTime() - now.getTime());

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [subscription?.current_period_end]);

  const getPlanLabel = (planType: string) => {
    switch (planType) {
      case "free_trial":
        return "Zkušební verze";
      case "monthly":
        return "Měsíční plán";
      case "lifetime":
        return "Doživotní přístup";
      default:
        return planType;
    }
  };

  const getPlanIcon = () => {
    if (subscription?.plan_type === "lifetime") {
      return <Crown className="h-5 w-5 text-yellow-600" />;
    } else if (subscription?.plan_type === "free_trial") {
      return <Zap className="h-5 w-5 text-blue-600" />;
    }
    return <Calendar className="h-5 w-5 text-green-600" />;
  };

  const getPlanColor = () => {
    if (subscription?.plan_type === "lifetime") {
      return "bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400";
    } else if (subscription?.plan_type === "free_trial") {
      return "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-400";
    }
    return "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400";
  };

  if (!subscription) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Předplatné</p>
            <p className="font-semibold">Žádné aktivní</p>
          </div>
          <Button size="sm" onClick={() => navigate("/prehled/predplatne")}>
            Zobrazit plány
          </Button>
        </div>
      </Card>
    );
  }

  if (subscription.plan_type === "lifetime") {
    return (
      <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500/10">
              {getPlanIcon()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Předplatné</p>
              <p className="font-semibold">{getPlanLabel(subscription.plan_type)}</p>
              <Badge className={getPlanColor()}>Aktivní navždy</Badge>
            </div>
          </div>
          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={refreshing}
              title="Aktualizovat předplatné"
            >
              <RiRefreshLine className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const showTimer = subscription.plan_type === "monthly" || subscription.plan_type === "free_trial";

  return (
    <Card className={`p-4 ${showTimer ? "border-green-500/20 bg-green-500/5" : ""}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
              {getPlanIcon()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Předplatné</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{getPlanLabel(subscription.plan_type)}</p>
                {hasActiveSubscription && (
                  <Badge className={getPlanColor()}>
                    {subscription.plan_type === "free_trial" ? "Zkušební" : "Premium"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {onRefresh && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={refreshing}
              title="Aktualizovat předplatné"
            >
              <RiRefreshLine className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>

        {showTimer && subscription.current_period_end && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RiTimeLine className="h-3 w-3" />
              <span>
                {subscription.plan_type === "free_trial" ? "Zkušební verze končí" : "Obnovuje se"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/50">
                <div className="text-lg sm:text-xl font-bold tabular-nums">
                  {timeRemaining.days}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Dní</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/50">
                <div className="text-lg sm:text-xl font-bold tabular-nums">
                  {timeRemaining.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Hodin</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/50">
                <div className="text-lg sm:text-xl font-bold tabular-nums">
                  {timeRemaining.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Minut</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 rounded-lg bg-background/50">
                <div className="text-lg sm:text-xl font-bold tabular-nums">
                  {timeRemaining.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Sekund</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <RiCalendarLine className="h-3 w-3" />
              <span>
                {new Date(subscription.current_period_end).toLocaleDateString("cs-CZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        )}

        {subscription.plan_type === "free_trial" && (
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate("/prehled/predplatne")}
          >
            Upgradovat plán
          </Button>
        )}
      </div>
    </Card>
  );
}
