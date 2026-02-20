import { useRef } from "react"
import { motion, useInView } from "motion/react"

const stats = [
  { value: "500+", label: "Absolventů kurzu" },
  { value: "12+", label: "Let zkušeností" },
  { value: "98%", label: "Spokojenost studentů" },
  { value: "30+", label: "Odborných modulů" },
]

export const BenefitsSection = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      <img
        src="/rameno.png"
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.2] pointer-events-none select-none object-contain dark:opacity-[0.12] mix-blend-multiply"
      />

      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.p
              className="text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-[0.16em] text-sm mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              O nás
            </motion.p>

            <motion.h2
              className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              Dires Fyzio —{" "}
              <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                vzdělávání na nejvyšší úrovni
              </span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed mb-5"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              Získáš systematické know-how, které používají profesionálové. Naučíš se správně vyšetřovat pohybový aparát, rozpoznat skutečné příčiny potíží a zvolit účinnou terapii na míru každému klientovi.
            </motion.p>

            <motion.p
              className="text-muted-foreground text-lg leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.24 }}
            >
              Kurz je navržen tak, aby byl srozumitelný i pro úplné začátečníky, ale zároveň přínosný i pro trenéry, maséry a zdravotnické pracovníky, kteří chtějí rozšířit své dovednosti.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-sky-100 dark:border-sky-900/40 bg-card p-8 text-center shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300"
                initial={{ opacity: 0, y: 28, scale: 0.94 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.18 + i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <p className="text-4xl font-bold bg-gradient-to-br from-sky-600 to-sky-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm font-medium leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
