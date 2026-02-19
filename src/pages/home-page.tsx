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

      <div className="bg-muted/70 transition-colors duration-700">
        <BenefitsSection />
      </div>

      <div className="relative overflow-hidden bg-background transition-colors duration-700">
        <img
          src="/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute -left-20 top-1/2 -translate-y-1/2 h-[130%] w-auto opacity-[0.06] pointer-events-none select-none object-contain dark:opacity-[0.04] dark:invert"
        />
        <FeaturesSection />
      </div>

      <div className="relative overflow-hidden bg-background transition-colors duration-700">
        <img
          src="/rameno.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-16 top-0 h-full w-auto opacity-[0.1] pointer-events-none select-none object-contain dark:opacity-[0.05]"
        />
        <TestimonialSection />
      </div>

      <div className="relative overflow-hidden bg-muted/50 transition-colors duration-700">
        <img
          src="/pattern_(kopie).png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none select-none object-cover dark:opacity-[0.03]"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}
        />
        <ServicesSection />
      </div>

      <div className="relative overflow-hidden bg-muted/70 transition-colors duration-700">
        <img
          src="/lýtko.png"
          alt=""
          aria-hidden="true"
          className="absolute -left-12 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.09] pointer-events-none select-none object-contain dark:opacity-[0.05]"
        />
        <Feature283 />
      </div>

      <div className="relative overflow-hidden bg-background transition-colors duration-700">
        <img
          src="/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-20 top-1/2 -translate-y-1/2 h-[120%] w-auto opacity-[0.05] pointer-events-none select-none object-contain dark:opacity-[0.03] dark:invert"
        />
        <TeamSection />
      </div>

      <div className="relative overflow-hidden bg-muted/40 transition-colors duration-700">
        <img
          src="/rameno.png"
          alt=""
          aria-hidden="true"
          className="absolute -right-10 bottom-0 h-[90%] w-auto opacity-[0.09] pointer-events-none select-none object-contain dark:opacity-[0.05]"
        />
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

      <div className="relative overflow-hidden bg-background transition-colors duration-700">
        <img
          src="/pattern_(kopie).png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none select-none object-cover dark:opacity-[0.03]"
          style={{ maskImage: "linear-gradient(to right, black 0%, transparent 50%)", WebkitMaskImage: "linear-gradient(to right, black 0%, transparent 50%)" }}
        />
        <FAQSection />
      </div>

      <div className="relative overflow-hidden bg-muted/70 transition-colors duration-700">
        <img
          src="/lýtko.png"
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.08] pointer-events-none select-none object-contain dark:opacity-[0.04]"
        />
        <img
          src="/rameno.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.08] pointer-events-none select-none object-contain dark:opacity-[0.04]"
        />
        <ContactSection />
      </div>
    </>
  )
}
