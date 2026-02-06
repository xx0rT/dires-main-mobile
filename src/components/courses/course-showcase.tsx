import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  Film,
  Play,
  ShoppingCart,
  Star,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  price: number
  originalPrice?: number
  coursesInPackage: { id: string; title: string; duration: number }[]
  cta: {
    text: string
    url: string
  }
  isPurchased?: boolean
  onPreview?: () => void
  onBuy?: () => void
}

interface CourseShowcaseProps {
  courses: ShowcaseCourse[]
  className?: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(price)
}

function CourseShowcaseCard({ course, index }: { course: ShowcaseCourse; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          {course.badge && (
            <Badge className="border-0 bg-white/15 text-white backdrop-blur-md">
              {course.badge}
            </Badge>
          )}
          {course.isPurchased && (
            <Badge className="border-0 bg-emerald-500/90 text-white">
              Zakoupeno
            </Badge>
          )}
        </div>

        <AnimatePresence>
          {hovered && !course.isPurchased && course.onPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2 rounded-full bg-white/95 text-black shadow-xl hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    course.onPreview?.()
                  }}
                >
                  <Eye className="h-4 w-4" />
                  Nahled obsahu
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Film className="h-3.5 w-3.5" />
                {course.videos} videi
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </div>
            </div>
            {!course.isPurchased && course.price > 0 && (
              <div className="text-right">
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="block text-xs text-white/60 line-through">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
                <span className="text-lg font-bold text-white">
                  {formatPrice(course.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">5.0</span>
        </div>

        <h3 className="mb-2 text-xl font-bold leading-tight">{course.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        {course.coursesInPackage.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {course.coursesInPackage.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
              >
                <Play className="h-3 w-3 shrink-0 text-primary" fill="currentColor" />
                <span className="flex-1 truncate">{c.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{c.duration} min</span>
              </div>
            ))}
            {course.coursesInPackage.length > 3 && (
              <p className="pl-3 text-xs text-muted-foreground">
                + {course.coursesInPackage.length - 3} dalsich videi
              </p>
            )}
          </div>
        )}

        <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons} lekci
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {course.audience.join(', ')}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={course.author.avatar} />
              <AvatarFallback>{course.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">{course.author.name}</p>
              <p className="text-[11px] text-muted-foreground">{course.author.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {course.onPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-3 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  course.onPreview?.()
                }}
              >
                <Eye className="h-3.5 w-3.5" />
                Nahled
              </Button>
            )}
            {course.isPurchased ? (
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-4 text-xs"
                asChild
              >
                <Link to={course.cta.url}>
                  <Play className="h-3.5 w-3.5" fill="currentColor" />
                  Pokracovat
                </Link>
              </Button>
            ) : course.onBuy ? (
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-4 text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  course.onBuy?.()
                }}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Koupit
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg px-4 text-xs"
                asChild
              >
                <Link to={course.cta.url}>
                  {course.cta.text}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const INITIAL_VISIBLE = 3

const CourseShowcase = ({ className, courses }: CourseShowcaseProps) => {
  const [expanded, setExpanded] = useState(false)
  const hasMore = courses.length > INITIAL_VISIBLE
  const visibleCourses = expanded ? courses : courses.slice(0, INITIAL_VISIBLE)

  return (
    <section className={cn('py-4', className)}>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Badge variant="outline" className="mb-3 gap-1.5 text-xs uppercase">
            <BookOpen className="h-3 w-3" />
            Katalog balicku
          </Badge>
          <h2 className="text-3xl font-bold">
            Vyberte si balicek
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Kazdy balicek obsahuje sadu videi. Zakupte jednorazove a ziskejte pristup ke vsem videim.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <span className="flex items-center gap-1">
            <Film className="h-4 w-4 text-primary" />
            {courses.reduce((sum, c) => sum + c.videos, 0)} videi celkem
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleCourses.map((course, idx) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: idx >= INITIAL_VISIBLE ? (idx - INITIAL_VISIBLE) * 0.08 : 0 }}
            >
              <CourseShowcaseCard course={course} index={idx} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? (
              <>
                Zobrazit mene
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Zobrazit vse ({courses.length - INITIAL_VISIBLE} dalsich)
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}

export { CourseShowcase }
