import { motion, AnimatePresence } from 'framer-motion'
import {
  Footprints,
  BookOpen,
  Brain,
  Target,
  Medal,
  GraduationCap,
  Library,
  Trophy,
  Zap,
  Flame,
  Shield,
  TrendingUp,
  Crown,
  Lock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BADGES, type BadgeDefinition } from '@/lib/gamification'
import { cn } from '@/lib/utils'

const BADGE_ICONS: Record<string, LucideIcon> = {
  'footprints': Footprints,
  'book-open': BookOpen,
  'brain': Brain,
  'target': Target,
  'medal': Medal,
  'graduation-cap': GraduationCap,
  'library': Library,
  'trophy': Trophy,
  'zap': Zap,
  'flame': Flame,
  'shield': Shield,
  'trending-up': TrendingUp,
  'crown': Crown,
}

const CATEGORY_LABELS: Record<string, string> = {
  lessons: 'Lekce',
  courses: 'Kurzy',
  streaks: 'Serie',
  special: 'Specialni',
}

const CATEGORY_COLORS: Record<string, string> = {
  lessons: 'text-green-500',
  courses: 'text-blue-500',
  streaks: 'text-orange-500',
  special: 'text-amber-500',
}

interface BadgesCollectionProps {
  earnedBadgeIds: Set<string>
}

export function BadgesCollection({ earnedBadgeIds }: BadgesCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = ['lessons', 'courses', 'streaks', 'special'] as const

  const filteredBadges = selectedCategory
    ? BADGES.filter((b) => b.category === selectedCategory)
    : BADGES

  const earnedCount = BADGES.filter((b) => earnedBadgeIds.has(b.id)).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-lg">Odznaky</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {earnedCount} z {BADGES.length} ziskano
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-bold tabular-nums">
              {earnedCount}/{BADGES.length}
            </Badge>
          </div>

          <div className="flex gap-1.5 pt-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                !selectedCategory
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              Vse ({BADGES.length})
            </motion.button>
            {categories.map((cat) => {
              const count = BADGES.filter((b) => b.category === cat).length
              const earned = BADGES.filter((b) => b.category === cat && earnedBadgeIds.has(b.id)).length
              return (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    selectedCategory === cat
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {CATEGORY_LABELS[cat]} ({earned}/{count})
                </motion.button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredBadges.map((badge, i) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadgeIds.has(badge.id)}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function BadgeItem({
  badge,
  earned,
  index,
}: {
  badge: BadgeDefinition
  earned: boolean
  index: number
}) {
  const Icon = BADGE_ICONS[badge.icon] || Trophy
  const catColor = CATEGORY_COLORS[badge.category] || 'text-zinc-500'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={earned ? { scale: 1.05, y: -4 } : undefined}
      className={cn(
        'relative rounded-xl border p-3 sm:p-4 text-center transition-colors',
        earned
          ? 'bg-card border-border hover:border-primary/30 cursor-default'
          : 'bg-muted/30 border-border/40 opacity-50',
      )}
    >
      {!earned && (
        <div className="absolute top-2 right-2">
          <Lock className="w-3 h-3 text-muted-foreground/50" />
        </div>
      )}

      <motion.div
        className={cn(
          'mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2',
          earned ? `${catColor.replace('text-', 'bg-')}/15` : 'bg-muted',
        )}
        animate={earned ? { rotate: [0, -5, 5, 0] } : undefined}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
      >
        <Icon
          className={cn(
            'w-5 h-5 sm:w-6 sm:h-6',
            earned ? catColor : 'text-muted-foreground/40',
          )}
        />
      </motion.div>

      <p className={cn(
        'text-xs font-semibold leading-tight',
        earned ? 'text-foreground' : 'text-muted-foreground/60',
      )}>
        {badge.name}
      </p>
      <p className={cn(
        'text-[10px] leading-snug mt-0.5',
        earned ? 'text-muted-foreground' : 'text-muted-foreground/40',
      )}>
        {badge.description}
      </p>

      {earned && badge.xpReward > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-1.5"
        >
          <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-bold">
            +{badge.xpReward} XP
          </Badge>
        </motion.div>
      )}
    </motion.div>
  )
}
