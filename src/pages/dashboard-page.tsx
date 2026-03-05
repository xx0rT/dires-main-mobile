import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiTimeLine, RiTrophyLine, RiArrowRightLine, RiCheckLine, RiMessage3Line, RiSettings4Line, RiSearchLine, RiCalendarLine } from '@remixicon/react'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSubscription } from '@/lib/use-subscription'
import { toast } from 'sonner'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { CourseDashboard } from '@/components/dashboard/course-dashboard'
import { useSelectedCourse } from '@/lib/selected-course-context'
import { supabase } from '@/lib/supabase'
import { useGamification } from '@/lib/use-gamification'
import { BadgesCollection } from '@/components/gamification/badges-collection'
import { XpRewardPopup } from '@/components/gamification/xp-reward-popup'
import { WelcomeLoader } from '@/components/dashboard/welcome-loader'
import { useNavVisibility } from '@/lib/nav-visibility-context'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  price: number
  order_index: number
}

interface Enrollment {
  id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
  course: Course
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] as const } },
}

function SectionLabel({ title, delay = 0, right }: { title: string; delay?: number; right?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-center justify-between mb-3"
    >
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      {right}
    </motion.div>
  )
}

const quickActions = [
  { label: 'Kurzy', icon: RiSearchLine, path: '/prehled/moje-kurzy', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Zpravy', icon: RiMessage3Line, path: '/prehled/zpravy', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Pokrok', icon: RiCalendarLine, path: '/prehled/pokrok', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Nastaveni', icon: RiSettings4Line, path: '/prehled/nastaveni', color: 'text-neutral-500', bg: 'bg-neutral-500/10' },
  { label: 'Certifikaty', icon: RiTrophyLine, path: '/prehled/certifikaty', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { label: 'Treneri', icon: RiBookOpenLine, path: '/prehled/treneri', color: 'text-sky-500', bg: 'bg-sky-500/10' },
]

function QuickActionItem({ action }: { action: typeof quickActions[number] }) {
  const Icon = action.icon
  return (
    <Link
      to={action.path}
      className="flex items-center gap-2 rounded-full border border-border/30 bg-background px-3.5 py-2 text-sm font-medium transition-colors active:bg-muted/60 hover:bg-muted/40 shrink-0 select-none"
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${action.bg}`}>
        <Icon className={`h-3.5 w-3.5 ${action.color}`} />
      </div>
      <span className="text-xs font-semibold text-foreground/80 whitespace-nowrap">{action.label}</span>
    </Link>
  )
}

function StatsRing({ value }: { value: number }) {
  const size = 52
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-neutral-100 dark:text-neutral-800" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2563eb" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] as const, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{value}%</span>
      </div>
    </div>
  )
}

function QuickActions() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, containScroll: false },
    [AutoScroll({ speed: 0.5, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="-mx-4 md:mx-0 overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex gap-2 px-4 md:px-0">
        {[...quickActions, ...quickActions].map((action, i) => (
          <QuickActionItem key={`${action.path}-${i}`} action={action} />
        ))}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { subscription, hasActiveSubscription, refetch } = useSubscription()
  const { selectedCourse } = useSelectedCourse()
  const {
    userXp, earnedBadges, claimedRewards, currentRank, nextRank,
    rankProgress, lastXpEvent, clearLastEvent, claimReward,
  } = useGamification()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const { showMobileNav } = useNavVisibility()
  const [stats, setStats] = useState({
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursSpent: 0,
    completedModules: 0,
  })

  const handleRefreshSubscription = async () => {
    setRefreshing(true)
    try {
      await refetch()
      toast.success('Predplatne aktualizovano')
    } catch {
      toast.error('Nepodarilo se aktualizovat predplatne')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          course_id,
          enrolled_at,
          completed,
          completion_date,
          courses!inner (
            id,
            title,
            description,
            thumbnail_url,
            price,
            order_index
          )
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError)
        return
      }

      const enrollmentsWithCourses = (enrollmentsData || []).map((enrollment: any) => ({
        id: enrollment.id,
        course_id: enrollment.course_id,
        progress_percentage: enrollment.completed ? 100 : 0,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completion_date,
        course: {
          id: enrollment.courses?.id || '',
          title: enrollment.courses?.title || '',
          description: enrollment.courses?.description || '',
          image_url: enrollment.courses?.thumbnail_url || '',
          price: enrollment.courses?.price || 0,
          order_index: enrollment.courses?.order_index || 0,
        },
      }))

      setEnrollments(enrollmentsWithCourses as Enrollment[])

      const { data: progressData } = await supabase
        .from('user_course_progress')
        .select('completed')
        .eq('user_id', user.id)

      const completedModulesCount = progressData?.filter((p) => p.completed).length || 0
      const totalMinutes = completedModulesCount * 60

      setStats({
        completedCourses: enrollmentsData?.filter((e) => e.completed).length || 0,
        inProgressCourses: enrollmentsData?.filter((e) => !e.completed).length || 0,
        totalHoursSpent: Math.round(totalMinutes / 60),
        completedModules: completedModulesCount,
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false)
    showMobileNav()
  }, [showMobileNav])

  const totalProgress = (stats.completedCourses + stats.inProgressCourses) > 0
    ? Math.round((stats.completedCourses / (stats.completedCourses + stats.inProgressCourses)) * 100)
    : 0

  if (selectedCourse) {
    return <CourseDashboard course={selectedCourse} />
  }

  const username = user?.email?.split('@')[0] || 'Studente'

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <WelcomeLoader onComplete={handleWelcomeComplete} username={username} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.div
          className="pb-8 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DashboardHero
            user={user}
            subscription={subscription}
            hasActiveSubscription={hasActiveSubscription}
            currentRank={currentRank}
            nextRank={nextRank}
            totalXp={userXp?.total_xp ?? 0}
            rankProgress={rankProgress}
            loginStreak={userXp?.login_streak ?? 0}
            lessonsCompleted={userXp?.lessons_completed ?? 0}
            coursesCompleted={userXp?.courses_completed ?? 0}
            onRefresh={handleRefreshSubscription}
            refreshing={refreshing}
          />

          <QuickActions />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <div>
                <SectionLabel
                  title="Statistiky"
                  delay={0.1}
                  right={
                    <Button asChild variant="ghost" size="sm" className="text-[11px] h-6 px-2 -mr-2">
                      <Link to="/prehled/pokrok">
                        Podrobne
                        <RiArrowRightLine className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  }
                />
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-4 mb-3"
                >
                  <div className="flex items-center gap-4">
                    <StatsRing value={totalProgress} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Celkovy pokrok</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stats.completedCourses} kurzu dokonceno, {stats.completedModules} lekci
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { title: 'Dokoncene', value: stats.completedCourses, icon: RiTrophyLine, bg: 'bg-emerald-500' },
                    { title: 'Probihajici', value: stats.inProgressCourses, icon: RiBookOpenLine, bg: 'bg-blue-500' },
                    { title: 'Hodin', value: stats.totalHoursSpent, icon: RiTimeLine, bg: 'bg-cyan-500' },
                    { title: 'Lekci', value: stats.completedModules, icon: RiCheckLine, bg: 'bg-amber-500' },
                  ].map((stat) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.title}
                        variants={fadeUp}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                          <Icon className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xl font-extrabold leading-tight">{stat.value}</div>
                          <div className="text-[11px] text-muted-foreground font-medium">{stat.title}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>

              <div>
                {enrollments.length > 0 ? (
                  <>
                    <SectionLabel
                      title="Pokracovat v uceni"
                      delay={0.2}
                      right={
                        <Button asChild variant="ghost" size="sm" className="text-[11px] h-6 px-2 -mr-2">
                          <Link to="/prehled/moje-kurzy">
                            Zobrazit vse
                            <RiArrowRightLine className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      }
                    />
                    <div className="space-y-2.5">
                      {enrollments.slice(0, 3).map((enrollment, i) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={`/kurz/${enrollment.course_id}`}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 active:scale-[0.98] transition-all"
                          >
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                              <RiBookOpenLine className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm truncate">{enrollment.course.title}</h3>
                                {enrollment.completed_at && (
                                  <span className="flex-shrink-0 text-[9px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                                    Hotovo
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-muted-foreground">Pokrok</span>
                                  <span className="font-bold tabular-nums">{Math.round(enrollment.progress_percentage)}%</span>
                                </div>
                                <Progress value={enrollment.progress_percentage} className="h-1.5" />
                              </div>
                            </div>
                            <RiArrowRightLine className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center py-10 space-y-4 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                    >
                      <RiBookOpenLine className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                    </motion.div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold">Zatim zadne kurzy</h3>
                      <p className="text-xs text-muted-foreground">
                        Zapiste se do sveho prvniho kurzu
                      </p>
                    </div>
                    <Button asChild size="default" className="rounded-xl">
                      <Link to="/prehled/moje-kurzy">Prohlednout Kurzy</Link>
                    </Button>
                  </motion.div>
                )}
              </div>

              <div>
                <SectionLabel title="Oceneni" delay={0.3} />
                <BadgesCollection
                  earnedBadgeIds={new Set(earnedBadges.map((b) => b.badge_id))}
                  claimedRewards={claimedRewards}
                  onClaimReward={claimReward}
                />
              </div>

              <div>
                <SectionLabel
                  title="Knihovna cviceni"
                  delay={0.35}
                  right={
                    <Button asChild variant="ghost" size="sm" className="text-[11px] h-6 px-2 -mr-2">
                      <Link to="/prehled/cviceni">
                        Zobrazit vse
                        <RiArrowRightLine className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  }
                />
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.4 }}
                >
                  <Link
                    to="/prehled/cviceni"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 active:scale-[0.98] transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <RiBookOpenLine className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold">Prohlednete si cviceni</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Cviky, popisy, obrazky a videa</p>
                    </div>
                    <RiArrowRightLine className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </Link>
                </motion.div>
              </div>

              <div>
                <SectionLabel title="Doporuceno pro vas" delay={0.4} />
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.45 }}
                  className="space-y-2.5"
                >
                  {[
                    { title: 'Vysledky testu', desc: 'Zkontrolujte sve hodnoceni', path: '/prehled/vysledky-testu', icon: RiCheckLine, bg: 'bg-emerald-500' },
                    { title: 'Studijni doba', desc: 'Sledujte cas studia', path: '/prehled/analytika', icon: RiTimeLine, bg: 'bg-cyan-500' },
                    { title: 'Certifikaty', desc: 'Vase ziskane certifikaty', path: '/prehled/certifikaty', icon: RiTrophyLine, bg: 'bg-amber-500' },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 active:scale-[0.98] transition-all"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold">{item.title}</h4>
                          <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                        </div>
                        <RiArrowRightLine className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      </Link>
                    )
                  })}
                </motion.div>
              </div>

            </>
          )}

          {lastXpEvent && (
            <XpRewardPopup
              amount={lastXpEvent.amount}
              source={lastXpEvent.source}
              newBadges={lastXpEvent.newBadges}
              newRank={lastXpEvent.newRank}
              visible={!!lastXpEvent}
              onClose={clearLastEvent}
            />
          )}
        </motion.div>
      )}
    </>
  )
}
