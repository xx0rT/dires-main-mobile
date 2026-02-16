import { Armchair, Car, HeartPulse, Wind } from "lucide-react";

import type { BentoItem } from "@/components/ui/bento-features";
import { BentoFeatures } from "@/components/ui/bento-features";
import type { ScrollFeature, ScrollTestimonial } from "@/components/ui/scroll-features";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import type { TabbedFeature } from "@/components/ui/tabbed-features";
import { TabbedFeatures } from "@/components/ui/tabbed-features";
import { Separator } from "@/components/ui/separator";

const SCROLL_FEATURES: ScrollFeature[] = [
  {
    title: "Kombinace pruznych a pevnych materialu",
    subtitle: "Napomaha k aktivnimu sedu a spravnemu drzeni tela.",
    statistics: { value: "2x", label: "Lepsi drzeni tela oproti bezne zidli" },
    visual:
      "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  {
    title: "Aktivni sed umoznuje lepe dychat",
    subtitle: "Spravna pozice panve a patere otevira prostor pro volne dychani.",
    statistics: { value: "40%", label: "Zlepseni kapacity plic pri spravnem sedu" },
    visual:
      "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  {
    title: "Opora pro panev",
    subtitle:
      "Tvar lineseat poskytuje oporu pro panev, to navadi ke snadnejsimu propojeni s hrudnikem.",
    statistics: { value: "85%", label: "Uzivatelu hlasi zlepseni do 14 dnu" },
    visual:
      "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
  {
    title: "Aktivace brisnich svalu",
    subtitle: "Behem sedu dochazi k aktivaci brisnich svalu a lepsi stabilite.",
    statistics: { value: "3x", label: "Vetsi aktivace core svalu nez na bezne zidli" },
    visual:
      "https://images.pexels.com/photos/7710086/pexels-photo-7710086.jpeg?auto=compress&cs=tinysrgb&w=1280",
  },
];

const SCROLL_TESTIMONIAL: ScrollTestimonial = {
  quote:
    "Po dvou tydnech pouzivani lineseat jsem prestala mit bolesti zad pri dlouhem sezeni v kancelari.",
  author: "Jana K.",
  designation: "kancelarska pracovnice",
};

const BENTO_ITEMS: BentoItem[] = [
  {
    title: (
      <>
        V aute i v
        <br />
        kancelari
      </>
    ),
    description: [
      "Lineseat bere s sebou vsude. At sidite v aute, v kancelari, u stolu nebo na cestach.",
      "Jediny sedak, ktery opravdu funguje - navrzeny fyzioterapeuty s 20letou zkusenosti.",
    ],
    image: {
      src: "https://images.pexels.com/photos/7710086/pexels-photo-7710086.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Lineseat v aute",
    },
    imagePosition: "content",
    className:
      "flex flex-col pl-6 py-6 overflow-hidden md:col-span-3 md:flex-row gap-6 md:gap-12",
    headerClassName: "flex-2 p-0 md:flex-1",
    contentClassName:
      "relative w-full self-start p-0 overflow-hidden rounded-l-xl border md:flex-1",
  },
  {
    title: "Vyzkousejte lineseat",
    description: [
      "Prijdte si osobne vyzkouset do Dires Fyzio v Praze.",
      "Nasi fyzioterapeuti vam poradi s nastavenim a vyberem.",
    ],
    image: {
      src: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Showroom Dires Fyzio",
      className: "aspect-[2/1.1] rounded-xl",
    },
    className: "md:col-span-2 flex flex-col justify-center",
    contentClassName: "flex items-center justify-center",
    imagePosition: "content",
  },
  {
    title: "Vyvoj s fyzioterapeuty",
    description: [
      "Lineseat vznikl ve spolupraci s prednimi ceskymi fyzioterapeuty a ortopedy.",
    ],
    image: {
      src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Vyvoj lineseat",
      className: "aspect-2/1 rounded-xl flex-1 self-center mb-6",
    },
    className: "md:col-span-2",
    headerClassName: "h-full",
    imagePosition: "header",
  },
  {
    title: "Materialy a kvalita",
    description: [
      "Vysokokvalitni pena s tvarovou pameti, protiskluzova spodni strana a pratelny potah na zip.",
    ],
    image: {
      src: "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Lineseat detail materialu",
    },
    imagePosition: "content",
    className: "overflow-hidden md:col-span-3",
    headerClassName: "",
    contentClassName:
      "relative aspect-[2/1.25] mt-4 p-0 ml-8 w-full md:max-w-[400px] lg:max-w-[500px] overflow-hidden md:mx-auto rounded-t-xl",
  },
];

const TABBED_FEATURES: TabbedFeature[] = [
  {
    title: "Sezeni v aute",
    description: "Ergonomicka podpora pri dlouhe jizde.",
    icon: Car,
    content: {
      title: "Pohodlna jizda bez bolesti zad.",
      description:
        "Lineseat se dokonale prisedi na sedadlo v aute. Podporuje spravne drzeni panve a snizuje unavu pri dlouhych cestach. Snadne nasazeni i sundani.",
      image:
        "https://images.pexels.com/photos/7710086/pexels-photo-7710086.jpeg?auto=compress&cs=tinysrgb&w=1280",
    },
  },
  {
    title: "Kancelarska prace",
    description: "Cely den u stolu bez nasledku.",
    icon: Armchair,
    content: {
      title: "Aktivni sed po celou pracovni dobu.",
      description:
        "Premiste lineseat na kancelarskou zidli a okamzite pocitite rozdil. Vase panev se nakloni do spravne pozice a pater se narovna prirozene.",
      image:
        "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
    },
  },
  {
    title: "Rehabilitace",
    description: "Podpora lecby a prevence.",
    icon: HeartPulse,
    content: {
      title: "Doporuceno fyzioterapeuty pro rehabilitaci.",
      description:
        "Lineseat je casto doporucovan pri bolestech zad, po operacich patere nebo pri prevenci problemu s drzenim tela. Jemne aktivuje spravne svalove skupiny.",
      image:
        "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
    },
  },
  {
    title: "Cestovani",
    description: "Kompaktni a lehky, vzdy po ruce.",
    icon: Wind,
    content: {
      title: "Vezmete si ho kamkoli s sebou.",
      description:
        "Lineseat je lehky a snadno prenosny. Pouzijte ho ve vlaku, v letadle nebo v hotelu. Nikdy nemusite sedet spatne.",
      image:
        "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=1280",
    },
  },
];

const INSTRUCTIONS = [
  {
    step: "1",
    title: "Umistete na sedadlo",
    description: "Polozte lineseat na sedadlo v aute nebo na kancelarskou zidli.",
  },
  {
    step: "2",
    title: "Sednte si",
    description:
      "Sednte si prirozene. Sedak sam navede vasi panev do spravne pozice.",
  },
  {
    step: "3",
    title: "Uzivejte si",
    description:
      "Uzivejte si pohodlny a zdravy sed. Vase telo si rychle zvykne.",
  },
];

export function LineseatScrollShowcase() {
  return (
    <ScrollFeatures
      features={SCROLL_FEATURES}
      testimonial={SCROLL_TESTIMONIAL}
    />
  );
}

export function LineseatBentoGrid() {
  return <BentoFeatures label="PROC LINESEAT?" items={BENTO_ITEMS} />;
}

export function LineseatTabs() {
  return (
    <TabbedFeatures
      heading="Kde vsude lineseat pouzijete"
      subheading="Lineseat je postaven na navycich, ktere delaji z dobreho sezeni kazdodenni rutinu - bez namah, bez bolesti."
      features={TABBED_FEATURES}
    />
  );
}

export function LineseatInstructions() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Navod k pouziti
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          S lineseat neni potreba nic nastavovat. Staci polozit a sednout si.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {INSTRUCTIONS.map((inst, index) => (
          <div key={inst.step}>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-2xl font-bold text-background">
                {inst.step}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{inst.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {inst.description}
              </p>
            </div>
            {index < INSTRUCTIONS.length - 1 && (
              <Separator className="mt-6 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
