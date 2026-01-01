import {
    RiShieldKeyholeLine,
    RiDashboard3Line,
    RiUploadCloud2Line,
    RiDatabase2Line,
    RiFireFill,
    RiStackLine
} from "@remixicon/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        <section id="features" className="container mx-auto px-4 py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black select-none uppercase tracking-tighter"
                      style={{
                          WebkitTextStroke: '2px rgba(128, 128, 128, 0.1)',
                          color: 'transparent',
                          transform: 'rotate(3deg)',
                      }}>
                    FUNKCE
                </span>
            </div>
            <div className="sticky top-24 z-10 bg-background/95 backdrop-blur-sm pb-6 -mx-4 px-4">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Vlastnosti Kurzů
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    Proč Si Vybrat Nás
                </h2>

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
        </section>
    )
}
