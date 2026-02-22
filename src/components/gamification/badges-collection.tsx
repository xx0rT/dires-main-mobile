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
  Gift,
  Tag,
  Calendar,
  Percent,
  Check,
  Copy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BADGES, type BadgeDefinition } from '@/lib/gamification'
import type { ClaimedReward } from '@/lib/use-gamification'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

const REWARD_TYPE_ICONS: Record<string, LucideIcon> = {
  promo_code: Tag,
  subscription_days: Calendar,
  discount: Percent,
}

interface BadgesCollectionProps {
  earnedBadgeIds: Set<string>
  claimedRewards: ClaimedReward[]
  onClaimReward: (badgeId: string) => Promise<boolean>
}

export function BadgesCollection({ earnedBadgeIds, claimedRewards, onClaimReward }: BadgesCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const categories = ['lessons', 'courses', 'streaks', 'special'] as const

  const filteredBadges = selectedCategory
    ? BADGES.filter((b) => b.category === selectedCategory)
    : BADGES

  const earnedCount = BADGES.filter((b) => earnedBadgeIds.has(b.id)).length
  const rewardMap = new Map(claimedRewards.map((r) => [r.badge_id, r]))
  const unclaimedCount = claimedRewards.filter((r) => !r.claimed).length

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
              <CardTitle className="text-lg flex items-center gap-2">
                Odznaky a odmeny
                {unclaimedCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 rounded-full bg-green-500/15 border border-green-500/30 px-2 py-0.5"
                  >
                    <Gift className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-bold text-green-600">{unclaimedCount} novych</span>
                  </motion.div>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {earnedCount} z {BADGES.length} ziskano -- kazdy odznak odemyka odmenu
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredBadges.map((badge, i) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadgeIds.has(badge.id)}
                  rewardData={rewardMap.get(badge.id)}
                  onClaim={onClaimReward}
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
  rewardData,
  onClaim,
  index,
}: {
  badge: BadgeDefinition
  earned: boolean
  rewardData?: ClaimedReward
  onClaim: (badgeId: string) => Promise<boolean>
  index: number
}) {
  const [claiming, setClaiming] = useState(false)
  const [copied, setCopied] = useState(false)
  const Icon = BADGE_ICONS[badge.icon] || Trophy
  const catColor = CATEGORY_COLORS[badge.category] || 'text-zinc-500'

  const hasReward = !!badge.reward
  const rewardClaimed = rewardData?.claimed ?? false
  const canClaim = earned && hasReward && rewardData && !rewardClaimed

  const handleClaim = async () => {
    setClaiming(true)
    const ok = await onClaim(badge.id)
    setClaiming(false)
    if (ok) {
      toast.success('Odmena vyzvednuta!', { description: badge.reward?.label })
    }
  }

  const handleCopyCode = () => {
    if (rewardData?.reward_value) {
      navigator.clipboard.writeText(rewardData.reward_value)
      setCopied(true)
      toast.success('Kod zkopirovan do schranky')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const RewardTypeIcon = badge.reward ? (REWARD_TYPE_ICONS[badge.reward.type] || Gift) : Gift

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={earned ? { y: -3 } : undefined}
      className={cn(
        'relative rounded-xl border p-4 transition-colors flex gap-3',
        earned
          ? 'bg-card border-border hover:border-primary/30'
          : 'bg-muted/30 border-border/40 opacity-50',
      )}
    >
      {!earned && (
        <div className="absolute top-3 right-3">
          <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />
        </div>
      )}

      <motion.div
        className={cn(
          'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          earned ? `${catColor.replace('text-', 'bg-')}/15` : 'bg-muted',
        )}
        animate={earned ? { rotate: [0, -5, 5, 0] } : undefined}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
      >
        <Icon
          className={cn(
            'w-6 h-6',
            earned ? catColor : 'text-muted-foreground/40',
          )}
        />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn(
              'text-sm font-semibold leading-tight',
              earned ? 'text-foreground' : 'text-muted-foreground/60',
            )}>
              {badge.name}
            </p>
            <p className={cn(
              'text-xs leading-snug mt-0.5',
              earned ? 'text-muted-foreground' : 'text-muted-foreground/40',
            )}>
              {badge.description}
            </p>
          </div>
          {earned && badge.xpReward > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold shrink-0">
              +{badge.xpReward} XP
            </Badge>
          )}
        </div>

        {hasReward && (
          <div className="mt-2">
            {!earned ? (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/40">
                <Gift className="w-3 h-3" />
                <span>Odmena: {badge.reward!.label}</span>
              </div>
            ) : canClaim ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-1"
              >
                <div className="flex-1 rounded-lg border border-green-500/30 bg-green-500/5 px-2.5 py-1.5 flex items-center gap-1.5">
                  <RewardTypeIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-[11px] font-medium text-green-600 truncate">
                    {badge.reward!.label}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="h-7 px-2.5 text-xs bg-green-600 hover:bg-green-700 text-white shrink-0"
                  onClick={handleClaim}
                  disabled={claiming}
                >
                  {claiming ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Gift className="w-3 h-3 mr-1" />
                      Vyzvednout
                    </>
                  )}
                </Button>
              </motion.div>
            ) : rewardClaimed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span className="text-[11px] font-medium text-green-600">Vyzvednuto</span>
                </div>
                {(rewardData?.reward_type === 'promo_code' || rewardData?.reward_type === 'discount') && (
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs font-mono bg-background px-2 py-0.5 rounded border flex-1 truncate">
                      {rewardData.reward_value}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="shrink-0 p-1 rounded hover:bg-accent transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}
                {rewardData?.reward_type === 'subscription_days' && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      +{rewardData.reward_value} dni pridano k predplatnemu
                    </span>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                <Gift className="w-3 h-3" />
                <span>{badge.reward!.label}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
