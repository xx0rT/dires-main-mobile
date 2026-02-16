import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Footprints, Activity, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    label: "LIBELA",
    description: "Vizualni zpetna vazba polohy desticky pro presnou korekci",
  },
  {
    label: "WOODEN / CARBON PLATFORM",
    description: "Vyrobeno z kvalitnich materialu s povrchovou upravou",
  },
  {
    label: "BASE CONTROL",
    description: "Zjednodusuje najit a citit bazi opory",
  },
  {
    label: "BALANCE ZONE",
    description: "Balancni opora s optimalnim prumerem",
  },
];

const EXERCISE_STEPS = [
  {
    title: "Zaujeti cvicebnich poloh",
    description:
      "Cvicime v asymetrickem sedu z uziho a z sirsiho. Snadnejsi je zacit s uzim sedem, kde se lepe aktivuji svaly nohy a chodidla.",
    image: "/postup-prvni.jpg",
    icon: Footprints,
  },
  {
    title: "Cviceni",
    description:
      "V asymetrickem sedu postupne nacitame stabilitu, tlacime nohy vazi podel a promenujeme svaly. Potern sledujeme citlivost a reakce tela.",
    image: "/postup-druhy.jpg",
    icon: Activity,
  },
  {
    title: "Pocity",
    description:
      "Pri postupnem zatezovani vnimame, jak se noha a chodidlo prizpusobuji. V idealnich stavu citi vahu, a pritom sledujeme odchylky spoliu.",
    image: "/postup-treti.jpg",
    icon: Eye,
  },
  {
    title: "Rezim cviceni",
    description:
      "Postupujte az od sedu pres stoj. V obou dalsinch stavu cvicte dle svych moznosti - sledujte vlastni pokroky.",
    image: "/postup-ctvrty.jpg",
    icon: TrendingUp,
  },
];

const VARIANTS = [
  {
    name: "CARBON",
    description:
      "Aerodynamicky design doplni sportovni vizual a zaroven nabidne maximalni odolnost diky karbonove povrchove uprave. Vhodna pro intenzivni pouziti.",
    price: "3 100",
    image: "/correctfoot-carbon-2048x1245.jpg",
    features: [
      "Karbonova povrchova uprava",
      "Maximalni odolnost",
      "Sportovni design",
    ],
  },
  {
    name: "WOOD",
    description:
      "Elegantni provedeni z kvalitniho ceskeho dreva. Prirodni material a nadcasovy vzhled, ktery se hodi do kazdeho interieru.",
    price: "2 900",
    image: "/correctfoot-wood-2048x1545.jpg",
    features: [
      "Ceske drevo",
      "Prirodni material",
      "Nadcasovy design",
    ],
  },
];

export function CorrectfootProductDescription() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Popis correctfoot
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          S correctfoot trenujete chodidlo, celou nohu, zaklady a drzeni tela na sve deti.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border">
          <img
            src="/popis-correctfoot.jpg"
            alt="Correctfoot - libela a platforma"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border">
          <img
            src="/popis-correctfoot2.jpg"
            alt="Correctfoot - base control a balance zone"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.label}
            className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-bold uppercase tracking-wide">
              {f.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CorrectfootExerciseGuide() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Jak cvicit s <span className="font-bold">correctfoot</span>?
        </h2>
      </div>

      <div className="mt-14 flex flex-col">
        {EXERCISE_STEPS.map((step, index) => (
          <div key={step.title}>
            {index > 0 && <Separator />}
            <div className="grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-[1fr_auto]">
              <div
                className={`flex flex-col gap-4 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5">
                    <step.icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="max-w-md text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div
                className={`w-full overflow-hidden rounded-2xl bg-muted md:w-72 lg:w-80 ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="mx-auto h-auto max-h-[24rem] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CorrectfootVariants() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Vyberte si ze dvou variant
        </h2>
      </div>

      <div className="mt-14 flex flex-col gap-10">
        {VARIANTS.map((variant, index) => (
          <div
            key={variant.name}
            className="group overflow-hidden rounded-3xl border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div
                className={`flex flex-col justify-center gap-5 p-8 md:p-12 ${index % 2 === 1 ? "md:order-2" : ""}`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    correctfoot
                  </p>
                  <h3 className="mt-1 text-4xl font-bold tracking-tight">
                    {variant.name}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {variant.description}
                </p>
                <ul className="flex flex-col gap-2">
                  {variant.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold">
                    {variant.price} Kc
                  </p>
                  <Button size="sm">Koupit</Button>
                </div>
              </div>
              <div
                className={`bg-muted p-6 ${index % 2 === 1 ? "md:order-1" : ""}`}
              >
                <img
                  src={variant.image}
                  alt={`Correctfoot ${variant.name}`}
                  className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
