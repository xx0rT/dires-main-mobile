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
  return (
    <>
      <div className="bg-background transition-colors duration-700">
        <HeroSection />
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
        <PricingSection />
      </div>

      <div className="ml-75px bg-muted/70 transition-colors duration-700">
        <Feature283 />
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

      <div className="bg-background transition-colors duration-700">
        <ContactSection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <FAQSection />
      </div>
    </>
  )
}
