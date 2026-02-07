import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar10 } from '@/components/layout/navbar'
import { FooterSection } from '@/components/layout/sections/footer'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function MarketingLayout() {
  const location = useLocation()
  const hideFooter = location.pathname.startsWith('/product/')

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar10 />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      {!hideFooter && <FooterSection />}
    </div>
  )
}
