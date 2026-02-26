import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Crown,
  Zap,
  Calendar,
  RefreshCw,
  Flame,
  BookOpen,
  TrendingUp,
  Sprout,
  Stethoscope,
  Award,
  Star,
  ChevronRight,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Subscription } from '@/lib/subscription'
import type { Rank } from '@/lib/gamification'
import { useNavigate } from 'react-router-dom'

const RANK_ICONS: Record<string, LucideIcon> = {
  seedling: Sprout,
  book: BookOpen,
  stethoscope: Stethoscope,
  award: Award,
  star: Star,
  crown: Crown,
  flame: Flame,
}

interface DashboardHeroProps {
  user: { email?: string } | null
  subscription: Subscription | null
  hasActiveSubscription: boolean
  currentRank: Rank | null
  nextRank: Rank | null
  totalXp: number
  rankProgress: number
  loginStreak: number
  lessonsCompleted: number
  coursesCompleted: number
  onRefresh?: () => void
  refreshing?: boolean
}

export function DashboardHero({
  user,
  subscription,
  hasActiveSubscription,
  currentRank,
  nextRank,
  totalXp,
  rankProgress,
  loginStreak,
  lessonsCompleted,
  coursesCompleted,
  onRefresh,
  refreshing,
}: DashboardHeroProps) {
  const navigate = useNavigate()
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!subscription?.current_period_end) return
    const calc = () => {
      const diff = Math.max(0, new Date(subscription.current_period_end!).getTime() - Date.now())
      setTimeRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [subscription?.current_period_end])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Dobre rano'
    if (h < 18) return 'Dobre odpoledne'
    return 'Dobry vecer'
  }

  const username = user?.email?.split('@')[0] || 'Studente'
  const RankIcon = currentRank ? (RANK_ICONS[currentRank.icon] || Star) : Star

  const getPlanLabel = () => {
    switch (subscription?.plan_type) {
      case 'free_trial': return 'Zkusebni verze'
      case 'monthly': return 'Mesicni plan'
      case 'lifetime': return 'Dozivotni pristup'
      default: return 'Zadne predplatne'
    }
  }

  const SubIcon = subscription?.plan_type === 'lifetime' ? Crown :
                  subscription?.plan_type === 'free_trial' ? Zap : Calendar

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className="space-y-1"
      >
        <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
          {getGreeting()},
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          {username}
        </h1>
        <p className="text-sm text-muted-foreground">
          Vitejte zpet. Pokracujte ve svem uceni.
        </p>
      </motion.div>

      {currentRank && (
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          className="flex items-start gap-3"
        >
          <motion.div
            className="relative flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20"
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <RankIcon className="w-5 h-5 text-primary" />
            <div className="absolute -top-1.5 -right-1.5 bg-primary/10 border border-primary/25 rounded-full px-1.5 py-px">
              <span className="text-[9px] font-extrabold text-primary leading-none">LVL</span>
            </div>
          </motion.div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-primary">{currentRank.name}</span>
              <motion.div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
              >
                <Zap className="w-3 h-3" />
                <span className="text-[11px] font-bold">{totalXp} XP</span>
              </motion.div>
            </div>

            {nextRank && (
              <p className="text-xs text-muted-foreground">
                {nextRank.minXp - totalXp} XP do <span className="font-semibold text-foreground">{nextRank.name}</span>
              </p>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-muted-foreground font-medium">Pokrok</span>
                <span className="text-[11px] font-bold">{rankProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              {[
                { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', label: `${loginStreak} dnu` },
                { icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10', label: `${lessonsCompleted} lekci` },
                { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', label: `${coursesCompleted} kurzu` },
              ].map(({ icon: Icon, color, bg, label }, i) => (
                <motion.div
                  key={label}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${bg} border border-transparent`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 350 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span className="text-[11px] font-semibold">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl bg-muted/50 border border-border/50 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
              <SubIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Predplatne</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{getPlanLabel()}</span>
                {hasActiveSubscription && subscription?.plan_type && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
                    {subscription.plan_type === 'free_trial' ? 'Zkusebni' : subscription.plan_type === 'lifetime' ? 'Dozivotni' : 'Premium'}
                  </span>
                )}
              </div>
            </div>
          </div>
          {onRefresh && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onRefresh}
              disabled={refreshing}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          )}
        </div>

        {subscription?.current_period_end && subscription.plan_type !== 'lifetime' && (
          <>
            <div className="h-px bg-border/60" />
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Clock className="w-3 h-3" />
                {subscription.plan_type === 'free_trial' ? 'Konci za' : 'Obnovuje se za'}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: timeRemaining.days, unit: 'Dnu' },
                  { val: timeRemaining.hours, unit: 'Hod' },
                  { val: timeRemaining.minutes, unit: 'Min' },
                  { val: timeRemaining.seconds, unit: 'Sek' },
                ].map(({ val, unit }, i) => (
                  <motion.div
                    key={unit}
                    className="flex flex-col items-center py-2 rounded-xl bg-background border border-border/40"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05, type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-lg font-extrabold tabular-nums leading-tight">{String(val).padStart(2, '0')}</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{unit}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>
                  {new Date(subscription.current_period_end).toLocaleDateString('cs-CZ', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </>
        )}

        {subscription?.plan_type === 'lifetime' && (
          <>
            <div className="h-px bg-border/60" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/15">
              <Crown className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-semibold">Aktivni navzdy</span>
            </div>
          </>
        )}

        {(!subscription || subscription.plan_type === 'free_trial') && (
          <motion.button
            onClick={() => navigate('/#pricing')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            {subscription ? 'Upgradovat plan' : 'Zobrazit plany'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}
