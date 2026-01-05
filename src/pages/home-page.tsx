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
      <div className="bg-background">
        <HeroSection />
      </div>

      <div className="bg-background">
        <LogoCloud />
      </div>

      <div className="bg-muted/40">
        <BenefitsSection />
      </div>

      <div className="bg-background">
        <FeaturesSection />
      </div>

      <div className="bg-muted/40">
        <ServicesSection />
      </div>

      <div className="bg-background">
        <TestimonialSection />
      </div>

      <div className="bg-muted/40">
        <TeamSection />
      </div>

      <div className="bg-background">
        <CommunitySection />
      </div>

      <div className="bg-muted/40">
        <PricingSection />
      </div>

      <div className="bg-background">
        <ContactSection />
      </div>

      <div className="bg-muted/40">
        <FAQSection />
      </div>
    </>
  )
}
