import { ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar_url: string
  slug: string
}

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const ease = [0.25, 0.4, 0.25, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}

const portrait = {
  hidden: { opacity: 0, y: 24, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease },
  },
}

export const HeroSection = () => {
  const navigate = useNavigate()
  const [members, setMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    supabase
      .from("team_members")
      .select("id, name, role, avatar_url, slug")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data }) => setMembers(data ?? []))
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/MG_0170-1024x683-1.jpg.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-32 pb-12 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <Badge
            variant="outline"
            className="mb-8 rounded-full border-white/20 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-sm"
          >
            <Badge className="mr-2 border-0 bg-sky-500 text-white">Nové</Badge>
            Přihlaste se do nadcházejících kurzů
          </Badge>
        </motion.div>

        <motion.h1
          className="mb-6 max-w-4xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-7xl"
          variants={fadeUp}
        >
          Staňte se{" "}
          <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
            Certifikovaným
          </span>{" "}
          Fyzioterapeutem
        </motion.h1>

        <motion.p
          className="mb-10 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
          variants={fadeUp}
        >
          Profesionální kurzy od českých odborníků. Získejte mezinárodně
          uznávaný certifikát a změňte svou kariéru.
        </motion.p>

        <motion.div
          className="mb-20 flex flex-wrap justify-center gap-4"
          variants={fadeUp}
        >
          <Button
            asChild
            size="lg"
            className="group/btn h-12 rounded-full border-0 bg-sky-500 px-8 text-base text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"
          >
            <Link to="/registrace">
              Začít zdarma
              <ArrowRight className="ml-2 size-5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-white/25 bg-white/10 px-8 text-base text-white backdrop-blur-sm hover:bg-white/20"
          >
            <Link to="#pricing">Zobrazit ceník</Link>
          </Button>
        </motion.div>

        {members.length > 0 && (
          <motion.div variants={fadeUp}>
            <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Poznejte náš tým
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-8 md:gap-12"
              variants={stagger}
            >
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  className="group flex cursor-pointer flex-col items-center"
                  variants={portrait}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/tym/${member.slug}`)}
                >
                  <div className="relative mb-3">
                    <div className="absolute -inset-2 rounded-full bg-sky-400/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative size-20 overflow-hidden rounded-full ring-2 ring-white/20 shadow-xl transition-all duration-300 group-hover:ring-sky-400/50 md:size-24">
                      <img
                        src={member.avatar_url}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white">{member.name}</p>
                  <p className="mt-0.5 text-xs text-white/50">{member.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <div className="relative z-10 w-full bg-gradient-to-t from-background via-background to-transparent py-6">
        <div className="group relative m-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-end text-sm text-muted-foreground">
                Spolupracujeme také s
              </p>
            </div>
            <div className="relative py-4 md:w-[calc(100%-11rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/column.svg" alt="Column" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="Lemon Squeezy" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-7 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lilly.svg" alt="Lilly" height="28" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-6 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI" height="24" width="auto" />
                </div>
              </InfiniteSlider>
              <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20" />
              <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20" />
              <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
              <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
