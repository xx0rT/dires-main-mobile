import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { RiArrowLeftLine, RiMailLine } from '@remixicon/react'
import { site } from '@/config/site'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setEmailSent(true)
      toast.success('Email pro obnovení hesla byl odeslán!')
    } catch (error: any) {
      toast.error(error.message || 'Odeslání emailu se nezdařilo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <img src={site.logo} alt={site.name} width={40} height={40} />
            <span className="text-2xl font-bold">{site.name}</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            {!emailSent ? (
              <>
                <CardTitle className="text-2xl">Obnovení hesla</CardTitle>
                <CardDescription>
                  Zadejte svůj email a my vám pošleme odkaz pro obnovení hesla
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/20 p-3">
                    <RiMailLine className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Zkontrolujte svůj email</CardTitle>
                <CardDescription className="text-center">
                  Poslali jsme odkaz pro obnovení hesla na {email}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {!emailSent ? (
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Odesílání...' : 'Odeslat odkaz pro obnovení'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Nedostali jste email? Zkontrolujte složku spam nebo to zkuste znovu.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Zkusit jiný email
                </Button>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/auth/sign-in"
                className="flex items-center justify-center text-sm text-primary hover:underline"
              >
                <RiArrowLeftLine className="mr-2 h-4 w-4" />
                Zpět na přihlášení
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
