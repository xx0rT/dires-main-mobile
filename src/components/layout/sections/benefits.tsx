import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

interface BenefitsProps {
    icon: string
    title: string
    description: string
    detailedInfo: string[]
}

const benefitList: BenefitsProps[] = [
    {
        icon: "Rocket",
        title: "Rychlý Start Kariéry",
        description:
            "Získejte certifikát během 3-6 měsíců a začněte praktikovat rychleji než tradičními programy.",
        detailedInfo: [
            "Intenzivní kurzy s flexibilním rozvrhem",
            "Praktická výuka hned od prvního dne",
            "Možnost pracovat již během studia",
            "Certifikace uznávaná zaměstnavateli"
        ]
    },
    {
        icon: "Award",
        title: "Mezinárodní Certifikát",
        description:
            "Uznávaný v celé Evropě. Otevřete si možnosti práce v jakékoli zemi.",
        detailedInfo: [
            "Akreditace podle evropských standardů",
            "Platnost ve všech členských státech EU",
            "Možnost kariérního růstu v zahraničí",
            "Mezinárodně uznávané kvalifikace"
        ]
    },
    {
        icon: "Users",
        title: "Osobní Mentoring",
        description:
            "Individuální vedení od zkušených fyzioterapeutů pro vaše nejlepší výsledky.",
        detailedInfo: [
            "1-na-1 konzultace s odborníky",
            "Personalizovaný studijní plán",
            "Zpětná vazba k vašemu pokroku",
            "Podpora i po dokončení kurzu"
        ]
    },
    {
        icon: "Shield",
        title: "Ověřené Techniky",
        description:
            "České metody prověřené desetiletími úspěšné klinické praxe.",
        detailedInfo: [
            "Tradice české fyzioterapeutické školy",
            "Vědecky podložené přístupy",
            "Kombinace teorie a praxe",
            "Aktualizované podle nejnovějších poznatků"
        ]
    }
]

export const BenefitsSection = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <section id="benefits" className="container mx-auto px-4 py-16 sm:py-20 relative">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[50%] w-[70%] animate-pulse bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 blur-3xl" />
            </div>

            <div className="grid place-items-start lg:grid-cols-2 lg:gap-24">
                <div className="sticky top-32 self-start" data-aos="fade-right">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Výhody
                    </h2>

                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                        Proč Si Vybrat Naše Kurzy
                    </h2>
                    <p className="mb-8 text-muted-foreground text-xl">
                        Staňte se certifikovaným fyzioterapeutem rychleji a efektivněji. <span className="font-semibold text-foreground">Začněte svou kariéru ještě dnes.</span>
                    </p>
                    <Button asChild size="lg" className="group/arrow rounded-full">
                        <Link to="/auth/sign-up">
                            Vytvořit účet zdarma
                            <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                        </Link>
                    </Button>
                </div>

                <div className="grid w-full gap-4 lg:grid-cols-2" data-aos="fade-left">
                    {benefitList.map(({ icon, title, description, detailedInfo }, index) => (
                        <Card
                            key={title}
                            className={`group/number transition-all duration-500 ease-in-out hover:bg-sidebar ${
                                hoveredIndex === null
                                    ? 'opacity-100 scale-100'
                                    : hoveredIndex === index
                                    ? 'lg:col-span-2 opacity-100 scale-100 z-10'
                                    : 'opacity-0 scale-95 absolute pointer-events-none'
                            }`}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <CardHeader>
                                <div className="flex justify-between">
                                    <Icon
                                        name={icon as keyof typeof icons}
                                        size={32}
                                        color="var(--primary)"
                                        className="mb-6 text-primary"
                                    />
                                    <span className="font-medium text-5xl text-muted-foreground/15 transition-all delay-75 group-hover/number:text-muted-foreground/30">
                                        0{index + 1}
                                    </span>
                                </div>

                                <CardTitle>{title}</CardTitle>
                            </CardHeader>

                            <CardContent className="text-muted-foreground">
                                {hoveredIndex === index ? (
                                    <div className="space-y-4">
                                        <p className="text-base">{description}</p>
                                        <div className="mt-4 space-y-2">
                                            <h4 className="font-semibold text-foreground text-sm">Klíčové výhody:</h4>
                                            <ul className="space-y-2">
                                                {detailedInfo.map((info, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-primary mt-1">✓</span>
                                                        <span className="text-sm">{info}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    description
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
