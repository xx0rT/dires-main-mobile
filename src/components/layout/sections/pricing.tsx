import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

enum PopularPlan {
    NO = 0,
    YES = 1
}

interface PlanProps {
    title: string
    popular: PopularPlan
    price: number
    description: string
    buttonText: string
    benefitList: string[]
}

const plans: PlanProps[] = [
    {
        title: "Základní",
        popular: 0,
        price: 890,
        description:
            "Ideální pro začátečníky zahajující svou fyzioterapeutickou cestu se základními technikami.",
        buttonText: "Přihlásit se",
        benefitList: [
            "40 hodin výuky",
            "Základní manuální terapie",
            "Online studijní materiály",
            "Certifikát o absolvování",
            "6 měsíců přístupu ke zdrojům"
        ]
    },
    {
        title: "Profesionální",
        popular: 1,
        price: 1590,
        description:
            "Komplexní program pro praktiky hledající pokročilou certifikaci.",
        buttonText: "Přihlásit se",
        benefitList: [
            "80 hodin výuky",
            "Pokročilé manuální techniky",
            "Klinické praktické lekce",
            "Mezinárodní certifikát",
            "Celoživotní přístup ke zdrojům"
        ]
    },
    {
        title: "Mistrovský",
        popular: 0,
        price: 2890,
        description:
            "Elitní výukový program pro zkušené odborníky specializující se na pokročilé metody.",
        buttonText: "Kontaktujte nás",
        benefitList: [
            "120+ hodin výuky",
            "Specializované certifikace",
            "Individuální mentorství",
            "Certifikace lektora",
            "Přístup do sítě absolventů"
        ]
    }
]

export const PricingSection = () => {
    return (
        <section id="pricing" className="container mx-auto px-4 py-16 sm:py-20 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black select-none uppercase tracking-tighter"
                      style={{
                          WebkitTextStroke: '2px rgba(128, 128, 128, 0.1)',
                          color: 'transparent',
                          transform: 'rotate(4deg)',
                      }}>
                    CENÍK
                </span>
            </div>
            <div className="relative z-10">
            <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                Ceník Kurzů
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                Investujte do Své Kariéry
            </h2>

            <h3 className="mx-auto pb-14 text-center text-muted-foreground text-xl md:w-1/2" data-aos="fade-up" data-aos-delay="200">
                Vyberte si úroveň kurzu, která odpovídá vašim zkušenostem a kariérním cílům. Všechny ceny zahrnují materiály a certifikaci.
            </h3>

            <div className="grid space-x-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {plans.map(
                    ({
                        title,
                        popular,
                        price,
                        description,
                        buttonText,
                        benefitList
                    }, index) => (
                        <Card
                            key={title}
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                            className={
                                popular === PopularPlan?.YES
                                    ? "border-[1.5px] border-primary shadow-black/10 drop-shadow-xl lg:scale-[1.1] dark:shadow-white/10"
                                    : ""
                            }
                        >
                            <CardHeader>
                                <CardTitle className="pb-2">{title}</CardTitle>

                                <CardDescription className="pb-4">
                                    {description}
                                </CardDescription>

                                <div>
                                    <span className="font-bold text-3xl">
                                        €{price}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {" "}
                                        /kurz
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex">
                                <div className="space-y-4">
                                    {benefitList.map((benefit) => (
                                        <span key={benefit} className="flex items-center gap-2">
                                            <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 fill-current">
                                            <path d="M14.3589 2.6492H7.3756C4.34227 2.6492 2.53394 4.45753 2.53394 7.49087V14.4659C2.53394 17.5075 4.34227 19.3159 7.3756 19.3159H14.3506C17.3839 19.3159 19.1923 17.5075 19.1923 14.4742V7.49087C19.2006 4.45753 17.3923 2.6492 14.3589 2.6492ZM14.8506 9.06587L10.1256 13.7909C10.0089 13.9075 9.8506 13.9742 9.68394 13.9742C9.51727 13.9742 9.35894 13.9075 9.24227 13.7909L6.88394 11.4325C6.64227 11.1909 6.64227 10.7909 6.88394 10.5492C7.1256 10.3075 7.5256 10.3075 7.76727 10.5492L9.68394 12.4659L13.9673 8.18253C14.2089 7.94087 14.6089 7.94087 14.8506 8.18253C15.0923 8.4242 15.0923 8.81587 14.8506 9.06587Z" />
                                            </svg>
                                            <h3>{benefit}</h3>
                                        </span>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    variant={
                                        popular === PopularPlan?.YES
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="w-full"
                                >
                                    {buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                )}
            </div>
            </div>
        </section>
    )
}
