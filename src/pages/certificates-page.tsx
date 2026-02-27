import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Download, BookOpen, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Certificate {
  courseId: string
  courseTitle: string
  completedAt: string
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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8 mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">Certifikaty</h1>
        <p className="text-muted-foreground mt-1">
          Vase ziskane certifikaty za dokoncene kurzy
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Celkem certifikatu</CardTitle>
              <CardDescription>Pocet dokoncenych kurzu</CardDescription>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>
      </motion.div>

      {certificates.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.courseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Award className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-semibold truncate">{cert.courseTitle}</h3>
                        {cert.completedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            Dokonceno: {new Date(cert.completedAt).toLocaleDateString('cs-CZ', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">
                          Overeno
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Stahnout
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="text-center py-16">
              <Award className="h-14 w-14 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">Zadne certifikaty</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Dokoncete kurz a ziskejte svuj prvni certifikat
              </p>
              <Button asChild>
                <Link to="/prehled/moje-kurzy">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Moje kurzy
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
