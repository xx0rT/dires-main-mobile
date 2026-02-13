import { BenefitsSection } from '@/components/layout/sections/benefits'
import { BlogShowcaseSection } from '@/components/layout/sections/blog-showcase'
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

      <div className="bg-sky-50/50 dark:bg-sky-950/10 transition-colors duration-700">
        <BenefitsSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <FeaturesSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <TestimonialSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <ServicesSection />
      </div>

      <div className="bg-sky-50/50 dark:bg-sky-950/10 transition-colors duration-700">
        <Feature283 />
      </div>

      <div className="bg-background transition-colors duration-700">
        <TeamSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <BlogShowcaseSection />
      </div>

      <div className="bg-sky-50/50 dark:bg-sky-950/10 transition-colors duration-700">
        <PricingSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <FAQSection />
      </div>

      <div className="bg-sky-50/50 dark:bg-sky-950/10 transition-colors duration-700">
        <ContactSection />
      </div>
    </>
  )
}
