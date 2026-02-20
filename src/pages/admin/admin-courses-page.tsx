import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface CoursePackage {
  id: string
  title: string
  description: string
  order_index: number
}

interface Course {
  id: string
  title: string
  instructor: string | null
  category: string | null
  level: string | null
  price: number
  published: boolean
  students_count: number
  lessons_count: number
  package_id: string | null
  order_index: number
}

interface Profile {
  id: string
  email: string
  full_name: string | null
}

interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  completed: boolean
}

const levelLabels: Record<string, string> = {
  beginner: 'Zacatecnik',
  intermediate: 'Pokrocily',
  advanced: 'Expert',
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

export default function AdminCoursesPage() {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<CoursePackage[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const [{ data: pkgData }, { data: courseData }] = await Promise.all([
      supabase
        .from('course_packages')
        .select('id, title, description, order_index')
        .order('order_index'),
      supabase
        .from('courses')
        .select('id, title, instructor, category, level, price, published, students_count, lessons_count, package_id, order_index')
        .order('order_index'),
    ])
    setPackages(pkgData ?? [])
    setCourses(courseData ?? [])
    if (pkgData) {
      setExpandedPackages(new Set(pkgData.map(p => p.id)))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course)
    setDetailLoading(true)
    const [{ data: enrollData }, { data: profilesData }] = await Promise.all([
      supabase
        .from('course_enrollments')
        .select('id, user_id, course_id, enrolled_at, completed')
        .eq('course_id', course.id)
        .order('enrolled_at', { ascending: false }),
      supabase.from('profiles').select('id, email, full_name'),
    ])
    setEnrollments((enrollData as Enrollment[]) ?? [])
    setAllProfiles(profilesData ?? [])
    setDetailLoading(false)
  }

  const profileMap = new Map<string, Profile>()
  for (const p of allProfiles) profileMap.set(p.id, p)
  const getProfile = (userId: string): Profile | null => profileMap.get(userId) ?? null

  const enrollUser = async () => {
    if (!selectedCourse || !selectedUserId) return
    const existing = enrollments.find((e) => e.user_id === selectedUserId)
    if (existing) {
      toast.error('Uzivatel je jiz zapsan do tohoto kurzu')
      return
    }

    const { error } = await supabase.from('course_enrollments').insert({
      user_id: selectedUserId,
      course_id: selectedCourse.id,
    })
    if (error) {
      toast.error('Chyba pri zapisu uzivatele')
      return
    }
    toast.success('Uzivatel uspesne zapsan do kurzu')
    setEnrollDialogOpen(false)
    setSelectedUserId('')
    openCourseDetail(selectedCourse)
  }

  const removeEnrollment = async (enrollmentId: string) => {
    const { error } = await supabase.from('course_enrollments').delete().eq('id', enrollmentId)
    if (error) {
      toast.error('Chyba pri odebrani zapisu')
      return
    }
    toast.success('Zapis odebran')
    setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId))
  }

  const toggleCompletion = async (enrollment: Enrollment) => {
    const { error } = await supabase
      .from('course_enrollments')
      .update({
        completed: !enrollment.completed,
        completion_date: !enrollment.completed ? new Date().toISOString() : null,
      })
      .eq('id', enrollment.id)
    if (error) {
      toast.error('Chyba pri aktualizaci')
      return
    }
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === enrollment.id ? { ...e, completed: !e.completed } : e
      )
    )
    toast.success(enrollment.completed ? 'Oznaceno jako nedokoncene' : 'Oznaceno jako dokoncene')
  }

  const togglePublished = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await supabase
      .from('courses')
      .update({ published: !course.published, updated_at: new Date().toISOString() })
      .eq('id', course.id)

    if (error) {
      toast.error('Chyba pri aktualizaci kurzu')
      return
    }

    toast.success(course.published ? 'Kurz skryt' : 'Kurz publikovan')
    setCourses((prev) =>
      prev.map((c) => (c.id === course.id ? { ...c, published: !c.published } : c))
    )
  }

  const deleteCourse = async (course: Course, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Opravdu chcete smazat kurz "${course.title}"?`)) return

    const { error } = await supabase.from('courses').delete().eq('id', course.id)
    if (error) {
      toast.error('Nepodarilo se smazat kurz')
      return
    }
    toast.success('Kurz smazan')
    setCourses((prev) => prev.filter((c) => c.id !== course.id))
  }

  const togglePackage = (pkgId: string) => {
    setExpandedPackages(prev => {
      const next = new Set(prev)
      if (next.has(pkgId)) next.delete(pkgId)
      else next.add(pkgId)
      return next
    })
  }

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  const unenrolledProfiles = allProfiles.filter(
    (p) => !enrollments.some((e) => e.user_id === p.id)
  )

  const totalStudents = courses.reduce((sum, c) => sum + c.students_count, 0)
  const publishedCount = courses.filter(c => c.published).length

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Sprava kurzu
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {packages.length} balicku, {courses.length} kurzu celkem
          </p>
        </div>
        <Button onClick={() => navigate('/admin/courses/new')}>
          <Plus className="mr-2 size-4" />
          Novy kurz
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                <Package className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{packages.length}</p>
                <p className="text-xs text-neutral-500">Balicku</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <BookOpen className="size-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{publishedCount}/{courses.length}</p>
                <p className="text-xs text-neutral-500">Publikovanych kurzu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
                <Users className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalStudents}</p>
                <p className="text-xs text-neutral-500">Studentu celkem</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Hledat kurzy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {packages.map((pkg) => {
          const pkgCourses = filteredCourses.filter(c => c.package_id === pkg.id)
          if (search && pkgCourses.length === 0) return null
          const isExpanded = expandedPackages.has(pkg.id)
          const totalPrice = pkgCourses.reduce((sum, c) => sum + Number(c.price), 0)
          const totalLessons = pkgCourses.reduce((sum, c) => sum + c.lessons_count, 0)

          return (
            <Card key={pkg.id}>
              <CardHeader
                className="cursor-pointer pb-3"
                onClick={() => togglePackage(pkg.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="size-5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="size-5 text-neutral-400" />
                    )}
                    <div>
                      <CardTitle className="text-base">{pkg.title}</CardTitle>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {pkgCourses.length} kurzu | {totalLessons} lekci | {formatCZK(totalPrice)} celkem
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {pkgCourses.filter(c => c.published).length}/{pkgCourses.length} aktivnich
                  </Badge>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {pkgCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => openCourseDetail(course)}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {course.title}
                            </p>
                            {course.level && (
                              <Badge variant="outline" className="text-[10px]">
                                {levelLabels[course.level] || course.level}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                            {course.instructor && <span>{course.instructor}</span>}
                            <span>{course.lessons_count} lekci</span>
                            <span>{course.students_count} studentu</span>
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {formatCZK(Number(course.price))}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/admin/courses/${course.id}`)
                            }}
                          >
                            <Pencil className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1 px-2"
                            onClick={(e) => togglePublished(course, e)}
                          >
                            {course.published ? (
                              <>
                                <Eye className="size-3 text-green-600" />
                                <span className="text-[10px] text-green-600">Aktivni</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="size-3 text-neutral-400" />
                                <span className="text-[10px] text-neutral-400">Skryty</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-red-500 hover:text-red-600"
                            onClick={(e) => deleteCourse(course, e)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pkgCourses.length === 0 && (
                      <p className="py-4 text-center text-sm text-neutral-500">
                        Zadne kurzy v tomto balicku
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}

        {(() => {
          const orphanCourses = filteredCourses.filter(c => !c.package_id)
          if (orphanCourses.length === 0) return null
          return (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-neutral-500">Kurzy bez balicku</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {orphanCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => openCourseDetail(course)}
                      >
                        <p className="text-sm font-medium">{course.title}</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {formatCZK(Number(course.price))} | {course.lessons_count} lekci
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/admin/courses/${course.id}`)
                          }}
                        >
                          <Pencil className="size-3.5 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-red-500 hover:text-red-600"
                          onClick={(e) => deleteCourse(course, e)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })()}
      </div>

      {filteredCourses.length === 0 && (
        <div className="py-12 text-center text-neutral-500">Zadne kurzy nenalezeny</div>
      )}

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="size-5" />
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/courses/${selectedCourse.id}`)}
                >
                  <Pencil className="mr-1 size-4" />
                  Upravit kurz
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500">Studenti</p>
                  <p className="text-lg font-bold">{selectedCourse.students_count}</p>
                </div>
                <div className="rounded-lg border p-3 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500">Lekce</p>
                  <p className="text-lg font-bold">{selectedCourse.lessons_count}</p>
                </div>
                <div className="rounded-lg border p-3 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500">Cena</p>
                  <p className="text-lg font-bold">{formatCZK(Number(selectedCourse.price))}</p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <UserPlus className="size-4" />
                    Zapsani uzivatele ({enrollments.length})
                  </h3>
                  <Button size="sm" onClick={() => setEnrollDialogOpen(true)}>
                    <Plus className="mr-1 size-4" />
                    Zapsat uzivatele
                  </Button>
                </div>

                {detailLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : enrollments.length === 0 ? (
                  <p className="text-sm text-neutral-500">Zadni zapsani uzivatele</p>
                ) : (
                  <div className="space-y-2">
                    {enrollments.map((e) => {
                      const prof = getProfile(e.user_id)
                      return (
                        <div
                          key={e.id}
                          className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-700"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {prof?.full_name || prof?.email || 'Neznamy'}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {prof?.email} | Zapsano: {new Date(e.enrolled_at).toLocaleDateString('cs-CZ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCompletion(e)}
                            >
                              {e.completed ? 'Zrusit dokonceni' : 'Oznacit dokonceno'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-red-500 hover:text-red-600"
                              onClick={() => removeEnrollment(e.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zapsat uzivatele do kurzu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">
              Vyberte uzivatele pro zapis do kurzu "{selectedCourse?.title}"
            </p>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte uzivatele..." />
              </SelectTrigger>
              <SelectContent>
                {unenrolledProfiles.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.full_name || p.email?.split('@')[0]} ({p.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                Zrusit
              </Button>
              <Button onClick={enrollUser} disabled={!selectedUserId}>
                Zapsat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
