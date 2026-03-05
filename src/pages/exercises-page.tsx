import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dumbbell, Clock, ChevronRight, Search, X, Target,
  Layers, Repeat, Wrench, Lightbulb, ListOrdered,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

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
  muscles_targeted: string[]
  sets: number
  reps: string
  equipment: string
}

const CATEGORIES = [
  { value: 'vse', label: 'Vse', icon: Layers },
  { value: 'protazeni', label: 'Protazeni', icon: Target },
  { value: 'posilovani', label: 'Posilovani', icon: Dumbbell },
  { value: 'mobilita', label: 'Mobilita', icon: Repeat },
  { value: 'rehabilitace', label: 'Rehabilitace', icon: Lightbulb },
]

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; dots: number }> = {
  zacatecnik: { label: 'Zacatecnik', color: 'text-emerald-500', dots: 1 },
  pokrocily: { label: 'Pokrocily', color: 'text-amber-500', dots: 2 },
  expert: { label: 'Expert', color: 'text-red-500', dots: 3 },
}

const BODY_PART_CONFIG: Record<string, { color: string; gradient: string }> = {
  nohy: { color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
  ramena: { color: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600' },
  zada: { color: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
  trup: { color: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600' },
  hyzde: { color: 'bg-rose-400', gradient: 'from-rose-400 to-rose-500' },
  kycle: { color: 'bg-teal-500', gradient: 'from-teal-500 to-teal-600' },
}

const CATEGORY_LABELS: Record<string, string> = {
  protazeni: 'Protazeni',
  posilovani: 'Posilovani',
  mobilita: 'Mobilita',
  rehabilitace: 'Rehabilitace',
}

function DifficultyDots({ difficulty }: { difficulty: string }) {
  const config = DIFFICULTY_CONFIG[difficulty] || { label: difficulty, color: 'text-neutral-400', dots: 1 }
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3].map((d) => (
          <div
            key={d}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              d <= config.dots ? config.color.replace('text-', 'bg-') : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          />
        ))}
      </div>
      <span className={`text-[10px] font-medium ${config.color}`}>{config.label}</span>
    </div>
  )
}

function ExerciseDetail({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const bodyConfig = BODY_PART_CONFIG[exercise.body_part] || { color: 'bg-neutral-500', gradient: 'from-neutral-500 to-neutral-600' }

  const staggerItem = {
    hidden: { opacity: 0, y: 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, delay: 0.15 + i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
    }),
  }

  const instructionSteps = exercise.instructions
    ? exercise.instructions.split('. ').filter(Boolean).map(s => s.endsWith('.') ? s : `${s}.`)
    : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto overscroll-contain"
      >
        <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto mt-2.5 sm:hidden" />

        {exercise.image_url ? (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative h-48 sm:h-56 overflow-hidden sm:rounded-t-2xl"
          >
            <img
              src={exercise.image_url}
              alt={exercise.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="text-xl font-bold text-white"
              >
                {exercise.title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="flex items-center gap-2 mt-1"
              >
                <span className="text-[11px] font-medium text-white/80 capitalize">{exercise.body_part}</span>
                <span className="text-white/40">|</span>
                <span className="text-[11px] font-medium text-white/80 capitalize">{CATEGORY_LABELS[exercise.category] || exercise.category}</span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="p-5 pb-0 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bodyConfig.gradient} flex items-center justify-center`}>
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{exercise.title}</h2>
                <span className="text-xs text-muted-foreground capitalize">{exercise.body_part}</span>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="p-5 space-y-4">
          <motion.div
            custom={0}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-2"
          >
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-bold">{exercise.sets}</p>
              <p className="text-[10px] text-muted-foreground">Serie</p>
            </div>
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Repeat className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-bold">{exercise.reps || '-'}</p>
              <p className="text-[10px] text-muted-foreground">Opakovani</p>
            </div>
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-bold">{exercise.duration_seconds}s</p>
              <p className="text-[10px] text-muted-foreground">Doba</p>
            </div>
          </motion.div>

          <motion.div custom={1} variants={staggerItem} initial="hidden" animate="visible" className="flex items-center justify-between">
            <DifficultyDots difficulty={exercise.difficulty} />
            {exercise.equipment && exercise.equipment !== 'zadne' && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Wrench className="h-3 w-3" />
                {exercise.equipment}
              </span>
            )}
            {exercise.equipment === 'zadne' && (
              <span className="text-[11px] text-emerald-600 font-medium">Bez vybaveni</span>
            )}
          </motion.div>

          <motion.div custom={2} variants={staggerItem} initial="hidden" animate="visible">
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
          </motion.div>

          {exercise.muscles_targeted?.length > 0 && (
            <motion.div custom={3} variants={staggerItem} initial="hidden" animate="visible">
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Cilove svaly</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exercise.muscles_targeted.map((muscle) => (
                  <span
                    key={muscle}
                    className="text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground px-2.5 py-1 rounded-lg"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {instructionSteps.length > 0 && (
            <motion.div custom={4} variants={staggerItem} initial="hidden" animate="visible">
              <div className="flex items-center gap-1.5 mb-2.5">
                <ListOrdered className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Postup</p>
              </div>
              <div className="space-y-2">
                {instructionSteps.map((step, i) => (
                  <motion.div
                    key={`step-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                    className="flex gap-3"
                  >
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${bodyConfig.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed flex-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {exercise.tips && (
            <motion.div custom={5} variants={staggerItem} initial="hidden" animate="visible">
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Tipy</p>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{exercise.tips}</p>
              </div>
            </motion.div>
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
      const q = search.toLowerCase()
      const matchSearch = !search || ex.title.toLowerCase().includes(q) || ex.body_part.toLowerCase().includes(q) || ex.category.toLowerCase().includes(q)
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { vse: exercises.length }
    for (const ex of exercises) {
      counts[ex.category] = (counts[ex.category] || 0) + 1
    }
    return counts
  }, [exercises])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent"
        />
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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hledat podle nazvu, svalu, casti tela..."
          className="pl-10 pr-10 h-11 rounded-xl bg-white dark:bg-neutral-900 border-border/40"
        />
        <AnimatePresence>
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.value
          return (
            <motion.button
              key={cat.value}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              whileTap={{ scale: 0.95 }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-white dark:bg-neutral-900 border border-border/40 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
              <span className={`text-[10px] font-bold ml-0.5 ${isActive ? 'opacity-60' : 'opacity-40'}`}>
                {categoryCounts[cat.value] || 0}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="grid grid-cols-3 gap-2.5"
      >
        {[
          { label: 'Cviceni', value: filtered.length, icon: Dumbbell, color: 'bg-blue-500' },
          { label: 'Casti tela', value: groupedByBodyPart.size, icon: Target, color: 'bg-emerald-500' },
          { label: 'Prumer cas', value: filtered.length > 0 ? `${Math.round(filtered.reduce((a, b) => a + b.duration_seconds, 0) / filtered.length)}s` : '0s', icon: Clock, color: 'bg-amber-500' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-3 text-center">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-lg font-bold leading-tight">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
            </div>
          )
        })}
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-5"
        >
          {Array.from(groupedByBodyPart.entries()).map(([bodyPart, exList], gi) => {
            const bpConfig = BODY_PART_CONFIG[bodyPart] || { color: 'bg-neutral-500', gradient: 'from-neutral-500 to-neutral-600' }
            return (
              <motion.div
                key={bodyPart}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + gi * 0.06, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className={`w-5 h-5 rounded-md ${bpConfig.color} flex items-center justify-center`}>
                    <span className="text-[9px] font-bold text-white uppercase">{bodyPart.slice(0, 2)}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider capitalize flex-1">{bodyPart}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{exList.length} cviku</span>
                </div>
                <div className="space-y-2">
                  {exList.map((exercise, i) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22 + gi * 0.06 + i * 0.04, duration: 0.35 }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedExercise(exercise)}
                        className="group w-full flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-2.5 transition-all active:scale-[0.98] hover:shadow-md hover:border-border text-left"
                      >
                        {exercise.image_url ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={exercise.image_url}
                              alt={exercise.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${bpConfig.gradient} flex items-center justify-center shrink-0`}>
                            <Dumbbell className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="text-sm font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{exercise.title}</h3>
                          <DifficultyDots difficulty={exercise.difficulty} />
                          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Layers className="h-3 w-3" />
                              {exercise.sets}x{exercise.reps || '-'}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Clock className="h-3 w-3" />
                              {exercise.duration_seconds}s
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="text-center py-16 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4"
          >
            <Dumbbell className="h-8 w-8 text-muted-foreground/40" />
          </motion.div>
          <h3 className="text-base font-semibold mb-1">Zadne vysledky</h3>
          <p className="text-sm text-muted-foreground mb-5">Zkuste jiny hledany vyraz nebo kategorii</p>
          <Button onClick={() => { setSearch(''); setActiveCategory('vse') }} variant="outline" className="rounded-xl">
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
