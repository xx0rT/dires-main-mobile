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
        title: "Manual Therapy Techniques",
        description:
            "Master soft tissue mobilization, joint manipulation, and myofascial release using traditional Czech methods.",
        pro: 0
    },
    {
        title: "Sports Rehabilitation",
        description:
            "Specialized training in sports injury treatment and athletic performance optimization.",
        pro: 0
    },
    {
        title: "Neurological Rehabilitation",
        description:
            "Advanced techniques for treating neurological conditions using Vojta and Bobath approaches.",
        pro: 0
    },
    {
        title: "Pediatric Physiotherapy",
        description:
            "Specialized courses in child development and treatment of pediatric conditions.",
        pro: 1
    }
]

export const ServicesSection = () => {
    return (
        <section
            id="services"
            className="container mx-auto px-4 py-16 sm:py-20"
        >
            <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                Course Specializations
            </h2>

            <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl">
                Areas of Expertise
            </h2>
            <h3 className="mx-auto mb-8 text-center text-muted-foreground text-xl md:w-1/2">
                Choose from our comprehensive range of specialized physiotherapy courses.
                Each program is designed to provide deep expertise in specific treatment areas.
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
        </section>
    )
}
