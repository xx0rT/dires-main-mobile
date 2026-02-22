import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Star,
  Users,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { toast } from 'sonner'

interface TeamMember {
  id: string
  name: string
  role: string
  slug: string
  description: string
  bio: string
  specializations: string[]
  experience_years: number
  avatar_url: string
  hourly_rate: number
  email: string
  phone: string
  location: string
  certifications: string[]
  education: string[]
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

function StatItem({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Award }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-3 rounded-2xl border border-neutral-200/60 bg-white/80 px-5 py-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/80"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <Icon className="size-4.5 text-neutral-600 dark:text-neutral-400" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none text-neutral-900 dark:text-neutral-100">{value}</p>
        <p className="mt-1 text-xs text-neutral-500">{label}</p>
      </div>
    </motion.div>
  )
}

function SpecBadge({ label, index }: { label: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.3 + index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="inline-flex cursor-default items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-teal-800 dark:hover:bg-teal-950 dark:hover:text-teal-300"
    >
      {label}
    </motion.span>
  )
}

function CertCard({ text, index, icon: Icon, accent }: { text: string; index: number; icon: typeof Award; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.4 + index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ x: 4 }}
      className="group flex items-start gap-3.5 rounded-xl border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="size-4" />
      </div>
      <span className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{text}</span>
    </motion.div>
  )
}

