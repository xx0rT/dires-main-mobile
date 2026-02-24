import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, BadgeCheck, ThumbsUp, Filter, TrendingUp,
  Users, Award, ChevronDown,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WriteReviewDialog } from '@/components/shop/write-review-dialog'
import type { ReviewRecord } from '@/components/shop/write-review-dialog'
import { cn } from '@/lib/utils'

const MOCK_REVIEWS: ReviewRecord[] = [
  {
    id: '1',
    author_name: 'Alena V.',
    rating: 5,
    title: 'Úžasná péče a profesionální přístup',
    content: 'Po měsících bolestí ramene jsem konečně našla odbornou pomoc. Každá terapie byla přizpůsobena mým potřebám a terapeut si vždy udělal čas na vysvětlení postupu. Bolesti jsou pryč a mohu se opět plně věnovat svým koníčkům.',
    service_type: 'Terapie ramene',
    verified: true,
    helpful_count: 24,
    approved: true,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    author_name: 'Tomáš K.',
    rating: 5,
    title: 'Vrátil jsem se ke sportu rychleji než jsem čekal',
    content: 'Po zranění achillovy šlachy při běhání jsem byl skeptický. Díky individuálnímu rehabilitačnímu plánu jsem za 8 týdnů opět na běžecké dráze. Profesionalita na nejvyšší úrovni!',
    service_type: 'Sportovní rehabilitace',
    verified: true,
    helpful_count: 18,
    approved: true,
    created_at: '2025-01-10T09:00:00Z',
  },
  {
    id: '3',
    author_name: 'Markéta N.',
    rating: 5,
    title: 'Konečně mohu fungovat bez bolesti',
    content: 'Chronické bolesti dolní části zad mě trápily více než 5 let. Zkoušela jsem různé léčby, ale žádná nepomohla dlouhodobě. Po třech měsících jsem poprvé bez bolesti!',
    service_type: 'Terapie bederní páteře',
    verified: true,
    helpful_count: 31,
    approved: true,
    created_at: '2025-01-05T08:00:00Z',
  },
  {
    id: '4',
    author_name: 'Pavel D.',
    rating: 4,
    title: 'Skvělé výsledky, trochu delší čekací doba',
    content: 'Péče je opravdu na vysoké úrovni a výsledky jsou skvělé. Jediné mínus je občas delší čekací doba na termín. Terapeut je velmi zkušený a vždy si udělá čas na všechny mé dotazy.',
    service_type: null,
    verified: false,
    helpful_count: 12,
    approved: true,
    created_at: '2025-01-02T07:00:00Z',
  },
  {
    id: '5',
    author_name: 'David B.',
    rating: 5,
    title: 'Pomohli mi po autonehodě',
    content: 'Po autonehodě jsem měl vážné problémy s krkem a rameny. Klasická medicína nabízela jen léky. Zde mi pomohli s komplexní rehabilitací. Po půl roce jsem téměř bez obtíží.',
    service_type: 'Poúrazová rehabilitace',
    verified: true,
    helpful_count: 8,
    approved: true,
    created_at: '2024-12-28T06:00:00Z',
  },
  {
    id: '6',
    author_name: 'Karolína S.',
    rating: 5,
    title: 'Perfektní přístup k seniorům',
    content: 'Moje maminka (78 let) trpěla artritidou a měla velké problémy s pohyblivostí. Terapeut byl nesmírně trpělivý a přizpůsobil vše jejímu věku. Po několika seancích je mnohem pohyblivější.',
    service_type: 'Geriatrická fyzioterapie',
    verified: true,
    helpful_count: 15,
    approved: true,
    created_at: '2024-12-22T05:00:00Z',
  },
  {
    id: '7',
    author_name: 'Jana K.',
    rating: 5,
    title: 'Skvělá péče o záda',
    content: 'Po třech měsících bolestí zad jsem konečně bez potíží. Pan doktor byl velmi profesionální a trpělivý. Cviky, které mi ukázal, mi pomáhají dodnes.',
    service_type: 'Terapie zad',
    verified: true,
    helpful_count: 20,
    approved: true,
    created_at: '2024-12-15T04:00:00Z',
  },
  {
    id: '8',
    author_name: 'Martin P.',
    rating: 4,
    title: 'Rychlá rehabilitace po fotbalovém úrazu',
    content: 'Po úrazu kolena při fotbale jsem potřeboval rychlou rehabilitaci. Díky individuálnímu přístupu jsem se vrátil do hry za 6 týdnů. Vřele doporučuji!',
    service_type: 'Rehabilitace kolene',
    verified: true,
    helpful_count: 11,
    approved: true,
    created_at: '2024-12-10T03:00:00Z',
  },
]

