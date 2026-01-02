import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RiHeartPulseLine, RiAddLine, RiUserLine, RiTimeLine, RiCheckLine, RiArrowRightLine } from '@remixicon/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const treatmentPlans = [
  {
    id: 1,
    name: 'Post-Surgery Knee Rehabilitation',
    patient: 'Sarah Johnson',
    type: 'Orthopedic',
    duration: '12 weeks',
    progress: 75,
    sessionsCompleted: 9,
    totalSessions: 12,
    status: 'active',
    startDate: '2024-11-15',
    exercises: [
      { name: 'Leg Extensions', sets: 3, reps: 15, completed: true },
      { name: 'Hamstring Curls', sets: 3, reps: 12, completed: true },
      { name: 'Wall Squats', sets: 2, reps: 10, completed: false },
      { name: 'Balance Exercises', sets: 3, reps: 10, completed: false }
    ]
  },
  {
    id: 2,
    name: 'Lower Back Pain Management',
    patient: 'Emma Davis',
    type: 'Pain Management',
    duration: '8 weeks',
    progress: 60,
    sessionsCompleted: 5,
    totalSessions: 8,
    status: 'active',
    startDate: '2024-12-01',
    exercises: [
      { name: 'Pelvic Tilts', sets: 3, reps: 12, completed: true },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, completed: true },
      { name: 'Bridge Exercise', sets: 3, reps: 15, completed: true },
      { name: 'Bird Dog', sets: 3, reps: 10, completed: false }
    ]
  },
  {
    id: 3,
    name: 'Shoulder Mobility Enhancement',
    patient: 'Michael Chen',
    type: 'Mobility',
    duration: '10 weeks',
    progress: 45,
    sessionsCompleted: 4,
    totalSessions: 10,
    status: 'active',
    startDate: '2024-12-10',
    exercises: [
      { name: 'Arm Circles', sets: 2, reps: 20, completed: true },
      { name: 'Shoulder Blade Squeeze', sets: 3, reps: 12, completed: true },
      { name: 'Wall Walks', sets: 2, reps: 10, completed: false },
      { name: 'Resistance Band Pulls', sets: 3, reps: 15, completed: false }
    ]
  },
  {
    id: 4,
    name: 'Neck Pain Relief Program',
    patient: 'Lisa Anderson',
    type: 'Pain Management',
    duration: '6 weeks',
    progress: 30,
    sessionsCompleted: 2,
    totalSessions: 6,
    status: 'active',
    startDate: '2024-12-20',
    exercises: [
      { name: 'Neck Rotations', sets: 2, reps: 10, completed: true },
      { name: 'Chin Tucks', sets: 3, reps: 15, completed: false },
      { name: 'Shoulder Shrugs', sets: 3, reps: 12, completed: false },
      { name: 'Neck Side Bends', sets: 2, reps: 10, completed: false }
    ]
  }
]

const exerciseLibrary = [
  {
    category: 'Strength',
    exercises: ['Leg Extensions', 'Hamstring Curls', 'Bicep Curls', 'Tricep Extensions', 'Chest Press']
  },
  {
    category: 'Flexibility',
    exercises: ['Cat-Cow Stretch', 'Hamstring Stretch', 'Hip Flexor Stretch', 'Shoulder Stretch']
  },
  {
    category: 'Balance',
    exercises: ['Single Leg Stand', 'Heel-to-Toe Walk', 'Balance Board', 'Tandem Stance']
  },
  {
    category: 'Cardio',
    exercises: ['Walking', 'Cycling', 'Swimming', 'Elliptical']
  }
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Treatment Plans</h1>
          <p className="text-muted-foreground">Manage treatment plans and exercise programs for your patients.</p>
        </div>
        <Button>
          <RiAddLine className="mr-2 h-4 w-4" />
          Create Treatment Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <RiHeartPulseLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treatmentPlans.filter(p => p.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Across {treatmentPlans.length} patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(treatmentPlans.reduce((acc, plan) => acc + plan.progress, 0) / treatmentPlans.length)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">On track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <RiTimeLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {treatmentPlans.reduce((acc, plan) => acc + plan.sessionsCompleted, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <RiCheckLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600 dark:text-green-400">Goals achieved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="library">Exercise Library</TabsTrigger>
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
                          {plan.status}
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
                        <span>Started: {new Date(plan.startDate).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-semibold">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{ width: `${plan.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Sessions: {plan.sessionsCompleted} / {plan.totalSessions}</span>
                      <span>{plan.totalSessions - plan.sessionsCompleted} remaining</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Exercises</h4>
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
                            <span>{exercise.sets} sets</span>
                            <span>{exercise.reps} reps</span>
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
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>Browse and add exercises to treatment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {exerciseLibrary.map((category, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{category.category}</h3>
                      <Badge variant="outline">{category.exercises.length} exercises</Badge>
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
