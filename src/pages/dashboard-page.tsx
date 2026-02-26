import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiTimeLine, RiTrophyLine, RiArrowRightLine, RiCheckLine, RiBillLine, RiUserLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSubscription } from '@/lib/use-subscription'
import { toast } from 'sonner'
import { PhysioAnalyticsChart } from '@/components/dashboard/physio-analytics-chart'
import { PhysioTodoList } from '@/components/dashboard/physio-todo-list'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { CourseDashboard } from '@/components/dashboard/course-dashboard'
import { useSelectedCourse } from '@/lib/selected-course-context'
import { supabase } from '@/lib/supabase'
import { useGamification } from '@/lib/use-gamification'
import { BadgesCollection } from '@/components/gamification/badges-collection'
import { XpRewardPopup } from '@/components/gamification/xp-reward-popup'

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
  const [stats, setStats] = useState({
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursSpent: 0,
    completedModules: 0
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
          order_index: enrollment.courses?.order_index || 0
        }
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
        completedModules: completedModulesCount
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (selectedCourse) {
    return <CourseDashboard course={selectedCourse} />
  }

  return (
    <div className="space-y-6 sm:space-y-8 relative mx-auto max-w-7xl">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/2 h-[40%] w-[60%] animate-pulse bg-gradient-to-r from-primary/15 via-blue-400/15 to-primary/15 blur-3xl" />
      </div>

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

      <BadgesCollection
        earnedBadgeIds={new Set(earnedBadges.map((b) => b.badge_id))}
        claimedRewards={claimedRewards}
        onClaimReward={claimReward}
      />

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Dokoncene Kurzy', value: stats.completedCourses, icon: RiTrophyLine, color: 'text-green-600' },
          { title: 'Probihajici Kurzy', value: stats.inProgressCourses, icon: RiBookOpenLine, color: 'text-blue-600' },
          { title: 'Hodin Studia', value: stats.totalHoursSpent, icon: RiTimeLine, color: 'text-blue-600' },
          { title: 'Dokoncene Lekce', value: stats.completedModules, icon: RiCheckLine, color: 'text-orange-600' }
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PhysioAnalyticsChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <PhysioTodoList />
      </motion.div>

      {enrollments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pokracovat ve Studiu</CardTitle>
                  <CardDescription>Vase aktivni kurzy a pokrok</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/prehled/moje-kurzy">
                    Zobrazit vse
                    <RiArrowRightLine className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center">
                        <RiBookOpenLine className="h-6 w-6 sm:h-8 sm:w-8 text-primary/70" />
                      </div>
                      <div className="sm:hidden flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{enrollment.course.title}</h3>
                          {enrollment.completed_at && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              <RiTrophyLine className="h-3 w-3 mr-1" />
                              Dokonceno
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="hidden sm:flex items-center justify-between">
                        <h3 className="font-semibold">{enrollment.course.title}</h3>
                        {enrollment.completed_at && (
                          <Badge variant="default" className="bg-green-600">
                            <RiTrophyLine className="h-3 w-3 mr-1" />
                            Dokonceno
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Pokrok</span>
                          <span className="font-medium">{Math.round(enrollment.progress_percentage)}%</span>
                        </div>
                        <Progress value={enrollment.progress_percentage} className="h-2" />
                      </div>
                    </div>
                    <Button size="sm" asChild className="w-full sm:w-auto">
                      <Link to="/prehled/moje-kurzy">Pokracovat</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Zacnete Svou Cestu</CardTitle>
              <CardDescription>
                Jeste nemate zadne kurzy. Prohlednete si nasi nabidku a zacnete se ucit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <RiBookOpenLine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">
                  Zapiste se do sveho prvniho kurzu a zacnete svou vzdelavaci cestu
                </p>
                <Button asChild size="lg">
                  <Link to="/prehled/moje-kurzy">Prohlednout Kurzy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Rychle Akce</CardTitle>
              <CardDescription>Nejcasteji pouzivane funkce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/prehled/moje-kurzy">
                  <RiBookOpenLine className="mr-2 h-4 w-4" />
                  Prohlizet Kurzy
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/prehled/fakturace">
                  <RiBillLine className="mr-2 h-4 w-4" />
                  Platby a Faktury
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/prehled/nastaveni">
                  <RiUserLine className="mr-2 h-4 w-4" />
                  Upravit Profil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
    </div>
  )
}
