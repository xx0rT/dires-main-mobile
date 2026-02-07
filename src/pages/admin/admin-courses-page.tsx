import { useEffect, useState, useCallback } from 'react'
import {
  BookOpen,
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
  profiles: { email: string; full_name: string | null }[] | { email: string; full_name: string | null } | null
}

function getProfile(profiles: Enrollment['profiles']): { email: string; full_name: string | null } | null {
  if (!profiles) return null
  if (Array.isArray(profiles)) return profiles[0] || null
  return profiles
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchCourses = useCallback(async () => {
    const { data } = await supabase
      .from('courses')
      .select('id, title, instructor, category, level, price, published, students_count, lessons_count')
      .order('created_at', { ascending: false })
    setCourses(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const openCourseDetail = async (course: Course) => {
    setSelectedCourse(course)
    setDetailLoading(true)
    const [{ data: enrollData }, { data: profilesData }] = await Promise.all([
      supabase
        .from('course_enrollments')
        .select('id, user_id, course_id, enrolled_at, completed, profiles:user_id(email, full_name)')
        .eq('course_id', course.id)
        .order('enrolled_at', { ascending: false }),
      supabase.from('profiles').select('id, email, full_name'),
    ])
    setEnrollments((enrollData as Enrollment[]) ?? [])
    setAllProfiles(profilesData ?? [])
    setDetailLoading(false)
  }

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

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  const levelLabels: Record<string, string> = {
    beginner: 'Zacatecnik',
    intermediate: 'Pokrocily',
    advanced: 'Expert',
  }

  const unenrolledProfiles = allProfiles.filter(
    (p) => !enrollments.some((e) => e.user_id === p.id)
  )

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Sprava kurzu
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {courses.length} kurzu v systemu
        </p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card
            key={course.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => openCourseDetail(course)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium leading-tight">
                  {course.title}
                </CardTitle>
                <Badge variant={course.published ? 'default' : 'outline'} className="shrink-0">
                  {course.published ? 'Aktivni' : 'Skryty'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {course.instructor && (
                  <p className="text-xs text-neutral-500">Lektor: {course.instructor}</p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {course.level && (
                    <Badge variant="outline" className="text-[10px]">
                      {levelLabels[course.level] || course.level}
                    </Badge>
                  )}
                  {course.category && (
                    <Badge variant="outline" className="text-[10px]">
                      {course.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {course.students_count} studentu
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3" />
                    {course.lessons_count} lekci
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {new Intl.NumberFormat('cs-CZ', {
                      style: 'currency',
                      currency: 'CZK',
                      maximumFractionDigits: 0,
                    }).format(Number(course.price))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
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
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat('cs-CZ', {
                      style: 'currency',
                      currency: 'CZK',
                      maximumFractionDigits: 0,
                    }).format(Number(selectedCourse.price))}
                  </p>
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
                    {enrollments.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-700"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {getProfile(e.profiles)?.full_name || getProfile(e.profiles)?.email || 'Neznamy'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {getProfile(e.profiles)?.email} | Zapsano: {new Date(e.enrolled_at).toLocaleDateString('cs-CZ')}
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
                    ))}
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
