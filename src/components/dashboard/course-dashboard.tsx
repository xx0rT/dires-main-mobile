import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
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
  const otherCourses = courses.filter(c => c.id !== course.id)

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
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, color-mix(in srgb, var(--primary) 5%, var(--background)) 0%, var(--background) 100%)',
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <motion.button
              type="button"
              onClick={() => setSelectedCourseId(null)}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-border/40 bg-background/60 backdrop-blur text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Kurz</p>
              <h2 className="text-base font-bold truncate leading-tight">{course.title}</h2>
            </div>

            {otherCourses.length > 0 && (
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setSelectorOpen(!selectorOpen)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/40 bg-background/60 backdrop-blur text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${selectorOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {selectorOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setSelectorOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-xl bg-popover border border-border shadow-lg overflow-hidden"
                      >
                        <div className="p-1.5">
                          <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Prepnout kurz</p>
                          {otherCourses.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCourseId(c.id)
                                setSelectorOpen(false)
                              }}
                              className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left hover:bg-accent active:bg-accent transition-colors"
                            >
                              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{c.title}</p>
                                {c.category && (
                                  <p className="text-[10px] text-muted-foreground truncate">{c.category}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
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
