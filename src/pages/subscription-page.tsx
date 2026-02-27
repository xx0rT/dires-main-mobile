import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard, Calendar, RefreshCw, CheckCircle2, Clock, AlertTriangle,
  Rocket, Briefcase, Building, BadgeCheck, Crown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useState, useCallback } from 'react'
import { SubscriptionCard } from '@/components/subscription/subscription-card'
import { cn } from '@/lib/utils'

const planFeatures: Record<string, string[]> = {
  free_trial: [
    'Pristup k vybranemu obsahu',
    'Casove omezene',
    'Zakladni podpora',
  ],
  monthly: [
    'Plny pristup ke vsem kurzum',
    'Mesicni aktualizace obsahu',
    'Prioritni podpora',
    'Moznost zrusit kdykoliv',
  ],
  lifetime: [
    'Dozivotni pristup ke vsem kurzum',
    'Vsechny budouci aktualizace',
    'VIP podpora',
    'Exkluzivni bonusovy obsah',
  ],
}

const planLabels: Record<string, string> = {
  free_trial: 'Zkusebni verze',
  monthly: 'Mesicni predplatne',
  lifetime: 'Dozivotni predplatne',
}

const pricingPlans = [
  {
    icon: Rocket,
    name: 'Zkusebni verze zdarma',
    planType: 'free_trial' as const,
    price: 0,
    duration: '3 dny',
    features: [
      '3denni zkusebni verze zdarma',
      'Plny pristup ke vsem funkcim',
      'Zakladni nastroje pro spravu ukolu',
      'Pristup k 1 dashboardu',
      'Zakladni podpora',
    ],
  },
  {
    icon: Briefcase,
    name: 'Mesicni plan',
    planType: 'monthly' as const,
    price: 730,
    duration: 'mesicne',
    popular: true,
    features: [
      'Vsechny funkce zkusebni verze',
      'Neomezene seznamy ukolu',
      'Pokrocila synchronizace kalendare',
      'Poznatky rizene AI',
      'Prioritni e-mailova podpora',
      'Zrusit kdykoli',
    ],
  },
  {
    icon: Building,
    name: 'Dozivotni pristup',
    planType: 'lifetime' as const,
    price: 4870,
    duration: 'jednorazove',
    features: [
      'Vsechny mesicni funkce',
      'Dozivotni pristup - zaplatte jednou',
      'Spoluprace v realnem case',
      'Vlastni integrace',
      'Prioritni podpora 24/7',
    ],
  },
]

export default function SubscriptionPage() {
  const { user, session } = useAuth()
  const { subscription, hasActiveSubscription, refetch } = useSubscription()
  const [refreshing, setRefreshing] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
      toast.success('Predplatne aktualizovano')
    } catch {
      toast.error('Nepodarilo se aktualizovat')
    } finally {
      setRefreshing(false)
    }
  }

  const handleSelectPlan = useCallback(async (planType: string) => {
    setLoadingPlan(planType)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`
      const authToken = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Nepodarilo se zahajit pokladnu. Zkuste to prosim znovu.')
    } finally {
      setLoadingPlan(null)
    }
  }, [session])

  const planType = subscription?.plan_type || 'free_trial'
  const features = planFeatures[planType] || planFeatures.free_trial
  const isCurrentPlan = (type: string) => subscription?.plan_type === type && hasActiveSubscription

  return (
    <div className="space-y-8 mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Predplatne</h1>
        <p className="text-muted-foreground mt-1">
          Spravujte sve predplatne a pristup ke kurzum
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {user && <SubscriptionCard userId={user.id} />}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-bold">Dostupne plany</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pricingPlans.map((plan, i) => {
            const isCurrent = isCurrentPlan(plan.planType)
            const PlanIcon = plan.icon
            return (
              <motion.div
                key={plan.planType}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              >
                <Card className={cn(
                  'relative flex flex-col h-full transition-shadow',
                  isCurrent && 'ring-2 ring-primary shadow-md',
                  plan.popular && !isCurrent && 'border-primary/40',
                )}>
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2.5 py-0.5 shadow-sm">
                        Aktualni plan
                      </Badge>
                    </div>
                  )}
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="text-[10px] px-2.5 py-0.5 shadow-sm">
                        Popularni
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3 pt-5">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <PlanIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{plan.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {plan.price.toLocaleString('cs-CZ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Kc{plan.planType === 'monthly' ? '/mes' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.duration}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col pb-5">
                    <ul className="space-y-2 flex-1 mb-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs">
                          <BadgeCheck className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary text-xs font-semibold">
                        <Crown className="h-3.5 w-3.5" />
                        Aktivni
                      </div>
                    ) : (
                      <Button
                        variant={plan.popular ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => handleSelectPlan(plan.planType)}
                        disabled={loadingPlan === plan.planType}
                      >
                        {loadingPlan === plan.planType ? 'Nacitani...' : 'Vybrat plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detaily planu
              </CardTitle>
              <CardDescription>
                Informace o vasem aktualnim planu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plan</span>
                <Badge variant={hasActiveSubscription ? 'default' : 'secondary'}>
                  {planLabels[planType] || planType}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center gap-1.5">
                  {hasActiveSubscription ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium">
                    {hasActiveSubscription ? 'Aktivni' : 'Neaktivni'}
                  </span>
                </div>
              </div>
              {subscription?.current_period_end && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Platnost do</span>
                    <span className="text-sm font-medium">
                      {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Aktualizovat stav
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Vyhody vaseho planu
              </CardTitle>
              <CardDescription>
                Co vase predplatne zahrnuje
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historie predplatneho
            </CardTitle>
            <CardDescription>
              Prehled zmen vaseho predplatneho
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{planLabels[planType]}</p>
                      <p className="text-xs text-muted-foreground">
                        Aktivovano: {new Date(subscription.created_at).toLocaleDateString('cs-CZ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status === 'active' ? 'Aktivni' : subscription.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Zadna historie predplatneho</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
