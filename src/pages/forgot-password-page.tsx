import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { RiArrowLeftLine } from '@remixicon/react'
import { site } from '@/config/site'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setEmailSent(true)
      toast.success('Zkontrolujte svůj email pro odkaz na reset hesla!')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || 'Něco se pokazilo')
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
            <CardTitle className="text-2xl">Obnovení hesla</CardTitle>
            <CardDescription>
              Zadejte svůj email a dostanete ověřovací kód
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4 text-center">
                <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <p className="font-medium">Email byl odeslán!</p>
                  <p className="mt-2 text-sm">
                    Zkontrolujte svou emailovou schránku a klikněte na odkaz pro reset hesla.
                  </p>
                </div>
                <Link
                  to="/auth/sign-in"
                  className="flex items-center justify-center text-sm text-primary hover:underline"
                >
                  <RiArrowLeftLine className="mr-2 h-4 w-4" />
                  Zpět na přihlášení
                </Link>
              </div>
            ) : (
              <>
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
                    {loading ? 'Odesílání...' : 'Odeslat odkaz na reset'}
                  </Button>
                </form>

                <div className="mt-6">
                  <Link
                    to="/auth/sign-in"
                    className="flex items-center justify-center text-sm text-primary hover:underline"
                  >
                    <RiArrowLeftLine className="mr-2 h-4 w-4" />
                    Zpět na přihlášení
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
