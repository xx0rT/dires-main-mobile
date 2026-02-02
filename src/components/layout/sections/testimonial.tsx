import {
  BadgeCheck,
  ChevronRight,
  Clock,
  MessageSquareCode,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
    name: "Zuzana Hykyšová",
    username: "3 reviews",
    date: "3 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "Honza Kottas helped me again with a problem that had been bothering me for a month and that neither massages nor acupuncture helped. Honza's gentle, sensitive work brought me noticeable relief and improvement, not immediately, but within a few sessions.",
  },
  {
    id: "2",
    name: "Lukáš Lebeda",
    username: "2 reviews",
    date: "8 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "I highly recommend Mr. Kottas, with whom I am dealing with a long-term neurological problem. I have been to various physiotherapy exercises/therapy and for the first time I feel that someone really understands the problem and uses the right path and technique. 5/5",
  },
  {
    id: "3",
    name: "Veronika Harapátová",
    username: "5 reviews · 1 photo",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content: "I didn't believe my 3-year-old daughter could be calm for an hour, but Mr. Kottas exudes such calmness that she enjoyed the entire visit and, even though she felt relieved right away, she would like to go there again, as she found the entire treatment pleasant.",
  },
  {
    id: "4",
    name: "Hanka Ježková",
    username: "1 review",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "Děkuju za skvělý přístup! Pan Kottas byl úžasný a hned po první návštěvě se mi dost ulevilo. Co ještě oceňuji je dostupnost do Diresu - tramvajová zastávka je kousíček:))",
  },
  {
    id: "5",
    name: "Žaneta Kárová",
    username: "Local Guide · 15 reviews",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "Great personal approach, highly recommend and thank you 🙏",
  },
  {
    id: "6",
    name: "Milan Harapát",
    username: "3 reviews",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "Excellent service and professional care. Mr. Kottas provided outstanding treatment and I'm very satisfied with the results.",
  },
  {
    id: "7",
    name: "Jana Nováková",
    username: "4 reviews",
    date: "10 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    content:
      "Professional approach and effective treatment. I can highly recommend Mr. Kottas for neurological rehabilitation. The results speak for themselves.",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: DataItem }) => (
  <Card className="relative mb-5 break-inside-avoid rounded-xl p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10 rounded-full ring-1 ring-muted">
        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{testimonial.name}</p>
          <BadgeCheck className="h-4 w-4 fill-cyan-400 stroke-white" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          @{testimonial.username}
        </p>
      </div>
      <div className="ml-auto hover:cursor-pointer">
        <img src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/x.svg" alt="X logo" className="h-4 w-4" />
      </div>
    </div>

    <div className="my-4 border-t border-dashed border-border" />

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
    <section className={cn("py-32", className)}>
      <div className="container mx-auto flex flex-col items-center">
        <div className="my-4 flex justify-center">
          <Badge variant="outline" className="rounded-sm py-2 shadow-md">
            <MessageSquareCode className="mr-2 size-4 text-muted-foreground" />
            <span>⭐ 5.0 Rating · 7 Reviews</span>
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-6 px-4 sm:px-8 text-center">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Hear what our customers <br /> are saying
          </h2>

          <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <span>
              Real reviews from patients who experienced professional care with <b>Mr. Kottas</b>.
            </span>
          </div>
        </div>

        <div className="relative mt-14 w-full max-w-7xl mx-auto px-4 after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background sm:px-8 md:px-16 lg:px-32">
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {reorderedData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button className="mt-4 gap-2 rounded-lg px-5 py-3 text-sm shadow-sm transition-colors hover:bg-primary/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            <span className="flex items-center gap-1">
              <span>See More</span>
              <span className="text-muted/80">-</span>
              <span className="text-muted/80">Reviews</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };
