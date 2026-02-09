import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface DataItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  date: string;
  tag: string;
}

const DATA: DataItem[] = [
  {
    id: "item-1",
    title: "Umela inteligence ve fyzioterapii",
    summary:
      "Jak AI revolucionizuje diagnostiku a planovani lecby. Personalizovane cvicebni plany a sledovani pokroku pacienta s vyssi presnosti.",
    href: "#",
    image: "https://images.pexels.com/photos/8376188/pexels-photo-8376188.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "10. Unor 2025",
    tag: "Technologie",
  },
  {
    id: "item-2",
    title: "Prevence sportovnich urazu",
    summary:
      "Komplexni pruvodce prevenci zraneni u sportovcu. Funkci screening, korekce pohybovych stereotypu a optimalizace treninku.",
    href: "#",
    image: "https://images.pexels.com/photos/6740738/pexels-photo-6740738.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "17. Unor 2025",
    tag: "Sport",
  },
  {
    id: "item-3",
    title: "Manualni terapie a jeji vyhody",
    summary:
      "Objevte silu manualnich technik pri lecbe pohyboveho aparatu. Mobilizace, manipulace a jejich role v moderni fyzioterapii.",
    href: "#",
    image: "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "24. Unor 2025",
    tag: "Terapie",
  },
  {
    id: "item-4",
    title: "Cviceni pro zdravou pater",
    summary:
      "Prakticky pruvodce cviky pro posíleni zad a prevenci bolesti. Denni rutiny a tipy pro spravne drzeni tela pri sedave praci.",
    href: "#",
    image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "3. Brezen 2025",
    tag: "Prevence",
  },
  {
    id: "item-5",
    title: "Rehabilitace po operaci",
    summary:
      "Komplexni prubeh rehabilitace po ortopedickych operacich. Faze hojeni, postupne zatezovani a navrat k plne aktivite.",
    href: "#",
    image: "https://images.pexels.com/photos/7659579/pexels-photo-7659579.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "10. Brezen 2025",
    tag: "Rehabilitace",
  },
];

interface Blog21Props {
  className?: string;
}

const Blog21 = ({ className }: Blog21Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section
      className={cn(
        "bg-linear-to-b from-background to-muted/20 py-12 px-6 md:px-12 lg:px-20",
        className,
      )}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Nejnovejsi clanky
            </h2>
            <p className="text-muted-foreground">
              Sledujte nase posledni prispevky a odborne rady
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="rounded-full hover:bg-background/80 disabled:opacity-50"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="rounded-full hover:bg-background/80 disabled:opacity-50"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
          breakpoints: {
            "(max-width: 768px)": {
              dragFree: true,
            },
          },
        }}
        className="w-full"
      >
        <CarouselContent className="mr-[calc(theme(container.padding))] 2xl:ml-[calc(50vw-700px+theme(container.padding)-20px)] 2xl:mr-[calc(50vw-700px+theme(container.padding))] gap-6">
          {DATA.map((item) => (
            <CarouselItem
              key={item.id}
              className="px-4 md:basis-1/2 md:pr-0 md:pl-4 lg:basis-1/3"
            >
              <div className="group h-full overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md">
                <a href={item.href} className="flex h-full flex-col">
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    <Badge className="absolute top-4 right-4 z-10">
                      {item.tag}
                    </Badge>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-muted-foreground">
                        {item.summary}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Badge variant="secondary" className="rounded-full">
                        <Calendar className="mr-1.5 size-3.5" />
                        <span className="text-xs">{item.date}</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full hover:bg-background"
                      >
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-8 flex items-center justify-center">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 font-medium hover:bg-primary hover:text-primary-foreground"
        >
          Všechny články
        </Button>
      </div>
    </section>
  );
};

export { Blog21 };
