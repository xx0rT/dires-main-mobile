import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { FooterSection } from '@/components/layout/sections/footer'
import { PatternPlaceholder } from '@/components/shadcnblocks/pattern-placeholder'
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
    <>
      <div className="fixed inset-0 z-0">
        <PatternPlaceholder />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, var(--background) 40%, var(--primary) 100%)",
          }}
        />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <FooterSection />
      </div>
    </>
  )
}
