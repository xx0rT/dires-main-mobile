import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle2, Play, Layers } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface CourseWithProgress {
  id: string
  title: string
  description: string
  thumbnail_url: string
  lessons_count: number
  duration: number
  completedLessons: number
  totalLessons: number
  progress: number
  isCompleted: boolean
  enrolledAt: string
}

export default function MyCoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchMyCourses()
  }, [user])

  const fetchMyCourses = async () => {
    if (!user) return

    try {
      const [{ data: purchasesData }, { data: enrollmentsData }] = await Promise.all([
        supabase.from('course_purchases').select('course_id').eq('user_id', user.id),
        supabase.from('course_enrollments').select('course_id, completed, enrolled_at').eq('user_id', user.id),
      ])

      const purchasedIds = new Set((purchasesData || []).map((p) => p.course_id))
      const enrollmentMap = new Map(
        (enrollmentsData || []).map((e) => [e.course_id, e])
      )
      const ownedIds = new Set([...purchasedIds, ...(enrollmentsData || []).map((e) => e.course_id)])

      if (ownedIds.size === 0) {
        setCourses([])
        setLoading(false)
        return
      }

      const [{ data: coursesData }, { data: progressData }, { data: lessonsData }] = await Promise.all([
        supabase
          .from('courses')
          .select('id, title, description, thumbnail_url, lessons_count, duration')
          .in('id', Array.from(ownedIds))
          .eq('published', true)
          .order('order_index'),
        supabase
          .from('user_course_progress')
          .select('course_id, lesson_id, completed')
          .eq('user_id', user.id),
        supabase
          .from('course_lessons')
          .select('id, course_id')
          .in('course_id', Array.from(ownedIds)),
      ])

      const lessonsByCourse = new Map<string, number>()
      for (const l of lessonsData || []) {
        lessonsByCourse.set(l.course_id, (lessonsByCourse.get(l.course_id) || 0) + 1)
      }

      const completedByCourse = new Map<string, number>()
      for (const p of progressData || []) {
        if (p.completed) {
          completedByCourse.set(p.course_id, (completedByCourse.get(p.course_id) || 0) + 1)
        }
      }

      const result: CourseWithProgress[] = (coursesData || []).map((course) => {
        const enrollment = enrollmentMap.get(course.id)
        const totalLessons = lessonsByCourse.get(course.id) || course.lessons_count || 0
        const completedLessons = completedByCourse.get(course.id) || 0
        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        const isCompleted = enrollment?.completed || progress === 100

        return {
          ...course,
          completedLessons,
          totalLessons,
          progress: isCompleted ? 100 : progress,
          isCompleted,
          enrolledAt: enrollment?.enrolled_at || '',
        }
      })

      setCourses(result)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const inProgress = courses.filter((c) => !c.isCompleted)
  const completed = courses.filter((c) => c.isCompleted)

  return (
    <div className="space-y-8 mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Moje Kurzy</h1>
        <p className="text-muted-foreground mt-1">
          Kurzy, ktere jste zakoupili. Vyberte kurz pro zobrazeni detailu.
        </p>
      </motion.div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center py-16"
        >
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Zatim zadne kurzy</h2>
          <p className="text-muted-foreground mb-6">
            Prozkoumejte nasi nabidku kurzu a zacnete se ucit.
          </p>
          <Button asChild size="lg">
            <Link to="/kurzy">Prohlizet kurzy</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {inProgress.length > 0 && (
            <CourseSection
              title="Probihajici"
              courses={inProgress}
              delay={0.1}
            />
          )}
          {completed.length > 0 && (
            <CourseSection
              title="Dokoncene"
              courses={completed}
              delay={inProgress.length > 0 ? 0.3 : 0.1}
            />
          )}
        </div>
      )}
    </div>
  )
}

function CourseSection({
  title,
  courses,
  delay,
}: {
  title: string
  courses: CourseWithProgress[]
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <h2 className="text-lg font-semibold mb-4 text-muted-foreground">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => (
          <CourseCard key={course.id} course={course} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

function CourseCard({ course, index }: { course: CourseWithProgress; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/prehled/moje-kurzy/${course.id}`} className="block group">
        <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/30 group-hover:-translate-y-0.5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.description}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  course.isCompleted
                    ? 'border-green-500/30 text-green-600 bg-green-500/10 shrink-0'
                    : 'border-primary/30 text-primary bg-primary/10 shrink-0'
                }
              >
                {course.isCompleted ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" /> Hotovo</>
                ) : (
                  <><Play className="h-3 w-3 mr-1" /> Aktivni</>
                )}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {course.completedLessons} / {course.totalLessons} lekci
                </span>
                <span className="font-medium tabular-nums">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {course.totalLessons} lekci
              </span>
              {course.duration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {course.duration} min
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
