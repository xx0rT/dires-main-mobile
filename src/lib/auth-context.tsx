import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { App as CapApp } from '@capacitor/app'
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession((prev) => {
        if (prev?.access_token === newSession?.access_token) return prev
        return newSession
      })
      setUser((prev) => {
        const newUser = newSession?.user ?? null
        if (prev?.id === newUser?.id) return prev
        return newUser
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listener = CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('auth-callback')) {
        const hashPart = url.split('#')[1]
        if (!hashPart) return

        const params = new URLSearchParams(hashPart)
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!error && data.session) {
            setUser(data.session.user)
            setSession(data.session)
            navigate('/prehled')
          }
        }

        Browser.close()
      }
    })

    return () => {
      listener.then(l => l.remove())
    }
  }, [navigate])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    setUser(data.user)
    setSession(data.session)

    const pendingPlan = localStorage.getItem('pending_plan')
    if (pendingPlan) {
      localStorage.removeItem('pending_plan')
      navigate('/', { state: { scrollTo: 'pricing', selectedPlan: pendingPlan } })
    } else {
      navigate('/prehled')
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/prehled`,
      }
    })
    if (error) throw error

    if (data.session) {
      setUser(data.user)
      setSession(data.session)
      localStorage.removeItem('onboarding_completed')

      const pendingPlan = localStorage.getItem('pending_plan')
      if (pendingPlan) {
        localStorage.removeItem('pending_plan')
        navigate('/onboarding')
      } else {
        navigate('/onboarding')
      }
    }
  }

  const signInWithGoogle = async () => {
    if (Capacitor.isNativePlatform()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.dires.app://auth-callback',
          skipBrowserRedirect: true,
        },
      })
      if (error) throw error
      if (data.url) {
        await Browser.open({ url: data.url, presentationStyle: 'popover' })
      }
    } else {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/prehled`,
        },
      })
      if (error) throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
