import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CoursesHero } from '@/components/courses/courses-hero'
import { CourseShowcase, type ShowcaseCourse } from '@/components/courses/course-showcase'
import { CoursesNews } from '@/components/courses/courses-news'
import { CoursePreviewDialog } from '@/components/courses/course-preview-dialog'
import type { CourseStatus } from '@/components/courses/course-card'

interface DBPackage {
  id: string
  title: string
  description: string
  icon: string
  order_index: number
}

interface DBCourse {
  id: string
  title: string
  description: string
  duration: number
  lessons_count: number
  price: number
  package_id: string
  order_index: number
}

interface DBEnrollment {
  course_id: string
  completed: boolean
  completion_date: string | null
}

interface DBPurchase {
  course_id: string
}

interface DBLesson {
  id: string
  course_id: string
  title: string
  description: string
  duration: number
  order_index: number
}

const gradients = [
  'from-blue-100 to-cyan-100',
  'from-green-100 to-emerald-100',
  'from-amber-100 to-orange-100',
  'from-rose-100 to-pink-100',
  'from-teal-100 to-green-100',
]

const avatars = [
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100',
]

export default function CoursesPage() {
  const { user, session } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { subscription, loading: subscriptionLoading, hasActiveSubscription } = useSubscription()
  const [packages, setPackages] = useState<DBPackage[]>([])
  const [courses, setCourses] = useState<DBCourse[]>([])
  const [enrollments, setEnrollments] = useState<DBEnrollment[]>([])
  const [purchases, setPurchases] = useState<DBPurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [, setBuyingCourseId] = useState<string | null>(null)
  const isAuthenticated = !!user

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCourse] = useState<DBCourse | null>(null)
  const [previewLessons] = useState<DBLesson[]>([])

  const loadData = useCallback(async () => {
    try {
      const { data: pkgs } = await supabase
        .from('course_packages')
        .select('*')
        .order('order_index')

      const { data: crs } = await supabase
        .from('courses')
        .select('id, title, description, duration, lessons_count, price, package_id, order_index')
        .eq('published', true)
        .not('package_id', 'is', null)
        .order('order_index')

      if (pkgs) setPackages(pkgs)
      if (crs) setCourses(crs)

      if (user) {
        const { data: enr } = await supabase
          .from('course_enrollments')
          .select('course_id, completed, completion_date')
          .eq('user_id', user.id)

        const { data: purch } = await supabase
          .from('course_purchases')
          .select('course_id')
          .eq('user_id', user.id)

        if (enr) setEnrollments(enr)
        if (purch) setPurchases(purch)
      }
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    const purchasedId = searchParams.get('purchased')
    if (purchasedId && user) {
      toast.success('Kurz byl uspesne zakoupen!')
      setSearchParams({}, { replace: true })
      loadData()
    }
  }, [searchParams, user, setSearchParams, loadData])

  const isPurchased = (courseId: string) => {
    return purchases.some(p => p.course_id === courseId)
  }

  const getCourseStatus = (course: DBCourse, packageCourses: DBCourse[]): CourseStatus => {
    const enrollment = enrollments.find(e => e.course_id === course.id)
    const purchased = isPurchased(course.id)

    if (enrollment?.completed) return 'completed'
    if (purchased || enrollment) return 'purchased'

    const sorted = [...packageCourses].sort((a, b) => a.order_index - b.order_index)
    const courseIdx = sorted.findIndex(c => c.id === course.id)

    if (courseIdx === 0) return 'available'

    const prevCourse = sorted[courseIdx - 1]
    const prevEnrollment = enrollments.find(e => e.course_id === prevCourse.id)

    if (!prevEnrollment?.completed) return 'locked'

    if (prevEnrollment.completion_date) {
      const completionDay = new Date(prevEnrollment.completion_date).toDateString()
      const today = new Date().toDateString()
      if (completionDay === today) return 'locked_daily'
    }

    return 'available'
  }

  const handleBuy = async (courseId: string) => {
    if (!user || !session) {
      navigate('/auth/sign-up')
      return
    }

    setBuyingCourseId(courseId)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Chyba pri vytvareni platby')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Chyba pri vytvareni platby')
    } finally {
      setBuyingCourseId(null)
    }
  }

  const buildShowcaseCourses = (): ShowcaseCourse[] => {
    return packages.map((pkg, idx) => {
      const pkgCourses = courses.filter(c => c.package_id === pkg.id)
      const totalLessons = pkgCourses.reduce((sum, c) => sum + c.lessons_count, 0)
      const totalDuration = pkgCourses.reduce((sum, c) => sum + c.duration, 0)
      const allPurchased = pkgCourses.length > 0 && pkgCourses.every(c => isPurchased(c.id))
      const firstAvailable = pkgCourses.find(c => {
        const status = getCourseStatus(c, pkgCourses)
        return status === 'available' || status === 'purchased'
      })

      return {
        badge: 'Balicek',
        title: pkg.title,
        description: pkg.description,
        author: {
          name: 'Fyzioterapie tým',
          title: `${pkgCourses.length} kurzu v balicku`,
          avatar: avatars[idx % avatars.length],
        },
        image: `https://images.pexels.com/photos/${idx % 2 === 0 ? '4506109' : '5473182'}/pexels-photo-${idx % 2 === 0 ? '4506109' : '5473182'}.jpeg?auto=compress&cs=tinysrgb&w=400`,
        lessons: pkgCourses.length,
        videos: totalLessons,
        duration: `${totalDuration} minut`,
        audience: ['Fyzioterapeuti', 'Studenti'],
        gradient: gradients[idx % gradients.length],
        cta: {
          text: allPurchased
            ? 'Pokracovat'
            : firstAvailable
              ? 'Zobrazit'
              : 'Koupit',
          url: firstAvailable ? `/course/${firstAvailable.id}` : '#courses',
        },
      }
    })
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user && !hasActiveSubscription) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="space-y-4 pb-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="mb-3 text-3xl">Premium pristup vyzadovan</CardTitle>
                <CardDescription className="text-base">
                  Pro pristup ke kurzum potrebujete aktivni predplatne
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-semibold">
                  <Check className="h-5 w-5 text-primary" />
                  Co ziskate s premium pristupem:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    'Moznost nakupu jednotlivych kurzu',
                    'AI asistent pro dotazy k obsahu kurzu',
                    'Certifikaty po dokonceni jednotlivych kurzu',
                    'Doplnkove studijni materialy ke stazeni',
                    'Aktualizace obsahu zdarma',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {subscription && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Aktualni stav:</strong>{' '}
                    {subscription.status === 'cancelled' && 'Vase predplatne bylo zruseno'}
                    {subscription.status === 'expired' && 'Vase predplatne vyprselo'}
                    {subscription.status === 'trialing' && 'Zkusebni obdobi'}
                    {subscription.status === 'active' && 'Aktivni'}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={() => navigate('/#pricing')} className="flex-1" size="lg">
                  Zobrazit cenove plany
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  Zpet na dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const showcaseCourses = buildShowcaseCourses()

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-muted/40 px-6 py-16 sm:px-10 lg:px-16">
          <CoursesHero />
        </div>

        <div id="courses" className="mt-16 rounded-3xl bg-muted/40 px-6 py-12 sm:px-10 lg:px-16">
          <CourseShowcase courses={showcaseCourses} />
        </div>

        <div className="mt-16 rounded-3xl bg-muted/40 px-6 py-12 sm:px-10 lg:px-16">
          <CoursesNews />
        </div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="px-6 py-10 text-center">
                <h3 className="mb-2 text-2xl font-bold">Pripraveni zacit?</h3>
                <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                  Vytvorte si ucet a ziskejte pristup ke kurzum
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button asChild size="lg">
                    <Link to="/auth/sign-up">Zacit nyni</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/auth/sign-in">Jiz mam ucet</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <CoursePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          courseTitle={previewCourse?.title || ''}
          courseDescription={previewCourse?.description || ''}
          coursePrice={previewCourse?.price}
          isPurchased={previewCourse ? isPurchased(previewCourse.id) : false}
          lessons={previewLessons}
          onBuy={
            previewCourse && isAuthenticated && !isPurchased(previewCourse.id)
              ? () => {
                  setPreviewOpen(false)
                  handleBuy(previewCourse.id)
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}
