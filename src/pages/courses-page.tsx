import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RiBookOpenLine, RiLockLine, RiCheckLine, RiPlayCircleLine, RiTimeLine, RiVideoLine, RiShieldCheckLine } from '@remixicon/react'
import { mockCourses, mockModules, mockDatabase } from '@/lib/mock-data'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { PhysioChatbot } from '@/components/chatbot/physio-chatbot'

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
  const { subscription, loading: subscriptionLoading, hasActiveSubscription } = useSubscription()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courseModules, setCourseModules] = useState<Record<string, CourseModule[]>>({})
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [previewModules, setPreviewModules] = useState<CourseModule[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasShownConfettiRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const storedConfettiCourses = localStorage.getItem('confetti-shown-courses')
    if (storedConfettiCourses) {
      try {
        const parsed = JSON.parse(storedConfettiCourses)
        hasShownConfettiRef.current = new Set(parsed)
      } catch (e) {
        console.error('Error parsing confetti storage:', e)
      }
    }
  }, [])

  useEffect(() => {
    loadCoursesData()
  }, [user])

  useEffect(() => {
    const checkNewlyUnlocked = () => {
      const unlockedCourses = courses
        .filter((_, index) => isCourseUnlocked(index))
        .map(c => c.id)

      const justUnlocked = unlockedCourses.filter(id => !hasShownConfettiRef.current.has(id))

      if (justUnlocked.length > 0) {
        justUnlocked.forEach((courseId) => {
          hasShownConfettiRef.current.add(courseId)
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#7033ff', '#4f46e5', '#6366f1']
          })
        })

        localStorage.setItem('confetti-shown-courses', JSON.stringify(Array.from(hasShownConfettiRef.current)))
      }
    }

    if (courses.length > 0 && user) {
      checkNewlyUnlocked()
    }
  }, [enrollments, courses, user])

  const loadCoursesData = async () => {
    try {
      const coursesData = mockCourses.filter(c => c.is_published)

      if (coursesData) {
        setCourses(coursesData)

        for (const course of coursesData) {
          const modules = mockModules.filter(m => m.course_id === course.id)
            .sort((a, b) => a.order_index - b.order_index)

          if (modules) {
            setCourseModules(prev => ({ ...prev, [course.id]: modules }))
          }
        }
      }

      if (user) {
        const enrollmentsData = mockDatabase.getEnrollments(user.id)

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
      mockDatabase.addEnrollment({
        user_id: user.id,
        course_id: courseId,
        progress_percentage: 0,
        completed_at: null
      })

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
    } catch (error) {
      console.error('Error enrolling in course:', error)
    }
  }

  const handlePreview = async (course: Course) => {
    const modules = courseModules[course.id] || []
    setPreviewModules(modules)
    setSelectedCourse(course)
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (user && !hasActiveSubscription) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <RiShieldCheckLine className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-3">
                  Premium přístup vyžadován
                </CardTitle>
                <CardDescription className="text-base">
                  Pro přístup ke kurzům potřebujete aktivní předplatné
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <RiCheckLine className="h-5 w-5 text-primary" />
                  Co získáte s premium přístupem:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <RiCheckLine className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Neomezený přístup ke všem kurzům</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RiCheckLine className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI asistent pro dotazy k obsahu kurzů</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RiCheckLine className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Certifikáty po dokončení jednotlivých kurzů</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RiCheckLine className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Doplňkové studijní materiály ke stažení</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <RiCheckLine className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Aktualizace obsahu zdarma</span>
                  </li>
                </ul>
              </div>

              {subscription && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Aktuální stav:</strong>{' '}
                    {subscription.status === 'cancelled' && 'Vaše předplatné bylo zrušeno'}
                    {subscription.status === 'inactive' && 'Vaše předplatné není aktivní'}
                    {subscription.status === 'expired' && 'Vaše předplatné vypršelo'}
                    {!['cancelled', 'inactive', 'expired'].includes(subscription.status) &&
                      `Status: ${subscription.status}`}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => navigate('/#pricing')}
                  className="flex-1"
                  size="lg"
                >
                  Zobrazit cenové plány
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Zpět na dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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

      {user && <PhysioChatbot />}

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
          const isEnrolled = isCourseEnrolled(course.id)
          const progress = getCourseProgress(course.id)
          const modules = courseModules[course.id] || []
          const totalDuration = modules.reduce((sum, m) => sum + m.duration_minutes, 0)

          return (
            <div key={course.id} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative mb-12"
              >
                <motion.div
                  className="absolute left-0 top-8 w-16 h-16 rounded-full flex items-center justify-center z-20 hidden md:flex shadow-lg"
                  style={{
                    background: !isUnlocked
                      ? '#6b7280'
                      : progress === 100
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #7033ff 0%, #a855f7 100%)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring" }}
                >
                  {!isUnlocked ? (
                    <RiLockLine className="h-6 w-6 text-white" />
                  ) : progress === 100 ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <RiCheckLine className="h-7 w-7 text-white font-bold" />
                    </motion.div>
                  ) : (
                    <RiBookOpenLine className="h-6 w-6 text-white" />
                  )}
                </motion.div>

                <Card className={`md:ml-24 ${!isUnlocked ? 'opacity-60 grayscale' : ''} group relative overflow-hidden transition-all duration-300 ${progress === 100 ? 'border-2 border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : isEnrolled ? 'border-2 border-primary/50 bg-primary/5' : 'border-2 border-border'} hover:shadow-xl hover:scale-[1.01]`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardHeader className="relative z-10 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                          {!isUnlocked && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <RiLockLine className="h-3 w-3" />
                              Zamčeno
                            </Badge>
                          )}
                          {isEnrolled && progress === 100 && (
                            <Badge className="bg-green-600 hover:bg-green-700 gap-1 text-xs">
                              <RiCheckLine className="h-3 w-3" />
                              Dokončeno
                            </Badge>
                          )}
                          {isEnrolled && progress > 0 && progress < 100 && (
                            <Badge className="gap-1 text-xs">
                              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                              V průběhu
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm leading-relaxed">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 relative z-10 pt-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <RiVideoLine className="h-3.5 w-3.5" />
                        <span>{modules.length} videí</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RiTimeLine className="h-3.5 w-3.5" />
                        <span>{totalDuration} minut</span>
                      </div>
                    </div>

                    {isEnrolled && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Váš pokrok</span>
                          <span className="font-bold text-primary">{Math.round(progress)}%</span>
                        </div>
                        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {isUnlocked ? (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" onClick={() => handlePreview(course)} className="group/btn">
                                <RiPlayCircleLine className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                                Náhled Obsahu
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden">
                              <DialogHeader className="border-b pb-4">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                                    <RiBookOpenLine className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <DialogTitle className="text-2xl mb-2">{selectedCourse?.title}</DialogTitle>
                                    <DialogDescription className="text-base">
                                      Prozkoumejte detailní obsah kurzu před zápisem
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <div className="overflow-y-auto max-h-[calc(85vh-180px)] pr-2 space-y-6 mt-4">
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-3"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    <h4 className="font-semibold text-lg">Co se naučíte</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/20">
                                    {selectedCourse?.description}
                                  </p>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 }}
                                  className="space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="h-1 w-1 rounded-full bg-primary" />
                                      <h4 className="font-semibold text-lg">Obsah kurzu</h4>
                                    </div>
                                    <Badge variant="outline" className="gap-1">
                                      <RiVideoLine className="h-3 w-3" />
                                      {previewModules.length} videí
                                    </Badge>
                                  </div>

                                  <div className="space-y-3">
                                    {previewModules.map((module, idx) => (
                                      <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                                        className="group/module flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 hover:shadow-md"
                                      >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover/module:scale-110 transition-transform">
                                          <span className="text-sm font-bold text-primary">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold mb-1 group-hover/module:text-primary transition-colors">
                                            {module.title}
                                          </p>
                                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                            {module.description}
                                          </p>
                                          <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                              <RiTimeLine className="h-3.5 w-3.5" />
                                              <span>{module.duration_minutes} min</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                              <RiPlayCircleLine className="h-3.5 w-3.5" />
                                              <span>Video lekce</span>
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                  className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20"
                                >
                                  <div className="flex items-start gap-3">
                                    <RiCheckLine className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Zahrnuje přístup k:</p>
                                      <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                        <li>Video lekce na vyžádání</li>
                                        <li>Doplňkové studijní materiály</li>
                                        <li>AI asistent pro dotazy</li>
                                        <li>Certifikát po dokončení</li>
                                      </ul>
                                    </div>
                                  </div>
                                </motion.div>
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
