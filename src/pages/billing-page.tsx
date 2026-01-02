import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  RiBillLine,
  RiAddLine,
  RiDownloadLine,
  RiSearchLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiFileTextLine,
} from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const revenueStats = [
  {
    title: 'Total Revenue',
    value: '$24,500',
    change: '+12% from last month',
    icon: RiMoneyDollarCircleLine,
    trend: 'up'
  },
  {
    title: 'Outstanding',
    value: '$3,200',
    change: '8 pending invoices',
    icon: RiTimeLine,
    trend: 'neutral'
  },
  {
    title: 'Collected This Month',
    value: '$21,300',
    change: '87% collection rate',
    icon: RiCheckLine,
    trend: 'up'
  },
  {
    title: 'Overdue',
    value: '$1,200',
    change: '3 overdue invoices',
    icon: RiErrorWarningLine,
    trend: 'down'
  }
]

const invoices = [
  {
    id: 'INV-2024-001',
    patient: 'Sarah Johnson',
    service: 'Sports Injury Rehabilitation',
    date: '2024-01-15',
    dueDate: '2024-01-30',
    amount: 450,
    status: 'paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'INV-2024-002',
    patient: 'Michael Chen',
    service: 'Post-Surgery Therapy Package',
    date: '2024-01-14',
    dueDate: '2024-01-29',
    amount: 1200,
    status: 'paid',
    paymentMethod: 'Insurance'
  },
  {
    id: 'INV-2024-003',
    patient: 'Emma Davis',
    service: 'Chronic Pain Management (8 sessions)',
    date: '2024-01-12',
    dueDate: '2024-01-27',
    amount: 800,
    status: 'pending',
    paymentMethod: null
  },
  {
    id: 'INV-2024-004',
    patient: 'James Wilson',
    service: 'Mobility Enhancement Program',
    date: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 600,
    status: 'overdue',
    paymentMethod: null
  },
  {
    id: 'INV-2024-005',
    patient: 'Lisa Anderson',
    service: 'Neck Pain Management (6 sessions)',
    date: '2024-01-08',
    dueDate: '2024-01-23',
    amount: 540,
    status: 'paid',
    paymentMethod: 'Debit Card'
  },
  {
    id: 'INV-2024-006',
    patient: 'David Martinez',
    service: 'Knee Rehabilitation',
    date: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 750,
    status: 'pending',
    paymentMethod: null
  }
]

const recentPayments = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    amount: 450,
    method: 'Credit Card',
    date: '2024-01-16',
    invoiceId: 'INV-2024-001',
    status: 'completed'
  },
  {
    id: 2,
    patient: 'Michael Chen',
    amount: 1200,
    method: 'Insurance',
    date: '2024-01-15',
    invoiceId: 'INV-2024-002',
    status: 'completed'
  },
  {
    id: 3,
    patient: 'Lisa Anderson',
    amount: 540,
    method: 'Debit Card',
    date: '2024-01-14',
    invoiceId: 'INV-2024-005',
    status: 'completed'
  }
]

const statusConfig = {
  paid: {
    variant: 'default' as const,
    label: 'Paid',
    color: 'text-green-600 dark:text-green-400'
  },
  pending: {
    variant: 'secondary' as const,
    label: 'Pending',
    color: 'text-yellow-600 dark:text-yellow-400'
  },
  overdue: {
    variant: 'destructive' as const,
    label: 'Overdue',
    color: 'text-red-600 dark:text-red-400'
  },
  cancelled: {
    variant: 'outline' as const,
    label: 'Cancelled',
    color: 'text-muted-foreground'
  }
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage invoices, payments, and revenue tracking.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RiDownloadLine className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {revenueStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Invoices</CardTitle>
                  <CardDescription>Track and manage all patient invoices</CardDescription>
                </div>
                <div className="relative w-[300px]">
                  <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-1">Invoice ID</div>
                  <div className="col-span-2">Patient / Service</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Amount</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="grid grid-cols-7 gap-4 px-4 py-4 items-center rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="col-span-1">
                      <span className="text-sm font-mono font-semibold">{invoice.id}</span>
                    </div>

                    <div className="col-span-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{invoice.patient}</p>
                        <p className="text-xs text-muted-foreground">{invoice.service}</p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Issued</p>
                        <p className="text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <p className="text-sm font-bold">${invoice.amount}</p>
                      {invoice.paymentMethod && (
                        <p className="text-xs text-muted-foreground">{invoice.paymentMethod}</p>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Badge variant={statusConfig[invoice.status as keyof typeof statusConfig].variant}>
                        {statusConfig[invoice.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>

                    <div className="col-span-1 flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <RiFileTextLine className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <RiDownloadLine className="h-4 w-4" />
                      </Button>
                      {invoice.status !== 'paid' && (
                        <Button variant="outline" size="sm">
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Invoiced</span>
                  <span className="text-sm font-semibold">
                    ${invoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paid</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ${invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                    ${invoices.filter(inv => inv.status === 'pending').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ${invoices.filter(inv => inv.status === 'overdue').reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Collection Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400">87%</div>
                  <p className="text-sm text-muted-foreground">Successfully collected</p>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all"
                    style={{ width: '87%' }}
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Above industry average of 75%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold">
                    ${Math.round(invoices.reduce((acc, inv) => acc + inv.amount, 0) / invoices.length)}
                  </div>
                  <p className="text-sm text-muted-foreground">Per invoice</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Highest:</span>
                    <span className="font-semibold">${Math.max(...invoices.map(inv => inv.amount))}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lowest:</span>
                    <span className="font-semibold">${Math.min(...invoices.map(inv => inv.amount))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <RiCheckLine className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{payment.patient}</p>
                          <Badge variant="outline" className="text-xs">{payment.invoiceId}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {payment.method} • {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        +${payment.amount}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Monthly revenue trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-4">
                  <RiMoneyDollarCircleLine className="h-16 w-16 mx-auto opacity-50" />
                  <p>Revenue charts will be available soon</p>
                  <p className="text-sm">Interactive revenue visualization coming in next update</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Services by Revenue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Post-Surgery Therapy</span>
                    <span className="text-sm font-semibold">$12,400</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sports Injury Rehabilitation</span>
                    <span className="text-sm font-semibold">$8,200</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '50%' }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pain Management</span>
                    <span className="text-sm font-semibold">$4,900</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <RiBillLine className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Credit Card</p>
                      <p className="text-xs text-muted-foreground">45% of payments</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">$11,025</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <RiCheckLine className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Insurance</p>
                      <p className="text-xs text-muted-foreground">35% of payments</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">$8,575</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <RiMoneyDollarCircleLine className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Debit Card</p>
                      <p className="text-xs text-muted-foreground">20% of payments</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">$4,900</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
