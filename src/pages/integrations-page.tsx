import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RiSearchLine, RiAddLine, RiPhoneLine, RiMailLine, RiCalendarLine, RiFileTextLine } from '@remixicon/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const patients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    condition: 'Sports Injury',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22',
    status: 'active',
    treatmentProgress: 75
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '+1 (555) 234-5678',
    condition: 'Post-Surgery Rehabilitation',
    lastVisit: '2024-01-14',
    nextAppointment: '2024-01-21',
    status: 'active',
    treatmentProgress: 45
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.d@email.com',
    phone: '+1 (555) 345-6789',
    condition: 'Chronic Back Pain',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-25',
    status: 'active',
    treatmentProgress: 60
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'j.wilson@email.com',
    phone: '+1 (555) 456-7890',
    condition: 'Mobility Enhancement',
    lastVisit: '2024-01-08',
    nextAppointment: null,
    status: 'inactive',
    treatmentProgress: 100
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '+1 (555) 567-8901',
    condition: 'Neck Pain Management',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-19',
    status: 'active',
    treatmentProgress: 30
  },
  {
    id: 6,
    name: 'David Martinez',
    email: 'dmartinez@email.com',
    phone: '+1 (555) 678-9012',
    condition: 'Knee Rehabilitation',
    lastVisit: '2024-01-11',
    nextAppointment: '2024-01-20',
    status: 'active',
    treatmentProgress: 55
  }
]

export default function IntegrationsPage() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and treatment history.</p>
        </div>
        <Button>
          <RiAddLine className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or condition..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{patient.condition}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RiMailLine className="h-4 w-4" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RiPhoneLine className="h-4 w-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RiCalendarLine className="h-4 w-4" />
                        <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Treatment Progress</span>
                          <span className="font-medium">{patient.treatmentProgress}%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{ width: `${patient.treatmentProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {patient.nextAppointment && (
                      <div className="flex items-center gap-2 text-sm bg-primary/5 border border-primary/20 rounded-lg p-2">
                        <RiCalendarLine className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Next appointment:</span>
                        <span className="font-medium">{new Date(patient.nextAppointment).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <RiFileTextLine className="mr-2 h-4 w-4" />
                    View Records
                  </Button>
                  <Button variant="outline" size="sm">
                    <RiCalendarLine className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Statistics</CardTitle>
          <CardDescription>Overview of your patient base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold mt-1">{patients.length}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Active Treatments</p>
              <p className="text-2xl font-bold mt-1">{patients.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">Completed Treatments</p>
              <p className="text-2xl font-bold mt-1">{patients.filter(p => p.treatmentProgress === 100).length}</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground">New This Month</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
