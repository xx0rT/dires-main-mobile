import { useEffect, useState } from 'react'
import { useAuth } from './auth-context'
import { supabase } from './supabase'

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const checkAdmin = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle()

      setIsAdmin(data?.is_admin === true)
      setLoading(false)
    }

    checkAdmin()
  }, [user, authLoading])

  return { isAdmin, loading: authLoading || loading }
}
