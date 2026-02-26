import { useEffect, useState, Fragment } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  user: { email?: string; user_metadata?: { avatar_url?: string } } | null
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

function getInitials(name: string) {
  return name
    .split(/[.\-_\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'U'
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
    if (h < 6) return 'Dobrou noc'
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

  const stats = [
    { icon: Flame, color: 'text-orange-500', val: loginStreak, unit: 'dnu' },
    { icon: BookOpen, color: 'text-emerald-500', val: lessonsCompleted, unit: 'lekci' },
    { icon: TrendingUp, color: 'text-blue-500', val: coursesCompleted, unit: 'kurzu' },
  ]

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative -mx-4 sm:-mx-6 -mt-3 px-4 sm:px-6 pt-2 pb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/90 via-blue-50/50 to-transparent dark:from-blue-950/50 dark:via-blue-900/20 dark:to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-56 h-56 bg-sky-200/40 dark:bg-sky-500/[0.06] rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200/20 dark:bg-blue-500/[0.04] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="text-xs font-medium text-muted-foreground tracking-wide mb-0.5">
                {getGreeting()}
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                {username}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-1">
                Pokracujte ve svem uceni
              </p>
            </motion.div>

            <div className="flex items-center gap-2 pt-1">
              {onRefresh && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-border/40 bg-white/60 dark:bg-white/5 backdrop-blur text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              )}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="relative"
              >
                <Avatar className="w-12 h-12 ring-2 ring-white/80 dark:ring-white/10 shadow-md">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                    {getInitials(username)}
                  </AvatarFallback>
                </Avatar>
                {currentRank && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-[1.5px] ring-white dark:ring-neutral-800 shadow-sm">
                    <RankIcon className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {currentRank && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-5 flex items-center gap-2.5"
            >
              <span className="text-[11px] font-bold text-primary whitespace-nowrap">{currentRank.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${rankProgress}%` }}
                  transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground tabular-nums whitespace-nowrap">
                {totalXp} XP
              </span>
              {nextRank && (
                <span className="text-[9px] text-muted-foreground whitespace-nowrap hidden sm:inline">
                  &rarr; {nextRank.name}
                </span>
              )}
            </motion.div>
          )}

          <motion.div
            className="flex items-center gap-3 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {stats.map(({ icon: Icon, color, val, unit }, i) => (
              <Fragment key={unit}>
                {i > 0 && <div className="w-px h-3 bg-border/50" />}
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs font-bold">{val}</span>
                  <span className="text-[10px] text-muted-foreground">{unit}</span>
                </div>
              </Fragment>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="rounded-2xl bg-muted/40 border border-border/40 p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
              <SubIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Predplatne</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{getPlanLabel()}</span>
                {hasActiveSubscription && subscription?.plan_type && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                    {subscription.plan_type === 'free_trial' ? 'Zkusebni' : subscription.plan_type === 'lifetime' ? 'Dozivotni' : 'Premium'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {subscription?.current_period_end && subscription.plan_type !== 'lifetime' && (
          <>
            <div className="h-px bg-border/50" />
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
                    className="flex flex-col items-center py-2 rounded-xl bg-background border border-border/30"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-lg font-extrabold tabular-nums leading-tight">{String(val).padStart(2, '0')}</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{unit}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
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
            <div className="h-px bg-border/50" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/15">
              <Crown className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-semibold">Aktivni navzdy</span>
            </div>
          </>
        )}

        {(!subscription || subscription.plan_type === 'free_trial') && (
          <motion.button
            onClick={() => navigate('/#pricing')}
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
