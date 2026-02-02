"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type Category = "Obecné" | "Cvičení" | "Bolest" | "Terapie" | "Ostatní";

interface FAQItem {
  question: string;
  answer: string;
  category: Category;
}

const faqItems: FAQItem[] = [
  // Obecné Questions
  {
    category: "Obecné",
    question: "Jak dlouho trvá průměrná fyzioterapeutická léčba?",
    answer:
      "Délka léčby závisí na druhu zranění a jeho závažnosti. Průměrně trvá léčba 4-8 týdnů s 2-3 návštěvami týdně. Při akutních problémech můžete vidět zlepšení již po prvních sezeních.",
  },
  {
    category: "Obecné",
    question: "Potřebuji doporučení od lékaře?",
    answer:
      "V České republice můžete navštívit fyzioterapeuta i bez doporučení. Pro úhradu zdravotní pojišťovnou je však nutné mít doporučení od praktického lékaře nebo specialisty.",
  },
  {
    category: "Obecné",
    question: "Jaký je rozdíl mezi fyzioterapií a rehabilitací?",
    answer:
      "Fyzioterapie je součástí rehabilitace. Rehabilitace je širší pojem zahrnující celkový proces uzdravení, zatímco fyzioterapie se zaměřuje konkrétně na pohybové funkce pomocí cvičení, masáží a dalších technik.",
  },
  // Cvičení Questions
  {
    category: "Cvičení",
    question: "Jak často bych měl cvičit doma?",
    answer:
      "Domácí cvičení je klíčové pro úspěšnou rehabilitaci. Doporučujeme cvičit 2-3x denně po 15-20 minut. Váš fyzioterapeut vám sestaví individuální plán přizpůsobený vašemu stavu.",
  },
  {
    category: "Cvičení",
    question: "Můžu cvičit, když mě to bolí?",
    answer:
      "Lehká nepříjemnost při cvičení je normální, ale ostrá nebo intenzivní bolest je varováním. Platí pravidlo: cvičení by nemělo zvyšovat bolest více než na 3-4 na škále 0-10. Při silnější bolesti cvičení přerušte a konzultujte s fyzioterapeutem.",
  },
  {
    category: "Cvičení",
    question: "Jak poznám, že cvičím správně?",
    answer:
      "Správná technika je zásadní. Měli byste cítit zapojení správných svalů, mít kontrolu nad pohybem a nedocházet k náhradním pohybovým vzorcům. Při pochybnostech vždy požádejte fyzioterapeuta o kontrolu techniky.",
  },
  // Bolest Questions
  {
    category: "Bolest",
    question: "Je normální, že mě bolí po terapii?",
    answer:
      "Lehká bolest svalů následující den po terapii je normální, podobně jako po cvičení. Měla by ustoupit do 24-48 hodin. Pokud bolest přetrvává nebo se zhoršuje, kontaktujte svého fyzioterapeuta.",
  },
  {
    category: "Bolest",
    question: "Jak dlouho trvá, než bolest odezní?",
    answer:
      "To závisí na příčině bolesti. Akutní bolest může ustoupit za několik dní až týdnů. Chronická bolest vyžaduje delší léčbu, obvykle několik měsíců. Důležitá je pravidelnost terapie a domácího cvičení.",
  },
  {
    category: "Bolest",
    question: "Pomáhá fyzioterapie při chronické bolesti?",
    answer:
      "Ano, fyzioterapie je velmi efektivní při léčbě chronické bolesti. Kombinuje aktivní cvičení, manuální techniky a edukaci o bolesti. Cílem je nejen zmírnit bolest, ale také naučit vás, jak s ní lépe fungovat.",
  },
  // Terapie Questions
  {
    category: "Terapie",
    question: "Co mám vzít s sebou na první návštěvu?",
    answer:
      "Přineste doporučení od lékaře (pokud ho máte), kartu pojišťovny, pohodlné oblečení vhodné pro cvičení a případně předchozí lékařské zprávy nebo výsledky vyšetření týkající se vašeho problému.",
  },
  {
    category: "Terapie",
    question: "Jak dlouho trvá jedno sezení?",
    answer:
      "Standardní terapeutické sezení trvá 30-60 minut. První návštěva bývá delší (60-90 minut), protože zahrnuje podrobné vyšetření a vyhodnocení vašeho stavu.",
  },
  {
    category: "Terapie",
    question: "Mohu si vybrat svého fyzioterapeuta?",
    answer:
      "Ano, máte právo si vybrat fyzioterapeuta podle svých preferencí. Doporučujeme vybrat si terapeuta se specializací odpovídající vašemu problému, například sport, neurologie nebo ortopedie.",
  },
  // Ostatní Questions
  {
    category: "Ostatní",
    question: "Hradí fyzioterapii zdravotní pojišťovna?",
    answer:
      "S doporučením od lékaře hradí zdravotní pojišťovna většinu fyzioterapeutických služeb. Bez doporučení si platíte plnou cenu. Rozsah hrazené péče závisí na vaší pojišťovně.",
  },
  {
    category: "Ostatní",
    question: "Můžu chodit k fyzioterapeutovi preventivně?",
    answer:
      "Určitě! Preventivní fyzioterapie je skvělý způsob, jak předcházet zraněním, zejména u sportovců nebo lidí s fyzicky náročným zaměstnáním. Pomůže vám udržet správné pohybové vzorce a svalovou rovnováhu.",
  },
  {
    category: "Ostatní",
    question: "Je fyzioterapie vhodná pro seniory?",
    answer:
      "Ano, fyzioterapie je vynikající pro seniory. Pomáhá udržovat pohyblivost, sílu a rovnováhu, což snižuje riziko pádů. Cvičení je vždy přizpůsobeno individuálním možnostem a potřebám.",
  },
];

