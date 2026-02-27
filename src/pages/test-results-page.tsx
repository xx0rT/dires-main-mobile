import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileText, Trophy, Target, TrendingUp } from 'lucide-react'
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-500'
  }

  const getScoreBadge = (score: number, isCompleted: boolean) => {
    if (isCompleted) return { label: 'Splneno', variant: 'default' as const, className: 'bg-green-600' }
    if (score >= 80) return { label: 'Vyborne', variant: 'default' as const, className: 'bg-green-600' }
    if (score >= 50) return { label: 'Probihajici', variant: 'secondary' as const, className: '' }
    return { label: 'Zacatek', variant: 'outline' as const, className: '' }
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold">Vysledky testu</h1>
        <p className="text-muted-foreground mt-1">
          Prehled vasich vysledku a hodnoceni v kurzech
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Prumerne hodnoceni', value: `${avgScore}%`, icon: Target, sub: 'Ze vsech kurzu' },
          { label: 'Nejlepsi vysledek', value: `${bestScore}%`, icon: Trophy, sub: 'Maximalni skore' },
          { label: 'Splnene kurzy', value: passedCourses, icon: FileText, sub: `z ${results.length} celkem` },
          { label: 'Celkovy pokrok', value: `${avgScore}%`, icon: TrendingUp, sub: 'Prumerny pokrok' },
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
            <CardTitle>Vysledky podle kurzu</CardTitle>
            <CardDescription>Podrobne vysledky a hodnoceni pro kazdy kurz</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => {
                  const badge = getScoreBadge(result.score, result.isCompleted)
                  return (
                    <div key={result.courseId} className="p-4 rounded-lg border hover:bg-accent/30 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{result.courseTitle}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {result.completedLessons} / {result.totalLessons} lekci dokonceno
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-lg font-bold tabular-nums ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </span>
                          <Badge variant={badge.variant} className={badge.className}>
                            {badge.label}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={result.score} className="h-2" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-semibold mb-1">Zadne vysledky</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Zapiste se do kurzu a zacnete studovat
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
