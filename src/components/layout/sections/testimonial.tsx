import {
  BadgeCheck,
  ChevronRight,
  Clock,
  MessageSquareCode,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DataItem {
  id: string;
  name: string;
  username: string;
  date: string;
  avatar: string;
  content: string;
}

const DATA: DataItem[] = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    date: "2023-10-05",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "Přibližně 3/4 roku jsem trpěl bolestí zad v bederní oblasti s postupným odumíráním levé hýždě a nohy. Tato bolest byla schopná mě zastavit, jako by někdo přitahoval kohoutky až už nešlo jít dál a musel jsem hledat úlevovou pozici ve dřepu. Absolvoval jsem magnetickou rezonanci (výhřezy 2-6mm na 6i místech), neurologické vyšetření včetně EMG, CT obstřik, konzultaci na neurochirurgii s možností operace jenž jsem odmítl, rehabilitace, cvičení, … stav se nelepšil, ačkoliv jsem stále věřil, že si musím být schopen pomoci sám. Nakonec jsem se dostal na doporučení do Dires Fyzio k Martinovi Šťastnému a začal objevovat nové možnosti cvičení a vnímání svého těla. Bolest rapidně ustoupila a věřím, že zmizí úplně. Je potřeba vytrvat a věřit, že naše těla jsou dostatečně vybavena k tomu aby si pomohla, jen jim musíme občas dát trochu prostoru a času najít nové možnosti.",
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    date: "2023-09-30",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "Honza Kottas mi opět pomohl od problému,  který mě měsíc trápil a se kterým mi nepomohly ani masáže, ani akupunktura. Honzova jemná, citlivá práce mi přinesla znatelnou úlevu a zlepšení ne úplně okamžitě, ale za pár hodin jsem zjistila, že už mě to nebolí, netáhne v zádech, nebrní v ruce, nepálí na hrudi. Honzu považuji za šamana, léčitele. Ještě se nestalo, aby mi nepomohl od problémů, se kterými bych šla jinak k neurologovi, se kterým mám naopak velmi špatnou zkušenost. Takže jsem skutečně šťastná, že Honzu znám a vřele ho každému doporučuji.",
  },
  {
    id: "3",
    name: "Alice Johnson",
    username: "alicej",
    date: "2023-09-25",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content: "Velice doporučuji pana Kottase, se kterým řeším dlouhodobý neurologický problém. Docházel jsem na různá fyzio cvičení/terapie a poprvé cítím, že problému někdo opravdu rozumí a používá správnou cestu a techniku. 5/5",
  },
  {
    id: "4",
    name: "Bob Brown",
    username: "bobbrown",
    date: "2023-09-20",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Nevěřila jsem, že moje 3 letá dcera dokáže být hodinu v klidu, ale z pana Kottase vyzařuje takový klid, že se jí celá návštěva líbila a i když se jí hned ulevilo, tak by tam chtěla jezdit znovu, jak jí bylo celé ošetření příjemné.",
  },
  {
    id: "5",
    name: "Charlie Davis",
    username: "charlied",
    date: "2023-09-15",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "Děkuju za skvělý přístup ! Pan Kottas byl úžasný a hned po první návštěvě se mi dost ulevilo. Co ještě oceňuji je dostupnost do Diresu - tramvajová zastávka je kousíček:))",
  },
  {
    id: "6",
    name: "Eva Wilson",
    username: "evawilson",
    date: "2023-09-10",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "Skvělý osobní přístup, velice doporučuji a děkuji 🙏 …",
  },
  {
    id: "7",
    name: "Frank Miller",
    username: "frankm",
    date: "2023-09-05",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    content:
      "Skvělé",
  },
  {
    id: "8",
    name: "Grace Lee",
    username: "gracelee",
    date: "2023-08-30",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp",
    content:
      "přístup terapeutů je profesionální a cílený na individuální potřeby. Už po pár sezeních jsem cítil velké zlepšení pohyblivosti.",
  },
  {
    id: "9",
    name: "Henry Garcia",
    username: "henryg",
    date: "2023-08-25",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Program 4Core mě opravdu posunul. Lekce jsou srozumitelné a pomáhají nejen s tělem, ale i s celkovým cítěním správného držení těla.",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: DataItem }) => (
  <Card className="relative mb-5 break-inside-avoid rounded-xl p-5 shadow-sm border-sky-100 dark:border-sky-900/30">
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10 rounded-full ring-1 ring-muted">
        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{testimonial.name}</p>
          <BadgeCheck className="h-4 w-4 fill-sky-400 stroke-white" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          @{testimonial.username}
        </p>
      </div>
      <div className="ml-auto hover:cursor-pointer">
        <img src="
          public/google__g__logo.svg.webp" alt="X logo" className="h-4 w-4" />
      </div>
    </div>

    <div className="my-4 border-t border-dashed border-sky-200/60 dark:border-sky-800/30" />

    <div className="text-sm text-foreground">
      <q>{testimonial.content}</q>
    </div>

    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span>{testimonial.date}</span>
    </div>
  </Card>
);

interface TestimonialSectionProps {
  className?: string;
}

const TestimonialSection = ({ className }: TestimonialSectionProps) => {
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const getColumnCount = () => {
      if (typeof window === "undefined") return 3;
      const width = window.innerWidth;
      if (width < 768) return 1;
      if (width < 1024) return 2;
      return 3;
    };

    const updateColumnCount = () => {
      setColumnCount(getColumnCount());
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const reorderForColumns = (items: DataItem[], columns: number) => {
    const itemsPerColumn = Math.ceil(items.length / columns);
    const reordered: DataItem[] = [];

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < itemsPerColumn; row++) {
        const originalIndex = row * columns + col;
        if (originalIndex < items.length) {
          reordered.push(items[originalIndex]);
        }
      }
    }

    return reordered;
  };

  const reorderedData = useMemo(() => {
    return reorderForColumns(DATA, columnCount);
  }, [columnCount]);

  return (
    <section id="testimonials" className={cn("py-32", className)}>
      <div className="container mx-auto flex flex-col items-center">
        <div className="my-4 flex justify-center">
          <Badge variant="outline" className="rounded-sm py-2 shadow-md">
            <MessageSquareCode className="mr-2 size-4 text-muted-foreground" />
            <span>Reference pacientů</span>
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-6 px-4 sm:px-8 text-center">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Zjistěte, co říkají <br /> naši pacienti
          </h2>

          <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <span>
              Objevte, jak naše fyzioterapeutická péče mění životy a zlepšuje zdraví našich klientů.
            </span>
          </div>
        </div>

        <div className="relative mt-14 w-full max-w-7xl mx-auto px-4 after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-gradient-to-t after:from-background sm:px-8 md:px-16 lg:px-32">
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {reorderedData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button asChild className="mt-4 gap-2 rounded-lg px-5 py-3 text-sm shadow-sm transition-colors hover:bg-primary/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            <Link to="/reference">
              <span className="flex items-center gap-1">
                <span>Zobrazit více</span>
                <span className="text-muted/80">-</span>
                <span className="text-muted/80">Referencí</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };
