import MagicBento from '@/components/ui/magic-bento'
import { ShapeDivider } from '@/components/ui/shape-divider'

const physioItems = [
    {
        title: 'Manuální Terapie',
        description: 'Pokročilé techniky mobilizace kloubů a měkkých tkání pro efektivní léčbu pohybových dysfunkcí',
        icon: '🤲',
        span: 'md:col-span-2 md:row-span-2',
        href: 'https://www.physio-pedia.com/Manual_Therapy'
    },
    {
        title: 'Sportovní Rehabilitace',
        description: 'Specializované postupy pro návrat sportovců k maximálnímu výkonu',
        icon: '⚽',
        span: 'md:col-span-1 md:row-span-1',
        href: 'https://www.physio-pedia.com/Sports_Physiotherapy'
    },
    {
        title: 'Neurologická Rehabilitace',
        description: 'Vojtova metoda, Bobath koncept a další přístupy k neurologickým pacientům',
        icon: '🧠',
        span: 'md:col-span-1 md:row-span-1',
        href: 'https://www.physio-pedia.com/Neurological_Physiotherapy'
    },
    {
        title: 'Dětská Fyzioterapie',
        description: 'Komplexní péče o vývojové obtíže a pediatrické diagnózy',
        icon: '👶',
        span: 'md:col-span-1 md:row-span-2',
        href: 'https://www.physio-pedia.com/Paediatric_Physiotherapy'
    },
    {
        title: 'Respirační Fyzioterapie',
        description: 'Moderní techniky dechové rehabilitace a plicní hygieny',
        icon: '💨',
        span: 'md:col-span-2 md:row-span-1',
        href: 'https://www.physio-pedia.com/Respiratory_Physiotherapy'
    }
]

export const ServicesSection = () => {
    return (
        <section
            id="services"
            className="relative w-full py-16 sm:py-20 overflow-visible"
        >
            <ShapeDivider position="top" variant="waves" flip={true} />
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
                    items={physioItems}
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
            <ShapeDivider position="bottom" variant="curve" />
        </section>
    )
}
