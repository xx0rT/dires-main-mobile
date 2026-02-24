import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onClose: () => void
  onReviewAdded: (review: ReviewRecord) => void
}

export interface ReviewRecord {
  id: string
  author_name: string
  rating: number
  title: string
  content: string
  service_type: string | null
  verified: boolean
  helpful_count: number
  approved: boolean
  created_at: string
}

const SERVICE_TYPES = [
  'Terapie zad',
  'Rehabilitace kolene',
  'Terapie krční páteře',
  'Sportovní rehabilitace',
  'Terapie ramene',
  'Poporodní rehabilitace',
  'Geriatrická fyzioterapie',
  'Poúrazová rehabilitace',
  'Sportovní masáž',
  'Jiná terapie',
]

export function WriteReviewDialog({ open, onClose, onReviewAdded }: Props) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    author_name: '',
    rating: 0,
    title: '',
    content: '',
    service_type: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.author_name.trim()) e.author_name = 'Zadejte své jméno'
    if (form.rating === 0) e.rating = 'Vyberte hodnocení'
    if (!form.title.trim()) e.title = 'Zadejte nadpis'
    if (form.content.trim().length < 20) e.content = 'Napište alespoň 20 znaků'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = {
        author_name: form.author_name.trim(),
        rating: form.rating,
        title: form.title.trim(),
        content: form.content.trim(),
        service_type: form.service_type || null,
        verified: false,
        helpful_count: 0,
        approved: true,
      }

      const { data, error } = await supabase.from('reviews').insert(payload).select().maybeSingle()

      if (error) throw error

      const newReview: ReviewRecord = data ?? {
        id: crypto.randomUUID(),
        ...payload,
        created_at: new Date().toISOString(),
      }

      onReviewAdded(newReview)
      setStep('success')
    } catch {
      toast.error('Nepodařilo se uložit hodnocení. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('form')
      setForm({ author_name: '', rating: 0, title: '', content: '', service_type: '' })
      setErrors({})
      setHoverRating(0)
    }, 300)
  }

  const displayRating = hoverRating || form.rating

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>

              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Napsat hodnocení
                      </h2>
                      <p className="mt-1 text-sm text-neutral-500">
                        Podělte se o svou zkušenost s ostatními pacienty
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-500 text-neutral-700 dark:text-neutral-300" style={{ fontWeight: 500 }}>
                          Vaše jméno <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.author_name}
                          onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                          placeholder="Jan Novák"
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-blue-900/30 ${errors.author_name ? 'border-red-300' : 'border-neutral-200 dark:border-neutral-700'}`}
                        />
                        {errors.author_name && <p className="mt-1 text-xs text-red-500">{errors.author_name}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-500 text-neutral-700 dark:text-neutral-300" style={{ fontWeight: 500 }}>
                          Hodnocení <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setForm((f) => ({ ...f, rating: star }))}
                            >
                              <Star
                                className={`h-8 w-8 transition-colors ${
                                  displayRating >= star
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-neutral-300 dark:text-neutral-600'
                                }`}
                              />
                            </motion.button>
                          ))}
                          {displayRating > 0 && (
                            <span className="ml-2 text-sm font-500 text-neutral-600 dark:text-neutral-400" style={{ fontWeight: 500 }}>
                              {['', 'Špatné', 'Ušlo', 'Dobré', 'Skvělé', 'Výborné'][displayRating]}
                            </span>
                          )}
                        </div>
                        {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-500 text-neutral-700 dark:text-neutral-300" style={{ fontWeight: 500 }}>
                          Typ terapie
                        </label>
                        <select
                          value={form.service_type}
                          onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
                          className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-blue-900/30"
                        >
                          <option value="">Vyberte terapii (volitelné)</option>
                          {SERVICE_TYPES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-500 text-neutral-700 dark:text-neutral-300" style={{ fontWeight: 500 }}>
                          Nadpis hodnocení <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Shrňte svou zkušenost v jedné větě"
                          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-blue-900/30 ${errors.title ? 'border-red-300' : 'border-neutral-200 dark:border-neutral-700'}`}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-500 text-neutral-700 dark:text-neutral-300" style={{ fontWeight: 500 }}>
                          Vaše hodnocení <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={form.content}
                          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                          placeholder="Popište svou zkušenost podrobněji..."
                          rows={4}
                          className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:ring-blue-900/30 ${errors.content ? 'border-red-300' : 'border-neutral-200 dark:border-neutral-700'}`}
                        />
                        <div className="mt-1 flex items-center justify-between">
                          {errors.content ? (
                            <p className="text-xs text-red-500">{errors.content}</p>
                          ) : (
                            <span />
                          )}
                          <span className="text-xs text-neutral-400">{form.content.length} znaků</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleClose}
                        className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-500 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        style={{ fontWeight: 500 }}
                      >
                        Zrušit
                      </button>
                      <motion.button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-600 text-white transition-opacity disabled:opacity-60"
                        style={{ fontWeight: 600 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {submitting ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {submitting ? 'Odesílám...' : 'Odeslat hodnocení'}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </motion.div>
                    <h2 className="mt-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      Děkujeme za hodnocení!
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Vaše zkušenost pomáhá ostatním pacientům. Hodnocení bylo úspěšně přidáno.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-600 text-white transition-opacity hover:opacity-90"
                      style={{ fontWeight: 600 }}
                    >
                      Zavřít
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
