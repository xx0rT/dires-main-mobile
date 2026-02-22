import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Copy,
  Percent,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
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
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { AnimatedPage, StaggerGrid, StaggerItem, HoverCard } from '@/components/admin/admin-motion'

interface PromoCode {
  id: string
  code: string
  discount_type: string
  discount_value: number
  applicable_plans: string[]
  is_active: boolean
  valid_from: string
  valid_until: string | null
  max_uses: number | null
  current_uses: number
  created_at: string
}

export default function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newCode, setNewCode] = useState('')
  const [newDiscountType, setNewDiscountType] = useState('percentage')
  const [newDiscountValue, setNewDiscountValue] = useState('')
  const [newMaxUses, setNewMaxUses] = useState('')
  const [newValidUntil, setNewValidUntil] = useState('')
  const [newPlans, setNewPlans] = useState<string[]>(['monthly', 'lifetime'])

  const fetchCodes = useCallback(async () => {
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  const toggleActive = async (code: PromoCode) => {
    const { error } = await supabase
      .from('promo_codes')
      .update({ is_active: !code.is_active, updated_at: new Date().toISOString() })
      .eq('id', code.id)

    if (error) {
      toast.error('Chyba pri aktualizaci promo kodu')
      return
    }

    toast.success(code.is_active ? 'Promo kod deaktivovan' : 'Promo kod aktivovan')
    setCodes((prev) =>
      prev.map((c) => (c.id === code.id ? { ...c, is_active: !c.is_active } : c))
    )
  }

  const deleteCode = async (code: PromoCode) => {
    if (code.current_uses > 0) {
      toast.error('Nelze smazat promo kod s existujicimi pouzitimi')
      return
    }

    const { error } = await supabase.from('promo_codes').delete().eq('id', code.id)
    if (error) {
      toast.error('Chyba pri mazani promo kodu')
      return
    }

    toast.success('Promo kod smazan')
    setCodes((prev) => prev.filter((c) => c.id !== code.id))
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewCode(result)
  }

  const createCode = async () => {
    if (!newCode || !newDiscountValue) {
      toast.error('Vyplnte vsechna povinne pole')
      return
    }
    setCreating(true)

    const { error } = await supabase.from('promo_codes').insert({
      code: newCode.toUpperCase(),
      discount_type: newDiscountType,
      discount_value: Number(newDiscountValue),
      applicable_plans: newPlans,
      max_uses: newMaxUses ? Number(newMaxUses) : null,
      valid_until: newValidUntil || null,
    })

    if (error) {
      toast.error(error.message.includes('unique') ? 'Kod jiz existuje' : 'Chyba pri vytvareni promo kodu')
      setCreating(false)
      return
    }

    toast.success('Promo kod vytvoren')
    setCreateOpen(false)
    resetForm()
    setCreating(false)
    fetchCodes()
  }

  const resetForm = () => {
    setNewCode('')
    setNewDiscountType('percentage')
    setNewDiscountValue('')
    setNewMaxUses('')
    setNewValidUntil('')
    setNewPlans(['monthly', 'lifetime'])
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success('Kod zkopirovan do schranky')
  }

  const togglePlan = (plan: string) => {
    setNewPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    )
  }

  const filtered = codes.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = codes.filter((c) => c.is_active).length
  const totalUses = codes.reduce((sum, c) => sum + c.current_uses, 0)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Promo kody
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {codes.length} kodu celkem, {activeCount} aktivnich
          </p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true) }}>
          <Plus className="mr-2 size-4" />
          Novy promo kod
        </Button>
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100/60 dark:bg-blue-900/30">
                  <Percent className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{codes.length}</p>
                  <p className="text-xs text-neutral-500">Celkem kodu</p>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-100/60 dark:bg-green-900/30">
                  <ToggleRight className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{activeCount}</p>
                  <p className="text-xs text-neutral-500">Aktivnich</p>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
        <StaggerItem>
          <HoverCard>
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100/60 dark:bg-amber-900/30">
                  <Copy className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalUses}</p>
                  <p className="text-xs text-neutral-500">Celkem pouziti</p>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </StaggerItem>
      </StaggerGrid>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-sm"
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Hledat promo kody..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Kod</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Sleva</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Plany</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Pouziti</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Platnost</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-500">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((code) => (
                    <tr
                      key={code.id}
                      className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-neutral-100 px-2 py-0.5 text-sm font-mono font-medium dark:bg-neutral-800">
                            {code.code}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyCode(code.code)}
                            className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {code.discount_type === 'percentage'
                          ? `${code.discount_value}%`
                          : `${code.discount_value} CZK`}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {code.applicable_plans.map((plan) => (
                            <Badge key={plan} variant="outline" className="text-[10px]">
                              {plan === 'monthly' ? 'Mesicni' : plan === 'lifetime' ? 'Dozivotni' : plan}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                        {code.current_uses}{code.max_uses ? ` / ${code.max_uses}` : ''}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">
                        {code.valid_until
                          ? `do ${new Date(code.valid_until).toLocaleDateString('cs-CZ')}`
                          : 'Bez limitu'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={code.is_active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }>
                          {code.is_active ? 'Aktivni' : 'Neaktivni'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => toggleActive(code)}
                            title={code.is_active ? 'Deaktivovat' : 'Aktivovat'}
                          >
                            {code.is_active ? (
                              <ToggleRight className="size-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="size-4 text-neutral-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-red-500 hover:text-red-600"
                            onClick={() => deleteCode(code)}
                            title="Smazat"
                            disabled={code.current_uses > 0}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                        Zadne promo kody nenalezeny
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novy promo kod</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Kod</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="SLEVA20"
                  className="font-mono"
                />
                <Button variant="outline" size="sm" onClick={generateCode}>
                  Generovat
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Typ slevy</Label>
                <Select value={newDiscountType} onValueChange={setNewDiscountType}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Procenta (%)</SelectItem>
                    <SelectItem value="fixed">Pevna castka (CZK)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hodnota slevy</Label>
                <Input
                  type="number"
                  value={newDiscountValue}
                  onChange={(e) => setNewDiscountValue(e.target.value)}
                  placeholder={newDiscountType === 'percentage' ? '20' : '100'}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Max pouziti</Label>
                <Input
                  type="number"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(e.target.value)}
                  placeholder="Neomezeno"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Platnost do</Label>
                <Input
                  type="date"
                  value={newValidUntil}
                  onChange={(e) => setNewValidUntil(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Platne pro plany</Label>
              <div className="mt-1.5 flex gap-2">
                {['monthly', 'lifetime'].map((plan) => (
                  <Button
                    key={plan}
                    type="button"
                    variant={newPlans.includes(plan) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePlan(plan)}
                  >
                    {plan === 'monthly' ? 'Mesicni' : 'Dozivotni'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Zrusit
              </Button>
              <Button onClick={createCode} disabled={!newCode || !newDiscountValue || creating}>
                {creating ? 'Vytvarim...' : 'Vytvorit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  )
}
