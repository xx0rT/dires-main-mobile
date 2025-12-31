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
        title: "Certified Training",
        description:
            "All courses are certified and recognized by Czech medical associations and international physiotherapy boards."
    },
    {
        icon: <RiDashboard3Line size={24} className="text-primary" />,
        title: "Hands-On Practice",
        description:
            "Extensive practical sessions with real patients under expert supervision in modern facilities."
    },
    {
        icon: <RiUploadCloud2Line size={24} className="text-primary" />,
        title: "Online Resources",
        description:
            "Access comprehensive video libraries, course materials, and documentation anytime, anywhere."
    },
    {
        icon: <RiDatabase2Line size={24} className="text-primary" />,
        title: "Expert Instructors",
        description:
            "Learn from experienced Czech physiotherapists with decades of clinical practice and teaching experience."
    },
    {
        icon: <RiFireFill size={24} className="text-primary" />,
        title: "Small Groups",
        description:
            "Limited class sizes ensure personalized attention and optimal learning outcomes for every student."
    },
    {
        icon: <RiStackLine size={24} className="text-primary" />,
        title: "Lifetime Support",
        description:
            "Join our alumni network with continued access to resources, updates, and professional development opportunities."
    }
]

export const FeaturesSection = () => {
    return (
        <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
            <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                Course Features
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                Why Choose Us
            </h2>

            <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2" data-aos="fade-up" data-aos-delay="200">
                Our comprehensive physiotherapy courses combine traditional Czech methods with modern rehabilitation techniques to provide the best learning experience.
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
