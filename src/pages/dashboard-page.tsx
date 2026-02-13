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
import { SubscriptionTimerCard } from '@/components/dashboard/subscription-timer-card'
import { supabase } from '@/lib/supabase'

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
      toast.success('Předplatné aktualizováno')
    } catch (error) {
      toast.error('Nepodařilo se aktualizovat předplatné')
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Dobré ráno'
    if (hour < 18) return 'Dobré odpoledne'
    return 'Dobrý večer'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 relative mx-auto max-w-7xl">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/2 h-[40%] w-[60%] animate-pulse bg-gradient-to-r from-primary/15 via-blue-400/15 to-primary/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {user?.email?.split('@')[0] || 'Studente'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Vítejte zpět na vaší vzdělávací platformě. Pokračujte ve svém učení.
          </p>
        </div>
        <div className="w-full lg:w-auto lg:min-w-[320px]">
          <SubscriptionTimerCard
            subscription={subscription}
            hasActiveSubscription={hasActiveSubscription}
            onRefresh={handleRefreshSubscription}
            refreshing={refreshing}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Dokončené Kurzy', value: stats.completedCourses, icon: RiTrophyLine, color: 'text-green-600' },
          { title: 'Probíhající Kurzy', value: stats.inProgressCourses, icon: RiBookOpenLine, color: 'text-blue-600' },
          { title: 'Hodin Studia', value: stats.totalHoursSpent, icon: RiTimeLine, color: 'text-blue-600' },
          { title: 'Dokončené Lekce', value: stats.completedModules, icon: RiCheckLine, color: 'text-orange-600' }
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
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
                  <CardTitle>Pokračovat ve Studiu</CardTitle>
                  <CardDescription>
                    Vaše aktivní kurzy a pokrok
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/prehled/moje-kurzy">
                    Zobrazit vše
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
                              Dokončeno
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
                            Dokončeno
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
                      <Link to="/prehled/moje-kurzy">
                        Pokračovat
                      </Link>
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
              <CardTitle>Začněte Svou Cestu</CardTitle>
              <CardDescription>
                Ještě nemáte žádné kurzy. Prohlédněte si naši nabídku a začněte se učit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <RiBookOpenLine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">
                  Zapište se do svého prvního kurzu a začněte svou vzdělávací cestu
                </p>
                <Button asChild size="lg">
                  <Link to="/prehled/moje-kurzy">
                    Prohlédnout Kurzy
                  </Link>
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
              <CardTitle>Rychlé Akce</CardTitle>
              <CardDescription>
                Nejčastěji používané funkce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/prehled/moje-kurzy">
                  <RiBookOpenLine className="mr-2 h-4 w-4" />
                  Prohlížet Kurzy
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Vaše Úspěchy</CardTitle>
              <CardDescription>
                Sledujte svůj pokrok
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${stats.completedCourses > 0 ? 'bg-green-500/20' : 'bg-muted'}`}>
                  {stats.completedCourses > 0 ? (
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dokončit První Kurz</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedCourses > 0 ? 'Splněno! Skvělá práce!' : 'Dokončete svůj první kurz'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${stats.inProgressCourses > 0 ? 'bg-green-500/20' : 'bg-muted'}`}>
                  {stats.inProgressCourses > 0 ? (
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Zapsat se do Kurzu</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.inProgressCourses > 0 ? 'Splněno! Pokračujte dál!' : 'Začněte svůj první kurz'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1 ${stats.completedModules >= 10 ? 'bg-green-500/20' : 'bg-muted'}`}>
                  {stats.completedModules >= 10 ? (
                    <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dokončit 10 Lekcí</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedModules >= 10 ? 'Splněno! Jste na správné cestě!' : `${stats.completedModules}/10 lekcí dokončeno`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
