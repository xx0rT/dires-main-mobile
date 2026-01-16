import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockAuth, type MockUser, type MockSession } from './mock-auth'

interface AuthContextType {
  user: MockUser | null
  session: MockSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [session, setSession] = useState<MockSession | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    mockAuth.getSession().then(({ session }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { subscription } = mockAuth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { user, error } = await mockAuth.signInWithPassword(email, password)
    if (error) throw error
    setUser(user)
    setSession(user ? { user, access_token: 'mock_token_' + user.id } : null)
    navigate('/dashboard')
  }

  const signUp = async (email: string, password: string) => {
    const { user, error } = await mockAuth.signUp(email, password)
    if (error) throw error
    setUser(user)
    setSession(user ? { user, access_token: 'mock_token_' + user.id } : null)
    navigate('/dashboard')
  }

  const signOut = async () => {
    const { error } = await mockAuth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
