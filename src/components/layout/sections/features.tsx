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

interface FeaturesProps {
    icon: React.ReactNode
    title: string
    description: string
}

const featureList: FeaturesProps[] = [
    {
        icon: <RiShieldKeyholeLine size={24} className="text-primary" />,
        title: "Certifikované Kurzy",
        description:
            "Uznávané české i mezinárodní certifikáty pro praxi po celé Evropě."
    },
    {
        icon: <RiDashboard3Line size={24} className="text-primary" />,
        title: "Praktická Výuka",
        description:
            "Reálná praxe se skutečnými pacienty v moderních zařízeních."
    },
    {
        icon: <RiUploadCloud2Line size={24} className="text-primary" />,
        title: "Online Přístup",
        description:
            "Video lekce a materiály dostupné kdykoli, odkudkoli."
    },
    {
        icon: <RiDatabase2Line size={24} className="text-primary" />,
        title: "Zkušení Lektoři",
        description:
            "Profesionálové s desetiletími praktických zkušeností."
    },
    {
        icon: <RiFireFill size={24} className="text-primary" />,
        title: "Malé Skupiny",
        description:
            "Maximálně 12 studentů pro individuální pozornost."
    },
    {
        icon: <RiStackLine size={24} className="text-primary" />,
        title: "Celoživotní Podpora",
        description:
            "Trvalý přístup k materiálům a síti absolventů."
    }
]

export const FeaturesSection = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
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
                    České metody + moderní techniky = <span className="font-semibold text-foreground">Vaše úspěšná kariéra</span>
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
        </section>
    )
}
