import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"

interface FAQProps {
    question: string
    answer: string
    value: string
}

const FAQList: FAQProps[] = [
    {
        question: "Are the courses internationally recognized?",
        answer: "Yes! All our certificates are recognized by Czech medical associations and meet European physiotherapy standards, allowing you to practice across the EU.",
        value: "item-1"
    },
    {
        question: "What's included in the course fee?",
        answer: "Course fees include all training sessions, comprehensive course materials, access to video libraries, practical equipment usage, certification exam, and ongoing resource access.",
        value: "item-2"
    },
    {
        question: "How long does it take to complete a course?",
        answer: "Course duration varies by level. Foundation courses run 2-3 weeks, Professional programs take 4-6 weeks, and Master level courses extend 8-12 weeks with flexible scheduling options.",
        value: "item-3"
    },
    {
        question: "Do I need prior experience?",
        answer: "Foundation courses are open to licensed healthcare professionals. Professional and Master levels require previous physiotherapy certification and clinical experience.",
        value: "item-4"
    },
    {
        question: "What languages are courses taught in?",
        answer: "Courses are primarily taught in Czech and English. Translation services and materials in other European languages can be arranged for group bookings.",
        value: "item-5"
    }
]

export const FAQSection = () => {
    return (
        <section id="faq" className="container mx-auto px-4 py-16 sm:py-20 md:w-[700px]">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                    FAQs
                </h2>

                <h2 className="text-center font-bold text-3xl md:text-4xl">
                    Common Questions
                </h2>
            </div>

            <Accordion type="single" collapsible className="AccordionRoot">
                {FAQList.map(({ question, answer, value }) => (
                    <AccordionItem key={value} value={value}>
                        <AccordionTrigger className="text-left">
                            {question}
                        </AccordionTrigger>

                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    )
}
