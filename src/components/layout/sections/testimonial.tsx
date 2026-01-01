import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel"

interface ReviewProps {
    image: string
    name: string
    userName: string
    comment: string
    rating: number
}

const reviewList: ReviewProps[] = [
    {
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
        name: "Sarah Johnson",
        userName: "CEO at TechStart",
        comment:
            "This platform has completely transformed how we manage our business operations. The intuitive interface and powerful features have saved us countless hours every week.",
        rating: 5.0
    },
    {
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        name: "Michael Chen",
        userName: "Product Manager",
        comment:
            "I've tried many solutions, but this one stands out. The team's attention to detail and customer support is exceptional. Highly recommend!",
        rating: 5.0
    },
    {
        image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg",
        name: "Emma Williams",
        userName: "Freelance Designer",
        comment:
            "As a solo entrepreneur, I needed something reliable and easy to use. This platform exceeded my expectations and helped me scale my business.",
        rating: 5.0
    },
    {
        image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        name: "David Martinez",
        userName: "Marketing Director",
        comment:
            "The ROI has been incredible. We saw improvements in our workflow within the first week. The analytics features are particularly impressive.",
        rating: 5.0
    },
    {
        image: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
        name: "Lisa Anderson",
        userName: "Startup Founder",
        comment:
            "Game changer for our team! The collaboration features and automation capabilities have streamlined our entire process.",
        rating: 5.0
    }
]

export const TestimonialSection = () => {
    return (
        <section id="testimonials" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider" data-aos="fade-up">
                    Testimonials
                </h2>

                <h2 className="mb-4 text-center font-bold text-3xl md:text-4xl" data-aos="fade-up" data-aos-delay="100">
                    What Our Customers Say
                </h2>
            </div>

            <Carousel
                opts={{
                    align: "start"
                }}
                className="relative mx-auto w-[80%] sm:w-[90%] lg:max-w-screen-xl"
            >
                <CarouselContent>
                    {reviewList.map((review) => (
                        <CarouselItem
                            key={review.name}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="flex h-full flex-col bg-muted/50">
                                <CardContent className="flex flex-grow flex-col">
                                    <div className="flex gap-1 pb-4">
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                        <Star className="size-4 fill-primary text-primary" />
                                    </div>
                                    <div className="flex flex-1 items-start pb-4">
                                        <p className="text-sm leading-relaxed">{`"${review.comment}"`}</p>
                                    </div>
                                </CardContent>

                                <CardHeader >
                                    <div className="flex flex-row items-center gap-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={review.image}
                                                alt={review.name}
                                            />
                                            <AvatarFallback>
                                                {review.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col">
                                            <CardTitle className="text-lg">
                                                {review.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {review.userName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    )
}
