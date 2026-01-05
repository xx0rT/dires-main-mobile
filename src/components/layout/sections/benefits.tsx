import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

interface BenefitsProps {
    icon: string
    title: string
    description: string
}

const benefitList: BenefitsProps[] = [
    {
        icon: "Rocket",
        title: "Rychlý Start Kariéry",
        description:
            "Získejte certifikát během 3-6 měsíců a začněte praktikovat rychleji než tradičními programy."
    },
    {
        icon: "Award",
        title: "Mezinárodní Certifikát",
        description:
            "Uznávaný v celé Evropě. Otevřete si možnosti práce v jakékoli zemi."
    },
    {
        icon: "Users",
        title: "Osobní Mentoring",
        description:
            "Individuální vedení od zkušených fyzioterapeutů pro vaše nejlepší výsledky."
    },
    {
        icon: "Shield",
        title: "Ověřené Techniky",
        description:
            "České metody prověřené desetiletími úspěšné klinické praxe."
    }
]

export const BenefitsSection = () => {
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
                    {benefitList.map(({ icon, title, description }, index) => (
                        <Card
                            key={title}
                            className="group/number transition-all delay-75 hover:bg-sidebar"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
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
                                {description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