const categories: Category[] = [
  "Obecné",
  "Cvičení",
  "Bolest",
  "Terapie",
  "Ostatní",
];

const TOP_PADDING = 300;

interface Faq12Props {
  className?: string;
}

const Faq12 = ({ className }: Faq12Props) => {
  const [activeCategory, setActiveCategory] = useState<Category>("Obecné");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);
  const categoryRefs = useRef<Record<Category, HTMLDivElement | null>>({
    Obecné: null,
    Cvičení: null,
    Bolest: null,
    Terapie: null,
    Ostatní: null,
  });

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();

    let debounceTimeout: NodeJS.Timeout;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Skip if we're programmatically scrolling
        if (isScrollingRef.current) return;

        // Clear any pending timeout
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        // Debounce the category update
        debounceTimeout = setTimeout(() => {
          const intersectingEntries = entries.filter(
            (entry) => entry.isIntersecting,
          );

          // Find the entry that's closest to being 100px from the top
          const entry = intersectingEntries.reduce(
            (closest, current) => {
              const rect = current.boundingClientRect;
              const distanceFromThreshold = Math.abs(rect.top - TOP_PADDING);
              const closestDistance = closest
                ? Math.abs(closest.boundingClientRect.top - TOP_PADDING)
                : Infinity;

              return distanceFromThreshold < closestDistance
                ? current
                : closest;
            },
            null as IntersectionObserverEntry | null,
          );

          if (entry) {
            const category = entry.target.getAttribute(
              "data-category",
            ) as Category;
            if (category) {
              setActiveCategory(category);
            }
          }
        }, 150);
      },
      {
        root: null,
        rootMargin: `-${TOP_PADDING}px 0px -100% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    Object.entries(categoryRefs.current).forEach(([category, element]) => {
      if (element) {
        element.setAttribute("data-category", category);
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = setupObserver();
    return () => {
      cleanup();
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    isScrollingRef.current = true;

    const element = document.getElementById(`faq-${category.toLowerCase()}`);
    if (element) {
      element.style.scrollMargin = `${TOP_PADDING}px`;
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  return (
    <section
      className={cn(
        "min-h-screen py-32",
        className,
      )}
    >
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-14">
          <div className="flex flex-col gap-4 border-b-2 pb-6 text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-light tracking-tight lg:text-6xl">
              Často kladené otázky
            </h3>
            <p className="text-sm tracking-tight text-muted-foreground lg:text-lg">
              Získáš systematické know-how od českých odborníků
            </p>
          </div>

        <div className="mt-0 grid max-w-5xl gap-8 md:mt-0 md:grid-cols-[200px_1fr] md:gap-12 lg:mt-0 mx-auto w-full">
          {/* Sidebar */}
          <div className="sticky top-24 flex h-fit flex-col gap-4 max-md:hidden">
            {categories.map((category) => (
              <Button
                variant="ghost"
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`justify-start text-left text-xl transition-colors ${
                  activeCategory === category
                    ? "font-semibold"
                    : "font-normal hover:opacity-75"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Items by Category */}
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = faqItems.filter(
                (item) => item.category === category,
              );

              return (
                <div
                  key={category}
                  id={`faq-${category.toLowerCase()}`}
                  ref={(el) => {
                    categoryRefs.current[category] = el;
                  }}
                  className={cn(
                    `rounded-xl`,
                    activeCategory === category
                      ? "bg-background"
                      : "bg-background/40",
                    "px-6",
                  )}
                  style={{
                    scrollMargin: `${TOP_PADDING}px`,
                  }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={`${categories[0]}-0`}
                    className="w-full"
                  >
                    {categoryItems.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`${category}-${i}`}
                        className="border-b border-muted last:border-0"
                      >
                        <AccordionTrigger className="text-base font-medium hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-base font-medium text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export { Faq12 };
export const FAQSection = Faq12;