type SortOption = 'newest' | 'helpful' | 'highest' | 'lowest'

function StarRow({ rating, filled = false }: { rating: number; filled?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            'h-4 w-4',
            s <= rating
              ? filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-amber-400 text-amber-400'
              : 'text-neutral-200 dark:text-neutral-700',
          )}
        />
      ))}
    </div>
  )
}

function ReviewCard({
  review,
  onHelpful,
  helpfulSet,
}: {
  review: ReviewRecord
  onHelpful: (id: string) => void
  helpfulSet: Set<string>
}) {
  const initials = review.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const date = new Date(review.created_at).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isHelpful = helpfulSet.has(review.id)
  const helpfulCount = (review.helpful_count ?? 0) + (isHelpful ? 1 : 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="group rounded-2xl border border-neutral-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-neutral-100 dark:ring-neutral-800">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-blue-50 text-sm font-700 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" style={{ fontWeight: 700 }}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-600 text-neutral-900 dark:text-neutral-100" style={{ fontWeight: 600 }}>
                {review.author_name}
              </span>
              {review.verified && (
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span>{date}</span>
              {review.service_type && (
                <>
                  <span>·</span>
                  <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {review.service_type}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <StarRow rating={review.rating} />
      </div>

      <div className="mt-3.5">
        <h3 className="text-sm font-600 text-neutral-900 dark:text-neutral-100 leading-snug" style={{ fontWeight: 600 }}>
          {review.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {review.content}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <button
          onClick={() => onHelpful(review.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all',
            isHelpful
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800',
          )}
        >
          <ThumbsUp className={cn('h-3.5 w-3.5', isHelpful && 'fill-current')} />
          <span>Užitečné</span>
          {helpfulCount > 0 && <span className="font-500" style={{ fontWeight: 500 }}>({helpfulCount})</span>}
        </button>
      </div>
    </motion.div>
  )
}

export default function ReferencesPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>(MOCK_REVIEWS)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')
  const [helpfulSet, setHelpfulSet] = useState<Set<string>>(new Set())
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setReviews(data as ReviewRecord[])
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const handleHelpful = async (id: string) => {
    setHelpfulSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    try {
      const review = reviews.find((r) => r.id === id)
      if (review) {
        await supabase
          .from('reviews')
          .update({ helpful_count: (review.helpful_count ?? 0) + (helpfulSet.has(id) ? -1 : 1) })
          .eq('id', id)
      }
    } catch {}
  }

  const handleReviewAdded = (review: ReviewRecord) => {
    setReviews((prev) => [review, ...prev])
    setVisibleCount((v) => v + 1)
  }

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
    : 0
  const verifiedCount = reviews.filter((r) => r.verified).length
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length
  const fiveStarPct = totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: totalReviews > 0 ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100 : 0,
  }))

  const filtered = reviews.filter((r) => filterRating === null || r.rating === filterRating)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'helpful') return (b.helpful_count ?? 0) - (a.helpful_count ?? 0)
    if (sort === 'highest') return b.rating - a.rating
    if (sort === 'lowest') return a.rating - b.rating
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const visible = sorted.slice(0, visibleCount)

  const SORT_LABELS: Record<SortOption, string> = {
    newest: 'Nejnovější',
    helpful: 'Nejužitečnější',
    highest: 'Nejvyšší hodnocení',
    lowest: 'Nejnižší hodnocení',
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-neutral-900"
          style={{ border: '1px solid rgba(59,130,246,0.12)' }}
        >
          <div className="relative overflow-hidden px-8 pb-8 pt-10">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)',
              }}
            />

            <div className="relative grid gap-8 lg:grid-cols-2">
              <div>
                <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-600 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" style={{ fontWeight: 600 }}>
                  Ověřené hodnocení pacientů
                </span>
                <h1 className="text-3xl font-800 tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl" style={{ fontWeight: 800 }}>
                  Co říkají naši pacienti
                </h1>
                <p className="mt-3 text-base text-neutral-500 dark:text-neutral-400">
                  Skutečné zkušenosti pacientů s naší fyzioterapeutickou péčí.
                </p>

                <div className="mt-6 flex items-end gap-3">
                  <span className="text-6xl font-800 leading-none text-neutral-900 dark:text-neutral-100" style={{ fontWeight: 800 }}>
                    {avgRating.toFixed(1)}
                  </span>
                  <div className="mb-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            'h-6 w-6',
                            s <= Math.round(avgRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-200 dark:text-neutral-700',
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-neutral-400">z {totalReviews} hodnocení</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { icon: Users, value: `${totalReviews}+`, label: 'Hodnocení', color: '#3b82f6' },
                    { icon: Award, value: `${fiveStarPct}%`, label: '5 hvězdiček', color: '#f59e0b' },
                    { icon: TrendingUp, value: `${verifiedCount}`, label: 'Ověřených', color: '#22c55e' },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div
                      key={label}
                      className="rounded-xl p-3 text-center"
                      style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
                    >
                      <Icon className="mx-auto mb-1 h-4 w-4" style={{ color }} />
                      <div className="text-lg font-800 text-neutral-900 dark:text-neutral-100" style={{ fontWeight: 800, color }}>
                        {value}
                      </div>
                      <div className="text-[11px] text-neutral-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="space-y-2.5">
                  {ratingCounts.map(({ star, count, pct }) => (
                    <button
                      key={star}
                      onClick={() => setFilterRating(filterRating === star ? null : star)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-all',
                        filterRating === star
                          ? 'bg-amber-50 dark:bg-amber-900/20'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                      )}
                    >
                      <div className="flex w-6 items-center justify-center">
                        <span className={cn('text-sm font-600', filterRating === star ? 'text-amber-600' : 'text-neutral-500')} style={{ fontWeight: 600 }}>
                          {star}
                        </span>
                      </div>
                      <Star className={cn('h-4 w-4 flex-shrink-0', filterRating === star ? 'fill-amber-400 text-amber-400' : 'fill-neutral-300 text-neutral-300')} />
                      <div className="flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800" style={{ height: 8 }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: filterRating === star ? '#f59e0b' : '#3b82f6' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: (5 - star) * 0.07, ease: [0.33, 1, 0.68, 1] }}
                        />
                      </div>
                      <span className={cn('w-10 text-right text-xs font-500', filterRating === star ? 'text-amber-600' : 'text-neutral-400')} style={{ fontWeight: 500 }}>
                        {count}
                      </span>
                    </button>
                  ))}
                </div>

                <motion.button
                  onClick={() => setDialogOpen(true)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-600 text-white shadow-lg shadow-blue-200/40 transition-opacity hover:opacity-90 dark:shadow-blue-900/30"
                  style={{ fontWeight: 600 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Star className="h-4 w-4 fill-white" />
                  Napsat hodnocení
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-500">
              {filterRating !== null
                ? `Filtr: ${filterRating} hvězdičky (${filtered.length})`
                : `${sorted.length} hodnocení`}
            </span>
            {filterRating !== null && (
              <button
                onClick={() => setFilterRating(null)}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                Zrušit filtr
              </button>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {SORT_LABELS[sort]}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setShowSortMenu(false) }}
                      className={cn(
                        'w-full px-4 py-2.5 text-left text-sm transition-colors',
                        sort === key
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800',
                      )}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center dark:border-neutral-800">
            <Star className="mb-3 h-10 w-10 text-neutral-300" />
            <p className="text-neutral-500">Žádná hodnocení pro tento filtr</p>
            <button
              onClick={() => setFilterRating(null)}
              className="mt-3 text-sm text-blue-500 hover:underline"
            >
              Zobrazit vše
            </button>
          </div>
        ) : (
          <>
            <motion.div layout className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visible.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onHelpful={handleHelpful}
                    helpfulSet={helpfulSet}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {sorted.length > visibleCount && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((v) => v + 6)}
                  className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-500 text-neutral-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                  style={{ fontWeight: 500 }}
                >
                  Načíst více ({sorted.length - visibleCount} zbývajících)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <WriteReviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onReviewAdded={handleReviewAdded}
      />
    </div>
  )
}
