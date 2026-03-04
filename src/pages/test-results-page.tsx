import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { FileText, Trophy, Target, TrendingUp, ChevronRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface CourseResult {
  courseId: string
  courseTitle: string
  totalLessons: number
  completedLessons: number
  score: number
  isCompleted: boolean
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

function ScoreRing({ score, size = 52 }: { score: number; size?: number }) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-neutral-100 dark:text-neutral-800"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] as const, delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold">{score}%</span>
      </div>
    </div>
  )
}

function StatPill({ icon: Icon, label, value, color }: { icon: typeof Trophy; label: string; value: string | number; color: string }) {
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

export default function TestResultsPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<CourseResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadResults()
  }, [user])

  const loadResults = async () => {
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
          .select('course_id, lesson_id, completed')
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
      for (const p of progressData || []) {
        if (p.completed) {
          completedByCourse.set(p.course_id, (completedByCourse.get(p.course_id) || 0) + 1)
        }
      }

      const mapped: CourseResult[] = (enrollments || []).map((e: any) => {
        const total = lessonsByCourse.get(e.course_id) || 0
        const completed = completedByCourse.get(e.course_id) || 0
        const score = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
          courseId: e.course_id,
          courseTitle: e.courses?.title || '',
          totalLessons: total,
          completedLessons: completed,
          score: e.completed ? 100 : score,
          isCompleted: e.completed || score === 100,
        }
      })

      mapped.sort((a, b) => b.score - a.score)
      setResults(mapped)
    } catch (error) {
      console.error('Error loading results:', error)
    } finally {
      setLoading(false)
    }
  }

  const passedCourses = results.filter(r => r.isCompleted).length
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0
  const bestScore = results.length > 0
    ? Math.max(...results.map(r => r.score))
    : 0

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
        <h1 className="text-2xl font-bold">Vysledky testu</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Prehled vasich vysledku a hodnoceni
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Target} label="Prumerne skore" value={`${avgScore}%`} color="bg-blue-500" />
        </motion.div>
        <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={Trophy} label="Nejlepsi" value={`${bestScore}%`} color="bg-amber-500" />
        </motion.div>
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={FileText} label="Splneno" value={passedCourses} color="bg-emerald-500" />
        </motion.div>
        <motion.div custom={1.5} variants={fadeUp} initial="hidden" animate="visible">
          <StatPill icon={TrendingUp} label="Celkem kurzu" value={results.length} color="bg-cyan-500" />
        </motion.div>
      </div>

      <div>
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between mb-3"
        >
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Vysledky podle kurzu</span>
        </motion.div>

        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result, i) => {
              const statusLabel = result.isCompleted ? 'Splneno' : result.score >= 50 ? 'Probihajici' : 'Zacatek'
              const statusColor = result.isCompleted
                ? 'text-emerald-600 bg-emerald-500/10'
                : result.score >= 50
                  ? 'text-amber-600 bg-amber-500/10'
                  : 'text-neutral-500 bg-neutral-500/10'

              return (
                <motion.div
                  key={result.courseId}
                  custom={i + 2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={`/prehled/moje-kurzy/${result.courseId}`}
                    className="flex items-center gap-4 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-4 transition-all active:scale-[0.98] hover:shadow-sm"
                  >
                    <ScoreRing score={result.score} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate">{result.courseTitle}</h3>
                        <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {result.completedLessons} / {result.totalLessons} lekci dokonceno
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold mb-1">Zadne vysledky</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
              Zapiste se do kurzu a zacnete studovat
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
