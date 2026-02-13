import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  CalendarClock,
  Layers,
  Lock,
  Play,
  Trophy,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  lessons_count: number
  duration: number
  category: string
  level: string
  instructor: string
  package_id: string | null
  order_index: number
}

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  order_index: number
}

interface LessonProgress {
  lesson_id: string
  completed: boolean
  completed_at: string | null
  progress_percent: number
}

export default function MyCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progressMap, setProgressMap] = useState<Map<string, LessonProgress>>(new Map())
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [enrolledAt, setEnrolledAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && courseId) loadData()
  }, [user, courseId])

  const loadData = async () => {
    if (!user || !courseId) return

    try {
      const [
        { data: courseData },
        { data: lessonsData },
        { data: enrollmentData },
        { data: purchaseData },
        { data: progressData },
      ] = await Promise.all([
        supabase
          .from('courses')
          .select('id, title, description, thumbnail_url, lessons_count, duration, category, level, instructor, package_id, order_index')
          .eq('id', courseId)
          .maybeSingle(),
        supabase
          .from('course_lessons')
          .select('id, title, description, duration, order_index')
          .eq('course_id', courseId)
          .order('order_index'),
        supabase
          .from('course_enrollments')
          .select('id, completed, enrolled_at')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle(),
        supabase
          .from('course_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle(),
        supabase
          .from('user_course_progress')
          .select('lesson_id, completed, completed_at, progress_percent')
          .eq('user_id', user.id)
          .eq('course_id', courseId),
      ])

      if (courseData) setCourse(courseData)
      if (lessonsData) setLessons(lessonsData)

      setIsEnrolled(!!enrollmentData || !!purchaseData)
      setIsCompleted(enrollmentData?.completed || false)
      setEnrolledAt(enrollmentData?.enrolled_at || null)

      if (progressData) {
        const map = new Map<string, LessonProgress>()
        for (const p of progressData) {
          map.set(p.lesson_id, p)
        }
        setProgressMap(map)
      }
    } catch (error) {
      console.error('Error loading course detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedLessons = Array.from(progressMap.values()).filter((p) => p.completed).length
  const totalLessons = lessons.length
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalDuration = lessons.reduce((acc, l) => acc + l.duration, 0)

  const getLessonStatus = (index: number): 'completed' | 'available' | 'daily_locked' | 'locked' => {
    const lesson = lessons[index]
    const progress = progressMap.get(lesson.id)

    if (progress?.completed) return 'completed'
    if (index === 0) return 'available'

    const prevLesson = lessons[index - 1]
    const prevProgress = progressMap.get(prevLesson.id)

    if (!prevProgress?.completed) return 'locked'

    if (prevProgress.completed_at) {
      const completedDate = new Date(prevProgress.completed_at)
      const now = new Date()
      const completedDay = new Date(completedDate.getFullYear(), completedDate.getMonth(), completedDate.getDate())
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      if (completedDay.getTime() >= today.getTime()) return 'daily_locked'
    }

    return 'available'
  }

  const getNextLesson = (): number | null => {
    for (let i = 0; i < lessons.length; i++) {
      const status = getLessonStatus(i)
      if (status === 'available' && !progressMap.get(lessons[i].id)?.completed) return i
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!course || !isEnrolled) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Kurz nenalezen</h2>
        <p className="text-muted-foreground mb-6">
          Tento kurz neexistuje nebo k nemu nemate pristup.
        </p>
        <Button asChild variant="outline">
          <Link to="/prehled/moje-kurzy">Zpet na moje kurzy</Link>
        </Button>
      </div>
    )
  }

  const nextLessonIndex = getNextLesson()

  return (
    <div className="space-y-6 mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/prehled/moje-kurzy">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zpet na moje kurzy
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {isCompleted ? (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                      <Trophy className="h-3 w-3 mr-1" />
                      Dokonceno
                    </Badge>
                  ) : overallProgress > 0 ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Play className="h-3 w-3 mr-1" />
                      Probiha
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Nezahajeno
                    </Badge>
                  )}
                  {course.level && course.level !== 'beginner' && (
                    <Badge variant="outline" className="capitalize">
                      {course.level}
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{course.title}</h1>

                {course.description && (
                  <p className="text-muted-foreground leading-relaxed mb-4">{course.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4" />
                    {totalLessons} lekci
                  </span>
                  {totalDuration > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {totalDuration} min celkem
                    </span>
                  )}
                  {course.instructor && (
                    <span className="flex items-center gap-1.5">
                      Instruktor: {course.instructor}
                    </span>
                  )}
                  {enrolledAt && (
                    <span className="flex items-center gap-1.5">
                      Zapsano: {new Date(enrolledAt).toLocaleDateString('cs-CZ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:w-64 shrink-0 space-y-4">
                <div className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold tabular-nums">{overallProgress}%</div>
                    <p className="text-sm text-muted-foreground">Celkovy pokrok</p>
                  </div>
                  <Progress value={overallProgress} className="h-2.5" />
                  <p className="text-xs text-muted-foreground text-center">
                    {completedLessons} z {totalLessons} lekci dokonceno
                  </p>
                </div>

                {nextLessonIndex !== null && (
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/kurz/${course.id}/cast/${nextLessonIndex + 1}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Pokracovat ve studiu
                  </Button>
                )}

                {isCompleted && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/kurz/${course.id}/cast/1`)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Zopakovat kurz
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'Celkem lekci', value: totalLessons, icon: Layers },
          { label: 'Dokonceno', value: completedLessons, icon: CheckCircle2 },
          { label: 'Zbyvajicich', value: totalLessons - completedLessons, icon: BookOpen },
          { label: 'Celkovy cas', value: `${totalDuration} min`, icon: Clock },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prehled lekci</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {lessons.map((lesson, index) => {
                const status = getLessonStatus(index)
                const progress = progressMap.get(lesson.id)
                const canOpen = status === 'completed' || status === 'available'

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    disabled={!canOpen}
                    onClick={() => {
                      if (canOpen) navigate(`/kurz/${course.id}/cast/${index + 1}`)
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 px-6 py-4 text-left transition-colors',
                      canOpen && 'hover:bg-accent/50 cursor-pointer',
                      !canOpen && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0',
                        status === 'completed' && 'bg-green-500 text-white',
                        status === 'available' && 'bg-primary/10 text-primary',
                        status === 'daily_locked' && 'bg-amber-500/15 text-amber-600',
                        status === 'locked' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : status === 'daily_locked' ? (
                        <CalendarClock className="h-4 w-4" />
                      ) : status === 'locked' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{lesson.duration} min</span>
                        <span className="text-muted-foreground/40">|</span>
                        <span>Lekce {index + 1} z {totalLessons}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {status === 'completed' && (
                        <Badge variant="outline" className="text-green-600 border-green-500/30 text-xs">
                          Dokonceno
                        </Badge>
                      )}
                      {status === 'daily_locked' && (
                        <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-xs gap-1">
                          <CalendarClock className="h-3 w-3" />
                          Zitra
                        </Badge>
                      )}
                      {status === 'available' && !progress?.completed && (
                        <Play className="h-4 w-4 text-muted-foreground" />
                      )}
                      {canOpen && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
