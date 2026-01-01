import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

interface Review {
    id: number
    name: string
    rating: number
    date: string
    text: string
    avatar: string
}

export const CommunitySection = () => {
    const [scrollY, setScrollY] = useState(0)
    const sectionRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect()
                const sectionTop = rect.top
                const sectionHeight = rect.height
                const windowHeight = window.innerHeight

                if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
                    const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight)
                    setScrollY(scrollProgress)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const row1Transform = scrollY * 300
    const row2Transform = scrollY * -300

    return (
        <section id="community" ref={sectionRef} className="container mx-auto py-12 overflow-hidden">
            <hr className="border-secondary" />
            <div className="container py-20 sm:py-20">
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

                <div className="relative space-y-6">
                    <div
                        className="flex gap-6 transition-transform duration-100 ease-out"
                        style={{ transform: `translateX(-${row1Transform}px)` }}
                    >
                        {[...reviews.slice(0, 4), ...reviews.slice(0, 4)].map((review, index) => (
                            <Card key={`row1-${review.id}-${index}`} className="min-w-[350px] flex-shrink-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{review.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-muted-foreground text-sm">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {review.text}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div
                        className="flex gap-6 transition-transform duration-100 ease-out"
                        style={{ transform: `translateX(${row2Transform}px)` }}
                    >
                        {[...reviews.slice(4), ...reviews.slice(4)].map((review, index) => (
                            <Card key={`row2-${review.id}-${index}`} className="min-w-[350px] flex-shrink-0">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{review.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="text-muted-foreground text-sm">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {review.text}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            <hr className="border-secondary" />
        </section>
    )
}
