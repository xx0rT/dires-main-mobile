import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileText, Download, Receipt, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Invoice {
  id: string
  courseTitle: string
  amount: number
  date: string
  paymentId: string | null
}

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadInvoices()
  }, [user])

  const loadInvoices = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from('course_purchases')
        .select('id, amount_paid, purchased_at, stripe_payment_intent_id, courses(title)')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false })

      const mapped: Invoice[] = (data || []).map((p: any) => ({
        id: p.id,
        courseTitle: p.courses?.title || 'Neznamy kurz',
        amount: p.amount_paid,
        date: p.purchased_at,
        paymentId: p.stripe_payment_intent_id,
      }))

      setInvoices(mapped)
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price)

  const totalSpent = invoices.reduce((sum, inv) => sum + inv.amount, 0)

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
        <h1 className="text-2xl sm:text-3xl font-bold">Faktury</h1>
        <p className="text-muted-foreground mt-1">
          Prehled vsech vasich faktur a plateb
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Celkove vydaje</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">{invoices.length} faktur</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posledni platba</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.length > 0
                  ? new Date(invoices[0].date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
                  : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.length > 0 ? formatPrice(invoices[0].amount) : 'Zadne platby'}
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
              <CardTitle className="text-sm font-medium">Prumerna platba</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.length > 0 ? formatPrice(Math.round(totalSpent / invoices.length)) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Na fakturu</p>
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
            <CardTitle>Historie faktur</CardTitle>
            <CardDescription>Vsechny vase faktury a doklady o platbe</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="space-y-3">
                {invoices.map((invoice, i) => (
                  <div key={invoice.id}>
                    {i > 0 && <Separator className="my-3" />}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{invoice.courseTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString('cs-CZ', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPrice(invoice.amount)}</p>
                          <Badge variant="outline" className="text-xs">Zaplaceno</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-semibold mb-1">Zadne faktury</h3>
                <p className="text-sm text-muted-foreground">
                  Zatim nemame zaznam o zadnych platbach
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
