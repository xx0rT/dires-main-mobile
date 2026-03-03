import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const pendingPlan = localStorage.getItem('pending_plan')
        if (pendingPlan) {
          localStorage.removeItem('pending_plan')
          navigate('/', { state: { scrollTo: 'pricing', selectedPlan: pendingPlan }, replace: true })
        } else {
          navigate('/prehled', { replace: true })
        }
      } else {
        navigate('/prihlaseni', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
