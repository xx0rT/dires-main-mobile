import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BarChart3, BookOpen, CheckCircle2, Clock, TrendingUp, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface CourseProgress {
  courseId: string
  courseTitle: string
  totalLessons: number
  completedLessons: number
  progress: number
  isCompleted: boolean
  lastActivity: string | null
}

export default function ProgressPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [totalHours, setTotalHours] = useState(0)

  useEffect(() => {
    if (user) loadProgress()
  }, [user])

  const loadProgress = async () => {
    if (!user) return

    try {
      const [
        { data: enrollments },
        { data: progressData },
        { data: lessonsData },
      ] = await Promise.all([
        supabase
          .from('course_enrollments')
          .select('course_id, completed, courses!inner(id, title)')
          .eq('user_id', user.id),
        supabase
          .from('user_course_progress')
          .select('course_id, lesson_id, completed, last_watched_at')
          .eq('user_id', user.id),
        supabase
          .from('course_lessons')
          .select('id, course_id'),
      ])

      const lessonsByCourse = new Map<string, number>()
      for (const l of lessonsData || []) {
        lessonsByCourse.set(l.course_id, (lessonsByCourse.get(l.course_id) || 0) + 1)
      }

      const completedByCourse = new Map<string, number>()
      const lastActivityByCourse = new Map<string, string>()
      for (const p of progressData || []) {
        if (p.completed) {
          completedByCourse.set(p.course_id, (completedByCourse.get(p.course_id) || 0) + 1)
        }
        const current = lastActivityByCourse.get(p.course_id)
        if (!current || (p.last_watched_at && p.last_watched_at > current)) {
          lastActivityByCourse.set(p.course_id, p.last_watched_at)
        }
      }

      const result: CourseProgress[] = (enrollments || []).map((e: any) => {
        const total = lessonsByCourse.get(e.course_id) || 0
        const completed = completedByCourse.get(e.course_id) || 0
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
          courseId: e.course_id,
          courseTitle: e.courses?.title || '',
          totalLessons: total,
          completedLessons: completed,
          progress: e.completed ? 100 : pct,
          isCompleted: e.completed || pct === 100,
          lastActivity: lastActivityByCourse.get(e.course_id) || null,
        }
      })

      result.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1
        return b.progress - a.progress
      })

      setCourses(result)

      const totalCompleted = (progressData || []).filter(p => p.completed).length
      setTotalHours(Math.round(totalCompleted * 0.75))
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedCourses = courses.filter(c => c.isCompleted).length
  const inProgressCourses = courses.filter(c => !c.isCompleted).length
  const totalLessonsCompleted = courses.reduce((sum, c) => sum + c.completedLessons, 0)
  const overallProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)
    : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Pokrok ve studiu</h1>
        <p className="text-muted-foreground mt-1">
          Sledujte svuj pokrok a ucebni aktivitu
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Celkovy pokrok', value: `${overallProgress}%`, icon: TrendingUp, sub: 'Prumerny pokrok' },
          { label: 'Dokoncene kurzy', value: completedCourses, icon: CheckCircle2, sub: `z ${courses.length} kurzu` },
          { label: 'Probihajici', value: inProgressCourses, icon: BookOpen, sub: 'Aktivni kurzy' },
          { label: 'Dokoncene lekce', value: totalLessonsCompleted, icon: Layers, sub: `~${totalHours}h studia` },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pokrok v kurzech</CardTitle>
            <CardDescription>Detailni prehled vaseho pokroku v jednotlivych kurzech</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-5">
                {courses.map((course) => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm font-medium truncate">{course.courseTitle}</h3>
                        {course.isCompleted && (
                          <Badge variant="outline" className="shrink-0 border-green-500/30 text-green-600 bg-green-500/10">
                            Dokonceno
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-semibold tabular-nums shrink-0">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.completedLessons} / {course.totalLessons} lekci</span>
                      {course.lastActivity && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Posledni aktivita: {new Date(course.lastActivity).toLocaleDateString('cs-CZ')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-semibold mb-1">Zadny pokrok</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Zacnete studovat kurzy a sledujte svuj pokrok
                </p>
                <Button asChild>
                  <Link to="/prehled/integrace">Prohlidnout kurzy</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
