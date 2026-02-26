import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Lock,
  Play,
  CalendarClock,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type LessonStatus = 'completed' | 'available' | 'daily_locked' | 'locked'

interface PathLesson {
  id: string
  title: string
  duration: number
  order_index: number
  status: LessonStatus
}

interface CoursePathProps {
  courseId: string
  lessons: PathLesson[]
  courseTitle?: string
}

const NODE_SIZE = 64
const VERTICAL_GAP = 88
const WAVE_AMPLITUDE = 60

function getNodeX(index: number): number {
  const cycle = index % 4
  if (cycle === 0) return 0
  if (cycle === 1) return WAVE_AMPLITUDE
  if (cycle === 2) return 0
  return -WAVE_AMPLITUDE
}

export function CoursePath({ courseId, lessons }: CoursePathProps) {
  const navigate = useNavigate()

  if (lessons.length === 0) return null

  const totalHeight = (lessons.length - 1) * VERTICAL_GAP + NODE_SIZE + 40

  return (
    <div className="relative flex flex-col items-center w-full overflow-visible pb-8">
      <div className="relative" style={{ height: totalHeight, width: '100%', maxWidth: 280 }}>
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height={totalHeight}
          viewBox={`${-WAVE_AMPLITUDE - NODE_SIZE} 0 ${WAVE_AMPLITUDE * 2 + NODE_SIZE * 2 + 40} ${totalHeight}`}
          fill="none"
          preserveAspectRatio="xMidYMin meet"
        >
          {lessons.map((_, i) => {
            if (i === lessons.length - 1) return null
            const x1 = getNodeX(i) + NODE_SIZE / 2
            const y1 = i * VERTICAL_GAP + NODE_SIZE / 2 + 20
            const x2 = getNodeX(i + 1) + NODE_SIZE / 2
            const y2 = (i + 1) * VERTICAL_GAP + NODE_SIZE / 2 + 20
            const midY = (y1 + y2) / 2

            const currentStatus = lessons[i].status
            const isConnected = currentStatus === 'completed'

            return (
              <motion.path
                key={`path-${lessons[i].id}`}
                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                stroke={isConnected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                strokeWidth={3}
                strokeDasharray={isConnected ? undefined : '8 6'}
                strokeLinecap="round"
                opacity={isConnected ? 0.5 : 0.25}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              />
            )
          })}
        </svg>

        {lessons.map((lesson, i) => {
          const x = getNodeX(i)
          const y = i * VERTICAL_GAP + 20
          const canOpen = lesson.status === 'completed' || lesson.status === 'available'
          const isActive = lesson.status === 'available'
          const isCompleted = lesson.status === 'completed'
          const isDailyLocked = lesson.status === 'daily_locked'
          const isLocked = lesson.status === 'locked'

          return (
            <motion.div
              key={lesson.id}
              className="absolute"
              style={{
                left: '50%',
                top: y,
                transform: `translateX(calc(-50% + ${x}px))`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: i * 0.07,
              }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <motion.button
                  type="button"
                  disabled={!canOpen}
                  onClick={() => canOpen && navigate(`/kurz/${courseId}/cast/${i + 1}`)}
                  whileTap={canOpen ? { scale: 0.9 } : undefined}
                  whileHover={canOpen ? { scale: 1.08 } : undefined}
                  className={cn(
                    'relative rounded-full flex items-center justify-center transition-shadow',
                    isCompleted && 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]',
                    isActive && 'bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.35)]',
                    isDailyLocked && 'bg-amber-500/20 border-2 border-amber-500/40',
                    isLocked && 'bg-muted/60 border-2 border-border/40',
                    !canOpen && 'cursor-not-allowed',
                  )}
                  style={{ width: NODE_SIZE, height: NODE_SIZE }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-[3px] border-primary/30"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    />
                  )}

                  {isCompleted && (
                    <div className="absolute -inset-1.5 rounded-full border-[3px] border-green-500/30" />
                  )}

                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : isActive ? (
                    <Play className="w-7 h-7 text-primary-foreground ml-0.5" />
                  ) : isDailyLocked ? (
                    <CalendarClock className="w-6 h-6 text-amber-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground/50" />
                  )}
                </motion.button>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.3 }}
                    className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold shadow-lg whitespace-nowrap"
                  >
                    START
                  </motion.div>
                )}

                {!isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.07 + 0.2 }}
                    className="text-center max-w-[120px]"
                  >
                    <p className={cn(
                      'text-[10px] font-semibold truncate',
                      isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground/60',
                    )}>
                      {lesson.title}
                    </p>
                    {isCompleted && (
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <Star className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                        <Star className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                        <Star className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                      </div>
                    )}
                    {isDailyLocked && (
                      <p className="text-[9px] text-amber-500 font-medium mt-0.5">Zitra</p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
