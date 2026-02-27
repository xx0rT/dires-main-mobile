import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiHeartPulseLine, RiAddLine, RiUserLine, RiTimeLine, RiCheckLine, RiArrowRightLine } from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const treatmentPlans = [
  {
    id: 1,
    name: 'Pooperační rehabilitace kolene',
    patient: 'Sarah Johnson',
    type: 'Ortopedická',
    duration: '12 týdnů',
    progress: 75,
    sessionsCompleted: 9,
    totalSessions: 12,
    status: 'active',
    startDate: '2024-11-15',
    exercises: [
      { name: 'Extenze nohou', sets: 3, reps: 15, completed: true },
      { name: 'Hamstringové rotace', sets: 3, reps: 12, completed: true },
      { name: 'Dřepy u zdi', sets: 2, reps: 10, completed: false },
      { name: 'Balanční cvičení', sets: 3, reps: 10, completed: false }
    ]
  },
  {
    id: 2,
    name: 'Léčba bolesti dolní části zad',
    patient: 'Emma Davis',
    type: 'Léčba bolesti',
    duration: '8 týdnů',
    progress: 60,
    sessionsCompleted: 5,
    totalSessions: 8,
    status: 'active',
    startDate: '2024-12-01',
    exercises: [
      { name: 'Pánvové náklon', sets: 3, reps: 12, completed: true },
      { name: 'Kočka-kráva protažení', sets: 2, reps: 10, completed: true },
      { name: 'Můstek', sets: 3, reps: 15, completed: true },
      { name: 'Ptačí pes', sets: 3, reps: 10, completed: false }
    ]
  },
  {
    id: 3,
    name: 'Zlepšení pohyblivosti ramen',
    patient: 'Michael Chen',
    type: 'Pohyblivost',
    duration: '10 týdnů',
    progress: 45,
    sessionsCompleted: 4,
    totalSessions: 10,
    status: 'active',
    startDate: '2024-12-10',
    exercises: [
      { name: 'Krouhy pažemi', sets: 2, reps: 20, completed: true },
      { name: 'Stažení lopatek', sets: 3, reps: 12, completed: true },
      { name: 'Chůze po zdi', sets: 2, reps: 10, completed: false },
      { name: 'Tahání odporové gumy', sets: 3, reps: 15, completed: false }
    ]
  },
  {
    id: 4,
    name: 'Program úlevy od bolesti krku',
    patient: 'Lisa Anderson',
    type: 'Léčba bolesti',
    duration: '6 týdnů',
    progress: 30,
    sessionsCompleted: 2,
    totalSessions: 6,
    status: 'active',
    startDate: '2024-12-20',
    exercises: [
      { name: 'Rotace krku', sets: 2, reps: 10, completed: true },
      { name: 'Vtažení brady', sets: 3, reps: 15, completed: false },
      { name: 'Pokrčení ramen', sets: 3, reps: 12, completed: false },
      { name: 'Boční ohyby krku', sets: 2, reps: 10, completed: false }
    ]
  }
]

const exerciseLibrary = [
  {
    category: 'Síla',
    exercises: ['Extenze nohou', 'Hamstringové rotace', 'Bicepsové zdvihy', 'Tricepsové natažení', 'Tlak na hrudník']
  },
  {
    category: 'Flexibilita',
    exercises: ['Kočka-kráva protažení', 'Hamstringové natažení', 'Protažení kyčelního flexoru', 'Protažení ramen']
  },
  {
    category: 'Rovnováha',
    exercises: ['Stoj na jedné noze', 'Chůze pata-špička', 'Balanční deska', 'Tandemový postoj']
  },
  {
    category: 'Kardio',
    exercises: ['Chůze', 'Cyklistika', 'Plavání', 'Eliptický trenažér']
  }
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between max-md:hidden">
        <div>
          <h1 className="text-3xl font-bold">Terapeutické plány</h1>
          <p className="text-muted-foreground">Spravujte terapeutické plány a cvičební programy pro vaše pacienty.</p>
        </div>
        <Button>
          <RiAddLine className="mr-2 h-4 w-4" />
          Vytvořit terapeutický plán
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivní plány</CardTitle>
            <RiHeartPulseLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treatmentPlans.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">U {treatmentPlans.length} pacientů</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Průměrný pokrok</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(treatmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / treatmentPlans.length)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Dle plánu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem sezení</CardTitle>
            <RiTimeLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {treatmentPlans.reduce((acc, plan) => acc + plan.sessionsCompleted, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Dokončeno tento měsíc</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Úspěšnost</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600 dark:text-green-400">Dosažených cílů</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Aktivní plány</TabsTrigger>
          <TabsTrigger value="library">Knihovna cviků</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {treatmentPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <Badge>{plan.type}</Badge>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status === 'active' ? 'aktivní' : plan.status}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <RiUserLine className="h-4 w-4" />
                          {plan.patient}
                        </span>
                        <span className="flex items-center gap-1">
                          <RiTimeLine className="h-4 w-4" />
                          {plan.duration}
                        </span>
                        <span>Začátek: {new Date(plan.startDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Upravit plán
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Celkový pokrok</span>
                      <span className="font-semibold">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sezení: {plan.sessionsCompleted} / {plan.totalSessions}</span>
                      <span>Zbývá {plan.totalSessions - plan.sessionsCompleted}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Cvičení</h4>
                      <Button variant="ghost" size="sm">
                        <RiArrowRightLine className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      {plan.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              exercise.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-muted-foreground'
                            }`}>
                              {exercise.completed && (
                                <RiCheckLine className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className={`text-sm font-medium ${
                              exercise.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {exercise.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{exercise.sets} sérií</span>
                            <span>{exercise.reps} opakování</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knihovna cviků</CardTitle>
              <CardDescription>Procházejte a přidávejte cvičení do terapeutických plánů</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {exerciseLibrary.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{category.category}</h3>
                      <Badge variant="outline">{category.exercises.length} cviků</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-medium">{exercise}</span>
                          <Button variant="ghost" size="sm">
                            <RiAddLine className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
