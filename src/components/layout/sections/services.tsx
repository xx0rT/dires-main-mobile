import ScrollStack, { ScrollStackItem } from "@/components/ui/scroll-stack"

const serviceList = [
    {
        title: "Manuální Terapeutické Techniky",
        description:
            "Ovládněte mobilizaci měkkých tkání, manipulaci kloubů a myofasciální uvolnění pomocí tradičních českých metod.",
        gradient: "from-blue-500/10 to-cyan-500/10",
        borderColor: "border-blue-500/20",
        image: "/demo-img.png"
    },
    {
        title: "Sportovní Rehabilitace",
        description:
            "Specializované školení v léčbě sportovních zranění a optimalizaci sportovního výkonu.",
        gradient: "from-green-500/10 to-emerald-500/10",
        borderColor: "border-green-500/20",
        image: "/dash.png"
    },
    {
        title: "Neurologická Rehabilitace",
        description:
            "Pokročilé techniky pro léčbu neurologických stavů pomocí Vojtovy a Bobathovy metody.",
        gradient: "from-orange-500/10 to-amber-500/10",
        borderColor: "border-orange-500/20",
        image: "/indie.png"
    },
    {
        title: "Dětská Fyzioterapie",
        description:
            "Specializované kurzy ve vývoji dítěte a léčbě pediatrických onemocnění.",
        gradient: "from-pink-500/10 to-rose-500/10",
        borderColor: "border-pink-500/20",
        image: "/image.png"
    }
]

export const ServicesSection = () => {
    return (
        <section
            id="services"
            className="w-full py-16 sm:py-20 min-h-screen"
        >
            <div className="container mx-auto px-4 mb-12">
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
            </div>

            <div className="w-full flex justify-center">
                <ScrollStack
                    itemDistance={110}
                    useWindowScroll={true}
                >
                    {serviceList.map(({ title, description, gradient, borderColor, image }) => (
                        <ScrollStackItem
                            key={title}
                            itemClassName={`bg-gradient-to-br ${gradient} border-2 ${borderColor} backdrop-blur-sm max-w-4xl mx-auto`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 items-center h-full">
                                <div className="flex-shrink-0 w-48 h-48 rounded-2xl overflow-hidden bg-white/50">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <h3 className="font-bold text-2xl md:text-3xl mb-4">
                                        {title}
                                    </h3>
                                    <p className="text-muted-foreground text-lg">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </ScrollStackItem>
                    ))}
                </ScrollStack>
            </div>
        </section>
    )
}
