import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

interface BenefitsProps {
    icon: string
    title: string
    description: string
}

const benefitList: BenefitsProps[] = [
    {
        icon: "Rocket",
        title: "Rychlé Vzdělávání",
        description:
            "Zrychlené programy navržené tak, abyste mohli efektivně praktikovat během měsíců, ne let. Intenzivní moduly zaměřené na praktické dovednosti."
    },
    {
        icon: "Award",
        title: "Mezinárodní Uznání",
        description:
            "Certifikáty uznávané v celé Evropě a mezinárodně. Otevřete si dveře k praxi v mnoha zemích s českými certifikovanými referencemi."
    },
    {
        icon: "Users",
        title: "Odborné Mentorství",
        description:
            "Individuální vedení od zkušených fyzioterapeutů. Získejte osobní zpětnou vazbu a kariérní rady během celé vaší cesty."
    },
    {
        icon: "Shield",
        title: "Osvědčené Metody",
        description:
            "Učte se časem ověřené české techniky podložené desetiletími klinického výzkumu a úspěšnými výsledky pacientů po celém světě."
    }
]

export const BenefitsSection = () => {
    return (
        <section id="benefits" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid place-items-start lg:grid-cols-2 lg:gap-24">
                <div className="sticky top-32 self-start" data-aos="fade-right">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Výhody
                    </h2>

                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                        Vaše Cesta k Dokonalosti
                    </h2>
                    <p className="mb-8 text-muted-foreground text-xl">
                        Připojte se ke stovkám úspěšných fyzioterapeutů, kteří transformovali své kariéry prostřednictvím našich vzdělávacích programů českých metod. Odborná výuka, praktické zkušenosti a celoživotní podpora.
                    </p>
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
