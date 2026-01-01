import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Marquee from "@/components/ui/marquee"

interface Review {
    id: number
    name: string
    rating: number
    date: string
    text: string
    avatar: string
}

export const CommunitySection = () => {

    const reviews: Review[] = [
        {
            id: 1,
            name: "Marie Kolářová",
            rating: 5,
            date: "před 2 týdny",
            text: "Absolvovala jsem zde kurz manuální terapie a byla jsem naprosto nadšená! Lektoři jsou velmi profesionální a dokáží srozumitelně vysvětlit i složité techniky. Určitě doporučuji!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
        },
        {
            id: 2,
            name: "Tomáš Novotný",
            rating: 5,
            date: "před 1 měsícem",
            text: "Výborné vzdělávací centrum! Kurzy jsou velmi dobře organizované a prakticky zaměřené. Po absolvování kurzu sportovní rehabilitace jsem výrazně zlepšil své dovednosti.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
        },
        {
            id: 3,
            name: "Jana Dvořáková",
            rating: 5,
            date: "před 3 týdny",
            text: "Skvělá atmosféra a odborný přístup. Kurz dětské fyzioterapie byl velmi přínosný a prakticky využitelný v mé každodenní praxi. Děkuji!",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
        },
        {
            id: 4,
            name: "Petr Svoboda",
            rating: 5,
            date: "před 2 měsíce",
            text: "Nejlepší vzdělávací instituce v oboru! Lektoři mají obrovské zkušenosti a dokáží předat nejen teorii, ale hlavně praktické dovednosti. Rozhodně se vrátím na další kurzy.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
        },
        {
            id: 5,
            name: "Lucie Procházková",
            rating: 5,
            date: "před 1 týdnem",
            text: "Úžasné kurzy s moderním přístupem. Oceňuji zejména důraz na praktické cvičení a individuální zpětnou vazbu od lektorů. Velmi profesionální!",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
        },
        {
            id: 6,
            name: "Martin Černý",
            rating: 5,
            date: "před 3 měsíce",
            text: "Vynikající kurz Vojtovy metody! Lektoři jsou opravdoví odborníci ve svém oboru. Materiály a praktická výuka na nejvyšší úrovni. Jednoznačně doporučuji všem kolegům.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
        },
        {
            id: 7,
            name: "Eva Málková",
            rating: 5,
            date: "před 2 týdny",
            text: "Profesionální a vstřícný přístup, kvalitní vzdělání. Kurz neurologické rehabilitace splnil všechna má očekávání. Děkuji celému týmu!",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop"
        },
        {
            id: 8,
            name: "David Horák",
            rating: 5,
            date: "před 1 měsícem",
            text: "Skvělá investice do mého profesního rozvoje. Kurzy jsou velmi dobře strukturované a lektoři jsou skutečně odborníci s mnohaletou praxí. Rozhodně se vrátím!",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop"
        }
    ]

    const cardWidths = [350, 420, 380, 450, 400, 370, 440, 390]

    const firstRow = reviews.slice(0, 4)
    const secondRow = reviews.slice(4)

    const ReviewCard = ({ review, width }: { review: Review; width: number }) => {
        const height = Math.round(width * 27 / 100)
        return (
            <Card className="flex-shrink-0 overflow-hidden" style={{ width: `${width}px`, height: `${height}px` }}>
                <CardContent className="p-4 h-full flex items-center gap-3">
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{review.name}</h3>
                            <div className="flex flex-shrink-0">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground text-xs line-clamp-2 leading-tight">
                            {review.text}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <section id="community" className="container mx-auto py-12 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black select-none uppercase tracking-tighter"
                      style={{
                          WebkitTextStroke: '2px rgba(128, 128, 128, 0.1)',
                          color: 'transparent',
                          transform: 'rotate(-5deg)',
                      }}>
                    RECENZE
                </span>
            </div>
            <hr className="border-secondary" />
            <div className="container py-20 sm:py-20 relative z-10">
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Recenze
                    </h2>
                    <h2 className="text-center font-bold text-3xl md:text-4xl mb-4">
                        Co říkají naši{" "}
                        <span className="bg-gradient-to-r from-[#da5319] to-primary bg-clip-text text-transparent">
                            studenti
                        </span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-xl">
                        <span className="font-bold">5.0</span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-muted-foreground">na Google</span>
                    </div>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
                    <Marquee className="[--duration:17.5s]">
                        {firstRow.map((review, index) => (
                            <ReviewCard key={review.id} review={review} width={cardWidths[index]} />
                        ))}
                    </Marquee>
                    <Marquee reverse className="[--duration:17.5s]">
                        {secondRow.map((review, index) => (
                            <ReviewCard key={review.id} review={review} width={cardWidths[index + 4]} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent" />
                </div>
            </div>
            <hr className="border-secondary" />
        </section>
    )
}
