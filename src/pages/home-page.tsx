import { BenefitsSection } from '@/components/layout/sections/benefits'
import { CommunitySection } from '@/components/layout/sections/community'
import { ContactSection } from '@/components/layout/sections/contact'
import { FAQSection } from '@/components/layout/sections/faq'
import { FeaturesSection } from '@/components/layout/sections/features'
import { HeroSection } from '@/components/layout/sections/hero'
import { PricingSection } from '@/components/layout/sections/pricing'
import { ServicesSection } from '@/components/layout/sections/services'
import { TeamSection } from '@/components/layout/sections/team'
import { TestimonialSection } from '@/components/layout/sections/testimonial'
import LogoCloud from '@/components/logo-cloud'
import { WaveDivider } from '@/components/ui/wave-divider'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <WaveDivider variant={1} />
      <BenefitsSection />
      <FeaturesSection />
      <WaveDivider variant={2} flip />
      <ServicesSection />
      <TestimonialSection />
      <WaveDivider variant={1} />
      <TeamSection />
      <CommunitySection />
      <WaveDivider variant={2} flip />
      <PricingSection />
      <ContactSection />
      <FAQSection />
    </>
  )
}
