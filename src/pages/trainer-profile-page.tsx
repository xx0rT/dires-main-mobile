import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, MapPin, Award, Clock, Mail, Globe, Building2, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { usePresence } from '@/lib/presence-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface TrainerProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  trainer_role: string | null
  trainer_specializations: string[]
  location: string | null
  phone: string | null
  company: string | null
  website: string | null
  last_seen_at: string | null
  created_at: string | null
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

export default function TrainerProfilePage() {
  const { trainerId } = useParams<{ trainerId: string }>()
  const { user } = useAuth()
  const { isUserOnline } = usePresence()
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (trainerId) fetchTrainer()
  }, [trainerId])

  const fetchTrainer = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, bio, trainer_role, trainer_specializations, location, phone, company, website, last_seen_at, created_at')
      .eq('id', trainerId!)
      .eq('is_trainer', true)
      .maybeSingle()

    setTrainer(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!trainer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold mb-2">Trener nenalezen</h2>
        <Button asChild variant="outline">
          <Link to="/prehled/treneri">Zpet na trenery</Link>
        </Button>
      </div>
    )
  }

  const online = isUserOnline(trainer.id)
  const isSelf = user?.id === trainer.id
  const initials = trainer.full_name
    ? trainer.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : trainer.email[0]?.toUpperCase() || 'T'

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        to="/prehled/treneri"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Zpet na trenery
      </Link>

      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative shrink-0">
            {trainer.avatar_url ? (
              <img
                src={trainer.avatar_url}
                alt={trainer.full_name || ''}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
            <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white dark:border-neutral-900 ${online ? 'bg-green-500' : 'bg-neutral-400'}`} />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-bold truncate">
                {trainer.full_name || trainer.email.split('@')[0]}
              </h1>
              {online && (
                <span className="shrink-0 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Online
                </span>
              )}
            </div>

            {trainer.trainer_role && (
              <p className="text-sm text-muted-foreground mt-0.5">{trainer.trainer_role}</p>
            )}

            <div className="flex items-center gap-3 mt-2.5 justify-center sm:justify-start flex-wrap">
              {trainer.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {trainer.location}
                </span>
              )}
              {trainer.created_at && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Clen od {new Date(trainer.created_at).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        {!isSelf && (
          <div className="flex gap-2 mt-5">
            <Button asChild className="flex-1 rounded-xl">
              <Link to={`/prehled/zpravy?trainer=${trainer.id}`}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Napsat zpravu
              </Link>
            </Button>
            {trainer.email && (
              <Button variant="outline" className="rounded-xl" asChild>
                <a href={`mailto:${trainer.email}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {trainer.bio && (
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
        >
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">O trenerovi</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{trainer.bio}</p>
        </motion.div>
      )}

      {(trainer.company || trainer.website || trainer.phone) && (
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
        >
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Kontaktni udaje</p>
          <div className="space-y-2.5">
            {trainer.company && (
              <div className="flex items-center gap-2.5 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{trainer.company}</span>
              </div>
            )}
            {trainer.website && (
              <div className="flex items-center gap-2.5 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={trainer.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                  {trainer.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {trainer.phone && (
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`tel:${trainer.phone}`} className="text-blue-500 hover:underline">
                  {trainer.phone}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {trainer.trainer_specializations?.length > 0 && (
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
        >
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            Specializace
          </p>
          <div className="flex flex-wrap gap-2">
            {trainer.trainer_specializations.map((spec) => (
              <Badge key={spec} variant="outline" className="rounded-lg px-3 py-1 text-xs">
                {spec}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
