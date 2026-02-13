import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Clock, Mail, Phone } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { site } from "@/config/site"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    firstName: z.string().min(2).max(255),
    lastName: z.string().min(2).max(255),
    email: z.string().email(),
    subject: z.string().min(2).max(255),
    message: z.string()
})

export const ContactSection = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            subject: "Manuální Terapie",
            message: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { firstName, lastName, email, subject, message } = values
        console.log(values)

        const mailToLink = `mailto:${site.mailSupport}?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`

        window.location.href = mailToLink
    }

    return (
        <section id="contact" className="container mx-auto px-4 py-16 sm:py-20">
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="md:text-right md:pr-8">
                    <div className="mb-4">
                        <h2 className="mb-2 text-lg text-sky-600 dark:text-sky-400 tracking-wider">
                            Kontakt
                        </h2>

                        <h2 className="font-bold text-3xl md:text-4xl">
                            Spojte Se S Námi
                        </h2>
                    </div>
                    <p className="mb-8 text-muted-foreground md:ml-auto md:w-5/6">
                        Připraveni posunout svou fyzioterapeutickou kariéru? Kontaktujte nás pro informace o kurzech,
                        detaily přihlášení nebo pro domluvení prohlídky zařízení. Jsme tu, abychom vám pomohli uspět.
                    </p>

                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="mb-1 flex gap-2 md:justify-end">
                                <Building2 />
                                <div className="font-bold">Najděte nás</div>
                            </div>

                            <div>
                                Karlovo náměstí 13, Praha 2, 120 00
                            </div>
                        </div>

                        <div>
                            <div className="mb-1 flex gap-2 md:justify-end">
                                <Phone />
                                <div className="font-bold">Zavolejte nám</div>
                            </div>

                            <div>+420 224 915 765</div>
                        </div>

                        <div>
                            <div className="mb-1 flex gap-2 md:justify-end">
                                <Mail />
                                <div className="font-bold">Napište nám</div>
                            </div>

                            <div>{site.mailSupport}</div>
                        </div>

                        <div>
                            <div className="flex gap-2 md:justify-end">
                                <Clock />
                                <div className="font-bold">Navštivte nás</div>
                            </div>

                            <div>
                                <div>Pondělí - Pátek</div>
                                <div>9:00 - 18:00 CET</div>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/60 dark:border-sky-800/30">
                    <CardContent className="p-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="grid w-full gap-4"
                            >
                                <div className="md:!flex-row flex flex-col gap-8">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Jméno
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Jan"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Příjmení</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Novák"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="me@domain.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Předmět</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Vyberte předmět" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Manuální Terapie">
                                                            Manuální Terapie
                                                        </SelectItem>
                                                        <SelectItem value="Sportovní Rehabilitace">
                                                            Sportovní Rehabilitace
                                                        </SelectItem>
                                                        <SelectItem value="Neurologická Rehabilitace">
                                                            Neurologická Rehabilitace
                                                        </SelectItem>
                                                        <SelectItem value="Dětská Fyzioterapie">
                                                            Dětská Fyzioterapie
                                                        </SelectItem>
                                                        <SelectItem value="Obecný Dotaz">
                                                            Obecný Dotaz
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zpráva</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        rows={5}
                                                        placeholder="Vaše zpráva..."
                                                        className="resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button className="mt-4 w-fit">Odeslat zprávu</Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter />
                </Card>
            </section>
        </section>
    )
}
