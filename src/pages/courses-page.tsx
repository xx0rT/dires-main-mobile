import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Check, Package, ShoppingCart } from 'lucide-react'
import { RiBookOpenLine, RiCheckLine, RiTimeLine, RiShoppingBag3Line } from '@remixicon/react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { useSubscription } from '@/lib/use-subscription'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PackageSection, type PackageCourse } from '@/components/courses/package-section'
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
  const [buyingCourseId, setBuyingCourseId] = useState<string | null>(null)
  const isAuthenticated = !!user

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCourse, setPreviewCourse] = useState<DBCourse | null>(null)
  const [previewLessons, setPreviewLessons] = useState<DBLesson[]>([])

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

  const handlePreview = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (!course) return

    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('id, course_id, title, description, duration, order_index')
      .eq('course_id', courseId)
      .order('order_index')

    setPreviewCourse(course)
    setPreviewLessons(lessons || [])
    setPreviewOpen(true)
  }

  const getPackageCourses = (packageId: string): PackageCourse[] => {
    const pkgCourses = courses.filter(c => c.package_id === packageId)
    return pkgCourses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      lessons_count: course.lessons_count,
      duration: course.duration,
      price: course.price,
      order_index: course.order_index,
      status: getCourseStatus(course, pkgCourses),
    }))
  }

  const totalPacks = courses.length
  const purchasedPacks = purchases.length
  const completedPacks = enrollments.filter(e => e.completed).length
  const totalVideos = courses.reduce((sum, c) => sum + c.lessons_count, 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

  return (
    <div className="relative mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold">Video Balicky</h1>
        <p className="mt-2 text-muted-foreground">
          Kazdy balicek obsahuje sadu videi. Zakupte si balicek jednorazove a ziskejte pristup ke vsem videim uvnitr.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { title: 'Celkem Balicku', value: totalPacks, icon: RiBookOpenLine, color: 'text-blue-600' },
          { title: 'Zakoupenych', value: purchasedPacks, icon: RiShoppingBag3Line, color: 'text-green-600' },
          { title: 'Dokoncenych', value: completedPacks, icon: RiCheckLine, color: 'text-emerald-600' },
          { title: 'Celkem Videi', value: totalVideos, icon: RiTimeLine, color: 'text-orange-600' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="space-y-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <PackageSection
                  id={pkg.id}
                  title={pkg.title}
                  description={pkg.description}
                  icon={pkg.icon}
                  courses={getPackageCourses(pkg.id)}
                  isAuthenticated={isAuthenticated}
                  buyingCourseId={buyingCourseId}
                  onBuy={handleBuy}
                  onPreview={handlePreview}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {packages.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Zadne balicky nejsou k dispozici.</p>
          </CardContent>
        </Card>
      )}

      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
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
  )
}
