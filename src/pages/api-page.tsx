import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiCalendarLine, RiAddLine, RiTimeLine, RiUserLine, RiCheckLine, RiCloseLine, RiMoreLine } from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const appointments = {
  today: [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      treatment: 'Sports Injury Rehabilitation',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Follow-up session for knee injury'
    },
    {
      id: 2,
      time: '10:30 AM',
      patient: 'Michael Chen',
      treatment: 'Post-Surgery Therapy',
      duration: '45 min',
      status: 'confirmed',
      notes: 'Initial assessment after shoulder surgery'
    },
    {
      id: 3,
      time: '12:00 PM',
      patient: 'Emma Davis',
      treatment: 'Chronic Pain Management',
      duration: '60 min',
      status: 'pending',
      notes: 'Lower back pain treatment'
    },
    {
      id: 4,
      time: '02:00 PM',
      patient: 'James Wilson',
      treatment: 'Mobility Enhancement',
      duration: '45 min',
      status: 'confirmed',
      notes: 'Regular mobility exercises'
    },
    {
      id: 5,
      time: '03:30 PM',
      patient: 'Lisa Anderson',
      treatment: 'Neck Pain Management',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Cervical spine treatment'
    }
  ],
  upcoming: [
    {
      id: 6,
      date: '2024-01-20',
      time: '10:00 AM',
      patient: 'David Martinez',
      treatment: 'Knee Rehabilitation',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Post-ACL surgery rehabilitation'
    },
    {
      id: 7,
      date: '2024-01-21',
      time: '11:00 AM',
      patient: 'Sarah Johnson',
      treatment: 'Sports Injury Rehabilitation',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Continue knee strengthening exercises'
    },
    {
      id: 8,
      date: '2024-01-22',
      time: '09:30 AM',
      patient: 'Robert Taylor',
      treatment: 'Balance and Coordination',
      duration: '45 min',
      status: 'pending',
      notes: 'Fall prevention program'
    },
    {
      id: 9,
      date: '2024-01-23',
      time: '02:00 PM',
      patient: 'Jennifer White',
      treatment: 'Arthritis Management',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Joint mobility exercises'
    }
  ]
}

const statusConfig = {
  confirmed: {
    variant: 'default' as const,
    label: 'Confirmed'
  },
  pending: {
    variant: 'secondary' as const,
    label: 'Pending'
  },
  completed: {
    variant: 'outline' as const,
    label: 'Completed'
  },
  cancelled: {
    variant: 'destructive' as const,
    label: 'Cancelled'
  }
}

export default function ApiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your appointment schedule and patient visits.</p>
        </div>
        <Button>
          <RiAddLine className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.today.length}</div>
            <p className="text-xs text-muted-foreground">
              {appointments.today.filter(a => a.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.today.length + appointments.upcoming.length}</div>
            <p className="text-xs text-muted-foreground">Across 5 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <RiTimeLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55 min</div>
            <p className="text-xs text-muted-foreground">Per appointment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-green-600 dark:text-green-400">Excellent performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>All appointments for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.today.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg bg-primary/10">
                      <RiTimeLine className="h-5 w-5 text-primary mb-1" />
                      <span className="text-sm font-bold text-primary">{appointment.time}</span>
                      <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{appointment.patient}</h4>
                            <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                              {statusConfig[appointment.status as keyof typeof statusConfig].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiUserLine className="h-4 w-4" />
                        <span>{appointment.notes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <RiCheckLine className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RiMoreLine className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Scheduled appointments for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointments.upcoming.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg bg-primary/10">
                      <RiCalendarLine className="h-5 w-5 text-primary mb-1" />
                      <span className="text-xs font-semibold text-primary">
                        {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-muted-foreground">{appointment.time}</span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{appointment.patient}</h4>
                            <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                              {statusConfig[appointment.status as keyof typeof statusConfig].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RiTimeLine className="h-4 w-4" />
                        <span>{appointment.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{appointment.notes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RiCloseLine className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Monthly calendar with all appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-4">
                  <RiCalendarLine className="h-16 w-16 mx-auto opacity-50" />
                  <p>Calendar view will be available soon</p>
                  <p className="text-sm">Integrated calendar component coming in next update</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
