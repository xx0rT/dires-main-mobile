import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth-context'

interface PresenceContextValue {
  onlineUserIds: Set<string>
  isUserOnline: (userId: string) => boolean
}

const PresenceContext = createContext<PresenceContextValue>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
})

export function usePresence() {
  return useContext(PresenceContext)
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) return

    const channel = supabase.channel('online-presence', {
      config: { presence: { key: user.id } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const ids = new Set<string>()
        for (const key of Object.keys(state)) {
          ids.add(key)
        }
        setOnlineUserIds(ids)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    const updateLastSeen = () => {
      supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', user.id)
        .then()
    }
    updateLastSeen()
    const interval = setInterval(updateLastSeen, 30_000)

    return () => {
      channel.unsubscribe()
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [user])

  const isUserOnline = useCallback(
    (userId: string) => onlineUserIds.has(userId),
    [onlineUserIds],
  )

  return (
    <PresenceContext.Provider value={{ onlineUserIds, isUserOnline }}>
      {children}
    </PresenceContext.Provider>
  )
}
