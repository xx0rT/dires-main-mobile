import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"

const ease = [0.25, 0.4, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease },
  },
}

function AnimatedBlock({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  variant?: "fadeUp" | "scaleIn"
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const v = variant === "scaleIn" ? scaleIn : fadeUp

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: v.hidden,
        visible: {
          ...v.visible,
          transition: { ...v.visible.transition, delay },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const BenefitsSection = () => {
  return (
    <section className={cn("py-32 dark:bg-background")} id="about">
      <div className="container mx-auto px-4">
        <div className="grid gap-14 pb-28 md:grid-cols-2 md:items-start">
          <AnimatedBlock>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
              O nás
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.15] md:text-4xl lg:text-[2.75rem]">
              Dires Fyzio — Vzdělávání{" "}
              <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                na nejvyšší úrovni
              </span>
            </h2>
          </AnimatedBlock>
          <AnimatedBlock delay={0.1}>
            <p className="text-lg leading-relaxed text-muted-foreground md:pt-8">
              Naše platforma nabízí intuitivní řešení pro vzdělávání
              v oblasti fyzioterapie. Poskytujeme ucelené kurzy, praktické
              nástroje a odborné vedení, které pomáhají studentům i profesionálům
              rozvíjet své dovednosti a budovat úspěšnou kariéru.
            </p>
          </AnimatedBlock>
        </div>

        <AnimatedBlock variant="scaleIn">
          <img
            src="/MG_0170-1024x683-1.jpg.webp"
            alt="Dires tým při práci"
            className="ml-auto aspect-video max-h-[550px] w-full rounded-2xl object-cover shadow-lg"
          />
        </AnimatedBlock>
        <AnimatedBlock delay={0.08}>
          <p className="mt-6 text-center text-xl text-muted-foreground lg:text-right">
            Odhodláni zjednodušit cestu k profesionální fyzioterapii
          </p>
        </AnimatedBlock>

        <div className="flex flex-col justify-between gap-14 py-32 lg:flex-row lg:items-center">
          <AnimatedBlock>
            <p className="mx-auto max-w-xl text-center text-2xl font-medium leading-snug lg:mx-0 lg:text-left">
              Jsme tým zkušených fyzioterapeutů, trenérů a pedagogů
              s jedním společným cílem.
            </p>
          </AnimatedBlock>
          <AnimatedBlock delay={0.1}>
            <div className="grid shrink-0 grid-cols-3 items-center gap-8">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">500+</span>
                <span className="text-xs text-muted-foreground">Absolventů</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">12+</span>
                <span className="text-xs text-muted-foreground">Let praxe</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">98%</span>
                <span className="text-xs text-muted-foreground">Spokojenost</span>
              </div>
            </div>
          </AnimatedBlock>
        </div>

        <div className="grid gap-14 lg:grid-cols-4 xl:grid-cols-5">
          <div className="md:col-span-2 xl:col-span-3">
            <AnimatedBlock>
              <h3 className="mb-10 text-4xl font-semibold">Proč jsme začali</h3>
            </AnimatedBlock>
            <AnimatedBlock delay={0.08}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Viděli jsme na vlastní oči, s jakými problémy se studenti
                fyzioterapie potýkají. Složité anatomické pojmy, nedostatek
                praxe a zastaralé výukové metody. Místo opakování stejných
                chyb jsme chtěli vytvořit systém, který celý vzdělávací
                proces zjednoduší od základů až po pokročilé techniky.
              </p>
            </AnimatedBlock>
            <AnimatedBlock delay={0.16}>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Naší misí je poskytnout každému přístup k profesionálnímu
                vzdělání v oblasti pohybového aparátu. Věříme, že odstraněním
                bariér a zpřístupněním kvalitních materiálů můžeme pomoci
                týmům i jednotlivcům soustředit se na to, co umí nejlépe
                — pomáhat lidem žít bez bolesti.
              </p>
            </AnimatedBlock>

            <AnimatedBlock delay={0.24}>
              <div className="mt-8 grid grid-cols-2 gap-6 text-center">
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="text-2xl font-bold md:text-4xl">2012</span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    Rok založení
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-card p-6 shadow-sm">
                  <span className="text-2xl font-bold md:text-4xl">30+</span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    Odborných modulů
                  </span>
                </div>
              </div>
            </AnimatedBlock>
          </div>

          <AnimatedBlock
            className="md:col-span-2"
            variant="scaleIn"
            delay={0.12}
          >
            <img
              src="/Dires.png"
              alt="Dires Fyzio"
              className="w-full rounded-2xl object-cover shadow-lg"
            />
          </AnimatedBlock>
        </div>
      </div>
    </section>
  )
}
