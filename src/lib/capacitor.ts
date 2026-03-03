import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { App } from '@capacitor/app'
import { supabase } from './supabase'

export const isNative = Capacitor.isNativePlatform()

const APP_SCHEME = 'com.dires.app'
const CALLBACK_PATH = 'auth/callback'

export function getRedirectUrl(): string {
  if (isNative) {
    return `${APP_SCHEME}://${CALLBACK_PATH}`
  }
  return `${window.location.origin}/auth/callback`
}

export async function openOAuthInBrowser(url: string): Promise<void> {
  await Browser.open({ url, windowName: '_self' })
}

export function setupDeepLinkListener(
  onSessionReady: () => void
): () => void {
  if (!isNative) return () => {}

  const handler = App.addListener('appUrlOpen', async ({ url }) => {
    if (!url.includes(CALLBACK_PATH)) return

    const hashOrQuery = url.includes('#') ? url.split('#')[1] : url.split('?')[1]
    if (!hashOrQuery) return

    const params = new URLSearchParams(hashOrQuery)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      if (!error) {
        onSessionReady()
      }
    }

    await Browser.close()
  })

  return () => {
    handler.then((h) => h.remove())
  }
}
