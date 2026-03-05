import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Dumbbell, Clock, ChevronRight, Search, X, Play, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'

interface Exercise {
  id: string
  title: string
  description: string
  body_part: string
  difficulty: string
  image_url: string
  video_url: string
  instructions: string
  tips: string
  category: string
  duration_seconds: number
}

const CATEGORIES = [
  { value: 'vse', label: 'Vse' },
  { value: 'protazeni', label: 'Protazeni' },
  { value: 'posilovani', label: 'Posilovani' },
  { value: 'mobilita', label: 'Mobilita' },
  { value: 'rehabilitace', label: 'Rehabilitace' },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  zacatecnik: 'text-emerald-600 bg-emerald-500/10',
  pokrocily: 'text-amber-600 bg-amber-500/10',
  expert: 'text-red-600 bg-red-500/10',
}

const DIFFICULTY_LABELS: Record<string, string> = {
  zacatecnik: 'Zacatecnik',
  pokrocily: 'Pokrocily',
  expert: 'Expert',
}

const BODY_PART_COLORS: Record<string, string> = {
  nohy: 'bg-blue-500',
  ramena: 'bg-cyan-500',
  zada: 'bg-emerald-500',
  trup: 'bg-amber-500',
  hyzde: 'bg-rose-400',
  kycle: 'bg-teal-500',
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

function ExerciseDetail({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || 'text-neutral-500 bg-neutral-500/10'
  const diffLabel = DIFFICULTY_LABELS[exercise.difficulty] || exercise.difficulty
  const bodyColor = BODY_PART_COLORS[exercise.body_part] || 'bg-neutral-500'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="p-5 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${bodyColor} flex items-center justify-center shrink-0`}>
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{exercise.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
                    {diffLabel}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{exercise.body_part}</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {exercise.duration_seconds}s
            </span>
            <span className="capitalize">{exercise.category}</span>
          </div>

          {exercise.instructions && (
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Postup</p>
              <p className="text-sm leading-relaxed">{exercise.instructions}</p>
            </div>
          )}

          {exercise.tips && (
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 p-4">
              <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Tipy
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{exercise.tips}</p>
            </div>
          )}

          {exercise.video_url && (
            <Button className="w-full rounded-xl h-11">
              <Play className="mr-2 h-4 w-4" />
              Prehrat video
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ExercisesPage() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('vse')
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    if (user) loadExercises()
  }, [user])

  const loadExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('body_part')
        .order('title')

      if (error) throw error
      setExercises(data || [])
    } catch (err) {
      console.error('Error loading exercises:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const matchSearch = !search || ex.title.toLowerCase().includes(search.toLowerCase()) || ex.body_part.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'vse' || ex.category === activeCategory
      return matchSearch && matchCategory
    })
  }, [exercises, search, activeCategory])

  const groupedByBodyPart = useMemo(() => {
    const groups = new Map<string, Exercise[]>()
    for (const ex of filtered) {
      const list = groups.get(ex.body_part) || []
      list.push(ex)
      groups.set(ex.body_part, list)
    }
    return groups
  }, [filtered])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-5 mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl font-bold">Knihovna cviceni</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Prohlidnete si cviky s popisy a navody
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat cviceni..."
          className="pl-10 h-11 rounded-xl"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat.value
                ? 'bg-foreground text-background'
                : 'bg-white dark:bg-neutral-900 border border-border/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-tight">{filtered.length}</p>
          <p className="text-[11px] text-muted-foreground font-medium">
            {filtered.length === exercises.length ? 'Celkem cviceni' : `z ${exercises.length} cviceni`}
          </p>
        </div>
      </motion.div>

      {filtered.length > 0 ? (
        <div className="space-y-5">
          {Array.from(groupedByBodyPart.entries()).map(([bodyPart, exList], gi) => (
            <div key={bodyPart}>
              <motion.div
                custom={gi}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-between mb-2"
              >
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider capitalize">{bodyPart}</span>
                <span className="text-[11px] text-muted-foreground">{exList.length}</span>
              </motion.div>
              <div className="space-y-2">
                {exList.map((exercise, i) => {
                  const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || 'text-neutral-500 bg-neutral-500/10'
                  const diffLabel = DIFFICULTY_LABELS[exercise.difficulty] || exercise.difficulty
                  const bodyColor = BODY_PART_COLORS[exercise.body_part] || 'bg-neutral-500'

                  return (
                    <motion.div
                      key={exercise.id}
                      custom={gi + i + 1}
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedExercise(exercise)}
                        className="w-full flex items-center gap-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-3.5 transition-all active:scale-[0.98] hover:shadow-sm text-left"
                      >
                        <div className={`w-10 h-10 rounded-xl ${bodyColor} flex items-center justify-center shrink-0`}>
                          <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold truncate">{exercise.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diffColor}`}>
                              {diffLabel}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {exercise.duration_seconds}s
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold mb-1">Zadne vysledky</h3>
          <p className="text-sm text-muted-foreground mb-5">Zkuste jiny hledany vyraz</p>
          <Button onClick={() => { setSearch(''); setActiveCategory('vse') }} variant="outline" className="rounded-full">
            Vymazat filtry
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetail exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
