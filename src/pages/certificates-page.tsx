import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Award, BookOpen, Calendar, Download, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Certificate {
  courseId: string
  courseTitle: string
  completedAt: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
  }),
}

function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  return (
    <motion.div
      custom={index + 1}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5 transition-all hover:shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Award className="h-6 w-6 text-amber-500" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">{cert.courseTitle}</h3>

          {cert.completedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <Calendar className="h-3 w-3" />
              Dokonceno {new Date(cert.completedAt).toLocaleDateString('cs-CZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Shield className="h-3 w-3" />
              Overeno
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/50 hover:bg-muted px-2 py-0.5 rounded-full transition-colors"
            >
              <Download className="h-3 w-3" />
              PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CertificatesPage() {
  const { user } = useAuth()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadCertificates()
  }, [user])

  const loadCertificates = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('course_enrollments')
        .select('course_id, completion_date, courses!inner(id, title)')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completion_date', { ascending: false })

      const mapped: Certificate[] = (data || []).map((e: any) => ({
        courseId: e.course_id,
        courseTitle: e.courses?.title || '',
        completedAt: e.completion_date || '',
      }))

      setCertificates(mapped)
    } catch (error) {
      console.error('Error loading certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl font-bold">Certifikaty</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Vase ziskane certifikaty za dokoncene kurzy
        </p>
      </motion.div>

      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl bg-white dark:bg-neutral-900 border border-border/40 p-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Award className="h-7 w-7 text-amber-500" />
          </div>
          <div>
            <p className="text-3xl font-bold leading-tight">{certificates.length}</p>
            <p className="text-xs text-muted-foreground font-medium">
              {certificates.length === 1 ? 'Ziskany certifikat' : 'Ziskanych certifikatu'}
            </p>
          </div>
        </div>
      </motion.div>

      {certificates.length > 0 ? (
        <div className="space-y-3">
          {certificates.map((cert, i) => (
            <CertificateCard key={cert.courseId} cert={cert} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center py-16 rounded-2xl bg-white dark:bg-neutral-900 border border-border/40"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold mb-1">Zadne certifikaty</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
            Dokoncete kurz a ziskejte svuj prvni certifikat
          </p>
          <Button asChild className="rounded-full px-6">
            <Link to="/prehled/moje-kurzy">Moje kurzy</Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
