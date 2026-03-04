import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { BookOpen, CheckCircle2, Clock, TrendingUp, Layers, Flame, Target, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

function CircularProgress({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-100 dark:text-neutral-800"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {value}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Celkove</span>
      </div>
    </div>
  )
}

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Flame; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 px-4 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-4.5 w-4.5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-tight">{value}</p>
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  )
}

function CourseProgressCard({ course, index }: { course: CourseProgress; index: number }) {
  const progressColor = course.isCompleted
    ? 'bg-emerald-500'
    : course.progress > 60
      ? 'bg-blue-500'
      : course.progress > 30
        ? 'bg-amber-500'
        : 'bg-neutral-400'

  return (
    <motion.div
      custom={index + 3}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
    >
      <Link
        to={`/prehled/moje-kurzy/${course.courseId}`}
        className="flex items-center gap-4 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-4 transition-all active:scale-[0.98] hover:shadow-sm"
      >
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-xl ${course.isCompleted ? 'bg-emerald-500/10' : 'bg-blue-500/10'} flex items-center justify-center`}>
            {course.isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <BookOpen className="h-6 w-6 text-blue-500" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold truncate">{course.courseTitle}</h3>
            {course.isCompleted && (
              <span className="shrink-0 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Hotovo
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-muted-foreground">
              {course.completedLessons}/{course.totalLessons} lekci
            </span>
            {course.lastActivity && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(course.lastActivity).toLocaleDateString('cs-CZ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${progressColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums w-8 text-right">{course.progress}%</span>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
      </Link>
    </motion.div>
  )
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

  const streakDays = useMemo(() => {
    return Math.min(totalLessonsCompleted, 7)
  }, [totalLessonsCompleted])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl font-bold">Statistiky</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Sledujte svuj pokrok a ucebni aktivitu
        </p>
      </motion.div>

      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Celkovy pokrok</p>
            <p className="text-sm text-muted-foreground">
              {completedCourses} z {courses.length} kurzu dokonceno
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-semibold">{streakDays} dni v rade</span>
            </div>
          </div>
          <CircularProgress value={overallProgress} />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Target} label="Probihajici" value={inProgressCourses} color="bg-blue-500" />
        </motion.div>
        <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={CheckCircle2} label="Dokoncene" value={completedCourses} color="bg-emerald-500" />
        </motion.div>
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Layers} label="Lekci hotovo" value={totalLessonsCompleted} color="bg-amber-500" />
        </motion.div>
        <motion.div custom={2.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={TrendingUp} label="Hodin studia" value={`~${totalHours}h`} color="bg-cyan-500" />
        </motion.div>
      </div>

      <div>
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-3"
        >
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Pokrok v kurzech</span>
          <span className="text-xs text-muted-foreground">{courses.length} kurzu</span>
        </motion.div>

        {courses.length > 0 ? (
          <div className="space-y-3">
            {courses.map((course, i) => (
              <CourseProgressCard key={course.courseId} course={course} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold mb-1">Zadny pokrok</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
              Zacnete studovat kurzy a sledujte svuj pokrok zde
            </p>
            <Button asChild className="rounded-full px-6">
              <Link to="/prehled/moje-kurzy">Prohlidnout kurzy</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
