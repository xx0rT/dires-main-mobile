import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { AnimatedTooltip } from "@/components/magicui/animated-tooltip"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar_url: string
  slug: string
}

const ease = [0.25, 0.4, 0.25, 1] as const

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const imgReveal = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
}

export const HeroSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id, name, role, avatar_url, slug")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data }) => setMembers(data ?? []))
  }, [])

  const tooltipItems = members.map((m, i) => ({
    id: i + 1,
    name: m.name,
    designation: m.role,
    image: m.avatar_url,
  }))

  return (
    <section className="pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="lg:border-y">
        <motion.div
          className="container flex flex-col max-lg:divide-y lg:flex-row"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 lg:border-l">
            <div className="py-8 lg:border-b lg:pr-8 lg:pb-8 lg:pl-4">
              <motion.h1
                className="text-[2.5rem] leading-[1.15] font-semibold tracking-tight md:text-[3.5rem] md:leading-[1.12] lg:text-6xl"
                variants={fadeUp}
              >
                Náš tým{" "}
                {tooltipItems.length > 0 && (
                  <span className="inline-flex items-start gap-4 align-middle">
                    <span className="relative flex items-start">
                      <span className="flex [&>div:nth-child(1)]:-rotate-3 [&>div:nth-child(2)]:rotate-2 [&>div:nth-child(3)]:-rotate-1 [&>div]:transition-transform [&>div]:duration-300 [&>div:hover]:rotate-0">
                        <AnimatedTooltip items={tooltipItems} />
                      </span>
                    </span>
                  </span>
                )}{" "}
                vytváří profesionální{" "}
                <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                  vzdělávání
                </span>{" "}
                v oblasti fyzioterapie.
              </motion.h1>
              <motion.p
                className="mt-6 max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl"
                variants={fadeUp}
              >
                Od myšlenky k realizaci — připravujeme ucelené kurzy,
                certifikace a nástroje pro fyzioterapeuty všech úrovní.
              </motion.p>
            </div>

            <motion.div
              className="relative mt-10 aspect-[3/2.4] overflow-hidden rounded-xl lg:mr-8 lg:mb-10 lg:ml-4"
              variants={imgReveal}
            >
              <img
                src="/MG_0170-1024x683-1.jpg.webp"
                alt="Dires tým při práci"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>

          <div className="lg:border-x lg:px-8">
            <div className="flex justify-center gap-6 pt-8 lg:gap-8 lg:pt-0">
              <motion.div
                className="relative mt-16 aspect-[1/1.1] h-[200px] overflow-hidden rounded-xl lg:mt-32 lg:h-[296px]"
                variants={imgReveal}
              >
                <img
                  src="/Dires.png"
                  alt="Dires"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <motion.div
                className="relative mt-8 aspect-[1/1.1] h-[200px] overflow-hidden rounded-xl lg:mt-16 lg:h-[296px]"
                variants={imgReveal}
              >
                <img
                  src="/image.png"
                  alt="Fyzioterapie"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>

            <motion.p
              className="mt-10 px-2 leading-relaxed tracking-tight text-muted-foreground md:mt-14 lg:px-4"
              variants={fadeUp}
            >
              Naší misí je umožnit každému fyzioterapeutovi dosáhnout svého
              plného potenciálu. Poskytujeme inovativní nástroje a ucelené
              kurzy, které zjednodušují vzdělávací proces a pomáhají
              profesionálům dosahovat výjimečných výsledků.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3 px-2 pb-8 lg:px-4"
              variants={fadeUp}
            >
              <Button size="lg" asChild>
                <Link to="/registrace">
                  Začít zdarma
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/kurzy">Prozkoumat kurzy</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
