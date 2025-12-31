import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { RiGithubFill, RiArrowRightLine } from '@remixicon/react'
import { site } from '@/config/site'

export default function SignInPage() {
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Úspěšně přihlášeno!')
    } catch (error: any) {
      toast.error(error.message || 'Přihlášení se nezdařilo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src={site.logo} alt={site.name} width={40} height={40} />
            <span className="text-2xl font-bold">{site.name}</span>
          </Link>
          <h2 className="text-4xl font-bold mb-4">Vítejte zpět!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Přihlaste se pro přístup k vašim kurzům a správě studentů.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/20 p-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Bezpečné přihlášení</h3>
                <p className="text-muted-foreground text-sm">Vaše data jsou chráněna nejmodernějším zabezpečením.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/20 p-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rychlý přístup</h3>
                <p className="text-muted-foreground text-sm">Okamžitý přístup ke všem vašim kurzům a materiálům.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <Card className="w-full max-w-md border-0 shadow-none lg:shadow-sm lg:border">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <img src={site.logo} alt={site.name} width={32} height={32} />
              <span className="text-xl font-bold">{site.name}</span>
            </div>
            <CardTitle className="text-2xl">Přihlášení do účtu</CardTitle>
            <CardDescription>
              Zadejte svůj email a heslo pro přístup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jmeno@priklad.cz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Heslo</Label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Zapomenuté heslo?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Zapamatovat si mě
                </label>
              </div>
              <Button type="submit" className="w-full group" disabled={loading}>
                {loading ? 'Přihlašování...' : 'Přihlásit se'}
                <RiArrowRightLine className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Nebo pokračujte s
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Sociální přihlášení již brzy!')}
            >
              <RiGithubFill className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Nemáte ještě účet?{' '}
              <Link to="/auth/sign-up" className="font-medium text-primary hover:underline">
                Zaregistrujte se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
