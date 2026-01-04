import MagicBento from '@/components/ui/magic-bento'

export const ServicesSection = () => {
    return (
        <section
            id="services"
            className="w-full py-16 sm:py-20"
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

            <div className="w-full flex justify-center px-4">
                <MagicBento
                    textAutoHide={true}
                    enableStars={true}
                    enableSpotlight={true}
                    enableBorderGlow={true}
                    enableTilt={true}
                    enableMagnetism={true}
                    clickEffect={true}
                    spotlightRadius={300}
                    particleCount={12}
                    glowColor="132, 0, 255"
                />
            </div>
        </section>
    )
}
