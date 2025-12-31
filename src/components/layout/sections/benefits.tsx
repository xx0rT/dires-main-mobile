import type { icons } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"

interface BenefitsProps {
    icon: string
    title: string
    description: string
}

const benefitList: BenefitsProps[] = [
    {
        icon: "Rocket",
        title: "Fast-Track Learning",
        description:
            "Accelerated programs designed to get you practicing effectively in months, not years. Intensive modules focused on practical skills."
    },
    {
        icon: "Award",
        title: "International Recognition",
        description:
            "Certificates recognized across Europe and internationally. Open doors to practice in multiple countries with Czech-certified credentials."
    },
    {
        icon: "Users",
        title: "Expert Mentorship",
        description:
            "One-on-one guidance from experienced physiotherapists. Get personalized feedback and career advice throughout your journey."
    },
    {
        icon: "Shield",
        title: "Proven Methods",
        description:
            "Learn time-tested Czech techniques backed by decades of clinical research and successful patient outcomes worldwide."
    }
]

export const BenefitsSection = () => {
    return (
        <section id="benefits" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="grid place-items-center lg:grid-cols-2 lg:gap-24">
                <div data-aos="fade-right">
                    <h2 className="mb-2 text-lg text-primary tracking-wider">
                        Benefits
                    </h2>

                    <h2 className="mb-4 font-bold text-3xl md:text-4xl">
                        Your Path to Excellence
                    </h2>
                    <p className="mb-8 text-muted-foreground text-xl">
                        Join hundreds of successful physiotherapists who have transformed their careers through our Czech-method training programs. Expert instruction, practical experience, and lifetime support.
                    </p>
                </div>

                <div className="grid w-full gap-4 lg:grid-cols-2" data-aos="fade-left">
                    {benefitList.map(({ icon, title, description }, index) => (
                        <Card
                            key={title}
                            className="group/number transition-all delay-75 hover:bg-sidebar"
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                        >
                            <CardHeader>
                                <div className="flex justify-between">
                                    <Icon
                                        name={icon as keyof typeof icons}
                                        size={32}
                                        color="var(--primary)"
                                        className="mb-6 text-primary"
                                    />
                                    <span className="font-medium text-5xl text-muted-foreground/15 transition-all delay-75 group-hover/number:text-muted-foreground/30">
                                        0{index + 1}
                                    </span>
                                </div>

                                <CardTitle>{title}</CardTitle>
                            </CardHeader>

                            <CardContent className="text-muted-foreground">
                                {description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
