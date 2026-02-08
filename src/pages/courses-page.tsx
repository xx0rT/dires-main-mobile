import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

const packageImages = [
  'https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/7298867/pexels-photo-7298867.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800',
]

const avatars = [
  'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100',
]

const gradients = [
  'from-blue-100 to-cyan-100',
  'from-green-100 to-emerald-100',
  'from-amber-100 to-orange-100',
  'from-rose-100 to-pink-100',
  'from-teal-100 to-green-100',
  'from-sky-100 to-blue-100',
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
  const [previewPackage, setPreviewPackage] = useState<{ title: string; description: string; price: number } | null>(null)
  const [previewLessons, setPreviewLessons] = useState<DBLesson[]>([])
  const [previewLoading, setPreviewLoading] = useState(false)

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

      const retryInterval = setInterval(() => {
        loadData()
      }, 2000)

      const stopRetrying = setTimeout(() => {
        clearInterval(retryInterval)
      }, 10000)

      return () => {
        clearInterval(retryInterval)
        clearTimeout(stopRetrying)
      }
    }
  }, [searchParams, user, setSearchParams, loadData])

  const isPurchased = (courseId: string) => {
    return purchases.some(p => p.course_id === courseId) || enrollments.some(e => e.course_id === courseId)
  }

  const handleBuy = async (courseId: string) => {
    if (!user || !session) {
      navigate('/auth/sign-up')
      return
    }

    const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !freshSession) {
      toast.error('Prosim prihlaste se znovu')
      navigate('/auth/sign-in')
      return
    }

    setBuyingCourseId(courseId)
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/course-checkout`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${freshSession.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Checkout failed:', { status: response.status, error: data.error })
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

  const handlePreview = async (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId)
    const pkgCourses = courses.filter(c => c.package_id === packageId)
    if (!pkg) return

    const totalPrice = pkgCourses.reduce((sum, c) => sum + c.price, 0)
    setPreviewPackage({ title: pkg.title, description: pkg.description, price: totalPrice })
    setPreviewLoading(true)
    setPreviewOpen(true)

    try {
      const courseIds = pkgCourses.map(c => c.id)
      const { data: lessons } = await supabase
        .from('course_lessons')
        .select('id, course_id, title, description, duration, order_index')
        .in('course_id', courseIds)
        .order('order_index')

      setPreviewLessons(lessons || [])
    } catch {
      setPreviewLessons([])
    } finally {
      setPreviewLoading(false)
    }
  }

  const buildShowcaseCourses = (): ShowcaseCourse[] => {
    return packages.map((pkg, idx) => {
      const pkgCourses = courses.filter(c => c.package_id === pkg.id)
      const totalLessons = pkgCourses.reduce((sum, c) => sum + c.lessons_count, 0)
      const totalDuration = pkgCourses.reduce((sum, c) => sum + c.duration, 0)
      const totalPrice = pkgCourses.reduce((sum, c) => sum + c.price, 0)
      const purchasedCourses = pkgCourses.filter(c => isPurchased(c.id))
      const allPurchased = pkgCourses.length > 0 && pkgCourses.every(c => isPurchased(c.id))
      const somePurchased = purchasedCourses.length > 0 && !allPurchased
      const firstAvailable = pkgCourses.find(c => {
        const purchased = isPurchased(c.id)
        const enrollment = enrollments.find(e => e.course_id === c.id)
        return purchased || !!enrollment
      })

      const firstCourseId = pkgCourses.length > 0 ? pkgCourses[0].id : ''

      return {
        badge: 'Balicek',
        title: pkg.title,
        description: pkg.description,
        author: {
          name: 'Fyzioterapie tym',
          title: somePurchased
            ? `${purchasedCourses.length}/${pkgCourses.length} kurzu odemceno`
            : `${pkgCourses.length} kurzu v balicku`,
          avatar: avatars[idx % avatars.length],
        },
        image: packageImages[idx % packageImages.length],
        lessons: pkgCourses.length,
        videos: totalLessons,
        duration: `${totalDuration} min`,
        audience: ['Fyzioterapeuti', 'Studenti'],
        gradient: gradients[idx % gradients.length],
        price: totalPrice,
        coursesInPackage: pkgCourses.map(c => ({
          id: c.id,
          title: c.title,
          duration: c.duration,
        })),
        isPurchased: allPurchased,
        cta: {
          text: allPurchased ? 'Pokracovat' : somePurchased ? 'Pokracovat' : 'Zobrazit',
          url: firstAvailable ? `/course/${firstAvailable.id}` : firstCourseId ? `/course/${firstCourseId}` : '#courses',
        },
        onPreview: () => handlePreview(pkg.id),
        onBuy: !allPurchased && isAuthenticated
          ? () => {
              const firstUnpurchased = pkgCourses.find(c => !isPurchased(c.id))
              if (firstUnpurchased) handleBuy(firstUnpurchased.id)
            }
          : !allPurchased && !isAuthenticated
            ? () => navigate('/auth/sign-up')
            : undefined,
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
        <div className="relative overflow-hidden rounded-3xl bg-muted/40 px-6 py-16 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
          <CoursesHero />
        </div>

        <div id="courses" className="relative mt-16 overflow-hidden rounded-3xl bg-muted/40 px-6 py-12 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/8 blur-[80px]" />
          <div className="pointer-events-none absolute -top-16 right-1/3 h-48 w-72 rounded-full bg-primary/6 blur-[70px]" />
          <CourseShowcase courses={showcaseCourses} />
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-muted/40 px-6 py-12 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/8 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/6 blur-[70px]" />
          <div className="pointer-events-none absolute right-1/4 top-0 h-40 w-80 rounded-full bg-primary/4 blur-[90px]" />
          <CoursesNews />
        </div>

        <CoursePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          courseTitle={previewPackage?.title || ''}
          courseDescription={previewPackage?.description || ''}
          coursePrice={previewPackage?.price}
          isPurchased={false}
          lessons={previewLessons}
          loading={previewLoading}
          onBuy={undefined}
        />
      </div>
    </div>
  )
}
