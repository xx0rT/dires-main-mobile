"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type Category = "Obecné" | "Cvičení" | "Bolest" | "Terapie" | "Ostatní";

interface FAQItem {
  question: string;
  answer: string;
  category: Category;
}

const faqItems: FAQItem[] = [
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

interface FAQItemCardProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemCard({ item, isOpen, onToggle }: FAQItemCardProps) {
  return (
    <motion.div
      layout
      initial={false}
      className={cn(
        "cursor-pointer rounded-xl border border-transparent bg-background/60 backdrop-blur-sm transition-colors",
        isOpen && "border-sky-200/40 bg-background dark:border-sky-800/30"
      )}
      whileHover={{ scale: 1.008, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-medium leading-snug">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex shrink-0 items-center justify-center"
        >
          <ChevronDown className="size-5 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface Faq12Props {
  className?: string;
}

const Faq12 = ({ className }: Faq12Props) => {
  const [activeCategory, setActiveCategory] = useState<Category>("Obecné");
  const [openItem, setOpenItem] = useState<string | null>("Obecné-0");

  const filteredItems = faqItems.filter(
    (item) => item.category === activeCategory
  );

  return (
    <section
      id="faq"
      className={cn("min-h-screen py-32", className)}
    >
      <div className="container mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            FAQ /
          </span>
          <h2 className="text-3xl font-light tracking-tight lg:text-5xl">
            Často kladené otázky
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Prohledejte naši kolekci často kladených otázek o našich službách a kurzech.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setOpenItem(null);
              }}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-medium transition-colors",
                activeCategory === category
                  ? "text-sky-900 dark:text-sky-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="faq-tab-indicator"
                  className="absolute inset-0 rounded-full bg-sky-100 dark:bg-sky-900/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-3"
          >
            {filteredItems.map((item, i) => {
              const itemKey = `${activeCategory}-${i}`;
              return (
                <FAQItemCard
                  key={itemKey}
                  item={item}
                  isOpen={openItem === itemKey}
                  onToggle={() =>
                    setOpenItem(openItem === itemKey ? null : itemKey)
                  }
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export { Faq12 };
export const FAQSection = Faq12;
