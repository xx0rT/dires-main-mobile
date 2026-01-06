import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { FooterSection } from '@/components/layout/sections/footer'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function MarketingLayout() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>
  )
}
