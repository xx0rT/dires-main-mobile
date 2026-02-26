import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  Clock,
  Layers,
  Play,
  Trophy,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useSelectedCourse, type UserCourse } from '@/lib/selected-course-context'
import { Progress } from '@/components/ui/progress'
import { CoursePath } from './course-path'

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

interface Props {
  course: UserCourse
}

export function CourseDashboard({ course }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { courses, setSelectedCourseId } = useSelectedCourse()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progressMap, setProgressMap] = useState<Map<string, LessonProgress>>(new Map())
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectorOpen, setSelectorOpen] = useState(false)

  useEffect(() => {
    if (user) loadCourseData()
  }, [user, course.id])

  const loadCourseData = async () => {
    if (!user) return
    setLoading(true)

    try {
      const [
        { data: lessonsData },
        { data: enrollmentData },
        { data: progressData },
      ] = await Promise.all([
        supabase
          .from('course_lessons')
          .select('id, title, description, duration, order_index')
          .eq('course_id', course.id)
          .order('order_index'),
        supabase
          .from('course_enrollments')
          .select('completed, enrolled_at')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .maybeSingle(),
        supabase
          .from('user_course_progress')
          .select('lesson_id, completed, completed_at, progress_percent')
          .eq('user_id', user.id)
          .eq('course_id', course.id),
      ])

      setLessons(lessonsData || [])
      setIsCompleted(enrollmentData?.completed || false)

      if (progressData) {
        const map = new Map<string, LessonProgress>()
        for (const p of progressData) {
          map.set(p.lesson_id, p)
        }
        setProgressMap(map)
      }
    } catch (error) {
      console.error('Error loading course data:', error)
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

  const getNextLessonIndex = (): number | null => {
    for (let i = 0; i < lessons.length; i++) {
      const status = getLessonStatus(i)
      if (status === 'available' && !progressMap.get(lessons[i].id)?.completed) return i
    }
    return null
  }

  const pathLessons = lessons.map((lesson, i) => ({
    ...lesson,
    status: getLessonStatus(i),
  }))

  const nextLessonIndex = getNextLessonIndex()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-0 -mx-4 sm:-mx-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative px-4 sm:px-6 pt-1 pb-4"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent dark:from-primary/12" />

        <div className="relative">
          <div className="relative mb-3">
            <button
              type="button"
              onClick={() => setSelectorOpen(!selectorOpen)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-background/60 backdrop-blur border border-border/30 active:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Aktualni kurz</p>
                  <p className="text-sm font-bold truncate">{course.title}</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: selectorOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {selectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-2xl bg-background border border-border/40 shadow-lg overflow-hidden">
                    {courses.filter(c => c.id !== course.id).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCourseId(c.id)
                          setSelectorOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 active:bg-accent transition-colors border-b border-border/20 last:border-b-0"
                      >
                        <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{c.title}</p>
                          {c.category && (
                            <p className="text-[10px] text-muted-foreground">{c.category}</p>
                          )}
                        </div>
                      </button>
                    ))}
                    {courses.filter(c => c.id !== course.id).length === 0 && (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Zadne dalsi kurzy
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourseId(null)
                        setSelectorOpen(false)
                      }}
                      className="w-full p-3 text-xs font-semibold text-primary text-center hover:bg-accent/50 transition-colors border-t border-border/30"
                    >
                      Zpet na prehled
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-1.5 text-[11px]">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    Dokonceno
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground font-medium">
                    <Layers className="w-3.5 h-3.5" />
                    {completedLessons}/{totalLessons} lekci
                  </span>
                )}
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {totalDuration} min
                </div>
              )}
            </div>
            <span className="text-[11px] font-bold tabular-nums">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-1.5 mt-1.5" />
        </div>
      </motion.div>

      {nextLessonIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="px-4 sm:px-6 pb-4"
        >
          <button
            type="button"
            onClick={() => navigate(`/kurz/${course.id}/cast/${nextLessonIndex + 1}`)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-primary/10 border border-primary/20 active:bg-primary/15 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider">Dalsi lekce</p>
              <p className="text-sm font-bold truncate">{lessons[nextLessonIndex]?.title}</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-shrink-0">
              <Clock className="w-3 h-3" />
              {lessons[nextLessonIndex]?.duration} min
            </div>
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="px-4 sm:px-6 pt-2"
      >
        <CoursePath
          courseId={course.id}
          lessons={pathLessons}
          courseTitle={course.title}
        />
      </motion.div>
    </div>
  )
}
