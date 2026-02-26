import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface WelcomeLoaderProps {
  onComplete: () => void
  username?: string
}

export function WelcomeLoader({ onComplete, username = 'Studente' }: WelcomeLoaderProps) {
  const [phase, setPhase] = useState<'logo' | 'greeting' | 'exit'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('greeting'), 800)
    const t2 = setTimeout(() => setPhase('exit'), 2000)
    const t3 = setTimeout(onComplete, 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        style={{ pointerEvents: phase === 'exit' ? 'none' : 'auto' }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/6 blur-[80px]" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: phase === 'greeting' ? 0.85 : 1,
              opacity: 1,
              y: phase === 'greeting' ? -20 : 0,
            }}
            transition={{
              scale: { type: 'spring', stiffness: 200, damping: 20 },
              opacity: { duration: 0.4 },
              y: { type: 'spring', stiffness: 200, damping: 25 },
            }}
          >
            <img
              src="/Dires.png"
              alt="Dires"
              className="w-20 h-20 dark:invert"
            />
          </motion.div>

          <AnimatePresence>
            {phase === 'greeting' && (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              >
                <motion.p
                  className="text-sm font-medium text-muted-foreground tracking-wide uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  Vitejte zpet
                </motion.p>
                <motion.h1
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {username}
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="w-48 h-0.5 rounded-full bg-border overflow-hidden"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
