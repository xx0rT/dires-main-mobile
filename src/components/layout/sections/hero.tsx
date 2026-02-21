import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ArrowUpRight, CalendarCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AnimatedTooltip } from "@/components/magicui/animated-tooltip"
import { supabase } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar_url: string
  slug: string
}

interface HeroCard {
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  isExternal?: boolean
}

const cards: HeroCard[] = [
  {
    title: "Rezervace v DIRES",
    description:
      "Objednejte se na osobni konzultaci nebo terapii. Nas tym zkusenych fyzioterapeutu je pripraveny vam pomoci s individualnim pristupem zamerenym na vase specificke potreby a cile. Vybirejte z siroke nabidky terminu.",
    image: "/MG_0170-1024x683-1.jpg.webp",
    imageAlt: "Fyzioterapie v DIRES",
    href: "#contact",
    isExternal: true,
  },
  {
    title: "Prozkoumejte kurzy",
    description:
      "Online vzdelavani v oblasti fyzioterapie. Profesionalni kurzy, certifikace a nastroje pro vase karierni rust. Ucte se vlastnim tempem odkudkoliv s pristupem k videum, materialum a interaktivnim testum od prednich odborniku.",
    image: "https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    imageAlt: "Online kurzy fyzioterapie",
    href: "/kurzy",
  },
]

export const HeroSection = () => {
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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

  const handleTooltipClick = (item: { id: number }) => {
    const member = members[item.id - 1]
    if (member?.slug) {
      navigate(`/tym/${member.slug}`)
    }
  }

  const handleCardClick = (card: HeroCard) => {
    if (card.isExternal || card.href.startsWith("#")) {
      const el = document.querySelector(card.href)
      el?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate(card.href)
    }
  }

  return (
    <section className="relative -mt-20 flex min-h-svh flex-col justify-center overflow-hidden bg-background pb-12 pt-24">
      <div className="pointer-events-none absolute inset-0">
        <img
          src="/pattern.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full select-none object-cover opacity-[0.07] mix-blend-multiply dark:opacity-[0.04]"
        />
        <div className="absolute top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px] dark:bg-blue-500/15" />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex max-w-4xl flex-col items-center gap-4">
              <h1 className="text-4xl font-medium tracking-tight text-balance md:text-5xl lg:text-6xl">
                Profesionalni vzdelavani v oblasti fyzioterapie
              </h1>
              {tooltipItems.length > 0 && (
                <div className="flex items-center gap-3 rounded-full border border-border/50 bg-background/80 px-5 py-2.5 backdrop-blur-sm">
                  <span className="relative z-50 flex items-center justify-center [&>div:nth-child(1)]:-rotate-3 [&>div:nth-child(2)]:rotate-2 [&>div:nth-child(3)]:-rotate-1 [&>div]:transition-transform [&>div]:duration-300 [&>div:hover]:rotate-0">
                    <AnimatedTooltip items={tooltipItems} onItemClick={handleTooltipClick} />
                  </span>
                  <span className="ml-1 text-base font-semibold text-foreground">
                    Nas tym
                  </span>
                </div>
              )}
              <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
                Od myslenky k realizaci — pripravujeme ucelene kurzy,
                certifikace a nastroje pro fyzioterapeuty vsech urovni.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <a href="#contact">
                  <CalendarCheck className="mr-2 size-4" />
                  Rezervovat termin
                </a>
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/kurzy")}>
                Prozkoumat kurzy
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>

          <div
            className="hide-scrollbar mx-auto flex w-full max-w-5xl gap-4 overflow-x-auto pb-4 md:overflow-visible md:pb-0"
            role="list"
          >
            {cards.map((card, index) => {
              const isHovered = hoveredIndex === index
              const isOtherHovered =
                hoveredIndex !== null && hoveredIndex !== index

              return (
                <motion.article
                  layout
                  key={card.title}
                  role="listitem"
                  className={cn(
                    "group relative flex min-h-96 min-w-72 flex-none cursor-pointer overflow-hidden rounded-xl border border-border/60 transition duration-300 md:min-w-0 md:flex-1",
                  )}
                  onClick={() => handleCardClick(card)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  tabIndex={0}
                  animate={{
                    flex: isHovered ? 1.3 : isOtherHovered ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition duration-500",
                      isHovered ? "scale-105" : "scale-100",
                    )}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70 transition duration-300 group-hover:via-black/50 group-hover:to-black/80" />

                  <div className="relative z-10 flex h-full w-full flex-col justify-between">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
                        {card.title}
                      </h3>
                    </div>
                    <motion.div
                      layout
                      className="flex w-full items-end gap-4 p-6"
                      initial={false}
                      animate={{
                        justifyContent: isHovered
                          ? "space-between"
                          : "flex-start",
                      }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <AnimatePresence initial={false}>
                        {isHovered && (
                          <motion.p
                            layout
                            key="card-description"
                            className="flex-1 text-sm text-white/90 md:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2,
                              ease: "easeInOut",
                            }}
                          >
                            {card.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <motion.span
                        layout
                        className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-sm"
                        initial={false}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <ArrowUpRight className="size-4" />
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
