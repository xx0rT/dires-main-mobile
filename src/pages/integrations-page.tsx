import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiTrophyLine } from '@remixicon/react'
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

export default function IntegrationsPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoursesData()
  }, [user])

  const loadCoursesData = async () => {
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
      }
    } catch (error) {
      console.error('Error loading courses data:', error)
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
        loadCoursesData()
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

        loadCoursesData()
      }
    } catch (error) {
      console.error('Error marking module complete:', error)
    }
  }

  const isModuleUnlocked = (courseId: string, moduleIndex: number) => {
    if (moduleIndex === 0) return true

    const modules = courseModules[courseId] || []
    const previousModule = modules[moduleIndex - 1]

    if (!previousModule) return false

    return moduleProgress[previousModule.id]?.is_completed || false
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Moje Kurzy</h1>
        <p className="text-muted-foreground mt-2">
          Spravujte své kurzy a sledujte svůj pokrok
        </p>
      </div>

      {enrollments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Zapsané Kurzy</CardTitle>
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
          transition={{ duration: 0.5, delay: 0.2 }}
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
    </div>
  )
}
