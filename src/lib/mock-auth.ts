export interface MockUser {
  id: string
  email: string
  created_at: string
}

export interface MockSession {
  user: MockUser
  access_token: string
}

const STORAGE_KEY = 'mock_auth_user'

export const mockAuth = {
  getSession: async (): Promise<{ session: MockSession | null }> => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { session: null }

    try {
      const user = JSON.parse(stored)
      return {
        session: {
          user,
          access_token: 'mock_token_' + user.id
        }
      }
    } catch {
      return { session: null }
    }
  },

  signInWithPassword: async (email: string, _password: string): Promise<{ user: MockUser | null; error: Error | null }> => {
    const user: MockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      created_at: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    return { user, error: null }
  },

  signUp: async (email: string, _password: string): Promise<{ user: MockUser | null; error: Error | null }> => {
    const user: MockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      created_at: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    return { user, error: null }
  },

  signOut: async (): Promise<{ error: Error | null }> => {
    localStorage.removeItem(STORAGE_KEY)
    return { error: null }
  },

  onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
    const checkAuth = async () => {
      const { session } = await mockAuth.getSession()
      callback('SIGNED_IN', session)
    }

    checkAuth()

    return {
      subscription: {
        unsubscribe: () => {}
      }
    }
  }
}
