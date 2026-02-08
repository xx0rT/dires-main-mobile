import { useEffect } from 'react'

export default function VerticalScrollLock() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.style.overflowX = 'hidden'
    body.style.overflowX = 'hidden'

    return () => {
      html.style.overflowX = ''
      body.style.overflowX = ''
    }
  }, [])

  return null
}
