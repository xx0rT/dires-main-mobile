import { Timeline2 } from '@/components/ui/timeline-2'
import { Separator } from '@/components/ui/separator'

const testimonials = [
    {
        subTitle: "Dr. Karel Lewit",
        title: "Průkopník Manuální Medicíny",
        description: "\"Funkce určuje strukturu. Bez správné diagnostiky funkčních poruch nelze dosáhnout trvalého léčebného úspěchu. Manuální medicína je uměním i vědou současně.\"",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
    {
        subTitle: "Berta Bobath",
        title: "Zakladatelka Bobath Konceptu",
        description: "\"Pohyb je životem. Každý pacient má potenciál ke zlepšení, pokud mu poskytneme správnou stimulaci a podmínky pro rozvoj.\"",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
    },
    {
        subTitle: "Prof. Václav Vojta",
        title: "Tvůrce Vojtovy Metody",
        description: "\"Reflexní lokomoce otevírá cestu k aktivaci vrozených pohybových vzorců, které mohou být narušeny. Tělo má schopnost obnovit si správnou funkci, pokud mu ukážeme cestu.\"",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
    },
    {
        subTitle: "Robin McKenzie",
        title: "Zakladatel McKenzie Metody",
        description: "\"Pacienti jsou nejlepšími terapeuty sami sobě. Naším úkolem je naučit je techniky, které jim umožní ovládat svou bolest a předcházet jejímu návratu.\"",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
    },
]

export const ServicesSection = () => {
    return (
        <>
            <section
                id="services"
                className="w-full py-16 sm:py-20 overflow-visible"
            >
                <div className="container mx-auto px-4 mb-8">
                    <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                        Známá Jména
                    </h2>

                    <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                        Možná jste již slyšeli o těchto slavných jménech
                    </h2>
                    <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-2/3">
                        Inspirace od průkopníků fyzioterapie a rehabilitace, jejichž metody formují moderní přístup k léčbě a vzdělávání.
                    </h3>
                </div>

                <Separator className="container mb-12" />

                <Timeline2
                    sections={testimonials}
                    heading="Moudrost legend fyzioterapie"
                />

                <Separator className="container mt-16" />
            </section>
        </>
    )
}
