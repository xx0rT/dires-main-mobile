import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

enum ServiceStatus {
    SOON = 1,
    READY = 0
}
interface ServiceProps {
    title: string
    pro: ServiceStatus
    description: string
}
const serviceList: ServiceProps[] = [
    {
        title: "Manuální Terapeutické Techniky",
        description:
            "Ovládněte mobilizaci měkkých tkání, manipulaci kloubů a myofasciální uvolnění pomocí tradičních českých metod.",
        pro: 0
    },
    {
        title: "Sportovní Rehabilitace",
        description:
            "Specializované školení v léčbě sportovních zranění a optimalizaci sportovního výkonu.",
        pro: 0
    },
    {
        title: "Neurologická Rehabilitace",
        description:
            "Pokročilé techniky pro léčbu neurologických stavů pomocí Vojtovy a Bobathovy metody.",
        pro: 0
    },
    {
        title: "Dětská Fyzioterapie",
        description:
            "Specializované kurzy ve vývoji dítěte a léčbě pediatrických onemocnění.",
        pro: 1
    }
]

export const ServicesSection = () => {
    return (
        <section
            id="services"
            className="container mx-auto px-4 py-16 sm:py-20 relative overflow-hidden"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black select-none uppercase tracking-tighter"
                      style={{
                          WebkitTextStroke: '2px rgba(128, 128, 128, 0.1)',
                          color: 'transparent',
                          transform: 'rotate(-2deg)',
                      }}>
                    KURZY
                </span>
            </div>
            <div className="relative z-10">
            <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                Specializace Kurzů
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                Oblasti Odbornosti
            </h2>
            <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2">
                Vyberte si z naší komplexní nabídky specializovaných fyzioterapeutických kurzů.
                Každý program je navržen tak, aby poskytoval hlubokou expertízu v konkrétních léčebných oblastech.
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />

            <div className="mx-auto grid w-full gap-4 sm:grid-cols-2 lg:w-[60%] lg:grid-cols-2">
                {serviceList.map(({ title, description }) => (
                    <Card
                        key={title}
                        className="relative h-full bg-muted/60"
                    >
                        <CardHeader>
                            <CardTitle className="font-bold text-lg">
                                {title}
                            </CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                       
                    </Card>
                ))}
            </div>
            </div>
        </section>
    )
}
