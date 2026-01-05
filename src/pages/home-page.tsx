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

export default function HomePage() {
  return (
    <>
      <div className="bg-background transition-colors duration-700">
        <HeroSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <LogoCloud />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <BenefitsSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <FeaturesSection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <ServicesSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <TestimonialSection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <TeamSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <CommunitySection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <PricingSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <ContactSection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <FAQSection />
      </div>
    </>
  )
}
