import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RiBillLine, RiCheckLine, RiTimeLine, RiBankCardLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { OrderHistory } from '@/components/dashboard/order-history'
import { supabase } from '@/lib/supabase'

interface Purchase {
  id: string
  course_id: string
  amount_paid: number
  purchased_at: string
  stripe_payment_intent_id: string | null
  course_title: string
  completed: boolean
}

export default function BillingPage() {
  const { user } = useAuth()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadBillingData()
  }, [user])

  const loadBillingData = async () => {
    if (!user) return

    try {
      const { data: purchaseRows } = await supabase
        .from('course_purchases')
        .select('id, course_id, amount_paid, purchased_at, stripe_payment_intent_id, courses(title)')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false })

      const { data: enrollmentRows } = await supabase
        .from('course_enrollments')
        .select('course_id, completed')
        .eq('user_id', user.id)

      const completedMap = new Map(
        (enrollmentRows || []).map(e => [e.course_id, e.completed])
      )

      const mapped: Purchase[] = (purchaseRows || []).map((p: Record<string, unknown>) => {
        const courses = p.courses as { title: string } | null
        return {
          id: p.id as string,
          course_id: p.course_id as string,
          amount_paid: p.amount_paid as number,
          purchased_at: p.purchased_at as string,
          stripe_payment_intent_id: p.stripe_payment_intent_id as string | null,
          course_title: courses?.title || 'Neznamy kurz',
          completed: completedMap.get(p.course_id as string) || false,
        }
      })

      setPurchases(mapped)
    } catch (error) {
      console.error('Error loading billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount_paid, 0)
  const completedCourses = purchases.filter(p => p.completed).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="hidden md:block">
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
              <div className="text-2xl font-bold">{new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                {purchases.length} zakoupených kurzů
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
                z {purchases.length} kurzů
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
              <div className="text-2xl font-bold">{purchases.length - completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                probíhajících kurzů
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Kurzy</TabsTrigger>
          <TabsTrigger value="orders">Objednávky</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
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
                {purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <RiCheckLine className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{purchase.course_title}</h3>
                              {purchase.completed && (
                                <Badge variant="default" className="bg-green-600">
                                  Dokonceno
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Zakoupeno: {new Date(purchase.purchased_at).toLocaleDateString('cs-CZ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(purchase.amount_paid)}</p>
                          <p className="text-xs text-muted-foreground">Zaplaceno</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <RiBillLine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Zadne nakupy</h3>
                    <p className="text-muted-foreground mb-6">
                      Jeste jste si nezakoupili zadny kurz
                    </p>
                    <Button>Prohlednout Kurzy</Button>
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
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory className="py-0" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
