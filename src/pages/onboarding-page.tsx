import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const onboardingSteps = [
  {
    title: 'Vítejte v Dires',
    description: 'Váš osobní průvodce fyziologickým tréninkem a wellbeing',
    icon: '👋',
  },
  {
    title: 'Online kurzy',
    description: 'Přístup k odborným kurzům pro zdravé a funkční tělo',
    icon: '🎓',
  },
  {
    title: 'Sledujte pokrok',
    description: 'Gamifikace vašeho učení s odznaky, body a žebříčky',
    icon: '📊',
  },
  {
    title: 'E-shop produktů',
    description: 'Profesionální pomůcky pro vaše cvičení a rehabilitaci',
    icon: '🛍️',
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem('onboarding_completed', 'true')
      navigate('/prehled')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true')
    navigate('/prehled')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-8xl mb-8"
            >
              {onboardingSteps[currentStep].icon}
            </motion.div>

            <h1 className="text-3xl font-bold">
              {onboardingSteps[currentStep].title}
            </h1>

            <p className="text-lg text-muted-foreground">
              {onboardingSteps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-12">
          {onboardingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              }`}
              initial={false}
              animate={{
                width: index === currentStep ? 32 : 8,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 pb-safe">
        <div className="flex gap-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Zpět
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Začít' : 'Další'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={handleSkip}
          className="w-full"
        >
          Přeskočit
        </Button>
      </div>
    </div>
  )
}
