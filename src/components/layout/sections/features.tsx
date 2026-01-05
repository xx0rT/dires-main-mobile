import {
    RiShieldKeyholeLine,
    RiDashboard3Line,
    RiUploadCloud2Line,
    RiDatabase2Line,
    RiFireFill,
    RiStackLine
} from "@remixicon/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RotatingText from "@/components/ui/rotating-text"
import { ShapeDivider } from "@/components/ui/shape-divider"

interface FeaturesProps {
    icon: React.ReactNode
    title: string
    description: string
}

const featureList: FeaturesProps[] = [
    {
        icon: <RiShieldKeyholeLine size={24} className="text-primary" />,
        title: "Certifikované Vzdělávání",
        description:
            "Všechny kurzy jsou certifikované a uznávané českými lékařskými asociacemi a mezinárodními fyzioterapeutickými radami."
    },
    {
        icon: <RiDashboard3Line size={24} className="text-primary" />,
        title: "Praktická Výuka",
        description:
            "Rozsáhlé praktické lekce se skutečnými pacienty pod odborným dohledem v moderních zařízeních."
    },
    {
        icon: <RiUploadCloud2Line size={24} className="text-primary" />,
        title: "Online Materiály",
        description:
            "Přístup ke komplexním video knihovnám, studijním materiálům a dokumentaci kdykoli a kdekoli."
    },
    {
        icon: <RiDatabase2Line size={24} className="text-primary" />,
        title: "Zkušení Lektoři",
        description:
            "Učte se od zkušených českých fyzioterapeutů s desetiletími klinické praxe a výukových zkušeností."
    },
    {
        icon: <RiFireFill size={24} className="text-primary" />,
        title: "Malé Skupiny",
        description:
            "Omezená velikost tříd zajišťuje individuální pozornost a optimální výsledky pro každého studenta."
    },
    {
        icon: <RiStackLine size={24} className="text-primary" />,
        title: "Celoživotní Podpora",
        description:
            "Připojte se k naší síti absolventů s neustálým přístupem ke zdrojům, aktualizacím a možnostem profesního rozvoje."
    }
]

export const FeaturesSection = () => {
    return (
        <section id="features" className="container relative mx-auto px-4 py-16 sm:py-20">
            <ShapeDivider position="top" variant="curve" flip={true} />
            <div className="sticky top-24 z-10 bg-background/95 backdrop-blur-sm pb-6 -mx-4 px-4">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Vlastnosti Kurzů
                </h2>

                <div className="mb-4 flex justify-center items-center gap-2 font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    <span>Proč Si Vybrat</span>
                  <RotatingText
                    texts={['Certifikované Vzdělávání', 'Praktickou Výuku', 'Online Materiály', 'Zkušené Lektory', 'Malé Skupiny', 'Celoživotní Podporu']}
                    mainClassName="px-2 sm:px-2 md:px-3 bg-purple-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                  />
                </div>

                <h3 className="mx-auto text-center text-muted-foreground text-xl md:w-1/2" data-aos="fade-up" data-aos-delay="200">
                    Naše komplexní fyzioterapeutické kurzy kombinují tradiční české metody s moderními rehabilitačními technikami pro nejlepší vzdělávací zkušenost.
                </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {featureList.map(({ icon, title, description }, index) => (
                    <div key={title} data-aos="fade-up" data-aos-delay={index * 100}>
                        <Card className="h-full border-0 bg-background shadow-none">
                            <CardHeader className="flex items-center justify-center gap-4 align-middle pb-2">
                                <div className="rounded-full bg-primary/20 p-2 ring-8 ring-primary/10">
                                    {icon}
                                </div>

                                <CardTitle>{title}</CardTitle>
                            </CardHeader>

                            <CardContent className="text-center text-muted-foreground">
                                {description}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
            <ShapeDivider position="bottom" variant="tilt" />
        </section>
    )
}
