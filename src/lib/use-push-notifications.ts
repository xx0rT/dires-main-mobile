import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export function usePushNotifications(user: User | null) {
  const registeredRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || registeredRef.current) return
    if (!Capacitor.isNativePlatform()) return

    registeredRef.current = true

    const setup = async () => {
      let permStatus = await PushNotifications.checkPermissions()

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions()
      }

      if (permStatus.receive !== 'granted') return

      await PushNotifications.register()
    }

    PushNotifications.addListener('registration', async (token) => {
      const platform = Capacitor.getPlatform()
      await supabase
        .from('device_tokens')
        .upsert(
          {
            user_id: user.id,
            token: token.value,
            platform,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,token' }
        )
    })

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err.error)
    })

    PushNotifications.addListener('pushNotificationReceived', (_notification) => {
    })

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      const data = notification.notification.data
      if (data?.conversation_id || data?.trainer_id) {
        const trainerId = data.trainer_id || ''
        navigate(`/prehled/zpravy${trainerId ? `?trainer=${trainerId}` : ''}`)
      }
    })

    setup()

    return () => {
      PushNotifications.removeAllListeners()
    }
  }, [user, navigate])
}

export async function unregisterPushToken(userId: string) {
  if (!Capacitor.isNativePlatform()) return

  try {
    await supabase
      .from('device_tokens')
      .delete()
      .eq('user_id', userId)
  } catch {
  }
}
