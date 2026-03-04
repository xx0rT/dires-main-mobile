import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Clock, BookOpen, Calendar, TrendingUp, Layers, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

interface StudySession {
  courseId: string
  courseTitle: string
  lessonsCompleted: number
  totalLessons: number
  estimatedHours: number
  lastStudied: string | null
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

const WEEKDAYS = ['Po', 'Ut', 'St', 'Ct', 'Pa', 'So', 'Ne']

function WeeklyActivityChart({ activityData }: { activityData: number[] }) {
  const max = Math.max(...activityData, 1)

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tydenni aktivita</p>
      <div className="flex items-end gap-2 h-24">
        {activityData.map((val, i) => {
          const height = Math.max((val / max) * 100, 6)
          const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6)
          return (
            <div key={WEEKDAYS[i]} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                className={`w-full rounded-lg ${isToday ? 'bg-blue-500' : val > 0 ? 'bg-blue-200 dark:bg-blue-800' : 'bg-neutral-100 dark:bg-neutral-800'}`}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.33, 1, 0.68, 1] as const }}
                style={{ minHeight: 6 }}
              />
              <span className={`text-[10px] font-medium ${isToday ? 'text-blue-500 font-bold' : 'text-muted-foreground'}`}>
                {WEEKDAYS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Clock; label: string; value: string | number; color: string }) {
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

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])

  useEffect(() => {
    if (user) loadStudyData()
  }, [user])

  const loadStudyData = async () => {
    if (!user) return

    try {
      const [
        { data: enrollments },
        { data: progressData },
        { data: lessonsData },
      ] = await Promise.all([
        supabase
          .from('course_enrollments')
          .select('course_id, courses!inner(id, title)')
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

      const mapped: StudySession[] = (enrollments || []).map((e: any) => {
        const completed = completedByCourse.get(e.course_id) || 0
        return {
          courseId: e.course_id,
          courseTitle: e.courses?.title || '',
          lessonsCompleted: completed,
          totalLessons: lessonsByCourse.get(e.course_id) || 0,
          estimatedHours: Math.round(completed * 0.75 * 10) / 10,
          lastStudied: lastActivityByCourse.get(e.course_id) || null,
        }
      })

      mapped.sort((a, b) => {
        if (!a.lastStudied && !b.lastStudied) return 0
        if (!a.lastStudied) return 1
        if (!b.lastStudied) return -1
        return b.lastStudied.localeCompare(a.lastStudied)
      })

      setSessions(mapped)

      const weekly = [0, 0, 0, 0, 0, 0, 0]
      const now = new Date()
      for (const p of progressData || []) {
        if (p.completed && p.last_watched_at) {
          const d = new Date(p.last_watched_at)
          const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
          if (diff < 7) {
            const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1
            weekly[dayIndex]++
          }
        }
      }
      setWeeklyData(weekly)
    } catch (error) {
      console.error('Error loading study data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalHours = useMemo(() => sessions.reduce((sum, s) => sum + s.estimatedHours, 0), [sessions])
  const totalLessons = useMemo(() => sessions.reduce((sum, s) => sum + s.lessonsCompleted, 0), [sessions])
  const avgPerCourse = sessions.length > 0 ? Math.round(totalHours / sessions.length * 10) / 10 : 0
  const thisWeekLessons = useMemo(() => weeklyData.reduce((a, b) => a + b, 0), [weeklyData])

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
        <h1 className="text-2xl font-bold">Studijni doba</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Prehled casu straveneho studiem
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Clock} label="Celkem hodin" value={`${totalHours}h`} color="bg-blue-500" />
        </motion.div>
        <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Layers} label="Lekci hotovo" value={totalLessons} color="bg-emerald-500" />
        </motion.div>
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={TrendingUp} label="Prumer/kurz" value={`${avgPerCourse}h`} color="bg-amber-500" />
        </motion.div>
        <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Calendar} label="Tento tyden" value={`${thisWeekLessons} lekci`} color="bg-cyan-500" />
        </motion.div>
      </div>

      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
        <WeeklyActivityChart activityData={weeklyData} />
      </motion.div>

      <div>
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-3"
        >
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Cas podle kurzu</span>
        </motion.div>

        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session, i) => (
              <motion.div
                key={session.courseId}
                custom={i + 3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={`/prehled/moje-kurzy/${session.courseId}`}
                  className="flex items-center gap-4 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-4 transition-all active:scale-[0.98] hover:shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate mb-1">{session.courseTitle}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{session.estimatedHours}h</span>
                      <span>{session.lessonsCompleted}/{session.totalLessons} lekci</span>
                      {session.lastStudied && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.lastStudied).toLocaleDateString('cs-CZ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                </Link>
              </motion.div>
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
            <h3 className="text-base font-semibold mb-1">Zadna data</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
              Zacnete studovat a sledujte svou aktivitu
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
