import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiBillLine, RiCheckLine, RiTimeLine, RiBankCardLine } from '@remixicon/react'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string
  price: number
}

interface Enrollment {
  id: string
  course_id: string
  enrolled_at: string
  completed_at: string | null
  course: Course
}

export default function BillingPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBillingData()
  }, [user])

  const loadBillingData = async () => {
    if (!user) return

    try {
      const { data: enrollmentsData } = await supabase
        .from('user_course_enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false })

      if (enrollmentsData) {
        setEnrollments(enrollmentsData as Enrollment[])
      }
    } catch (error) {
      console.error('Error loading billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = enrollments.reduce((sum, e) => sum + e.course.price, 0)
  const completedCourses = enrollments.filter(e => e.completed_at).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platby a Fakturace</h1>
        <p className="text-muted-foreground mt-2">
          Spravujte své platby a prohlížejte zakoupené kurzy
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Celkové Výdaje
              </CardTitle>
              <RiBillLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalSpent}</div>
              <p className="text-xs text-muted-foreground">
                {enrollments.length} zakoupených kurzů
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dokončené Kurzy
              </CardTitle>
              <RiCheckLine className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                z {enrollments.length} kurzů
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aktivní Kurzy
              </CardTitle>
              <RiTimeLine className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length - completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                probíhajících kurzů
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Zakoupené Kurzy</CardTitle>
            <CardDescription>
              Historie vašich nákupů a plateb
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <RiCheckLine className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{enrollment.course.title}</h3>
                          {enrollment.completed_at && (
                            <Badge variant="default" className="bg-green-600">
                              Dokončeno
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Zakoupeno: {new Date(enrollment.enrolled_at).toLocaleDateString('cs-CZ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">€{enrollment.course.price}</p>
                      <p className="text-xs text-muted-foreground">Zaplaceno</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <RiBillLine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Žádné nákupy</h3>
                <p className="text-muted-foreground mb-6">
                  Ještě jste si nezakoupili žádný kurz
                </p>
                <Button>Prohlédnout Kurzy</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Platební Metody</CardTitle>
              <CardDescription>
                Spravujte své platební metody
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <RiBankCardLine className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Kreditní Karta</p>
                    <p className="text-xs text-muted-foreground">Výchozí platební metoda</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Přidat Kartu
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Při nákupu kurzu můžete použít kartu nebo bankovní převod
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Fakturační Údaje</CardTitle>
              <CardDescription>
                Upravte své fakturační informace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="text-muted-foreground">Email pro faktury</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Upravit Fakturační Údaje
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
