import { Calendar, Check, Crown, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free_trial' | 'monthly' | 'lifetime';
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}&select=*`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setSubscription(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
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

  const active = subscription?.status === 'active' || subscription?.status === 'trialing';

  const getPlanLabel = (planType: string) => {
    switch (planType) {
      case 'free_trial': return 'Zkušební verze zdarma';
      case 'monthly': return 'Měsíční plán';
      case 'lifetime': return 'Doživotní přístup';
      default: return planType;
    }
  };

  const getRemainingDays = () => {
    if (!subscription?.current_period_end) return 0;
    const end = new Date(subscription.current_period_end);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const label = subscription ? getPlanLabel(subscription.plan_type) : '';
  const trialDays = getRemainingDays();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {subscription?.plan_type === "lifetime" ? (
            <div className="flex size-12 items-center justify-center rounded-full bg-yellow-500/10">
              <Crown className="size-6 text-yellow-600" />
            </div>
          ) : subscription?.plan_type === "free_trial" ? (
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <Zap className="size-6 text-blue-600" />
            </div>
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <Check className="size-6 text-green-600" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Aktuální plán</p>
            <p className="text-lg font-semibold">{subscription ? label : 'Žádné předplatné'}</p>
          </div>
        </div>
        {subscription && (
          <Badge
            variant={active ? "default" : "secondary"}
            className={
              active
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                : ""
            }
          >
            {active ? "Aktivní" : "Neaktivní"}
          </Badge>
        )}
      </div>

      {subscription ? (
        <>
          {subscription.plan_type === "free_trial" && trialDays > 0 && (
            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
              <p className="text-sm font-medium text-blue-600">
                {trialDays} {trialDays === 1 ? 'den' : trialDays < 5 ? 'dny' : 'dní'} zbývá ve zkušební verzi
              </p>
              <p className="mt-1 text-xs text-blue-600/80">
                Upgradujte nyní pro pokračování přístupu po skončení zkušební doby
              </p>
            </div>
          )}

          {subscription.plan_type === "monthly" && trialDays > 0 && (
            <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-green-600">
                  Zbývající čas předplatného
                </p>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                  Aktivní
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {trialDays} {trialDays === 1 ? 'den' : trialDays < 5 ? 'dny' : 'dní'}
              </p>
              <p className="mt-1 text-xs text-green-600/80">
                Vaše předplatné se automaticky obnoví {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('cs-CZ') : 'N/A'}
              </p>
            </div>
          )}

          {subscription.plan_type !== "lifetime" && subscription.current_period_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-lg bg-muted p-3">
              <Calendar className="size-4" />
              <span>
                {subscription.plan_type === "free_trial"
                  ? "Zkušební verze končí"
                  : "Obnovuje se"}{" "}
                {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}

          {subscription.plan_type === "lifetime" && (
            <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
              <p className="text-sm font-medium text-yellow-700">
                Máte doživotní přístup ke všem funkcím
              </p>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID předplatného:</span>
              <span className="font-mono text-xs">{subscription.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Typ plánu:</span>
              <span className="font-medium">{label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Datum vytvoření:</span>
              <span>{new Date(subscription.created_at).toLocaleDateString('cs-CZ')}</span>
            </div>
          </div>

          {subscription.plan_type !== "lifetime" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/prehled/predplatne")}
            >
              {subscription.plan_type === "free_trial"
                ? "Upgradovat plán"
                : "Změnit plán"}
            </Button>
          )}
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground py-4">
            Nemáte aktivní předplatné. Vyberte si plán a začněte využívat všechny funkce.
          </p>
          <Button
            className="w-full"
            onClick={() => navigate("/prehled/predplatne")}
          >
            Zobrazit plány
          </Button>
        </>
      )}
    </div>
  );
}
