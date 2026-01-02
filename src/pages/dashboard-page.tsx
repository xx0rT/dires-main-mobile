import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiUserLine, RiCalendarLine, RiBillLine, RiHeartPulseLine, RiArrowRightLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

const stats = [
  {
    title: 'Total Patients',
    value: '142',
    change: '+8 this month',
    icon: RiUserLine,
    trend: 'up'
  },
  {
    title: 'Appointments Today',
    value: '12',
    change: '3 completed',
    icon: RiCalendarLine,
    trend: 'neutral'
  },
  {
    title: 'Active Treatments',
    value: '87',
    change: '+15 this week',
    icon: RiHeartPulseLine,
    trend: 'up'
  },
  {
    title: 'Revenue This Month',
    value: '$24,500',
    change: '+12% from last month',
    icon: RiBillLine,
    trend: 'up'
  }
]

const upcomingAppointments = [
  {
    id: 1,
    patient: 'Sarah Johnson',
    treatment: 'Sports Injury Rehabilitation',
    time: '10:00 AM',
    status: 'confirmed',
    type: 'Follow-up'
  },
  {
    id: 2,
    patient: 'Michael Chen',
    treatment: 'Post-Surgery Therapy',
    time: '11:30 AM',
    status: 'confirmed',
    type: 'Initial Assessment'
  },
  {
    id: 3,
    patient: 'Emma Davis',
    treatment: 'Chronic Pain Management',
    time: '2:00 PM',
    status: 'pending',
    type: 'Follow-up'
  },
  {
    id: 4,
    patient: 'James Wilson',
    treatment: 'Mobility Enhancement',
    time: '3:30 PM',
    status: 'confirmed',
    type: 'Regular Session'
  }
]

const recentActivity = [
  {
    id: 1,
    title: 'New Patient Registered',
    description: 'Sarah Mitchell completed registration for lower back pain treatment',
    time: '15 minutes ago',
    type: 'patient'
  },
  {
    id: 2,
    title: 'Treatment Completed',
    description: 'Michael Chen finished post-surgery rehabilitation session',
    time: '1 hour ago',
    type: 'treatment'
  },
  {
    id: 3,
    title: 'Payment Received',
    description: '$250 payment received from Emma Davis for therapy sessions',
    time: '2 hours ago',
    type: 'payment'
  },
  {
    id: 4,
    title: 'Appointment Scheduled',
    description: 'James Wilson booked follow-up appointment for next week',
    time: '1 day ago',
    type: 'appointment'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, Dr. {user?.email?.split('@')[0] || 'Therapist'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's your clinic overview and today's schedule.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>
                  You have {upcomingAppointments.length} appointments scheduled for today
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/api">
                  View All
                  <RiArrowRightLine className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg bg-primary/10">
                      <span className="text-sm font-bold text-primary">{appointment.time}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{appointment.patient}</p>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your clinic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/api">
                <RiCalendarLine className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/integrations">
                <RiUserLine className="mr-2 h-4 w-4" />
                Add New Patient
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/analytics">
                <RiHeartPulseLine className="mr-2 h-4 w-4" />
                Create Treatment Plan
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/billing">
                <RiBillLine className="mr-2 h-4 w-4" />
                Process Payment
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to set up your clinic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
                <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Create Account</p>
                <p className="text-xs text-muted-foreground">Successfully registered as a therapist</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                <div className="h-3 w-3 rounded-full border-2 border-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Add Your First Patient</p>
                <p className="text-xs text-muted-foreground">Start managing patient records and treatments</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-muted p-1">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Schedule Appointments</p>
                <p className="text-xs text-muted-foreground">Book your first therapy session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