export default function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>()
  const [member, setMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.75])

  useEffect(() => {
    const fetchMember = async () => {
      if (!slug) return
      const { data } = await supabase
        .from('team_members')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle()
      setMember(data)
      setLoading(false)
    }
    fetchMember()
  }, [slug])

  const handleSendMessage = async () => {
    if (!contactName || !contactEmail || !contactMessage) {
      toast.error('Vyplnte prosim vsechna pole')
      return
    }
    setSending(true)
    const mailtoLink = `mailto:${member?.email}?subject=Dotaz od ${encodeURIComponent(contactName)}&body=${encodeURIComponent(contactMessage)}%0A%0AOdpovedet na: ${encodeURIComponent(contactEmail)}`
    window.location.href = mailtoLink
    setTimeout(() => {
      toast.success('Email klient byl otevren')
      setSending(false)
    }, 500)
  }

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100"
        />
      </div>
    )
  }

  if (!member) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[500px] flex-col items-center justify-center gap-4"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <Users className="size-7 text-neutral-400" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Clen tymu nenalezen
        </h2>
        <p className="text-sm text-neutral-500">
          Tento profil neexistuje nebo byl odstranen.
        </p>
        <Button asChild variant="outline" className="mt-2 rounded-xl">
          <Link to="/tym">
            <ArrowLeft className="mr-2 size-4" />
            Zpet na tym
          </Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="pb-24">
      <div ref={heroRef} className="relative h-[420px] overflow-hidden sm:h-[480px] lg:h-[540px]">
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <img
            src={member.avatar_url}
            alt={member.name}
            className="h-[130%] w-full object-cover"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10"
          style={{ opacity: heroOverlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

        <div className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Breadcrumb>
                <BreadcrumbList className="text-xs sm:text-sm">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to="/"
                        className="flex items-center gap-1.5 text-white/50 transition-colors hover:text-white/90"
                      >
                        <Home className="size-3.5" />
                        <span className="hidden sm:inline">Domov</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="size-3.5 text-white/30" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to="/tym"
                        className="text-white/50 transition-colors hover:text-white/90"
                      >
                        Tym
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="size-3.5 text-white/30" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-white/90">
                      {member.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="border-0 bg-white/10 text-white/90 backdrop-blur-md text-xs font-medium px-3 py-1">
                  {member.role}
                </Badge>
                <Badge className="border-0 bg-emerald-500/15 text-emerald-200 backdrop-blur-md text-xs font-medium px-3 py-1">
                  <CheckCircle2 className="mr-1.5 size-3" />
                  Overeny odbornik
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {member.name}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                {member.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="-mt-10 relative z-20 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          <StatItem
            value={`${member.experience_years} let`}
            label="Zkusenosti"
            icon={Award}
          />
          <StatItem
            value={`${member.specializations.length}`}
            label="Specializaci"
            icon={ShieldCheck}
          />
          <StatItem
            value={formatCZK(member.hourly_rate)}
            label="Za hodinu"
            icon={Clock}
          />
          <StatItem
            value="4.9"
            label="Hodnoceni"
            icon={Star}
          />
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="space-y-10">
            <motion.section
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <Users className="size-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  O mne
                </h2>
              </div>
              <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-base leading-[1.85] text-neutral-600 dark:text-neutral-400">
                  {member.bio}
                </p>
              </div>
            </motion.section>

            <motion.section
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30">
                  <Sparkles className="size-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Specializace
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {member.specializations.map((spec, i) => (
                  <SpecBadge key={spec} label={spec} index={i} />
                ))}
              </div>
            </motion.section>

            {member.certifications.length > 0 && (
              <motion.section
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Award className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Certifikace
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {member.certifications.map((cert, i) => (
                    <CertCard
                      key={cert}
                      text={cert}
                      index={i}
                      icon={ShieldCheck}
                      accent="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {member.education.length > 0 && (
              <motion.section
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <GraduationCap className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Vzdelani
                  </h2>
                </div>
                <div className="space-y-3">
                  {member.education.map((edu, i) => (
                    <CertCard
                      key={edu}
                      text={edu}
                      index={i}
                      icon={BookOpen}
                      accent="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="border-b border-neutral-100 bg-gradient-to-br from-teal-50 to-cyan-50/30 px-6 py-5 dark:border-neutral-800 dark:from-teal-950/20 dark:to-cyan-950/10">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/40">
                    <Clock className="size-4.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      Cena konzultace
                    </h3>
                    <p className="text-xs text-neutral-500">Individualni pristup</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {formatCZK(member.hourly_rate)}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">za 1 hodinu</p>
                </div>

                <div className="my-5 h-px bg-neutral-100 dark:bg-neutral-800" />

                <ul className="space-y-3">
                  {['Individualni pristup', 'Diagnostika zahrnuta', 'Cvicebni plan na miru'].map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.35 }}
                      className="flex items-center gap-2.5 text-sm text-neutral-600 dark:text-neutral-400"
                    >
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="mb-4 flex items-center gap-3 font-semibold text-neutral-900 dark:text-neutral-100">
                <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <Mail className="size-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                Kontakt
              </h3>
              <div className="space-y-2.5">
                <a
                  href={`mailto:${member.email}`}
                  className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm transition-all hover:border-teal-200 hover:bg-teal-50/50 dark:border-neutral-800 dark:bg-neutral-800/30 dark:hover:border-teal-900 dark:hover:bg-teal-950/20"
                >
                  <Mail className="size-4 text-neutral-400 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">{member.email}</span>
                </a>
                <a
                  href={`tel:${member.phone}`}
                  className="group flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-800/30 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
                >
                  <Phone className="size-4 text-neutral-400 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">{member.phone}</span>
                </a>
                <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3.5 text-sm dark:border-neutral-800 dark:bg-neutral-800/30">
                  <MapPin className="size-4 text-neutral-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">{member.location}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="mb-4 flex items-center gap-3 font-semibold text-neutral-900 dark:text-neutral-100">
                <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <Send className="size-4 text-neutral-600 dark:text-neutral-400" />
                </div>
                Napiste mi
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-neutral-500">Vase jmeno</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jan Novak"
                    className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-neutral-500">Vas email</Label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jan@email.cz"
                    className="mt-1.5 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-neutral-500">Zprava</Label>
                  <Textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Rad bych se objednal na konzultaci..."
                    rows={4}
                    className="mt-1.5 resize-none rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
                  />
                </div>
                <Button
                  className="mt-1 w-full rounded-xl"
                  onClick={handleSendMessage}
                  disabled={sending || !contactName || !contactEmail || !contactMessage}
                >
                  <Send className="mr-2 size-4" />
                  {sending ? 'Oteviram...' : 'Odeslat zpravu'}
                </Button>
                <p className="text-center text-[11px] text-neutral-400">
                  Zprava bude odeslana na {member.email}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
