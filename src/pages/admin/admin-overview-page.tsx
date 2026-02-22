import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  BookOpen,
  Clock,
  CreditCard,
  Globe,
  Monitor,
  Receipt,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AnimatedPage,
  StaggerGrid,
  StaggerItem,
  HoverCard,
  AnimatedListItem,
} from '@/components/admin/admin-motion'

interface Stats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalPurchases: number
  totalRevenue: number
  activeSubscriptions: number
}

interface ActivityRow {
  id: string
  user_id: string | null
  session_id: string
  event_type: string
  page_path: string
  page_title: string
  device_type: string
  duration_seconds: number
  created_at: string
}

interface TrafficStats {
  totalPageViews: number
  uniqueSessions: number
  uniqueUsers: number
  avgDuration: number
  topPages: { path: string; title: string; views: number }[]
  deviceBreakdown: { desktop: number; mobile: number; tablet: number }
  recentActivity: ActivityRow[]
  todayPageViews: number
  weekPageViews: number
}

const formatCZK = (amount: number) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount)

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'prave ted'
  if (mins < 60) return `pred ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `pred ${hours}h`
  const days = Math.floor(hours / 24)
  return `pred ${days}d`
}

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === 'mobile') return <Smartphone className="size-3.5" />
  if (type === 'tablet') return <Tablet className="size-3.5" />
  return <Monitor className="size-3.5" />
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
  const [traffic, setTraffic] = useState<TrafficStats>({
    totalPageViews: 0,
    uniqueSessions: 0,
    uniqueUsers: 0,
    avgDuration: 0,
    topPages: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    recentActivity: [],
    todayPageViews: 0,
    weekPageViews: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchTraffic = useCallback(async () => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { data: allActivity },
      { data: todayActivity },
      { data: weekActivity },
      { data: recentRows },
    ] = await Promise.all([
      supabase
        .from('user_activity')
        .select('id, user_id, session_id, event_type, page_path, page_title, device_type, duration_seconds, created_at')
        .eq('event_type', 'page_view')
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase
        .from('user_activity')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('created_at', todayStart),
      supabase
        .from('user_activity')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('created_at', weekAgo),
      supabase
        .from('user_activity')
        .select('id, user_id, session_id, event_type, page_path, page_title, device_type, duration_seconds, created_at')
        .order('created_at', { ascending: false })
        .limit(20),
    ])

    const rows = allActivity ?? []
    const sessions = new Set(rows.map(r => r.session_id))
    const users = new Set(rows.filter(r => r.user_id).map(r => r.user_id))
    const totalDuration = rows.reduce((s, r) => s + (r.duration_seconds || 0), 0)

    const pageCount = new Map<string, { title: string; count: number }>()
    for (const r of rows) {
      const existing = pageCount.get(r.page_path)
      if (existing) {
        existing.count++
      } else {
        pageCount.set(r.page_path, { title: r.page_title || r.page_path, count: 1 })
      }
    }
    const topPages = Array.from(pageCount.entries())
      .map(([path, data]) => ({ path, title: data.title, views: data.count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8)

    const devices = { desktop: 0, mobile: 0, tablet: 0 }
    for (const r of rows) {
      const d = r.device_type as keyof typeof devices
      if (d in devices) devices[d]++
    }

    setTraffic({
      totalPageViews: rows.length,
      uniqueSessions: sessions.size,
      uniqueUsers: users.size,
      avgDuration: rows.length > 0 ? Math.round(totalDuration / rows.length) : 0,
      topPages,
      deviceBreakdown: devices,
      recentActivity: (recentRows ?? []) as ActivityRow[],
      todayPageViews: (todayActivity as any)?.length ?? 0,
      weekPageViews: (weekActivity as any)?.length ?? 0,
    })
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
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

      await fetchTraffic()
      setLoading(false)
    }
    fetchAll()
  }, [fetchTraffic])

  useEffect(() => {
    const interval = setInterval(fetchTraffic, 30000)
    return () => clearInterval(interval)
  }, [fetchTraffic])

  const statCards = [
    { label: 'Uzivatele', value: stats.totalUsers, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100/60 dark:bg-blue-900/30', link: '/admin/users' },
    { label: 'Kurzy', value: stats.totalCourses, icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100/60 dark:bg-emerald-900/30', link: '/admin/courses' },
    { label: 'Zapisy', value: stats.totalEnrollments, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100/60 dark:bg-amber-900/30', link: '/admin/courses' },
    { label: 'Aktivni predplatne', value: stats.activeSubscriptions, icon: CreditCard, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100/60 dark:bg-cyan-900/30', link: '/admin/subscriptions' },
    { label: 'Nakupy kurzu', value: stats.totalPurchases, icon: Receipt, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100/60 dark:bg-rose-900/30', link: '/admin/invoices' },
    {
      label: 'Celkove prijmy',
      value: formatCZK(stats.totalRevenue),
      icon: CreditCard,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100/60 dark:bg-green-900/30',
      link: '/admin/invoices',
      isFormatted: true,
    },
  ]

  const totalDeviceViews = traffic.deviceBreakdown.desktop + traffic.deviceBreakdown.mobile + traffic.deviceBreakdown.tablet
  const devicePercent = (count: number) => totalDeviceViews > 0 ? Math.round((count / totalDeviceViews) * 100) : 0

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AnimatedPage className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sprava uzivatelu, kurzu a faktur
        </p>
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <StaggerItem key={card.label}>
              <HoverCard>
                <Link to={card.link}>
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
                        {card.value}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </HoverCard>
            </StaggerItem>
          )
        })}
      </StaggerGrid>

      <StaggerGrid className="space-y-8">
        <StaggerItem>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="size-5 text-green-600" />
                <CardTitle className="text-base">Provoz webu (Traffic Monitor)</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-green-500" />
                Zive
              </Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-4 grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Prehled</TabsTrigger>
                  <TabsTrigger value="pages">Stranky</TabsTrigger>
                  <TabsTrigger value="live">Ziva aktivita</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border p-4 dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Globe className="size-3.5" />
                        Zobrazeni dnes
                      </div>
                      <p className="mt-2 text-2xl font-bold">{traffic.todayPageViews}</p>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Users className="size-3.5" />
                        Unikatni navstevnici
                      </div>
                      <p className="mt-2 text-2xl font-bold">{traffic.uniqueUsers}</p>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Activity className="size-3.5" />
                        Celkem sezeni
                      </div>
                      <p className="mt-2 text-2xl font-bold">{traffic.uniqueSessions}</p>
                    </div>
                    <div className="rounded-lg border p-4 dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Clock className="size-3.5" />
                        Prumerna doba
                      </div>
                      <p className="mt-2 text-2xl font-bold">{formatDuration(traffic.avgDuration)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-medium text-neutral-500">Zarizeni</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Desktop', count: traffic.deviceBreakdown.desktop, icon: Monitor, color: 'bg-blue-500' },
                        { label: 'Mobil', count: traffic.deviceBreakdown.mobile, icon: Smartphone, color: 'bg-green-500' },
                        { label: 'Tablet', count: traffic.deviceBreakdown.tablet, icon: Tablet, color: 'bg-amber-500' },
                      ].map((d) => (
                        <div key={d.label} className="flex items-center gap-3">
                          <d.icon className="size-4 text-neutral-500" />
                          <span className="w-16 text-sm">{d.label}</span>
                          <div className="flex-1">
                            <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                              <div
                                className={`h-2 rounded-full ${d.color} transition-all duration-500`}
                                style={{ width: `${devicePercent(d.count)}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-12 text-right text-xs tabular-nums text-neutral-500">
                            {devicePercent(d.count)}%
                          </span>
                          <span className="w-10 text-right text-xs tabular-nums font-medium">
                            {d.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pages">
                  {traffic.topPages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-neutral-500">Zatim zadna data o strankach</p>
                  ) : (
                    <div className="space-y-2">
                      {traffic.topPages.map((page, idx) => {
                        const maxViews = traffic.topPages[0]?.views || 1
                        const pct = Math.round((page.views / maxViews) * 100)
                        return (
                          <AnimatedListItem key={page.path} index={idx}>
                            <div className="flex items-center gap-3 rounded-lg border p-3 dark:border-neutral-700">
                              <span className="flex size-6 items-center justify-center rounded-md bg-neutral-100 text-[10px] font-bold dark:bg-neutral-800">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium">{page.title}</p>
                                <p className="truncate text-xs text-neutral-500">{page.path}</p>
                              </div>
                              <div className="hidden w-32 sm:block">
                                <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                  <div
                                    className="h-1.5 rounded-full bg-blue-500 transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm font-semibold tabular-nums">{page.views}</span>
                            </div>
                          </AnimatedListItem>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="live">
                  {traffic.recentActivity.length === 0 ? (
                    <p className="py-8 text-center text-sm text-neutral-500">Zatim zadna aktivita</p>
                  ) : (
                    <div className="space-y-1.5">
                      {traffic.recentActivity.map((a, idx) => (
                        <AnimatedListItem key={a.id} index={idx}>
                          <div className="flex items-center gap-3 rounded-lg border p-2.5 text-sm dark:border-neutral-700">
                            <DeviceIcon type={a.device_type} />
                            <Badge
                              variant="outline"
                              className="min-w-[80px] justify-center text-[10px] font-normal"
                            >
                              {a.event_type === 'page_view'
                                ? 'Zobrazeni'
                                : a.event_type === 'session_start'
                                  ? 'Zacatek'
                                  : a.event_type === 'session_end'
                                    ? 'Konec'
                                    : a.event_type}
                            </Badge>
                            <span className="flex-1 truncate text-neutral-700 dark:text-neutral-300">
                              {a.page_title || a.page_path}
                            </span>
                            {a.duration_seconds > 0 && (
                              <span className="text-xs tabular-nums text-neutral-400">
                                {formatDuration(a.duration_seconds)}
                              </span>
                            )}
                            <span className="text-xs text-neutral-400 whitespace-nowrap">
                              {timeAgo(a.created_at)}
                            </span>
                          </div>
                        </AnimatedListItem>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posledni registrovani uzivatele</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-sm text-neutral-500">Zadni uzivatele</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((u, idx) => (
                    <AnimatedListItem key={u.id} index={idx}>
                      <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
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
                    </AnimatedListItem>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerGrid>
    </AnimatedPage>
  )
}
