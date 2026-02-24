export interface Rank {
  id: string
  name: string
  minXp: number
  maxXp: number
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

export interface BadgeReward {
  type: 'promo_code' | 'subscription_days' | 'discount'
  value: string
  label: string
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  xpReward: number
  category: 'lessons' | 'courses' | 'streaks' | 'special'
  condition: (stats: UserStats) => boolean
  reward?: BadgeReward
}

export interface UserStats {
  lessonsCompleted: number
  coursesCompleted: number
  loginStreak: number
  longestStreak: number
  totalXp: number
}

export const RANKS: Rank[] = [
  { id: 'novice', name: 'Novic', minXp: 0, maxXp: 99, color: 'text-zinc-500', bgColor: 'bg-zinc-500/10', borderColor: 'border-zinc-500/30', icon: 'seedling' },
  { id: 'student', name: 'Student', minXp: 100, maxXp: 299, color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: 'book' },
  { id: 'practitioner', name: 'Praktikant', minXp: 300, maxXp: 599, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: 'stethoscope' },
  { id: 'specialist', name: 'Specialista', minXp: 600, maxXp: 999, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', icon: 'award' },
  { id: 'expert', name: 'Expert', minXp: 1000, maxXp: 1999, color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', icon: 'star' },
  { id: 'master', name: 'Mistr', minXp: 2000, maxXp: 3499, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', icon: 'crown' },
  { id: 'grandmaster', name: 'Velmistr', minXp: 3500, maxXp: 999999, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: 'flame' },
]

export const XP_REWARDS = {
  lesson_complete: 25,
  course_complete: 150,
  streak_3: 30,
  streak_7: 75,
  streak_30: 300,
  first_lesson: 50,
  first_course: 100,
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_lesson',
    name: 'Prvni krok',
    description: 'Dokoncete svou prvni lekci',
    icon: 'footprints',
    xpReward: XP_REWARDS.first_lesson,
    category: 'lessons',
    condition: (s) => s.lessonsCompleted >= 1,
    reward: { type: 'promo_code', value: 'PRVNIKROK10', label: '10% sleva na dalsi kurz' },
  },
  {
    id: 'lessons_5',
    name: 'Pilny student',
    description: 'Dokoncete 5 lekci',
    icon: 'book-open',
    xpReward: 50,
    category: 'lessons',
    condition: (s) => s.lessonsCompleted >= 5,
    reward: { type: 'subscription_days', value: '3', label: '3 dny predplatneho zdarma' },
  },
  {
    id: 'lessons_10',
    name: 'Znaly praktik',
    description: 'Dokoncete 10 lekci',
    icon: 'brain',
    xpReward: 100,
    category: 'lessons',
    condition: (s) => s.lessonsCompleted >= 10,
    reward: { type: 'promo_code', value: 'PRAKTIK15', label: '15% sleva na vsechny produkty' },
  },
  {
    id: 'lessons_25',
    name: 'Neustupny',
    description: 'Dokoncete 25 lekci',
    icon: 'target',
    xpReward: 200,
    category: 'lessons',
    condition: (s) => s.lessonsCompleted >= 25,
    reward: { type: 'subscription_days', value: '7', label: '7 dni predplatneho zdarma' },
  },
  {
    id: 'lessons_50',
    name: 'Marathonec',
    description: 'Dokoncete 50 lekci',
    icon: 'medal',
    xpReward: 400,
    category: 'lessons',
    condition: (s) => s.lessonsCompleted >= 50,
    reward: { type: 'discount', value: '25', label: '25% sleva na rocni predplatne' },
  },
  {
    id: 'first_course',
    name: 'Absolvent',
    description: 'Dokoncete svuj prvni kurz',
    icon: 'graduation-cap',
    xpReward: XP_REWARDS.first_course,
    category: 'courses',
    condition: (s) => s.coursesCompleted >= 1,
    reward: { type: 'promo_code', value: 'ABSOLVENT20', label: '20% sleva na dalsi kurz' },
  },
  {
    id: 'courses_3',
    name: 'Sberatel znalosti',
    description: 'Dokoncete 3 kurzy',
    icon: 'library',
    xpReward: 250,
    category: 'courses',
    condition: (s) => s.coursesCompleted >= 3,
    reward: { type: 'subscription_days', value: '14', label: '14 dni predplatneho zdarma' },
  },
  {
    id: 'courses_5',
    name: 'Akademik',
    description: 'Dokoncete 5 kurzu',
    icon: 'trophy',
    xpReward: 500,
    category: 'courses',
    condition: (s) => s.coursesCompleted >= 5,
    reward: { type: 'discount', value: '30', label: '30% sleva na cokoliv v obchode' },
  },
  {
    id: 'streak_3',
    name: 'Na vlne',
    description: '3 dny v rade aktivni',
    icon: 'zap',
    xpReward: XP_REWARDS.streak_3,
    category: 'streaks',
    condition: (s) => s.longestStreak >= 3,
    reward: { type: 'promo_code', value: 'SERIE5', label: '5% sleva na dalsi nakup' },
  },
  {
    id: 'streak_7',
    name: 'Tydenni valka',
    description: '7 dni v rade aktivni',
    icon: 'flame',
    xpReward: XP_REWARDS.streak_7,
    category: 'streaks',
    condition: (s) => s.longestStreak >= 7,
    reward: { type: 'subscription_days', value: '5', label: '5 dni predplatneho zdarma' },
  },
  {
    id: 'streak_30',
    name: 'Zelezna vule',
    description: '30 dni v rade aktivni',
    icon: 'shield',
    xpReward: XP_REWARDS.streak_30,
    category: 'streaks',
    condition: (s) => s.longestStreak >= 30,
    reward: { type: 'subscription_days', value: '30', label: '30 dni predplatneho zdarma' },
  },
  {
    id: 'xp_500',
    name: 'Stoupenec',
    description: 'Nasbirejte 500 XP',
    icon: 'trending-up',
    xpReward: 50,
    category: 'special',
    condition: (s) => s.totalXp >= 500,
    reward: { type: 'promo_code', value: 'XP500SLEVA', label: '10% sleva na e-shop' },
  },
  {
    id: 'xp_2000',
    name: 'Veteran',
    description: 'Nasbirejte 2000 XP',
    icon: 'crown',
    xpReward: 200,
    category: 'special',
    condition: (s) => s.totalXp >= 2000,
    reward: { type: 'discount', value: '50', label: '50% sleva na mesicni predplatne' },
  },
]

export function getRankForXp(xp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) return RANKS[i]
  }
  return RANKS[0]
}

export function getNextRank(currentRank: Rank): Rank | null {
  const idx = RANKS.findIndex((r) => r.id === currentRank.id)
  if (idx < RANKS.length - 1) return RANKS[idx + 1]
  return null
}

export function getXpProgressInRank(xp: number, rank: Rank): number {
  const nextRank = getNextRank(rank)
  if (!nextRank) return 100
  const xpInRank = xp - rank.minXp
  const xpNeeded = nextRank.minXp - rank.minXp
  return Math.min(Math.round((xpInRank / xpNeeded) * 100), 100)
}

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.id === id)
}
