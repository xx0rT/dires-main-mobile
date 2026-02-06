import { GraduationCap, Trophy } from 'lucide-react'
import { CourseCard } from './course-card'
import type { CourseStatus } from './course-card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const iconMap: Record<string, typeof GraduationCap> = {
  'graduation-cap': GraduationCap,
  trophy: Trophy,
}

export interface PackageCourse {
  id: string
  title: string
  description: string
  lessons_count: number
  duration: number
  price: number
  order_index: number
  status: CourseStatus
}

interface PackageSectionProps {
  id: string
  title: string
  description: string
  icon: string
  courses: PackageCourse[]
  isAuthenticated: boolean
  buyingCourseId: string | null
  onBuy: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function PackageSection({
  title,
  description,
  icon,
  courses,
  isAuthenticated,
  buyingCourseId,
  onBuy,
  onPreview,
}: PackageSectionProps) {
  const IconComponent = iconMap[icon] || GraduationCap
  const completedCount = courses.filter(c => c.status === 'completed').length
  const progressPercent = courses.length > 0 ? Math.round((completedCount / courses.length) * 100) : 0

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <IconComponent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{title}</h2>
              <Badge variant="outline" className="text-[11px]">
                {courses.length} balicku
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {completedCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{completedCount}/{courses.length}</span>
            <Progress value={progressPercent} className="h-1.5 w-20" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {courses
          .sort((a, b) => a.order_index - b.order_index)
          .map((course, courseIndex) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              lessonsCount={course.lessons_count}
              duration={course.duration}
              price={course.price}
              status={course.status}
              index={courseIndex}
              isAuthenticated={isAuthenticated}
              buying={buyingCourseId === course.id}
              onBuy={onBuy}
              onPreview={onPreview}
            />
          ))}
      </div>
    </section>
  )
}
