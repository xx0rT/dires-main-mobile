import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Award,
  MapPin,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'

interface TeamMember {
  id: string
  name: string
  role: string
  slug: string
  description: string
  specializations: string[]
  experience_years: number
  avatar_url: string
  hourly_rate: number
  location: string
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

function TeamMemberCard({ member, idx }: { member: TeamMember; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.33, 1, 0.68, 1] as const }}
    >
      <Link
        to={`/tym/${member.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/50 bg-white transition-all duration-500 hover:border-neutral-300/80 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] dark:border-neutral-800/60 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={member.avatar_url}
            alt={member.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80 group-hover:via-black/30" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-500 group-hover:scale-100 scale-75">
              <ArrowUpRight className="size-5 text-white" />
            </div>
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white/25">
              {member.role}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-1">
              {member.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <Award className="size-3" />
                {member.experience_years} let
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {member.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {member.description}
          </p>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {member.specializations.slice(0, 2).map((spec) => (
              <Badge
                key={spec}
                variant="outline"
                className="rounded-full border-neutral-200 bg-neutral-50 text-[10px] font-normal text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {spec}
              </Badge>
            ))}
            {member.specializations.length > 2 && (
              <Badge
                variant="outline"
                className="rounded-full border-neutral-200 bg-neutral-50 text-[10px] font-normal text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              >
                +{member.specializations.length - 2}
              </Badge>
            )}
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCZK(member.hourly_rate)}
                </span>
                <span className="text-[11px] text-neutral-400">/ hod</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                <span className="relative">
                  Zobrazit
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-neutral-900 transition-all duration-300 group-hover:w-full dark:bg-neutral-100" />
                </span>
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from('team_members')
        .select('id, name, role, slug, description, specializations, experience_years, avatar_url, hourly_rate, location')
        .eq('is_active', true)
        .order('order_index')
      setMembers(data ?? [])
      setLoading(false)
    }
    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-muted/40 px-6 py-16 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary/8 blur-[80px]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center"
          >
            <Badge variant="outline" className="mb-4">Nas tym</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl lg:text-5xl">
              Nasi odbornici
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
              Tym certifikovanych fyzioterapeutu s letitymi zkusenostmi.
              Vyberte si sveho specialistu a objednejte se na konzultaci.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, idx) => (
            <TeamMemberCard key={member.id} member={member} idx={idx} />
          ))}
        </div>

        {members.length === 0 && (
          <div className="py-20 text-center text-neutral-500">
            Zatim nejsou zadni clenove tymu.
          </div>
        )}
      </div>
    </div>
  )
}
