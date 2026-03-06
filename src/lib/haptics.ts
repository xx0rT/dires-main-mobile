import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

export async function hapticImpact(style: ImpactStyle = ImpactStyle.Medium) {
  if (!isNative) return
  try {
    await Haptics.impact({ style })
  } catch {}
}

export async function hapticLight() {
  return hapticImpact(ImpactStyle.Light)
}

export async function hapticHeavy() {
  return hapticImpact(ImpactStyle.Heavy)
}

export async function hapticNotification(type: NotificationType = NotificationType.Success) {
  if (!isNative) return
  try {
    await Haptics.notification({ type })
  } catch {}
}

export async function hapticSelection() {
  if (!isNative) return
  try {
    await Haptics.selectionStart()
    await Haptics.selectionChanged()
    await Haptics.selectionEnd()
  } catch {}
}
