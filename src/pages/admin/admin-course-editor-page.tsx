import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { blocksToHtml } from "@/lib/blocks-to-html"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import CourseLessonEditor, {
  type LessonData,
} from "@/components/admin/course-lesson-editor"
import CourseQuizEditor, {
  type Quiz,
  type QuizQuestion,
  type QuizOption,
} from "@/components/admin/course-quiz-editor"

interface CoursePackage {
  id: string
  title: string
}

interface CourseFormData {
  title: string
  description: string
  instructor: string
  thumbnail_url: string
  category: string
  level: string
  duration: number
  price: number
  published: boolean
  package_id: string | null
  order_index: number
}

const defaultForm: CourseFormData = {
  title: "",
  description: "",
  instructor: "",
  thumbnail_url: "",
  category: "general",
  level: "beginner",
  duration: 0,
  price: 0,
  published: false,
  package_id: null,
  order_index: 0,
}

export default function AdminCourseEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = id && id !== "new"

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<CourseFormData>(defaultForm)
  const [lessons, setLessons] = useState<LessonData[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [packages, setPackages] = useState<CoursePackage[]>([])

  const fetchPackages = useCallback(async () => {
    const { data } = await supabase
      .from("course_packages")
      .select("id, title")
      .order("order_index")
    setPackages(data ?? [])
  }, [])

  const fetchCourse = useCallback(async () => {
    if (!isEditing) return
    setLoading(true)
    try {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      if (!course) {
        toast.error("Kurz nenalezen")
        navigate("/admin/courses")
        return
      }

      setFormData({
        title: course.title,
        description: course.description || "",
        instructor: course.instructor || "",
        thumbnail_url: course.thumbnail_url || "",
        category: course.category || "general",
        level: course.level || "beginner",
        duration: course.duration || 0,
        price: Number(course.price) || 0,
        published: course.published ?? false,
        package_id: course.package_id || null,
        order_index: course.order_index || 0,
      })

      const { data: lessonRows } = await supabase
        .from("course_lessons")
        .select("*")
        .eq("course_id", id)
        .order("order_index")

      if (lessonRows) {
        setLessons(
          lessonRows.map((l: any) => ({
            id: l.id,
            title: l.title,
            description: l.description || "",
            video_url: l.video_url || "",
            duration: l.duration || 0,
            order_index: l.order_index || 0,
            content: l.content && typeof l.content === "object"
              ? { html: l.content.html || "", blocks: l.content.blocks || [] }
              : { html: "", blocks: [] },
          }))
        )
      }

      const { data: quizRows } = await supabase
        .from("course_quizzes")
        .select("*")
        .eq("course_id", id)
        .order("order_index")

      if (quizRows && quizRows.length > 0) {
        const quizIds = quizRows.map((q: any) => q.id)
        const { data: questionRows } = await supabase
          .from("course_quiz_questions")
          .select("*")
          .in("quiz_id", quizIds)
          .order("order_index")

        const questionIds = (questionRows || []).map((q: any) => q.id)
        let optionRows: any[] = []
        if (questionIds.length > 0) {
          const { data: opts } = await supabase
            .from("course_quiz_options")
            .select("*")
            .in("question_id", questionIds)
            .order("order_index")
          optionRows = opts || []
        }

        const builtQuizzes: Quiz[] = quizRows.map((q: any) => {
          const questions: QuizQuestion[] = (questionRows || [])
            .filter((qq: any) => qq.quiz_id === q.id)
            .map((qq: any) => ({
              id: qq.id,
              question_text: qq.question_text,
              question_type: qq.question_type,
              explanation: qq.explanation || "",
              order_index: qq.order_index,
              options: optionRows
                .filter((o: any) => o.question_id === qq.id)
                .map((o: any) => ({
                  id: o.id,
                  option_text: o.option_text,
                  is_correct: o.is_correct,
                  order_index: o.order_index,
                })),
            }))
          return {
            id: q.id,
            title: q.title,
            description: q.description || "",
            lesson_id: q.lesson_id || null,
            order_index: q.order_index,
            questions,
          }
        })
        setQuizzes(builtQuizzes)
      }
    } catch (err) {
      console.error("Error fetching course:", err)
      toast.error("Nepodarilo se nacist kurz")
    } finally {
      setLoading(false)
    }
  }, [id, isEditing, navigate])

  useEffect(() => {
    fetchPackages()
    fetchCourse()
  }, [fetchPackages, fetchCourse])

  const handleSave = async (publish?: boolean) => {
    if (!formData.title.trim()) {
      toast.error("Zadejte nazev kurzu")
      return
    }

    setSaving(true)
    try {
      const totalDuration = lessons.reduce((sum, l) => sum + l.duration, 0)
      const courseData = {
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        thumbnail_url: formData.thumbnail_url,
        category: formData.category,
        level: formData.level,
        duration: totalDuration,
        price: formData.price,
        published: publish !== undefined ? publish : formData.published,
        package_id: formData.package_id,
        order_index: formData.order_index,
        lessons_count: lessons.length,
        updated_at: new Date().toISOString(),
      }

      let courseId = id

      if (isEditing) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from("courses")
          .insert([courseData])
          .select()
          .single()
        if (error) throw error
        courseId = data.id
      }

      await saveLessons(courseId!)
      await saveQuizzes(courseId!)

      toast.success(
        isEditing ? "Kurz uspesne aktualizovan" : "Kurz uspesne vytvoren"
      )

      if (!isEditing && courseId) {
        navigate(`/admin/courses/${courseId}`, { replace: true })
      }
    } catch (err: any) {
      console.error("Error saving course:", err)
      toast.error("Nepodarilo se ulozit kurz")
    } finally {
      setSaving(false)
    }
  }

  const saveLessons = async (courseId: string) => {
    if (isEditing) {
      const { data: existingLessons } = await supabase
        .from("course_lessons")
        .select("id")
        .eq("course_id", courseId)

      const existingIds = (existingLessons || []).map((l: any) => l.id)
      const currentIds = lessons
        .filter((l) => !l.id.startsWith("temp-"))
        .map((l) => l.id)
      const toDelete = existingIds.filter(
        (eid: string) => !currentIds.includes(eid)
      )

      if (toDelete.length > 0) {
        await supabase
          .from("course_lessons")
          .delete()
          .in("id", toDelete)
      }
    }

    for (const lesson of lessons) {
      const lessonContent =
        lesson.content.blocks.length > 0
          ? {
              html: blocksToHtml(lesson.content.blocks),
              blocks: lesson.content.blocks,
            }
          : { html: lesson.content.html, blocks: [] }

      const lessonData = {
        course_id: courseId,
        title: lesson.title,
        description: lesson.description,
        video_url: lesson.video_url,
        duration: lesson.duration,
        order_index: lesson.order_index,
        content: lessonContent,
        updated_at: new Date().toISOString(),
      }

      if (lesson.id.startsWith("temp-")) {
        const { data } = await supabase
          .from("course_lessons")
          .insert([lessonData])
          .select()
          .single()
        if (data) lesson.id = data.id
      } else {
        await supabase
          .from("course_lessons")
          .update(lessonData)
          .eq("id", lesson.id)
      }
    }
  }

  const saveQuizzes = async (courseId: string) => {
    if (isEditing) {
      const { data: existingQuizzes } = await supabase
        .from("course_quizzes")
        .select("id")
        .eq("course_id", courseId)

      const existingIds = (existingQuizzes || []).map((q: any) => q.id)
      const currentIds = quizzes
        .filter((q) => !q.id.startsWith("temp-"))
        .map((q) => q.id)
      const toDelete = existingIds.filter(
        (eid: string) => !currentIds.includes(eid)
      )

      if (toDelete.length > 0) {
        await supabase
          .from("course_quizzes")
          .delete()
          .in("id", toDelete)
      }
    }

    for (const quiz of quizzes) {
      const lessonExists =
        quiz.lesson_id && lessons.some((l) => l.id === quiz.lesson_id)

      const quizData = {
        course_id: courseId,
        title: quiz.title,
        description: quiz.description,
        lesson_id: lessonExists ? quiz.lesson_id : null,
        order_index: quiz.order_index,
        updated_at: new Date().toISOString(),
      }

      let quizId = quiz.id
      if (quiz.id.startsWith("temp-")) {
        const { data } = await supabase
          .from("course_quizzes")
          .insert([quizData])
          .select()
          .single()
        if (data) quizId = data.id
      } else {
        await supabase
          .from("course_quizzes")
          .update(quizData)
          .eq("id", quiz.id)
      }

      await saveQuestions(quizId, quiz.questions)
    }
  }

  const saveQuestions = async (
    quizId: string,
    questions: QuizQuestion[]
  ) => {
    const { data: existingQuestions } = await supabase
      .from("course_quiz_questions")
      .select("id")
      .eq("quiz_id", quizId)

    const existingIds = (existingQuestions || []).map((q: any) => q.id)
    const currentIds = questions
      .filter((q) => !q.id.startsWith("temp-"))
      .map((q) => q.id)
    const toDelete = existingIds.filter(
      (eid: string) => !currentIds.includes(eid)
    )

    if (toDelete.length > 0) {
      await supabase
        .from("course_quiz_questions")
        .delete()
        .in("id", toDelete)
    }

    for (const question of questions) {
      const questionData = {
        quiz_id: quizId,
        question_text: question.question_text,
        question_type: question.question_type,
        explanation: question.explanation,
        order_index: question.order_index,
      }

      let questionId = question.id
      if (question.id.startsWith("temp-")) {
        const { data } = await supabase
          .from("course_quiz_questions")
          .insert([questionData])
          .select()
          .single()
        if (data) questionId = data.id
      } else {
        await supabase
          .from("course_quiz_questions")
          .update(questionData)
          .eq("id", question.id)
      }

      await saveOptions(questionId, question.options)
    }
  }

  const saveOptions = async (
    questionId: string,
    options: QuizOption[]
  ) => {
    const { data: existingOptions } = await supabase
      .from("course_quiz_options")
      .select("id")
      .eq("question_id", questionId)

    const existingIds = (existingOptions || []).map((o: any) => o.id)
    const currentIds = options
      .filter((o) => !o.id.startsWith("temp-"))
      .map((o) => o.id)
    const toDelete = existingIds.filter(
      (eid: string) => !currentIds.includes(eid)
    )

    if (toDelete.length > 0) {
      await supabase
        .from("course_quiz_options")
        .delete()
        .in("id", toDelete)
    }

    for (const option of options) {
      const optionData = {
        question_id: questionId,
        option_text: option.option_text,
        is_correct: option.is_correct,
        order_index: option.order_index,
      }

      if (option.id.startsWith("temp-")) {
        await supabase.from("course_quiz_options").insert([optionData])
      } else {
        await supabase
          .from("course_quiz_options")
          .update(optionData)
          .eq("id", option.id)
      }
    }
  }

  const handleDelete = async () => {
    if (!isEditing) return
    if (!confirm("Opravdu chcete smazat tento kurz? Tato akce je nevratna."))
      return

    setSaving(true)
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (error) throw error
      toast.success("Kurz smazan")
      navigate("/admin/courses")
    } catch {
      toast.error("Nepodarilo se smazat kurz")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/courses")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Upravit kurz" : "Novy kurz"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Aktualizujte obsah a nastaveni kurzu"
                : "Vytvorte novy kurz s lekcemi a kvizy"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={saving}
            >
              Smazat kurz
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            <Save className="mr-2 size-4" />
            Ulozit koncept
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            <Eye className="mr-2 size-4" />
            Publikovat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Zakladni informace</CardTitle>
              <CardDescription>Nazev a popis kurzu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nazev kurzu</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Zadejte nazev kurzu"
                  className="text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label>Popis</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Popis kurzu"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lessons">
                Lekce ({lessons.length})
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                Kvizy ({quizzes.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lessons" className="mt-6">
              <CourseLessonEditor
                lessons={lessons}
                onChange={setLessons}
              />
            </TabsContent>
            <TabsContent value="quizzes" className="mt-6">
              <CourseQuizEditor
                quizzes={quizzes}
                onChange={setQuizzes}
                lessons={lessons.map((l) => ({
                  id: l.id,
                  title: l.title || "Bez nazvu",
                }))}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nastaveni</CardTitle>
              <CardDescription>Konfigurace kurzu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Stav</Label>
                <Select
                  value={formData.published ? "published" : "draft"}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      published: val === "published",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Koncept</SelectItem>
                    <SelectItem value="published">Publikovano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Balicek</Label>
                <Select
                  value={formData.package_id || "none"}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      package_id: val === "none" ? null : val,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Bez balicku</SelectItem>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Lektor</Label>
                <Input
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  placeholder="Jmeno lektora"
                />
              </div>

              <div className="space-y-2">
                <Label>Kategorie</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Kategorie kurzu"
                />
              </div>

              <div className="space-y-2">
                <Label>Uroven</Label>
                <Select
                  value={formData.level}
                  onValueChange={(val) =>
                    setFormData({ ...formData, level: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Zacatecnik</SelectItem>
                    <SelectItem value="intermediate">Pokrocily</SelectItem>
                    <SelectItem value="advanced">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cena (CZK)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value) || 0,
                    })
                  }
                  min={0}
                />
              </div>

              <div className="space-y-2">
                <Label>Poradi</Label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: Number(e.target.value) || 0,
                    })
                  }
                  min={0}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nahledovy obrazek</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={formData.thumbnail_url}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail_url: e.target.value })
                }
                placeholder="https://example.com/obrazek.jpg"
              />
              {formData.thumbnail_url && (
                <img
                  src={formData.thumbnail_url}
                  alt="Nahled"
                  className="w-full rounded-lg border object-cover"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
