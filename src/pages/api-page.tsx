import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiCalendarLine, RiAddLine, RiTimeLine, RiUserLine, RiCheckLine, RiCloseLine, RiMoreLine } from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const appointments = {
  today: [
    {
      id: 1,
      time: '09:00',
      patient: 'Jana Nováková',
      treatment: 'Rehabilitace sportovních zranění',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Kontrolní sezení pro zranění kolene'
    },
    {
      id: 2,
      time: '10:30',
      patient: 'Petr Dvořák',
      treatment: 'Pooperační terapie',
      duration: '45 min',
      status: 'confirmed',
      notes: 'Prvotní vyšetření po operaci ramene'
    },
    {
      id: 3,
      time: '12:00',
      patient: 'Eva Marková',
      treatment: 'Léčba chronické bolesti',
      duration: '60 min',
      status: 'pending',
      notes: 'Léčba bolesti dolní části zad'
    },
    {
      id: 4,
      time: '14:00',
      patient: 'Tomáš Svoboda',
      treatment: 'Zlepšení mobility',
      duration: '45 min',
      status: 'confirmed',
      notes: 'Pravidelná cvičení mobility'
    },
    {
      id: 5,
      time: '15:30',
      patient: 'Lucie Procházková',
      treatment: 'Léčba bolesti krku',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Léčba krční páteře'
    }
  ],
  upcoming: [
    {
      id: 6,
      date: '2024-01-20',
      time: '10:00',
      patient: 'Martin Černý',
      treatment: 'Rehabilitace kolene',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Rehabilitace po operaci ACL'
    },
    {
      id: 7,
      date: '2024-01-21',
      time: '11:00',
      patient: 'Jana Nováková',
      treatment: 'Rehabilitace sportovních zranění',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Pokračování posilování kolene'
    },
    {
      id: 8,
      date: '2024-01-22',
      time: '09:30',
      patient: 'Pavel Novotný',
      treatment: 'Rovnováha a koordinace',
      duration: '45 min',
      status: 'pending',
      notes: 'Program prevence pádů'
    },
    {
      id: 9,
      date: '2024-01-23',
      time: '14:00',
      patient: 'Monika Horáková',
      treatment: 'Léčba artritidy',
      duration: '60 min',
      status: 'confirmed',
      notes: 'Cvičení mobility kloubů'
    }
  ]
}

const statusConfig = {
  confirmed: {
    variant: 'default' as const,
    label: 'Potvrzeno'
  },
  pending: {
    variant: 'secondary' as const,
    label: 'Čeká'
  },
  completed: {
    variant: 'outline' as const,
    label: 'Dokončeno'
  },
  cancelled: {
    variant: 'destructive' as const,
    label: 'Zrušeno'
  }
}

export default function ApiPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Objednávky</h1>
          <p className="text-muted-foreground">Spravujte harmonogram objednávek a návštěvy pacientů.</p>
        </div>
        <Button>
          <RiAddLine className="mr-2 h-4 w-4" />
          Nová objednávka
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dnešní objednávky</CardTitle>
            <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.today.length}</div>
            <p className="text-xs text-muted-foreground">
              {appointments.today.filter(a => a.status === 'confirmed').length} potvrzeno
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tento týden</CardTitle>
            <RiCalendarLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.today.length + appointments.upcoming.length}</div>
            <p className="text-xs text-muted-foreground">V průběhu 5 dní</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Průměrná délka</CardTitle>
            <RiTimeLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55 min</div>
            <p className="text-xs text-muted-foreground">Na objednávku</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Míra dokončení</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96%</div>
            <p className="text-xs text-green-600 dark:text-green-400">Vynikající výkon</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Dnes</TabsTrigger>
          <TabsTrigger value="upcoming">Nadcházející</TabsTrigger>
          <TabsTrigger value="calendar">Kalendářní zobrazení</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dnešní harmonogram</CardTitle>
              <CardDescription>Všechny dnešní objednávky</CardDescription>
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
                      Dokončit
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
              <CardTitle>Nadcházející objednávky</CardTitle>
              <CardDescription>Naplánované objednávky na následujících 7 dní</CardDescription>
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
                      Přeplánovat
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
              <CardTitle>Kalendářní zobrazení</CardTitle>
              <CardDescription>Měsíční kalendář se všemi objednávkami</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-4">
                  <RiCalendarLine className="h-16 w-16 mx-auto opacity-50" />
                  <p>Kalendářní zobrazení bude brzy k dispozici</p>
                  <p className="text-sm">Integrovaná komponenta kalendáře přijde v příští aktualizaci</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
