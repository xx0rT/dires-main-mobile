import { motion } from 'framer-motion'
import { Clock, Lock, Play, Check, Eye, ShoppingCart, Film } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export type CourseStatus = 'available' | 'purchased' | 'completed' | 'locked' | 'locked_daily'

interface CourseCardProps {
  id: string
  title: string
  description: string
  lessonsCount: number
  duration: number
  price: number
  status: CourseStatus
  index: number
  isAuthenticated: boolean
  buying?: boolean
  onBuy: (courseId: string) => void
  onPreview: (courseId: string) => void
}

export function CourseCard({
  id,
  title,
  description,
  lessonsCount,
  duration,
  price,
  status,
  index,
  isAuthenticated,
  buying,
  onBuy,
  onPreview,
}: CourseCardProps) {
  const isLocked = status === 'locked' || status === 'locked_daily'
  const isCompleted = status === 'completed'
  const isPurchased = status === 'purchased'

  const formattedPrice = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
  }).format(price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div
        className={`rounded-xl border p-4 transition-all duration-200 ${
          isLocked
            ? 'opacity-50 bg-muted/30'
            : isCompleted
              ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
              : isPurchased
                ? 'border-primary/20 bg-primary/[0.02]'
                : 'hover:border-border/80 hover:bg-accent/30'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isCompleted
                ? 'bg-emerald-100 dark:bg-emerald-900/40'
                : isLocked
                  ? 'bg-muted'
                  : isPurchased
                    ? 'bg-primary/10'
                    : 'bg-primary/10'
            }`}
          >
            {isLocked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : isCompleted ? (
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            ) : (
              <Film className="h-5 w-5 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h3 className="text-sm font-semibold leading-tight">{title}</h3>
                {isCompleted && (
                  <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-[10px] px-1.5 py-0">
                    Dokonceno
                  </Badge>
                )}
                {isPurchased && (
                  <Badge className="gap-1 bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                    Zakoupeno
                  </Badge>
                )}
              </div>
              {!isPurchased && !isCompleted && !isLocked && (
                <span className="text-sm font-bold text-primary shrink-0">{formattedPrice}</span>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{description}</p>

            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" fill="currentColor" />
                  {lessonsCount} videi
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {duration} min
                </span>
              </div>

              <div className="flex items-center gap-2">
                {status === 'available' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(id)}
                      className="h-7 rounded-lg px-2.5 text-xs gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Obsah
                    </Button>
                    {isAuthenticated ? (
                      <Button
                        size="sm"
                        onClick={() => onBuy(id)}
                        disabled={buying}
                        className="h-7 rounded-lg px-3 text-xs gap-1"
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {buying ? 'Zpracovani...' : 'Koupit'}
                      </Button>
                    ) : (
                      <Button size="sm" className="h-7 rounded-lg px-3 text-xs gap-1" asChild>
                        <Link to="/auth/sign-up">
                          <ShoppingCart className="h-3 w-3" />
                          Prihlasit se
                        </Link>
                      </Button>
                    )}
                  </>
                )}

                {isPurchased && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(id)}
                      className="h-7 rounded-lg px-2.5 text-xs gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Obsah
                    </Button>
                    <Button size="sm" className="h-7 rounded-lg px-3 text-xs gap-1" asChild>
                      <Link to={`/course/${id}`}>
                        <Play className="h-3 w-3" fill="currentColor" />
                        Spustit
                      </Link>
                    </Button>
                  </>
                )}

                {isCompleted && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreview(id)}
                      className="h-7 rounded-lg px-2.5 text-xs gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      Obsah
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 rounded-lg px-3 text-xs gap-1" asChild>
                      <Link to={`/course/${id}`}>
                        <Play className="h-3 w-3" fill="currentColor" />
                        Znovu
                      </Link>
                    </Button>
                  </>
                )}

                {status === 'locked' && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Dokoncete predchozi
                  </span>
                )}

                {status === 'locked_daily' && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Dostupne zitra
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
