import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  CircleDot,
  CheckSquare,
  ToggleLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface QuizOption {
  id: string
  option_text: string
  is_correct: boolean
  order_index: number
}

export interface QuizQuestion {
  id: string
  question_text: string
  question_type: "single_choice" | "multiple_choice" | "true_false"
  explanation: string
  order_index: number
  options: QuizOption[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  lesson_id: string | null
  order_index: number
  questions: QuizQuestion[]
}

interface CourseQuizEditorProps {
  quizzes: Quiz[]
  onChange: (quizzes: Quiz[]) => void
  lessons: { id: string; title: string }[]
}

const questionTypeLabels: Record<string, string> = {
  single_choice: "Jedna spravna",
  multiple_choice: "Vice spravnych",
  true_false: "Pravda / Nepravda",
}

const questionTypeIcons: Record<string, typeof CircleDot> = {
  single_choice: CircleDot,
  multiple_choice: CheckSquare,
  true_false: ToggleLeft,
}

function generateId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function CourseQuizEditor({
  quizzes,
  onChange,
  lessons,
}: CourseQuizEditorProps) {
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const addQuiz = () => {
    const newQuiz: Quiz = {
      id: generateId(),
      title: "",
      description: "",
      lesson_id: null,
      order_index: quizzes.length,
      questions: [],
    }
    onChange([...quizzes, newQuiz])
    setExpandedQuiz(newQuiz.id)
  }

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    onChange(quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeQuiz = (id: string) => {
    onChange(quizzes.filter((q) => q.id !== id))
    if (expandedQuiz === id) setExpandedQuiz(null)
  }

  const addQuestion = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return

    const newQuestion: QuizQuestion = {
      id: generateId(),
      question_text: "",
      question_type: "single_choice",
      explanation: "",
      order_index: quiz.questions.length,
      options: [
        { id: generateId(), option_text: "", is_correct: true, order_index: 0 },
        { id: generateId(), option_text: "", is_correct: false, order_index: 1 },
      ],
    }
    updateQuiz(quizId, { questions: [...quiz.questions, newQuestion] })
    setExpandedQuestion(newQuestion.id)
  }

  const updateQuestion = (
    quizId: string,
    questionId: string,
    updates: Partial<QuizQuestion>
  ) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    updateQuiz(quizId, {
      questions: quiz.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      ),
    })
  }

  const removeQuestion = (quizId: string, questionId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    updateQuiz(quizId, {
      questions: quiz.questions.filter((q) => q.id !== questionId),
    })
  }

  const addOption = (quizId: string, questionId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return

    const newOption: QuizOption = {
      id: generateId(),
      option_text: "",
      is_correct: false,
      order_index: question.options.length,
    }
    updateQuestion(quizId, questionId, {
      options: [...question.options, newOption],
    })
  }

  const updateOption = (
    quizId: string,
    questionId: string,
    optionId: string,
    updates: Partial<QuizOption>
  ) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return

    let newOptions = question.options.map((o) =>
      o.id === optionId ? { ...o, ...updates } : o
    )

    if (
      updates.is_correct &&
      question.question_type === "single_choice"
    ) {
      newOptions = newOptions.map((o) =>
        o.id === optionId ? o : { ...o, is_correct: false }
      )
    }

    updateQuestion(quizId, questionId, { options: newOptions })
  }

  const removeOption = (
    quizId: string,
    questionId: string,
    optionId: string
  ) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return
    updateQuestion(quizId, questionId, {
      options: question.options.filter((o) => o.id !== optionId),
    })
  }

  const handleQuestionTypeChange = (
    quizId: string,
    questionId: string,
    type: QuizQuestion["question_type"]
  ) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return
    const question = quiz.questions.find((q) => q.id === questionId)
    if (!question) return

    let options = question.options
    if (type === "true_false") {
      options = [
        { id: generateId(), option_text: "Pravda", is_correct: true, order_index: 0 },
        { id: generateId(), option_text: "Nepravda", is_correct: false, order_index: 1 },
      ]
    }
    updateQuestion(quizId, questionId, { question_type: type, options })
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const isExpanded = expandedQuiz === quiz.id
        return (
          <Card key={quiz.id}>
            <div
              className="flex cursor-pointer items-center gap-3 p-4"
              onClick={() => setExpandedQuiz(isExpanded ? null : quiz.id)}
            >
              <GripVertical className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {quiz.title || "Novy kviz"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {quiz.questions.length} otazek
                  {quiz.lesson_id && lessons.find((l) => l.id === quiz.lesson_id)
                    ? ` | Lekce: ${lessons.find((l) => l.id === quiz.lesson_id)?.title}`
                    : " | Kviz kurzu"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  removeQuiz(quiz.id)
                }}
              >
                <Trash2 className="size-4" />
              </Button>
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </div>

            {isExpanded && (
              <CardContent className="space-y-4 border-t pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nazev kvizu</Label>
                    <Input
                      value={quiz.title}
                      onChange={(e) =>
                        updateQuiz(quiz.id, { title: e.target.value })
                      }
                      placeholder="Nazev kvizu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prirazena lekce</Label>
                    <Select
                      value={quiz.lesson_id || "course"}
                      onValueChange={(val) =>
                        updateQuiz(quiz.id, {
                          lesson_id: val === "course" ? null : val,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">
                          Kviz kurzu (zadna lekce)
                        </SelectItem>
                        {lessons.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Popis</Label>
                  <Textarea
                    value={quiz.description}
                    onChange={(e) =>
                      updateQuiz(quiz.id, { description: e.target.value })
                    }
                    placeholder="Popis kvizu"
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Otazky</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(quiz.id)}
                    >
                      <Plus className="mr-1 size-3" />
                      Pridat otazku
                    </Button>
                  </div>

                  {quiz.questions.map((question, qIdx) => {
                    const isQExpanded = expandedQuestion === question.id
                    const Icon = questionTypeIcons[question.question_type]
                    return (
                      <div
                        key={question.id}
                        className="rounded-lg border bg-muted/30"
                      >
                        <div
                          className="flex cursor-pointer items-center gap-2 p-3"
                          onClick={() =>
                            setExpandedQuestion(isQExpanded ? null : question.id)
                          }
                        >
                          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                            {qIdx + 1}
                          </span>
                          <Icon className="size-3.5 text-muted-foreground" />
                          <span className="flex-1 truncate text-sm">
                            {question.question_text || "Nova otazka"}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {questionTypeLabels[question.question_type]}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeQuestion(quiz.id, question.id)
                            }}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                          {isQExpanded ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )}
                        </div>

                        {isQExpanded && (
                          <div className="space-y-3 border-t p-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-2 sm:col-span-2">
                                <Label>Text otazky</Label>
                                <Textarea
                                  value={question.question_text}
                                  onChange={(e) =>
                                    updateQuestion(quiz.id, question.id, {
                                      question_text: e.target.value,
                                    })
                                  }
                                  placeholder="Zadejte otazku"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Typ otazky</Label>
                                <Select
                                  value={question.question_type}
                                  onValueChange={(val) =>
                                    handleQuestionTypeChange(
                                      quiz.id,
                                      question.id,
                                      val as QuizQuestion["question_type"]
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="single_choice">
                                      Jedna spravna odpoved
                                    </SelectItem>
                                    <SelectItem value="multiple_choice">
                                      Vice spravnych odpovedi
                                    </SelectItem>
                                    <SelectItem value="true_false">
                                      Pravda / Nepravda
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Vysvetleni (po odpovedi)</Label>
                                <Input
                                  value={question.explanation}
                                  onChange={(e) =>
                                    updateQuestion(quiz.id, question.id, {
                                      explanation: e.target.value,
                                    })
                                  }
                                  placeholder="Vysvetleni spravne odpovedi"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Moznosti odpovedi</Label>
                              {question.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    checked={opt.is_correct}
                                    onCheckedChange={(checked) =>
                                      updateOption(
                                        quiz.id,
                                        question.id,
                                        opt.id,
                                        { is_correct: !!checked }
                                      )
                                    }
                                  />
                                  <Input
                                    value={opt.option_text}
                                    onChange={(e) =>
                                      updateOption(
                                        quiz.id,
                                        question.id,
                                        opt.id,
                                        { option_text: e.target.value }
                                      )
                                    }
                                    placeholder="Text moznosti"
                                    className="flex-1"
                                    disabled={question.question_type === "true_false"}
                                  />
                                  {opt.is_correct && (
                                    <Badge
                                      variant="outline"
                                      className="shrink-0 border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                    >
                                      Spravna
                                    </Badge>
                                  )}
                                  {question.question_type !== "true_false" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-red-500"
                                      onClick={() =>
                                        removeOption(
                                          quiz.id,
                                          question.id,
                                          opt.id
                                        )
                                      }
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              {question.question_type !== "true_false" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-1"
                                  onClick={() =>
                                    addOption(quiz.id, question.id)
                                  }
                                >
                                  <Plus className="mr-1 size-3" />
                                  Pridat moznost
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {quiz.questions.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Zatim zadne otazky. Pridejte prvni otazku.
                    </p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      <Button variant="outline" className="w-full" onClick={addQuiz}>
        <Plus className="mr-2 size-4" />
        Pridat kviz
      </Button>

      {quizzes.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Zatim zadne kvizy. Pridejte prvni kviz pro tento kurz.
        </div>
      )}
    </div>
  )
}
