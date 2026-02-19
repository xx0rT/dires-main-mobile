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

      <div className="relative overflow-hidden bg-muted/70 transition-colors duration-700">
        <img
          src="/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute -bottom-10 -right-16 h-96 w-auto opacity-[0.12] pointer-events-none select-none object-contain dark:opacity-[0.07] dark:invert"
        />
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

      <div className="bg-muted/70 transition-colors duration-700">
        <Feature283 />
      </div>

      <div className="bg-background transition-colors duration-700">
        <TeamSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <BlogShowcaseSection />
      </div>

      <div className="relative overflow-hidden bg-muted/70 transition-colors duration-700">
        <img
          src="/lýtko.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-8 top-0 h-full w-auto opacity-[0.14] pointer-events-none select-none object-contain dark:opacity-[0.07]"
        />
        <PricingSection />
      </div>

      <div className="bg-background transition-colors duration-700">
        <FAQSection />
      </div>

      <div className="bg-muted/70 transition-colors duration-700">
        <ContactSection />
      </div>
    </>
  )
}
