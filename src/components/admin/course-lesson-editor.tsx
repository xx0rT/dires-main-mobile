import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Film,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogEditor from "@/components/admin/blog-editor"
import DraggableContentBlocks, {
  type ContentBlock,
} from "@/components/admin/draggable-content-blocks"

export interface LessonData {
  id: string
  title: string
  description: string
  video_url: string
  duration: number
  order_index: number
  content: {
    html: string
    blocks: ContentBlock[]
  }
}

interface CourseLessonEditorProps {
  lessons: LessonData[]
  onChange: (lessons: LessonData[]) => void
}

function generateId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function CourseLessonEditor({
  lessons,
  onChange,
}: CourseLessonEditorProps) {
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  const addLesson = () => {
    const newLesson: LessonData = {
      id: generateId(),
      title: "",
      description: "",
      video_url: "",
      duration: 0,
      order_index: lessons.length,
      content: { html: "", blocks: [] },
    }
    onChange([...lessons, newLesson])
    setExpandedLesson(newLesson.id)
  }

  const updateLesson = (id: string, updates: Partial<LessonData>) => {
    onChange(lessons.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const removeLesson = (id: string) => {
    onChange(lessons.filter((l) => l.id !== id))
    if (expandedLesson === id) setExpandedLesson(null)
  }

  const moveLesson = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= lessons.length) return
    const newLessons = [...lessons]
    const temp = newLessons[idx]
    newLessons[idx] = newLessons[newIdx]
    newLessons[newIdx] = temp
    newLessons.forEach((l, i) => {
      l.order_index = i
    })
    onChange(newLessons)
  }

  return (
    <div className="space-y-3">
      {lessons.map((lesson, idx) => {
        const isExpanded = expandedLesson === lesson.id
        return (
          <Card key={lesson.id}>
            <div
              className="flex cursor-pointer items-center gap-3 p-4"
              onClick={() =>
                setExpandedLesson(isExpanded ? null : lesson.id)
              }
            >
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLesson(idx, "up")
                  }}
                >
                  <ChevronUp className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5"
                  disabled={idx === lessons.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLesson(idx, "down")
                  }}
                >
                  <ChevronDown className="size-3" />
                </Button>
              </div>
              <GripVertical className="size-4 text-muted-foreground" />
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {lesson.title || "Nova lekce"}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {lesson.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {lesson.duration} min
                    </span>
                  )}
                  {lesson.video_url && (
                    <span className="flex items-center gap-1">
                      <Film className="size-3" />
                      Video
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  removeLesson(lesson.id)
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nazev lekce</Label>
                    <Input
                      value={lesson.title}
                      onChange={(e) =>
                        updateLesson(lesson.id, { title: e.target.value })
                      }
                      placeholder="Nazev lekce"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Popis</Label>
                    <Textarea
                      value={lesson.description}
                      onChange={(e) =>
                        updateLesson(lesson.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Kratky popis lekce"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL videa</Label>
                    <Input
                      value={lesson.video_url}
                      onChange={(e) =>
                        updateLesson(lesson.id, {
                          video_url: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delka (minuty)</Label>
                    <Input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) =>
                        updateLesson(lesson.id, {
                          duration: Number(e.target.value) || 0,
                        })
                      }
                      min={0}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Obsah lekce
                  </Label>
                  <Tabs defaultValue="wysiwyg" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="wysiwyg">
                        Vizualni editor
                      </TabsTrigger>
                      <TabsTrigger value="blocks">Bloky obsahu</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wysiwyg" className="mt-4">
                      <BlogEditor
                        content={lesson.content.html}
                        onChange={(html) =>
                          updateLesson(lesson.id, {
                            content: { ...lesson.content, html },
                          })
                        }
                      />
                    </TabsContent>
                    <TabsContent value="blocks" className="mt-4">
                      <DraggableContentBlocks
                        blocks={lesson.content.blocks}
                        onChange={(blocks) =>
                          updateLesson(lesson.id, {
                            content: { ...lesson.content, blocks },
                          })
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      <Button variant="outline" className="w-full" onClick={addLesson}>
        <Plus className="mr-2 size-4" />
        Pridat lekci
      </Button>

      {lessons.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Zatim zadne lekce. Pridejte prvni lekci pro tento kurz.
        </div>
      )}
    </div>
  )
}
