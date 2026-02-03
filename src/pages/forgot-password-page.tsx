import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { RiArrowLeftLine } from '@remixicon/react'
import { site } from '@/config/site'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-password-reset-code`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Něco se pokazilo')
        return
      }

      toast.success('Ověřovací kód byl odeslán na váš email!')
      navigate('/auth/reset-password', { state: { email } })
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
                {loading ? 'Odesílání...' : 'Odeslat ověřovací kód'}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
