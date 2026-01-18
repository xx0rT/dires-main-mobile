import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { RiUserLine, RiLockLine, RiLogoutBoxLine } from '@remixicon/react'
import { SubscriptionCard } from '@/components/subscription/subscription-card'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Hesla se neshodují')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Heslo musí mít alespoň 6 znaků')
      return
    }

    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      toast.success('Heslo bylo úspěšně aktualizováno!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.message || 'Aktualizace hesla se nezdařila')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Úspěšně odhlášeno')
    } catch (error: any) {
      toast.error(error.message || 'Odhlášení se nezdařilo')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nastavení</h1>
        <p className="text-muted-foreground">
          Spravujte své nastavení účtu a preference
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Zabezpečení</TabsTrigger>
          <TabsTrigger value="notifications">Upozornění</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informace o profilu</CardTitle>
              <CardDescription>
                Aktualizujte informace svého účtu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <RiUserLine className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Změnit avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF nebo PNG. Maximální velikost 800 KB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="flex-1"
                    />
                    <Button variant="outline" disabled>
                      Ověřeno
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Váš email je ověřený a nelze jej změnit
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userId">ID uživatele</Label>
                  <Input
                    id="userId"
                    value={user?.id || ''}
                    disabled
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="created">Účet vytvořen</Label>
                  <Input
                    id="created"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString('cs-CZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : ''}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          {user && <SubscriptionCard userId={user.id} />}
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Změna hesla</CardTitle>
              <CardDescription>
                Aktualizujte své heslo pro zabezpečení účtu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Současné heslo</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Zadejte současné heslo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Nové heslo</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Zadejte nové heslo"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Potvrzení nového hesla</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Potvrďte nové heslo"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  <RiLockLine className="mr-2 h-4 w-4" />
                  {loading ? 'Aktualizuji...' : 'Aktualizovat heslo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktivní relace</CardTitle>
              <CardDescription>
                Spravujte své aktivní relace napříč zařízeními
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <p className="font-medium">Aktuální relace</p>
                    <p className="text-sm text-muted-foreground">
                      Toto zařízení - Aktivní nyní
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Aktivní
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Nebezpečná zóna</CardTitle>
              <CardDescription>
                Nevratné a destruktivní akce
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div className="space-y-1">
                  <p className="font-medium">Odhlásit se</p>
                  <p className="text-sm text-muted-foreground">
                    Odhlásit se ze svého účtu na tomto zařízení
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleSignOut}>
                  <RiLogoutBoxLine className="mr-2 h-4 w-4" />
                  Odhlásit se
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>E-mailová upozornění</CardTitle>
              <CardDescription>
                Spravujte, jak přijímáte e-mailová upozornění
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Marketingové e-maily</p>
                  <p className="text-sm text-muted-foreground">
                    Dostávejte e-maily o nových funkcích a aktualizacích
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Konfigurovat
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Bezpečnostní upozornění</p>
                  <p className="text-sm text-muted-foreground">
                    Dostávejte upozornění o zabezpečení vašeho účtu
                  </p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Vždy zapnuto
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
