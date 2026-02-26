import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiTrophyLine, RiArrowRightLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CourseDashboard } from '@/components/dashboard/course-dashboard'
import { useSelectedCourse } from '@/lib/selected-course-context'
import { supabase } from '@/lib/supabase'
import { useGamification } from '@/lib/use-gamification'
import { XpRewardPopup } from '@/components/gamification/xp-reward-popup'
import { WelcomeLoader } from '@/components/layout/welcome-loader'

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
  const { selectedCourse } = useSelectedCourse()
  const {
    userXp, currentRank, lastXpEvent, clearLastEvent,
  } = useGamification()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)
  const [stats, setStats] = useState({
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursSpent: 0,
    completedModules: 0
  })

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

  if (loading || showLoader) {
    return <WelcomeLoader onComplete={() => setShowLoader(false)} />
  }

  if (selectedCourse) {
    return <CourseDashboard course={selectedCourse} />
  }

  const userName = user?.email?.split('@')[0] || 'Uživateli'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 pt-6 pb-4"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-1"
        >
          Ahoj, {userName}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground"
        >
          Vítejte zpět na vaší vzdělávací cestě
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 pb-6"
      >
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-400/10 border border-primary/20">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Váš rank</div>
            <div className="text-2xl font-bold">{currentRank?.name || 'Začátečník'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {userXp?.total_xp || 0} XP
            </div>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut'
            }}
            className="text-5xl"
          >
            🏆
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 space-y-3">
        {[
          {
            title: 'Dokončené Kurzy',
            value: stats.completedCourses,
            icon: '✅',
            color: 'from-green-500/20 to-green-600/20',
            borderColor: 'border-green-500/30'
          },
          {
            title: 'Probíhající Kurzy',
            value: stats.inProgressCourses,
            icon: '📚',
            color: 'from-blue-500/20 to-blue-600/20',
            borderColor: 'border-blue-500/30'
          },
          {
            title: 'Hodin Studia',
            value: stats.totalHoursSpent,
            icon: '⏱️',
            color: 'from-purple-500/20 to-purple-600/20',
            borderColor: 'border-purple-500/30'
          },
          {
            title: 'Dokončené Lekce',
            value: stats.completedModules,
            icon: '✨',
            color: 'from-orange-500/20 to-orange-600/20',
            borderColor: 'border-orange-500/30'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${stat.color} border ${stat.borderColor}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            </div>
            <RiArrowRightLine className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        ))}
      </div>

      {enrollments.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 px-4 pb-24"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pokračovat ve studiu</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/prehled/moje-kurzy">
                Vše
                <RiArrowRightLine className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {enrollments.slice(0, 3).map((enrollment, index) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-card border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-400/20 flex items-center justify-center">
                    <RiBookOpenLine className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{enrollment.course.title}</h3>
                    {enrollment.completed_at && (
                      <Badge variant="default" className="bg-green-600 text-xs mt-1">
                        <RiTrophyLine className="h-3 w-3 mr-1" />
                        Dokončeno
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pokrok</span>
                    <span className="font-medium">{Math.round(enrollment.progress_percentage)}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage} className="h-2" />
                </div>
                <Button size="sm" asChild className="w-full mt-3">
                  <Link to="/prehled/moje-kurzy">Pokračovat</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 px-4 pb-24"
        >
          <div className="text-center py-12 px-4 rounded-2xl bg-gradient-to-br from-primary/5 to-blue-400/5 border border-primary/10">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut'
              }}
              className="text-6xl mb-4"
            >
              📚
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Začněte svou cestu</h3>
            <p className="text-muted-foreground mb-6">
              Ještě nemáte žádné kurzy. Prohlédněte si naši nabídku.
            </p>
            <Button asChild size="lg">
              <Link to="/prehled/moje-kurzy">Prohlédnout Kurzy</Link>
            </Button>
          </div>
        </motion.div>
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
    </div>
  )
}
