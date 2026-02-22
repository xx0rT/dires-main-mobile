import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Star, Trophy, ArrowUp } from 'lucide-react'
import { useEffect } from 'react'
import type { BadgeDefinition, Rank } from '@/lib/gamification'
import { cn } from '@/lib/utils'

interface XpRewardPopupProps {
  amount: number
  source: string
  newBadges: BadgeDefinition[]
  newRank: Rank | null
  visible: boolean
  onClose: () => void
}

export function XpRewardPopup({
  amount,
  source,
  newBadges,
  newRank,
  visible,
  onClose,
}: XpRewardPopupProps) {
  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(onClose, 4000)
      return () => clearTimeout(timeout)
    }
  }, [visible, onClose])

  const sourceLabel: Record<string, string> = {
    lesson_complete: 'Lekce dokoncena',
    course_complete: 'Kurz dokoncen',
    badge_earned: 'Odznak ziskan',
    streak_bonus: 'Bonus za serii',
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="pointer-events-auto rounded-xl border bg-card/95 backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3 min-w-[200px]"
            whileHover={{ scale: 1.02 }}
            onClick={onClose}
          >
            <motion.div
              className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Zap className="w-5 h-5 text-amber-500" />
            </motion.div>
            <div>
              <motion.div
                className="text-lg font-bold tabular-nums text-amber-500"
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.3, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                +{amount} XP
              </motion.div>
              <p className="text-xs text-muted-foreground">
                {sourceLabel[source] || source}
              </p>
            </div>
          </motion.div>

          {newRank && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              className="pointer-events-auto rounded-xl border-2 bg-card/95 backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3 min-w-[200px]"
              style={{ borderColor: `var(--color-${newRank.color.replace('text-', '')}, currentColor)` }}
            >
              <motion.div
                className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', newRank.bgColor)}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <ArrowUp className={cn('w-5 h-5', newRank.color)} />
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Novy rank!</p>
                <p className={cn('text-sm font-bold', newRank.color)}>{newRank.name}</p>
              </div>
            </motion.div>
          )}

          {newBadges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring', stiffness: 300 }}
              className="pointer-events-auto rounded-xl border bg-card/95 backdrop-blur-md shadow-lg px-4 py-3 flex items-center gap-3 min-w-[200px]"
            >
              <motion.div
                className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.2 }}
              >
                {badge.category === 'courses' ? (
                  <Trophy className="w-5 h-5 text-green-500" />
                ) : (
                  <Star className="w-5 h-5 text-green-500" />
                )}
              </motion.div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Novy odznak!</p>
                <p className="text-sm font-bold">{badge.name}</p>
                {badge.xpReward > 0 && (
                  <p className="text-[10px] text-amber-500 font-semibold">+{badge.xpReward} XP</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
