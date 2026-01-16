import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { RiBookOpenLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiTimeLine, RiVideoLine, RiSparklingLine, RiRefreshLine } from '@remixicon/react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'

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
  completed_at: string | null
}

export default function CoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [previewModules, setPreviewModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])
  const [aiTips, setAiTips] = useState<string[]>([])
  const [loadingTips, setLoadingTips] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  useEffect(() => {
    loadCoursesData()
  }, [user])

  useEffect(() => {
    if (user && enrollments.length > 0) {
      fetchAiTips()
    }
  }, [user, enrollments.length])

  useEffect(() => {
    const checkNewlyUnlocked = () => {
      const unlockedCourses = courses
        .filter((_, index) => isCourseUnlocked(index))
        .map(c => c.id)

      const previouslyLocked = courses.filter(c => !newlyUnlocked.includes(c.id)).map(c => c.id)
      const justUnlocked = unlockedCourses.filter(id => previouslyLocked.includes(id) && !newlyUnlocked.includes(id))

      if (justUnlocked.length > 0) {
        setNewlyUnlocked(prev => [...prev, ...justUnlocked])
        justUnlocked.forEach(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7033ff', '#4f46e5', '#6366f1']
          })
        })
      }
    }

    if (courses.length > 0 && enrollments.length > 0) {
      checkNewlyUnlocked()
    }
  }, [enrollments, courses])

  const loadCoursesData = async () => {
    try {
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('order_index', { ascending: true })

      if (coursesData) {
        setCourses(coursesData)

        for (const course of coursesData) {
          const { data: modules } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index', { ascending: true })

          if (modules) {
            setCourseModules(prev => ({ ...prev, [course.id]: modules }))
          }
        }
      }

      if (user) {
        const { data: enrollmentsData } = await supabase
          .from('user_course_enrollments')
          .select('*')
          .eq('user_id', user.id)

        if (enrollmentsData) {
          setEnrollments(enrollmentsData as Enrollment[])
        }
      }
    } catch (error) {
      console.error('Error loading courses data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAiTips = async () => {
    if (!user) return

    setLoadingTips(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        setLoadingTips(false)
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/learning-tips`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setAiTips(data.tips || [])
      } else if (response.status === 401) {
        console.log('Authentication required for AI tips')
      }
    } catch (error) {
      console.error('Error fetching AI tips:', error)
    } finally {
      setLoadingTips(false)
    }
  }

  const isCourseUnlocked = (courseIndex: number) => {
    if (courseIndex === 0) return true
    if (!user) return false

    const previousCourse = courses[courseIndex - 1]
    if (!previousCourse) return false

    const enrollment = enrollments.find(e => e.course_id === previousCourse.id)
    return enrollment?.completed_at != null
  }

  const isCourseEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId)
  }

  const getCourseProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment?.progress_percentage || 0
  }

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      navigate('/auth/sign-up')
      return
    }

    try {
      const { error } = await supabase
        .from('user_course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0
        })

      if (!error) {
        const courseIndex = courses.findIndex(c => c.id === courseId)
        if (courseIndex > 0) {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#7033ff', '#4f46e5', '#6366f1', '#a855f7'],
            ticks: 300
          })
        }
        loadCoursesData()
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  const handlePreview = async (course: Course) => {
    const modules = courseModules[course.id] || []
    setPreviewModules(modules)
    setSelectedCourse(course)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 space-y-12" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold md:text-5xl">
          Roadmapa <span className="bg-gradient-to-r from-[#7033ff] to-primary bg-clip-text text-transparent">Kurzů</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Absolvujte kurzy v pořadí a odemkněte pokročilé techniky. Každý kurz musí být dokončen před přechodem k dalšímu.
        </p>
      </motion.div>

      {user && aiTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <RiSparklingLine className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Asistent pro Učení</CardTitle>
                    <CardDescription>Personalizované tipy na základě vašeho pokroku</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchAiTips}
                  disabled={loadingTips}
                >
                  <RiRefreshLine className={`h-4 w-4 ${loadingTips ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiTips.map((tip, index) => {
                  const [emoji, ...textParts] = tip.split(' ')
                  const text = textParts.join(' ')
                  const [title, ...descParts] = text.split(':')
                  const description = descParts.join(':')

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
                    >
                      <span className="text-2xl flex-shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{title}</span>
                          {description && <span className="text-muted-foreground">:{description}</span>}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="relative max-w-4xl mx-auto">
        <svg className="absolute left-8 top-0 w-1 h-full hidden md:block" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7033ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7033ff" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="url(#lineGradient)"
            strokeWidth="2"
          />
        </svg>

        {courses.map((course, index) => {
          const isUnlocked = isCourseUnlocked(index)
          const previousCourse = index > 0 ? courses[index - 1] : null
          const previousProgress = previousCourse ? getCourseProgress(previousCourse.id) : 100
          const isEnrolled = isCourseEnrolled(course.id)
          const progress = getCourseProgress(course.id)
          const modules = courseModules[course.id] || []
          const totalDuration = modules.reduce((sum, m) => sum + m.duration_minutes, 0)

          return (
            <div key={course.id} className="relative">
              {index > 0 && (
                <svg className="absolute left-8 -top-12 w-1 h-12 hidden md:block" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id={`progressGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={previousProgress === 100 ? "1" : "0.3"} />
                      <stop offset="100%" stopColor="#7033ff" stopOpacity={previousProgress === 100 ? "1" : "0.3"} />
                    </linearGradient>
                  </defs>
                  <motion.line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke={`url(#progressGradient${index})`}
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isInView ? previousProgress / 100 : 0 }}
                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeInOut" }}
                  />
                </svg>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative mb-12"
              >
                <motion.div
                  className="absolute left-0 top-8 w-16 h-16 rounded-full bg-background flex items-center justify-center z-20 hidden md:flex shadow-lg"
                  style={{
                    border: `4px solid ${!isUnlocked ? '#6b7280' : progress === 100 ? '#10b981' : '#7033ff'}`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring" }}
                >
                  {!isUnlocked ? (
                    <RiLockLine className="h-6 w-6 text-muted-foreground" />
                  ) : progress === 100 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <RiCheckLine className="h-6 w-6 text-green-600" />
                    </motion.div>
                  ) : (
                    <RiBookOpenLine className="h-6 w-6 text-primary" />
                  )}
                </motion.div>

                <Card className={`md:ml-24 ${!isUnlocked ? 'opacity-60 grayscale' : ''} hover:shadow-xl transition-all duration-300 border-2 ${progress === 100 ? 'border-green-500/30' : isEnrolled ? 'border-primary/30' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-2xl">{course.title}</CardTitle>
                          {!isUnlocked && (
                            <Badge variant="secondary">
                              <RiLockLine className="h-3 w-3 mr-1" />
                              Zamčeno
                            </Badge>
                          )}
                          {isEnrolled && progress === 100 && (
                            <Badge variant="default" className="bg-green-600">
                              <RiCheckLine className="h-3 w-3 mr-1" />
                              Dokončeno
                            </Badge>
                          )}
                          {isEnrolled && progress > 0 && progress < 100 && (
                            <Badge variant="default">
                              V průběhu
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <RiVideoLine className="h-4 w-4" />
                        <span>{modules.length} videí</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiTimeLine className="h-4 w-4" />
                        <span>{totalDuration} minut</span>
                      </div>
                    </div>

                    {isEnrolled && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Váš pokrok</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" onClick={() => handlePreview(course)}>
                                <RiPlayCircleLine className="mr-2 h-4 w-4" />
                                Náhled Obsahu
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{selectedCourse?.title}</DialogTitle>
                                <DialogDescription>
                                  Prozkoumejte obsah kurzu před zápisem
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Co se naučíte:</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedCourse?.description}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Obsah kurzu ({previewModules.length} videí):</h4>
                                  <div className="space-y-2">
                                    {previewModules.map((module, idx) => (
                                      <div
                                        key={module.id}
                                        className="flex items-start gap-3 p-3 rounded-lg border"
                                      >
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                          <span className="text-sm font-semibold">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{module.title}</p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {module.description}
                                          </p>
                                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <RiTimeLine className="h-3 w-3" />
                                            <span>{module.duration_minutes} minut</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {user ? (
                            isEnrolled ? (
                              <Button asChild>
                                <Link to={`/course/${course.id}`}>
                                  {progress === 100 ? 'Prohlédnout' : 'Pokračovat'}
                                </Link>
                              </Button>
                            ) : (
                              <Button onClick={() => handleEnroll(course.id)}>
                                Zapsat se
                              </Button>
                            )
                          ) : (
                            <Button asChild>
                              <Link to="/auth/sign-up">
                                Přihlásit se k zápisu
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button disabled>
                          <RiLockLine className="mr-2 h-4 w-4" />
                          Dokončete předchozí kurz
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )
        })}
      </div>

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center py-12 px-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h3 className="text-2xl font-bold mb-4">Připraveni začít?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Vytvořte si účet a získejte přístup ke všem kurzům s postupným odemykáním
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/auth/sign-up">
                Začít nyní
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth/sign-in">
                Již mám účet
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
