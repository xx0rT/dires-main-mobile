import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiBookOpenLine, RiPlayCircleLine, RiTimeLine, RiVideoLine } from '@remixicon/react'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getMockCourses, getMockModulesByCourseId } from '@/data/mock-data'

export default function CoursesPage() {
  const courses = getMockCourses()
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null)
  const [previewModules, setPreviewModules] = useState<ReturnType<typeof getMockModulesByCourseId>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  const handlePreview = (course: typeof courses[0]) => {
    setSelectedCourse(course)
    const modules = getMockModulesByCourseId(course.id)
    setPreviewModules(modules)
  }

  const totalModules = (courseId: string) => {
    return getMockModulesByCourseId(courseId).length
  }

  const totalDuration = (courseId: string) => {
    const modules = getMockModulesByCourseId(courseId)
    return modules.reduce((acc, module) => acc + module.duration_minutes, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Naše Kurzy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Objevte naši sbírku odborných kurzů zaměřených na manuální terapii a rehabilitaci
          </p>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const modules = totalModules(course.id)
            const duration = totalDuration(course.id)

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.image_url}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {course.price.toLocaleString('cs-CZ')} Kč
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiVideoLine className="h-4 w-4" />
                        <span>{modules} videí</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiTimeLine className="h-4 w-4" />
                        <span>{Math.ceil(duration / 60)} hodin obsahu</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Link to={`/course/${course.id}`}>
                        <Button className="w-full">
                          <RiPlayCircleLine className="h-4 w-4 mr-2" />
                          Začít kurz
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handlePreview(course)}
                      >
                        <RiBookOpenLine className="h-4 w-4 mr-2" />
                        Náhled obsahu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCourse(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCourse(null)}>
                    ✕
                  </Button>
                </div>

                <p className="text-muted-foreground mb-6">{selectedCourse.description}</p>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Obsah kurzu</h3>
                  {previewModules.map((module, index) => (
                    <div key={module.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {module.duration_minutes} minut
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Link to={`/course/${selectedCourse.id}`}>
                    <Button className="w-full" onClick={() => setSelectedCourse(null)}>
                      <RiPlayCircleLine className="h-4 w-4 mr-2" />
                      Začít kurz
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
