import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatedPage, StaggerGrid, StaggerItem, HoverCard } from '@/components/admin/admin-motion'

interface Profile {
  id: string
  email: string
  full_name: string | null
}

interface CourseInfo {
  id: string
  title: string
}

interface CoursePurchase {
  id: string
  user_id: string
  course_id: string
  amount_paid: number
  purchased_at: string
  stripe_payment_intent_id: string | null
}

interface Order {
  id: string
  user_id: string
  status: string
  total: number
  stripe_payment_intent_id: string | null
  created_at: string
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

export default function AdminInvoicesPage() {
  const [purchases, setPurchases] = useState<CoursePurchase[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [coursesList, setCoursesList] = useState<CourseInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('purchases')

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: purchasesData }, { data: ordersData }, { data: profilesData }, { data: coursesData }] = await Promise.all([
        supabase
          .from('course_purchases')
          .select('id, user_id, course_id, amount_paid, purchased_at, stripe_payment_intent_id')
          .order('purchased_at', { ascending: false }),
        supabase
          .from('orders')
          .select('id, user_id, status, total, stripe_payment_intent_id, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, email, full_name'),
        supabase.from('courses').select('id, title'),
      ])
      setPurchases((purchasesData as CoursePurchase[]) ?? [])
      setOrders((ordersData as Order[]) ?? [])
      setProfiles(profilesData ?? [])
      setCoursesList(coursesData ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const profileMap = new Map<string, Profile>()
  for (const p of profiles) profileMap.set(p.id, p)

  const courseMap = new Map<string, string>()
  for (const c of coursesList) courseMap.set(c.id, c.title)

  const getProfile = (userId: string): Profile | null => profileMap.get(userId) ?? null
  const getCourseTitle = (courseId: string): string => courseMap.get(courseId) ?? '-'

  const filteredPurchases = purchases.filter((p) => {
    const q = search.toLowerCase()
    const prof = getProfile(p.user_id)
    return (
      prof?.email?.toLowerCase().includes(q) ||
      prof?.full_name?.toLowerCase().includes(q) ||
      getCourseTitle(p.course_id).toLowerCase().includes(q) ||
      p.stripe_payment_intent_id?.toLowerCase().includes(q)
    )
  })

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase()
    const prof = getProfile(o.user_id)
    return (
      prof?.email?.toLowerCase().includes(q) ||
      prof?.full_name?.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.stripe_payment_intent_id?.toLowerCase().includes(q)
    )
  })

  const totalPurchaseRevenue = purchases.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0)
  const totalOrderRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0)

  const orderStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
      refunded: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    }
    return <Badge className={colors[status] || ''}>{status}</Badge>
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Faktury a platby
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Prehled vsech plateb a objednavek
        </p>
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-neutral-500">Prijmy z kurzu</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCZK(totalPurchaseRevenue)}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{purchases.length} transakci</p>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-neutral-500">Prijmy z objednavek</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCZK(totalOrderRevenue)}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{orders.length} objednavek</p>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-neutral-500">Celkove prijmy</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCZK(totalPurchaseRevenue + totalOrderRevenue)}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {purchases.length + orders.length} celkem
                </p>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
      </StaggerGrid>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Hledat podle emailu, kurzu nebo ID platby..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="purchases">Nakupy kurzu ({purchases.length})</TabsTrigger>
            <TabsTrigger value="orders">Objednavky ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Uzivatel</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Kurz</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Castka</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Datum</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Stripe ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                {getProfile(p.user_id)?.full_name || getProfile(p.user_id)?.email?.split('@')[0] || '-'}
                              </p>
                              <p className="text-xs text-neutral-500">{getProfile(p.user_id)?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                            {getCourseTitle(p.course_id)}
                          </td>
                          <td className="px-4 py-3 font-medium">{formatCZK(Number(p.amount_paid))}</td>
                          <td className="px-4 py-3 text-neutral-500">
                            {new Date(p.purchased_at).toLocaleDateString('cs-CZ')}
                          </td>
                          <td className="px-4 py-3">
                            {p.stripe_payment_intent_id ? (
                              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                                {p.stripe_payment_intent_id.slice(0, 20)}...
                              </code>
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredPurchases.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                            Zadne nakupy nenalezeny
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Uzivatel</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Celkem</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Datum</th>
                        <th className="px-4 py-3 text-left font-medium text-neutral-500">Stripe ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                {getProfile(o.user_id)?.full_name || getProfile(o.user_id)?.email?.split('@')[0] || '-'}
                              </p>
                              <p className="text-xs text-neutral-500">{getProfile(o.user_id)?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">{orderStatusBadge(o.status)}</td>
                          <td className="px-4 py-3 font-medium">{formatCZK(Number(o.total))}</td>
                          <td className="px-4 py-3 text-neutral-500">
                            {new Date(o.created_at).toLocaleDateString('cs-CZ')}
                          </td>
                          <td className="px-4 py-3">
                            {o.stripe_payment_intent_id ? (
                              <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                                {o.stripe_payment_intent_id.slice(0, 20)}...
                              </code>
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                            Zadne objednavky nenalezeny
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AnimatedPage>
  )
}
