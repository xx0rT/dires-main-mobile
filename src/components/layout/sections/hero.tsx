import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  return (
    <section className="relative min-h-screen w-full flex flex-col -mt-20 pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/MG_0170-1024x683-1.jpg.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
      </div>

      <div className="container relative z-10 mx-auto w-full px-4 flex-1 flex flex-col justify-center py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 rounded-2xl py-2 text-sm bg-white/10 border-white/25 text-white backdrop-blur-sm"
            >
              <span className="mr-2">
                <Badge className="bg-sky-500 border-0 text-white">Nové</Badge>
              </span>
              Přihlaste se do našich nadcházejících kurzů!
            </Badge>
          </motion.div>

          <motion.h1
            className="font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Staňte se{" "}
            <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
              Certifikovaným Fyzioterapeutem
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/75 leading-relaxed max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Profesionální kurzy od českých odborníků. Získejte mezinárodně uznávaný certifikát během měsíců.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="group/arrow rounded-full bg-sky-500 hover:bg-sky-400 text-white border-0 shadow-xl shadow-sky-900/30"
            >
              <Link to="/registrace">
                Začít zdarma
                <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <Link to="#pricing">Zobrazit ceník</Link>
            </Button>
          </motion.div>

          {members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <p className="text-white/50 text-xs uppercase tracking-[0.18em] font-medium mb-4">
                Váš tým instruktorů
              </p>
              <div className="flex flex-wrap gap-3">
                {members.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -16, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.55 + i * 0.08 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                  >
                    <Link to={`/tym/${member.slug}`}>
                      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 hover:bg-white/20 hover:border-sky-400/40 transition-all duration-300 cursor-pointer">
                        <Avatar className="size-9 ring-2 ring-sky-400/50 shrink-0">
                          <AvatarImage src={member.avatar_url} className="object-cover" />
                          <AvatarFallback className="bg-sky-900/80 text-sky-200 text-xs font-bold">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">{member.name}</p>
                          <p className="text-white/55 text-xs mt-0.5 leading-tight">{member.role}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full py-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="group relative m-auto max-w-7xl px-6">
          <div className="flex flex-col items-center md:flex-row gap-4">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-end text-muted-foreground text-sm">Spolupracujeme také s</p>
            </div>
            <div className="relative py-4 md:w-[calc(100%-11rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/column.svg" alt="Column Logo" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub Logo" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike Logo" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="Lemon Squeezy Logo" height="20" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel Logo" height="16" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-7 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lilly.svg" alt="Lilly Logo" height="28" width="auto" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-6 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI Logo" height="24" width="auto" />
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
