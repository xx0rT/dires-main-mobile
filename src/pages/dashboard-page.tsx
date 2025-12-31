import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiUserLine, RiBookOpenLine, RiAwardLine, RiCalendarLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const stats = [
  {
    title: 'Celkem studentů',
    value: '248',
    change: '+24 tento měsíc',
    icon: RiUserLine,
    trend: 'up'
  },
  {
    title: 'Aktivní kurzy',
    value: '8',
    change: '3 probíhající',
    icon: RiBookOpenLine,
    trend: 'up'
  },
  {
    title: 'Vydané certifikáty',
    value: '156',
    change: '+12 tento týden',
    icon: RiAwardLine,
    trend: 'up'
  },
  {
    title: 'Nadcházející lekce',
    value: '23',
    change: 'Příští 7 dní',
    icon: RiCalendarLine,
    trend: 'neutral'
  }
]

const recentActivity = [
  {
    id: 1,
    title: 'Nový student registrován',
    description: 'Jana Nováková se přihlásila do kurzu Manuální terapie',
    time: 'Před 15 minutami',
    type: 'user'
  },
  {
    id: 2,
    title: 'Certifikát vystaven',
    description: 'Petr Svoboda úspěšně dokončil kurz Sportovní fyzioterapie',
    time: 'Před 1 hodinou',
    type: 'certificate'
  },
  {
    id: 3,
    title: 'Nový kurz přidán',
    description: 'Kurz "Kineziologický taping" byl publikován',
    time: 'Před 3 hodinami',
    type: 'course'
  },
  {
    id: 4,
    title: 'Nadcházející lekce',
    description: 'Manuální terapie - Modul 2 začíná zítra v 9:00',
    time: 'Před 1 dnem',
    type: 'event'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Dobré ráno'
    if (hour < 18) return 'Dobré odpoledne'
    return 'Dobrý večer'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.email?.split('@')[0] || 'vítejte'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Zde je přehled vašich kurzů a aktivity studentů.
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
            <CardTitle>Přehled kurzů</CardTitle>
            <CardDescription>
              Statistiky vašich kurzů za posledních 30 dní
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-4">
                <RiBookOpenLine className="h-16 w-16 mx-auto opacity-50" />
                <p>Grafická vizualizace bude brzy dostupná</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/analytics">Zobrazit všechny kurzy</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Poslední aktivita</CardTitle>
            <CardDescription>
              Nejnovější události z vašich kurzů
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
            <CardTitle>Rychlé akce</CardTitle>
            <CardDescription>
              Běžné úkoly a zkratky
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/analytics">
                <RiBookOpenLine className="mr-2 h-4 w-4" />
                Přidat nový kurz
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/integrations">
                <RiUserLine className="mr-2 h-4 w-4" />
                Spravovat studenty
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/billing">
                <RiAwardLine className="mr-2 h-4 w-4" />
                Vystavit certifikát
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Začínáme</CardTitle>
            <CardDescription>
              Dokončete tyto kroky pro plné využití platformy
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
                <p className="text-sm font-medium">Vytvořit účet</p>
                <p className="text-xs text-muted-foreground">Úspěšně jste se zaregistrovali</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                <div className="h-3 w-3 rounded-full border-2 border-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Přidat první kurz</p>
                <p className="text-xs text-muted-foreground">Vytvořte svůj první fyzioterapeutický kurz</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-muted p-1">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Pozvat studenty</p>
                <p className="text-xs text-muted-foreground">Sdílejte kurzy se svými studenty</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
