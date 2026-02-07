import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CreditCard, Receipt, TrendingUp, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalPurchases: number
  totalRevenue: number
  activeSubscriptions: number
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
  })
  const [recentUsers, setRecentUsers] = useState<
    { id: string; email: string; full_name: string | null; created_at: string }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: usersCount },
        { count: coursesCount },
        { count: enrollmentsCount },
        { data: purchases },
        { count: activeSubsCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('course_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('course_purchases').select('amount_paid'),
        supabase
          .from('subscriptions')
          .select('*', { count: 'exact', head: true })
          .in('status', ['active', 'trialing']),
        supabase
          .from('profiles')
          .select('id, email, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const totalRevenue = purchases?.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0) ?? 0

      setStats({
        totalUsers: usersCount ?? 0,
        totalCourses: coursesCount ?? 0,
        totalEnrollments: enrollmentsCount ?? 0,
        totalPurchases: purchases?.length ?? 0,
        totalRevenue,
        activeSubscriptions: activeSubsCount ?? 0,
      })
      setRecentUsers(recent ?? [])
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Uzivatele', value: stats.totalUsers, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100/60 dark:bg-blue-900/30', link: '/admin/users' },
    { label: 'Kurzy', value: stats.totalCourses, icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100/60 dark:bg-emerald-900/30', link: '/admin/courses' },
    { label: 'Zapisy', value: stats.totalEnrollments, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100/60 dark:bg-amber-900/30', link: '/admin/courses' },
    { label: 'Aktivni predplatne', value: stats.activeSubscriptions, icon: CreditCard, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100/60 dark:bg-cyan-900/30', link: '/admin/users' },
    { label: 'Nakupy kurzu', value: stats.totalPurchases, icon: Receipt, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100/60 dark:bg-rose-900/30', link: '/admin/invoices' },
    {
      label: 'Celkove prijmy',
      value: new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(stats.totalRevenue),
      icon: CreditCard,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100/60 dark:bg-green-900/30',
      link: '/admin/invoices',
      isFormatted: true,
    },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sprava uzivatelu, kurzu a faktur
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} to={card.link}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-500">
                    {card.label}
                  </CardTitle>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${card.bg}`}>
                    <Icon className={`size-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {card.isFormatted ? card.value : card.value}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Posledni registrovani uzivatele</CardTitle>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-neutral-500">Zadni uzivatele</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium dark:bg-neutral-700">
                      {(u.full_name || u.email)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {u.full_name || u.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-neutral-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(u.created_at).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
