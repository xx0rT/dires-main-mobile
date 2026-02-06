import { ArrowRight, BookOpen, Play, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface ShowcaseCourse {
  badge?: string
  title: string
  description: string
  author: {
    name: string
    title: string
    avatar: string
  }
  image: string
  lessons: number
  videos: number
  duration: string
  audience: string[]
  gradient: string
  cta: {
    text: string
    url: string
  }
}

interface CourseShowcaseProps {
  courses: ShowcaseCourse[]
  className?: string
}

const CourseShowcase = ({ className, courses }: CourseShowcaseProps) => {
  return (
    <section className={cn('py-4', className)}>
      <div className="flex flex-col gap-8">
        {courses.map((course) => (
          <div
            key={course.title}
            className="relative flex flex-col gap-8 border-t border-border py-16 md:p-8"
          >
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="secondary" className="rounded-none uppercase">
                    {course.badge}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold">{course.title}</h3>

                <div className="space-y-2 text-sm text-foreground/90">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.audience.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons} Lekci</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span>
                      {course.videos} Videi, {course.duration}
                    </span>
                  </div>
                </div>

                <p className="text-lg leading-relaxed">{course.description}</p>

                <div>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border xl:size-12">
                      <AvatarImage src={course.author.avatar} />
                      <AvatarFallback>{course.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{course.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.author.title}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to={course.cta.url}
                  className="group/btn flex w-fit items-center gap-2 border-l border-border p-1 hover:bg-accent"
                >
                  <span className="font-medium">{course.cta.text}</span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>

              <div>
                <div
                  className={`group grid aspect-video w-full place-items-center bg-gradient-to-br ${course.gradient} rounded-lg pt-6 pr-8 transition duration-200 ease-out hover:scale-[1.03] hover:-rotate-2 dark:from-muted dark:to-muted/50`}
                >
                  <div className="shadow-duo col-start-1 row-start-1 flex aspect-square w-24 origin-top-left rotate-[-6deg] rounded-md border border-border bg-muted/50 transition duration-500 ease-out group-hover:scale-[1.1] group-hover:rotate-[-2deg] lg:w-32" />
                  <div className="col-start-1 row-start-1 flex aspect-square w-24 origin-top-left rotate-[-8deg] rounded-md border border-border bg-muted/50 transition duration-500 ease-out group-hover:scale-[1.1] group-hover:rotate-[-8deg] lg:w-32" />
                  <div className="shadow-duo col-start-1 row-start-1 flex aspect-square w-24 origin-top-left rotate-[-10deg] rounded-md border border-border bg-card transition duration-500 ease-out group-hover:scale-[1.1] group-hover:rotate-[-14deg] lg:w-32">
                    <div className="m-4 h-4 w-4 rounded-full bg-muted shadow-inner" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { CourseShowcase }
