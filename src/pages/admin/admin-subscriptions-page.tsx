import { useEffect, useState, useCallback } from 'react'
import {
  CreditCard,
  Search,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Subscription {
  id: string
  user_id: string
  plan_type: string
  status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
}

interface Profile {
  id: string
  email: string
  full_name: string | null
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: 'Aktivni', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', icon: CheckCircle2 },
  trialing: { label: 'Zkusebni', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', icon: Clock },
  cancelled: { label: 'Zruseno', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', icon: AlertTriangle },
  expired: { label: 'Vyprselo', color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400', icon: XCircle },
}

const planLabels: Record<string, string> = {
  free_trial: 'Zkusebni',
  monthly: 'Mesicni',
  lifetime: 'Dozivotni',
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [allProfiles, setAllProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<'created_at' | 'status'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [grantDialogOpen, setGrantDialogOpen] = useState(false)
  const [grantUserId, setGrantUserId] = useState('')
  const [grantPlanType, setGrantPlanType] = useState('monthly')
  const [granting, setGranting] = useState(false)

  const profileMap = new Map<string, Profile>()
  for (const p of allProfiles) profileMap.set(p.id, p)

  const getProfile = (userId: string): Profile | null => profileMap.get(userId) ?? null

  const fetchData = useCallback(async () => {
    const [{ data: subsData }, { data: profilesData }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, full_name'),
    ])
    setSubscriptions((subsData as Subscription[]) ?? [])
    setAllProfiles(profilesData ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateStatus = async (sub: Subscription, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() }
    if (newStatus === 'cancelled') {
      updates.cancel_at_period_end = true
    }
    if (newStatus === 'active') {
      updates.cancel_at_period_end = false
    }

    const { error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', sub.id)

    if (error) {
      toast.error('Chyba pri aktualizaci predplatneho')
      return
    }

    toast.success(`Status zmenen na: ${statusConfig[newStatus]?.label || newStatus}`)
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === sub.id ? { ...s, status: newStatus, ...updates } : s
      )
    )
  }

  const grantSubscription = async () => {
    if (!grantUserId || !grantPlanType) return
    setGranting(true)

    const existing = subscriptions.find((s) => s.user_id === grantUserId)
    if (existing) {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: grantPlanType,
          status: 'active',
          cancel_at_period_end: false,
          current_period_start: new Date().toISOString(),
          current_period_end: grantPlanType === 'lifetime'
            ? null
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) {
        toast.error('Chyba pri aktualizaci predplatneho')
        setGranting(false)
        return
      }
    } else {
      const { error } = await supabase.from('subscriptions').insert({
        user_id: grantUserId,
        plan_type: grantPlanType,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: grantPlanType === 'lifetime'
          ? null
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (error) {
        toast.error('Chyba pri udeleni predplatneho')
        setGranting(false)
        return
      }
    }

    toast.success('Predplatne udeleno')
    setGrantDialogOpen(false)
    setGrantUserId('')
    setGrantPlanType('monthly')
    setGranting(false)
    fetchData()
  }

  const filtered = subscriptions
    .filter((s) => {
      const q = search.toLowerCase()
      const prof = getProfile(s.user_id)
      const matchesSearch =
        prof?.email?.toLowerCase().includes(q) ||
        prof?.full_name?.toLowerCase().includes(q) ||
        s.plan_type.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aVal = sortField === 'status' ? a.status : a.created_at
      const bVal = sortField === 'status' ? b.status : b.created_at
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })

  const statCounts = {
    active: subscriptions.filter((s) => s.status === 'active').length,
    trialing: subscriptions.filter((s) => s.status === 'trialing').length,
    cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
    expired: subscriptions.filter((s) => s.status === 'expired').length,
  }

  const SortIcon = sortDir === 'asc' ? ChevronUp : ChevronDown

  const handleSort = (field: 'created_at' | 'status') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const usersWithoutSub = allProfiles.filter(
    (p) => !subscriptions.some((s) => s.user_id === p.id)
  )

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Sprava predplatneho
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {subscriptions.length} predplatnych celkem
          </p>
        </div>
        <Button onClick={() => setGrantDialogOpen(true)}>
          <UserPlus className="mr-2 size-4" />
          Udelit predplatne
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(statCounts).map(([key, count]) => {
          const config = statusConfig[key]
          const Icon = config?.icon || CreditCard
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-shadow hover:shadow-md ${statusFilter === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
            >
              <CardContent className="flex items-center gap-3 pt-6">
                <div className={`flex size-10 items-center justify-center rounded-lg ${config?.color.split(' ').slice(0, 2).join(' ')}`}>
                  <Icon className={`size-5 ${config?.color.split(' ').slice(2).join(' ')}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{count}</p>
                  <p className="text-xs text-neutral-500">{config?.label || key}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Hledat podle emailu nebo jmena..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Uzivatel</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Plan</th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left font-medium text-neutral-500"
                    onClick={() => handleSort('status')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Status
                      {sortField === 'status' && <SortIcon className="size-3" />}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Obdobi</th>
                  <th
                    className="cursor-pointer px-4 py-3 text-left font-medium text-neutral-500"
                    onClick={() => handleSort('created_at')}
                  >
                    <span className="inline-flex items-center gap-1">
                      Vytvoreno
                      {sortField === 'created_at' && <SortIcon className="size-3" />}
                    </span>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-neutral-500">Akce</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const prof = getProfile(sub.user_id)
                  const config = statusConfig[sub.status]
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-neutral-100">
                            {prof?.full_name || prof?.email?.split('@')[0] || '-'}
                          </p>
                          <p className="text-xs text-neutral-500">{prof?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{planLabels[sub.plan_type] || sub.plan_type}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={config?.color || ''}>{config?.label || sub.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {sub.current_period_end
                          ? `do ${new Date(sub.current_period_end).toLocaleDateString('cs-CZ')}`
                          : sub.plan_type === 'lifetime'
                            ? 'Dozivotni'
                            : '-'}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(sub.created_at).toLocaleDateString('cs-CZ')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {sub.status !== 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus(sub, 'active')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Aktivovat
                            </Button>
                          )}
                          {sub.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus(sub, 'cancelled')}
                              className="text-amber-600 hover:text-amber-700"
                            >
                              Zrusit
                            </Button>
                          )}
                          {sub.status !== 'expired' && sub.status !== 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateStatus(sub, 'expired')}
                              className="text-neutral-500 hover:text-neutral-600"
                            >
                              Vyprsit
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                      Zadna predplatna nenalezena
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Udelit predplatne</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Uzivatel</label>
              <Select value={grantUserId} onValueChange={setGrantUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte uzivatele..." />
                </SelectTrigger>
                <SelectContent>
                  {usersWithoutSub.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.full_name || p.email?.split('@')[0]} ({p.email})
                    </SelectItem>
                  ))}
                  {usersWithoutSub.length === 0 && (
                    <div className="px-2 py-3 text-center text-sm text-neutral-500">
                      Vsichni uzivatele maji predplatne
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Typ planu</label>
              <Select value={grantPlanType} onValueChange={setGrantPlanType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free_trial">Zkusebni</SelectItem>
                  <SelectItem value="monthly">Mesicni</SelectItem>
                  <SelectItem value="lifetime">Dozivotni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
                Zrusit
              </Button>
              <Button onClick={grantSubscription} disabled={!grantUserId || granting}>
                {granting ? 'Udeluji...' : 'Udelit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
