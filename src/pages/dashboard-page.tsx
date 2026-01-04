import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiTimeLine, RiTrophyLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiBillLine, RiSettingsLine, RiMailLine } from '@remixicon/react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string
  image_url: string
  price: number
  order_index: number
}

interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string
  order_index: number
  duration_minutes: number
}

interface Enrollment {
  id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
  course: Course
}

interface ModuleProgress {
  module_id: string
  is_completed: boolean
  completed_at: string | null
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [loading, setLoading] = useState(true)
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
      const { data: enrollmentsData } = await supabase
        .from('user_course_enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      const { data: progressData } = await supabase
        .from('user_module_progress')
        .select('*')
        .eq('user_id', user.id)

      if (enrollmentsData) {
        setEnrollments(enrollmentsData as Enrollment[])

        const enrolledCourseIds = enrollmentsData.map((e: Enrollment) => e.course_id)
        for (const courseId of enrolledCourseIds) {
          const { data: modules } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true })

          if (modules) {
            setCourseModules(prev => ({ ...prev, [courseId]: modules }))
          }
        }
      }

      if (coursesData) {
        setAvailableCourses(coursesData)
      }

      if (progressData) {
        const progressMap: Record<string, ModuleProgress> = {}
        progressData.forEach((p: ModuleProgress) => {
          progressMap[p.module_id] = p
        })
        setModuleProgress(progressMap)

        const completedModulesCount = progressData.filter((p: ModuleProgress) => p.is_completed).length
        const totalMinutes = progressData.filter((p: ModuleProgress) => p.is_completed).length * 60

        setStats({
          completedCourses: enrollmentsData?.filter((e: Enrollment) => e.completed_at).length || 0,
          inProgressCourses: enrollmentsData?.filter((e: Enrollment) => !e.completed_at).length || 0,
          totalHoursSpent: Math.round(totalMinutes / 60),
          completedModules: completedModulesCount
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const enrollInCourse = async (courseId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0
        })

      if (!error) {
        loadDashboardData()
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  const markModuleComplete = async (moduleId: string, courseId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          course_id: courseId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id'
        })

      if (!error) {
        const modules = courseModules[courseId] || []
        const completedCount = Object.values(moduleProgress).filter(p =>
          p.is_completed && modules.some(m => m.id === p.module_id)
        ).length + 1

        const progressPercentage = (completedCount / modules.length) * 100

        await supabase
          .from('user_course_enrollments')
          .update({
            progress_percentage: progressPercentage,
            completed_at: progressPercentage === 100 ? new Date().toISOString() : null
          })
          .eq('user_id', user.id)
          .eq('course_id', courseId)

        loadDashboardData()
      }
    } catch (error) {
      console.error('Error marking module complete:', error)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Dobré ráno'
    if (hour < 18) return 'Dobré odpoledne'
    return 'Dobrý večer'
  }

  const isModuleUnlocked = (courseId: string, moduleIndex: number) => {
    if (moduleIndex === 0) return true

    const modules = courseModules[courseId] || []
    const previousModule = modules[moduleIndex - 1]

    if (!previousModule) return false

    return moduleProgress[previousModule.id]?.is_completed || false
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
    <div className="space-y-8 relative">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/2 h-[40%] w-[60%] animate-pulse bg-gradient-to-r from-primary/15 via-purple-500/15 to-primary/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.email?.split('@')[0] || 'Studente'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Vítejte zpět na vaší vzdělávací platformě. Pokračujte ve svém učení.
        </p>
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
          { title: 'Hodin Studia', value: stats.totalHoursSpent, icon: RiTimeLine, color: 'text-purple-600' },
          { title: 'Dokončené Lekce', value: stats.completedModules, icon: RiCheckLine, color: 'text-orange-600' }
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden">
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

      <Tabs defaultValue="learning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="learning">
            <RiBookOpenLine className="h-4 w-4 mr-2" />
            Učení
          </TabsTrigger>
          <TabsTrigger value="billing">
            <RiBillLine className="h-4 w-4 mr-2" />
            Platby
          </TabsTrigger>
          <TabsTrigger value="settings">
            <RiSettingsLine className="h-4 w-4 mr-2" />
            Nastavení
          </TabsTrigger>
          <TabsTrigger value="contact">
            <RiMailLine className="h-4 w-4 mr-2" />
            Kontakt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="learning" className="space-y-6">
          {enrollments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Moje Kurzy</CardTitle>
                  <CardDescription>
                    Pokračujte tam, kde jste skončili
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {enrollments.map((enrollment) => {
                    const modules = courseModules[enrollment.course_id] || []
                    const completedModules = modules.filter(m =>
                      moduleProgress[m.id]?.is_completed
                    ).length

                    return (
                      <div key={enrollment.id} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                            <p className="text-sm text-muted-foreground">{enrollment.course.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-muted-foreground">
                                {completedModules} / {modules.length} lekcí
                              </span>
                              {enrollment.completed_at && (
                                <Badge variant="default" className="bg-green-600">
                                  <RiTrophyLine className="h-3 w-3 mr-1" />
                                  Dokončeno
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Pokrok</span>
                            <span className="font-medium">{Math.round(enrollment.progress_percentage)}%</span>
                          </div>
                          <Progress value={enrollment.progress_percentage} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Lekce:</h4>
                          {modules.map((module, index) => {
                            const isCompleted = moduleProgress[module.id]?.is_completed
                            const isUnlocked = isModuleUnlocked(enrollment.course_id, index)

                            return (
                              <div
                                key={module.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  isCompleted
                                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                                    : isUnlocked
                                    ? 'bg-background hover:bg-accent cursor-pointer'
                                    : 'bg-muted opacity-60'
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {isCompleted ? (
                                    <div className="rounded-full bg-green-600 p-1.5">
                                      <RiCheckLine className="h-4 w-4 text-white" />
                                    </div>
                                  ) : isUnlocked ? (
                                    <div className="rounded-full bg-primary/20 p-1.5">
                                      <RiPlayCircleLine className="h-4 w-4 text-primary" />
                                    </div>
                                  ) : (
                                    <div className="rounded-full bg-muted p-1.5">
                                      <RiLockLine className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{module.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {module.duration_minutes} minut
                                    </p>
                                  </div>
                                </div>
                                {isUnlocked && !isCompleted && (
                                  <Button
                                    size="sm"
                                    onClick={() => markModuleComplete(module.id, enrollment.course_id)}
                                  >
                                    Označit jako hotové
                                  </Button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {availableCourses.filter(course =>
            !enrollments.some(e => e.course_id === course.id)
          ).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Dostupné Kurzy</CardTitle>
                  <CardDescription>
                    Zapište se do nových kurzů a rozšiřte své znalosti
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableCourses
                      .filter(course => !enrollments.some(e => e.course_id === course.id))
                      .map((course) => (
                        <Card key={course.id} className="overflow-hidden">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                            <RiBookOpenLine className="h-16 w-16 text-primary/50" />
                          </div>
                          <CardHeader>
                            <CardTitle className="text-lg">{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">€{course.price}</span>
                              <Button onClick={() => enrollInCourse(course.id)}>
                                Zapsat se
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Platby a Fakturace</CardTitle>
              <CardDescription>Spravujte své platby a prohlížejte faktury</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-12">
                  <RiBillLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Historie plateb</h3>
                  <p className="text-muted-foreground">
                    Zde se zobrazí vaše platební historie a faktury
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení Účtu</CardTitle>
              <CardDescription>Upravte své osobní údaje a předvolby</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="p-3 bg-muted rounded-lg">
                    {user?.email}
                  </div>
                </div>
                <div className="text-center py-8">
                  <RiSettingsLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Další nastavení budou brzy k dispozici
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktujte Podporu</CardTitle>
              <CardDescription>Máte dotazy? Jsme tu, abychom vám pomohli</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <RiMailLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Potřebujete pomoc?</h3>
                  <p className="text-muted-foreground mb-4">
                    Náš tým podpory je připraven odpovědět na vaše dotazy
                  </p>
                  <Button>Odeslat zprávu</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Email Podpora</h4>
                    <p className="text-sm text-muted-foreground">podpora@fyzioterapie.cz</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Telefonická Podpora</h4>
                    <p className="text-sm text-muted-foreground">+420 123 456 789</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
