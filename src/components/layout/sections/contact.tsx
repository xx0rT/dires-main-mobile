import { Check } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { site } from "@/config/site"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  referrer: string
}

export const ContactSection = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
      referrer: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    const mailToLink = `mailto:${site.mailSupport}?subject=${data.subject}&body=Dobry den, jmenuji se ${data.firstName} ${data.lastName}, muj email je ${data.email}. %0D%0A${data.message}`
    window.location.href = mailToLink
  }

  return (
    <section id="contact" className={cn("py-32")}>
      <div className="container mx-auto max-w-5xl rounded-2xl border border-border/60 bg-muted/50 p-8 md:p-12 lg:p-16">
        <div className="text-center">
          <span className="text-xs text-muted-foreground">KONTAKT /</span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:grid-rows-[min-content_1fr]">
          <h2 className="order-1 text-4xl font-medium tracking-tight md:order-none md:text-5xl">
            Spojte se s nami
          </h2>
          <div className="order-2 md:order-none md:row-span-2">
            <div className="rounded-lg border border-border bg-background p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6 sm:grid-cols-2"
              >
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Jmeno</FieldLabel>
                      <Input {...field} id={field.name} placeholder="Jan" />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Prijmeni</FieldLabel>
                      <Input {...field} id={field.name} placeholder="Novak" />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="jan.novak@email.cz"
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Predmet
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue placeholder="Vyberte predmet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manualni Terapie">Manualni Terapie</SelectItem>
                          <SelectItem value="Sportovni Rehabilitace">Sportovni Rehabilitace</SelectItem>
                          <SelectItem value="Neurologicka Rehabilitace">Neurologicka Rehabilitace</SelectItem>
                          <SelectItem value="Detska Fyzioterapie">Detska Fyzioterapie</SelectItem>
                          <SelectItem value="Obecny Dotaz">Obecny Dotaz</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor={field.name}>Zprava</FieldLabel>
                      <Textarea
                        {...field}
                        id={field.name}
                        placeholder="Napiste nam svuj dotaz..."
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="referrer"
                  render={({ field }) => (
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor={field.name}>
                        Jak jste se o nas dozvedeli?
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="Google / Doporuceni"
                      />
                    </Field>
                  )}
                />
                <Button type="submit" className="sm:col-span-2">
                  Odeslat zpravu
                </Button>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Odeslanim formulare souhlasíte se zpracovanim vasich osobnich udaju v souladu s nasimi{" "}
                  <a href="#" className="text-primary hover:underline">
                    zasadami ochrany soukromi
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
          <div className="order-3 my-6 md:order-none">
            <ul className="space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background">
                  <Check className="size-4" />
                </span>
                Popiste sve potize a pozadavky
              </li>
              <li className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background">
                  <Check className="size-4" />
                </span>
                Obdrzite nabidku na miru
              </li>
              <li className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background">
                  <Check className="size-4" />
                </span>
                Domluvte si osobni konzultaci
              </li>
            </ul>
            <p className="my-6 font-bold">
              Duvera vice nez 3000 klientu po cele Ceske republice
            </p>
            <div className="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-8.svg"
                alt="partner"
                className="max-w-24 dark:invert"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 grid gap-8 md:gap-12 lg:w-1/2 lg:grid-cols-2">
          <div>
            <h3 className="mb-1.5 font-bold">FAQ</h3>
            <p className="text-sm text-muted-foreground">
              Prohledejte nasi kolekci{" "}
              <a href="#faq" className="text-primary underline hover:underline">
                casto kladenych otazek
              </a>{" "}
              o nasich sluzbach a kurzech.
            </p>
          </div>
          <div>
            <h3 className="mb-1.5 font-bold">Kurzy</h3>
            <p className="text-sm text-muted-foreground">
              Prozkoumejte nasi nabidku{" "}
              <a href="/kurzy" className="text-primary underline hover:underline">
                profesionalnich kurzu
              </a>{" "}
              pro fyzioterapeuty vsech urovni.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
