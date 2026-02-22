import { motion } from 'framer-motion'
import {
  Sprout,
  BookOpen,
  Stethoscope,
  Award,
  Star,
  Crown,
  Flame,
  Zap,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Rank } from '@/lib/gamification'
import { cn } from '@/lib/utils'

const RANK_ICONS: Record<string, LucideIcon> = {
  seedling: Sprout,
  book: BookOpen,
  stethoscope: Stethoscope,
  award: Award,
  star: Star,
  crown: Crown,
  flame: Flame,
}

interface RankProgressCardProps {
  currentRank: Rank
  nextRank: Rank | null
  totalXp: number
  rankProgress: number
  loginStreak: number
  lessonsCompleted: number
  coursesCompleted: number
}

export function RankProgressCard({
  currentRank,
  nextRank,
  totalXp,
  rankProgress,
  loginStreak,
  lessonsCompleted,
  coursesCompleted,
}: RankProgressCardProps) {
  const RankIcon = RANK_ICONS[currentRank.icon] || Star
  const xpToNext = nextRank ? nextRank.minXp - totalXp : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-current" style={{ color: currentRank.color.replace('text-', '') }} />
              <div className="absolute -bottom-12 -left-12 w-52 h-52 rounded-full bg-current" style={{ color: currentRank.color.replace('text-', '') }} />
            </div>

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <motion.div
                className={cn(
                  'relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 shrink-0',
                  currentRank.bgColor,
                  currentRank.borderColor,
                )}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <RankIcon className={cn('w-10 h-10 sm:w-12 sm:h-12', currentRank.color)} />
                </motion.div>
                <div className="absolute -top-2 -right-2">
                  <Badge className={cn('text-[10px] px-1.5 py-0 h-5 font-bold border', currentRank.bgColor, currentRank.color, currentRank.borderColor)}>
                    LVL
                  </Badge>
                </div>
              </motion.div>

              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={cn('text-xl sm:text-2xl font-bold', currentRank.color)}>
                      {currentRank.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs font-semibold gap-1">
                      <Zap className="w-3 h-3" />
                      {totalXp} XP
                    </Badge>
                  </div>
                  {nextRank && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {xpToNext} XP do ranku <span className="font-medium">{nextRank.name}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Pokrok</span>
                    <span className="font-bold tabular-nums">{rankProgress}%</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn('absolute inset-y-0 left-0 rounded-full', currentRank.color.replace('text-', 'bg-'))}
                      initial={{ width: 0 }}
                      animate={{ width: `${rankProgress}%` }}
                      transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                    />
                    <motion.div
                      className={cn('absolute inset-y-0 left-0 rounded-full opacity-40', currentRank.color.replace('text-', 'bg-'))}
                      initial={{ width: 0 }}
                      animate={{ width: `${rankProgress}%` }}
                      transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs">
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <div>
                      <span className="font-bold tabular-nums">{loginStreak}</span>
                      <span className="text-muted-foreground ml-0.5">dnu v rade</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <div>
                      <span className="font-bold tabular-nums">{lessonsCompleted}</span>
                      <span className="text-muted-foreground ml-0.5">lekci</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-1.5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-bold tabular-nums">{coursesCompleted}</span>
                      <span className="text-muted-foreground ml-0.5">kurzu</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
