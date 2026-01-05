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

      <div className="bg-muted/30">
        <LogoCloud />
      </div>

      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <BenefitsSection />
          </div>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <FeaturesSection />
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <ServicesSection />
          </div>
        </div>
      </div>

      <div className="bg-muted/30">
        <TestimonialSection />
      </div>

      <div className="bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <TeamSection />
          </div>
        </div>
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <CommunitySection />
          </div>
        </div>
      </div>

      <div className="bg-background">
        <PricingSection />
      </div>

      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-card border border-border/50 shadow-lg p-8 md:p-12">
            <ContactSection />
          </div>
        </div>
      </div>

      <div className="bg-background">
        <FAQSection />
      </div>
    </>
  )
}
