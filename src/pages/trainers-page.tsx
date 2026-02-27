import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Award, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Trainer {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  trainer_role: string | null
  trainer_specializations: string[]
  location: string | null
  last_seen_at: string | null
}

function isOnline(lastSeen: string | null): boolean {
  if (!lastSeen) return false
  const diff = Date.now() - new Date(lastSeen).getTime()
  return diff < 5 * 60 * 1000
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return email[0]?.toUpperCase() || 'T'
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, bio, trainer_role, trainer_specializations, location, last_seen_at')
      .eq('is_trainer', true)
      .order('full_name')

    setTrainers(data ?? [])
    setLoading(false)
  }

  const online = trainers.filter(t => isOnline(t.last_seen_at))
  const offline = trainers.filter(t => !isOnline(t.last_seen_at))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold">Treneri</h1>
        <p className="text-muted-foreground mt-1">Nasi profesionalni treneri pro vasi cestu</p>
      </div>

      {trainers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Award className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-1">Zatim zadni treneri</h2>
          <p className="text-sm text-muted-foreground">Treneri budou brzy k dispozici</p>
        </motion.div>
      ) : (
        <>
          {online.length > 0 && (
            <TrainerSection label="Online" trainers={online} startDelay={0} />
          )}
          <TrainerSection
            label={online.length > 0 ? 'Offline' : 'Vsichni treneri'}
            trainers={offline.length > 0 ? offline : (online.length > 0 ? [] : trainers)}
            startDelay={online.length * 0.05}
          />
        </>
      )}
    </div>
  )
}

function TrainerSection({ label, trainers, startDelay }: { label: string; trainers: Trainer[]; startDelay: number }) {
  if (trainers.length === 0) return null

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-[11px] text-muted-foreground/60">({trainers.length})</span>
      </div>
      <div className="space-y-2">
        {trainers.map((trainer, i) => (
          <TrainerCard key={trainer.id} trainer={trainer} index={i} delay={startDelay + i * 0.05} />
        ))}
      </div>
    </div>
  )
}

function TrainerCard({ trainer, delay }: { trainer: Trainer; index: number; delay: number }) {
  const online = isOnline(trainer.last_seen_at)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link
        to={`/prehled/treneri/${trainer.id}`}
        className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-muted/25 border border-border/25 hover:bg-muted/50 active:bg-muted/60 transition-colors"
      >
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={trainer.avatar_url || undefined} alt={trainer.full_name || ''} />
            <AvatarFallback className="text-sm font-medium bg-neutral-200 dark:bg-neutral-700">
              {getInitials(trainer.full_name, trainer.email)}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background ${online ? 'bg-green-500' : 'bg-neutral-400'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">
              {trainer.full_name || trainer.email.split('@')[0]}
            </h3>
            {online && (
              <span className="text-[10px] font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md flex-shrink-0">
                Online
              </span>
            )}
          </div>

          {trainer.trainer_role && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{trainer.trainer_role}</p>
          )}

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {trainer.location && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground/70">
                <MapPin className="h-3 w-3" />
                {trainer.location}
              </span>
            )}
            {trainer.trainer_specializations?.slice(0, 2).map((spec) => (
              <Badge key={spec} variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                {spec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to={`/prehled/zpravy?trainer=${trainer.id}`}>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
        </div>
      </Link>
    </motion.div>
  )
}
