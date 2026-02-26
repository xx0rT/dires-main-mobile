import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiTimeLine, RiTrophyLine, RiArrowRightLine, RiCheckLine, RiBillLine, RiUserLine } from '@remixicon/react'
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
  }, [])

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
          className="space-y-8 pb-8"
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {[
                  { title: 'Dokoncene', value: stats.completedCourses, icon: RiTrophyLine, color: 'text-green-500', bg: 'bg-green-500/10' },
                  { title: 'Probihajici', value: stats.inProgressCourses, icon: RiBookOpenLine, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { title: 'Hodin', value: stats.totalHoursSpent, icon: RiTimeLine, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                  { title: 'Lekci', value: stats.completedModules, icon: RiCheckLine, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.title}
                      variants={fadeUp}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/30"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <div className="text-xl font-extrabold leading-tight">{stat.value}</div>
                        <div className="text-[11px] text-muted-foreground font-medium">{stat.title}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {enrollments.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Pokracovat</h2>
                      <p className="text-xs text-muted-foreground">Vase aktivni kurzy</p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                      <Link to="/prehled/moje-kurzy">
                        Vse
                        <RiArrowRightLine className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {enrollments.slice(0, 3).map((enrollment, i) => (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Link
                          to="/prehled/moje-kurzy"
                          className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/60 transition-colors"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-blue-400/15 flex items-center justify-center">
                            <RiBookOpenLine className="h-5 w-5 text-primary/70" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm truncate">{enrollment.course.title}</h3>
                              {enrollment.completed_at && (
                                <span className="flex-shrink-0 text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                                  Hotovo
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted-foreground">Pokrok</span>
                                <span className="font-bold">{Math.round(enrollment.progress_percentage)}%</span>
                              </div>
                              <Progress value={enrollment.progress_percentage} className="h-1.5" />
                            </div>
                          </div>
                          <RiArrowRightLine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center py-10 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                  >
                    <RiBookOpenLine className="h-14 w-14 text-muted-foreground/40 mx-auto" />
                  </motion.div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold">Zacnete Svou Cestu</h3>
                    <p className="text-sm text-muted-foreground">
                      Zapiste se do sveho prvniho kurzu
                    </p>
                  </div>
                  <Button asChild size="lg" className="rounded-xl">
                    <Link to="/prehled/moje-kurzy">Prohlednout Kurzy</Link>
                  </Button>
                </motion.div>
              )}

              <BadgesCollection
                earnedBadgeIds={new Set(earnedBadges.map((b) => b.badge_id))}
                claimedRewards={claimedRewards}
                onClaimReward={claimReward}
              />

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-2"
              >
                <h2 className="text-lg font-bold">Rychle Akce</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { to: '/prehled/moje-kurzy', icon: RiBookOpenLine, label: 'Kurzy', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { to: '/prehled/fakturace', icon: RiBillLine, label: 'Platby', color: 'text-green-500', bg: 'bg-green-500/10' },
                    { to: '/prehled/nastaveni', icon: RiUserLine, label: 'Profil', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                  ].map(({ to, icon: Icon, label, color, bg }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.06, type: 'spring', stiffness: 300 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Link
                        to={to}
                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/60 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                          <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                        <span className="text-xs font-semibold">{label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
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
