import { useEffect, useRef, useState } from 'react'
import { BenefitsSection } from '@/components/layout/sections/benefits'
import { CommunitySection } from '@/components/layout/sections/community'
import { ContactSection } from '@/components/layout/sections/contact'
import { Feature283 } from '@/components/layout/sections/contributors'
import { FAQSection } from '@/components/layout/sections/faq'
import { FeaturesSection } from '@/components/layout/sections/features'
import { HeroSection } from '@/components/layout/sections/hero'
import { PricingSection } from '@/components/layout/sections/pricing'
import { ServicesSection } from '@/components/layout/sections/services'
import { TeamSection } from '@/components/layout/sections/team'
import { TestimonialSection } from '@/components/layout/sections/testimonial'

export default function HomePage() {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setActiveSectionIndex(index)
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const sections = [
    { Component: HeroSection, bg: 'bg-background' },
    { Component: BenefitsSection, bg: 'bg-muted/70' },
    { Component: FeaturesSection, bg: 'bg-background' },
    { Component: ServicesSection, bg: 'bg-muted/70' },
    { Component: PricingSection, bg: 'bg-background' },
    { Component: Feature283, bg: 'bg-muted/70', className: 'ml-75px' },
    { Component: TestimonialSection, bg: 'bg-background' },
    { Component: TeamSection, bg: 'bg-muted/70' },
    { Component: CommunitySection, bg: 'bg-background' },
    { Component: ContactSection, bg: 'bg-background' },
    { Component: FAQSection, bg: 'bg-muted/70' },
  ]

  return (
    <>
      {sections.map(({ Component, bg, className }, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el
          }}
          className={`${bg} ${className || ''} transition-all duration-700`}
          style={{
            opacity: activeSectionIndex === index ? 1 : 0.15,
            transform: activeSectionIndex === index ? 'scale(1)' : 'scale(0.95)',
            filter: activeSectionIndex === index ? 'blur(0px)' : 'blur(3px)',
          }}
        >
          <Component />
        </div>
      ))}
    </>
  )
}
