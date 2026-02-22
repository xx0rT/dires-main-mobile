import { useEffect, useState, useCallback } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Search,
  Shield,
  ShieldOff,
  UserCheck,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { AnimatedPage, AnimatedListItem } from '@/components/admin/admin-motion'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  company: string | null
  location: string | null
  is_admin: boolean
  created_at: string
}

interface Subscription {
  id: string
  user_id: string
  plan_type: string
  status: string
  current_period_end: string | null
  created_at: string
}

interface CourseEnrollment {
  id: string
  course_id: string
  enrolled_at: string
  completed: boolean
  courses: { title: string }[] | { title: string } | null
}

interface CoursePurchase {
  id: string
  course_id: string
  amount_paid: number
  purchased_at: string
  courses: { title: string }[] | { title: string } | null
}

function getCourseTitle(courses: { title: string }[] | { title: string } | null): string {
  if (!courses) return 'Neznamy kurz'
  if (Array.isArray(courses)) return courses[0]?.title || 'Neznamy kurz'
  return courses.title
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [userEnrollments, setUserEnrollments] = useState<CourseEnrollment[]>([])
  const [userPurchases, setUserPurchases] = useState<CoursePurchase[]>([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [sortField, setSortField] = useState<'created_at' | 'email'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchData = useCallback(async () => {
    const [{ data: profilesData }, { data: subsData }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*'),
    ])
    setProfiles(profilesData ?? [])
    setSubscriptions(subsData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const openUserDetail = async (profile: Profile) => {
    setSelectedUser(profile)
    setDetailLoading(true)
    const [{ data: enrollments }, { data: purchases }] = await Promise.all([
      supabase
        .from('course_enrollments')
        .select('id, course_id, enrolled_at, completed, courses(title)')
        .eq('user_id', profile.id),
      supabase
        .from('course_purchases')
        .select('id, course_id, amount_paid, purchased_at, courses(title)')
        .eq('user_id', profile.id),
    ])
    setUserEnrollments((enrollments as CourseEnrollment[]) ?? [])
    setUserPurchases((purchases as CoursePurchase[]) ?? [])
    setDetailLoading(false)
  }

  const toggleAdmin = async (profile: Profile) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !profile.is_admin })
      .eq('id', profile.id)

    if (error) {
      toast.error('Chyba pri zmene admin statusu')
      return
    }

    toast.success(profile.is_admin ? 'Admin prava odebrany' : 'Admin prava udeleny')
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.id ? { ...p, is_admin: !p.is_admin } : p))
    )
    if (selectedUser?.id === profile.id) {
      setSelectedUser({ ...profile, is_admin: !profile.is_admin })
    }
  }

  const getSubscription = (userId: string) =>
    subscriptions.find((s) => s.user_id === userId)

  const getStatusBadge = (sub?: Subscription) => {
    if (!sub) return <Badge variant="outline">Bez predplatneho</Badge>
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
      cancelled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
      expired: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    }
    const planLabels: Record<string, string> = {
      free_trial: 'Trial',
      monthly: 'Mesicni',
      lifetime: 'Dozivotni',
    }
    return (
      <Badge className={colors[sub.status] || ''}>
        {planLabels[sub.plan_type] || sub.plan_type} - {sub.status}
      </Badge>
    )
  }

  const filtered = profiles
    .filter((p) => {
      const q = search.toLowerCase()
      return (
        p.email?.toLowerCase().includes(q) ||
        p.full_name?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const aVal = sortField === 'email' ? (a.email || '') : (a.created_at || '')
      const bVal = sortField === 'email' ? (b.email || '') : (b.created_at || '')
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

  const SortIcon = sortDir === 'asc' ? ChevronUp : ChevronDown

  const handleSort = (field: 'created_at' | 'email') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
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
          Sprava uzivatelu
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {profiles.length} registrovanych uzivatelu
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-sm"
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Hledat podle emailu, jmena nebo ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Uzivatel</th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-medium text-neutral-500"
                      onClick={() => handleSort('email')}
                    >
                      <span className="inline-flex items-center gap-1">
                        Email
                        {sortField === 'email' && <SortIcon className="size-3" />}
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Predplatne</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Role</th>
                    <th
                      className="cursor-pointer px-4 py-3 text-left font-medium text-neutral-500"
                      onClick={() => handleSort('created_at')}
                    >
                      <span className="inline-flex items-center gap-1">
                        Registrace
                        {sortField === 'created_at' && <SortIcon className="size-3" />}
                      </span>
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-500">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((profile) => {
                    const sub = getSubscription(profile.id)
                    return (
                      <tr
                        key={profile.id}
                        className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium dark:bg-neutral-700">
                              {(profile.full_name || profile.email)?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium text-neutral-900 dark:text-neutral-100">
                              {profile.full_name || profile.email?.split('@')[0]}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                          {profile.email}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(sub)}</td>
                        <td className="px-4 py-3">
                          {profile.is_admin ? (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline">Uzivatel</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {new Date(profile.created_at).toLocaleDateString('cs-CZ')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openUserDetail(profile)}
                            >
                              Detail
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => toggleAdmin(profile)}
                              title={profile.is_admin ? 'Odebrat admin' : 'Udelit admin'}
                            >
                              {profile.is_admin ? (
                                <ShieldOff className="size-4 text-red-500" />
                              ) : (
                                <Shield className="size-4 text-neutral-400" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                        Zadni uzivatele nenalezeni
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5" />
              Detail uzivatele
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Email" value={selectedUser.email} />
                <InfoRow label="Jmeno" value={selectedUser.full_name || '-'} />
                <InfoRow label="Telefon" value={selectedUser.phone || '-'} />
                <InfoRow label="Firma" value={selectedUser.company || '-'} />
                <InfoRow label="Lokace" value={selectedUser.location || '-'} />
                <InfoRow
                  label="Registrace"
                  value={new Date(selectedUser.created_at).toLocaleDateString('cs-CZ')}
                />
                <InfoRow
                  label="Role"
                  value={selectedUser.is_admin ? 'Admin' : 'Uzivatel'}
                />
                <InfoRow
                  label="Predplatne"
                  value={(() => {
                    const sub = getSubscription(selectedUser.id)
                    if (!sub) return 'Zadne'
                    return `${sub.plan_type} (${sub.status})`
                  })()}
                />
              </div>

              {detailLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      <BookOpen className="size-4" />
                      Zapsane kurzy ({userEnrollments.length})
                    </h3>
                    {userEnrollments.length === 0 ? (
                      <p className="text-sm text-neutral-500">Zadne zapisy</p>
                    ) : (
                      <div className="space-y-2">
                        {userEnrollments.map((e, i) => (
                          <AnimatedListItem key={e.id} index={i}>
                            <div
                              className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-700"
                            >
                              <div>
                                <p className="text-sm font-medium">{getCourseTitle(e.courses)}</p>
                                <p className="text-xs text-neutral-500">
                                  Zapsano: {new Date(e.enrolled_at).toLocaleDateString('cs-CZ')}
                                </p>
                              </div>
                              {e.completed ? (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                  Dokonceno
                                </Badge>
                              ) : (
                                <Badge variant="outline">Probiha</Badge>
                              )}
                            </div>
                          </AnimatedListItem>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      <CreditCard className="size-4" />
                      Nakupy kurzu ({userPurchases.length})
                    </h3>
                    {userPurchases.length === 0 ? (
                      <p className="text-sm text-neutral-500">Zadne nakupy</p>
                    ) : (
                      <div className="space-y-2">
                        {userPurchases.map((p, i) => (
                          <AnimatedListItem key={p.id} index={i}>
                            <div
                              className="flex items-center justify-between rounded-lg border p-3 dark:border-neutral-700"
                            >
                              <div>
                                <p className="text-sm font-medium">{getCourseTitle(p.courses)}</p>
                                <p className="text-xs text-neutral-500">
                                  {new Date(p.purchased_at).toLocaleDateString('cs-CZ')}
                                </p>
                              </div>
                              <span className="text-sm font-medium">
                                {new Intl.NumberFormat('cs-CZ', {
                                  style: 'currency',
                                  currency: 'CZK',
                                  maximumFractionDigits: 0,
                                }).format(Number(p.amount_paid))}
                              </span>
                            </div>
                          </AnimatedListItem>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-2 border-t pt-4 dark:border-neutral-700">
                <Button
                  variant={selectedUser.is_admin ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => toggleAdmin(selectedUser)}
                >
                  {selectedUser.is_admin ? (
                    <>
                      <ShieldOff className="mr-2 size-4" />
                      Odebrat admin prava
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 size-4" />
                      Udelit admin prava
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                  <X className="mr-2 size-4" />
                  Zavrit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900 dark:text-neutral-100">{value}</dd>
    </div>
  )
}
