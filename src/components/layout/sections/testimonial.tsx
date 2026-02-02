import {
  ChevronRight,
  Clock,
  MessageSquareCode,
  Star,
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
  date: string;
  avatar: string;
  content: string;
  rating: number;
  reviewCount?: number;
  photoCount?: number;
  isLocalGuide?: boolean;
}

const DATA: DataItem[] = [
  {
    id: "1",
    name: "Zuzana Hykyšová",
    date: "3 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    rating: 5,
    reviewCount: 3,
    content:
      "Honza Kottas helped me again with a problem that had been bothering me for a month and that neither massages nor acupuncture helped. Honza's gentle, sensitive work brought me noticeable relief and improvement, not immediately, but within a few days.",
  },
  {
    id: "2",
    name: "Lukáš Lebeda",
    date: "8 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    rating: 5,
    reviewCount: 2,
    content:
      "I highly recommend Mr. Kottas, with whom I am dealing with a long-term neurological problem. I have been to various physiotherapy exercises/therapy and for the first time I feel that someone really understands the problem and uses the right path and technique. 5/5",
  },
  {
    id: "3",
    name: "Veronika Harapátová",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    rating: 5,
    reviewCount: 5,
    photoCount: 1,
    content:
      "I didn't believe my 3-year-old daughter could be calm for an hour, but Mr. Kottas exudes such calmness that she enjoyed the entire visit and, even though she felt relieved right away, she would like to go there again, as she found the entire treatment pleasant.",
  },
  {
    id: "4",
    name: "Hanka Ježková",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    rating: 5,
    reviewCount: 1,
    content:
      "Děkuju za skvělý přístup ! Pan Kottas byl úžasný a hned po první návštěvě se mi dost ulevilo. Co ještě oceňuji je dostupnost do Diresu - tramvajová zastávka je kousíček:))",
  },
  {
    id: "5",
    name: "Žaneta Kárová",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    rating: 5,
    reviewCount: 15,
    photoCount: 14,
    isLocalGuide: true,
    content: "Great personal approach, highly recommend and thank you 🙏",
  },
  {
    id: "6",
    name: "Milan Harapát",
    date: "a year ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    rating: 5,
    reviewCount: 3,
    content:
      "Profesionální přístup a okamžité zlepšení po první návštěvě. Pan Kottas opravdu rozumí svému oboru a ví, jak pomoci. Mohu jen doporučit!",
  },
  {
    id: "7",
    name: "Petra Nováková",
    date: "2 months ago",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    rating: 5,
    reviewCount: 8,
    content:
      "Po dlouhodobých bolestech zad jsem konečně našla pomoc u pana Kottase. Jeho individuální přístup a odbornost jsou na vysoké úrovni. Děkuji!",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: DataItem }) => (
  <Card className="relative mb-5 break-inside-avoid rounded-xl p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10 rounded-full ring-1 ring-muted">
        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium">{testimonial.name}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {testimonial.isLocalGuide && (
                <span className="mr-1 text-xs">Local Guide ·</span>
              )}
              {testimonial.reviewCount && (
                <span>{testimonial.reviewCount} reviews</span>
              )}
              {testimonial.photoCount && (
                <span> · {testimonial.photoCount} photos</span>
              )}
            </div>
          </div>
          <div className="ml-auto hover:cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#4285F4"
                d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
              />
              <path
                fill="#34A853"
                d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
              />
              <path
                fill="#FBBC05"
                d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
              />
              <path
                fill="#EA4335"
                d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
              />
            </svg>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < testimonial.rating
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-gray-200 stroke-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>

    <div className="my-4 border-t border-dashed border-border" />

    <div className="text-sm text-foreground">
      <p>{testimonial.content}</p>
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
      <div className="container">
        <div className="my-4 flex justify-center">
          <Badge variant="outline" className="rounded-sm py-2 shadow-md">
            <MessageSquareCode className="mr-2 size-4 text-muted-foreground" />
            <span>Customer Feedback</span>
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-6 px-4 sm:px-8">
          <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
            Hear what our customers <br /> are saying
          </h2>

          <div className="mt-4 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 stroke-yellow-400"
                  />
                ))}
              </div>
              <span className="text-2xl font-semibold">5.0</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Based on 7 Google reviews
            </span>
          </div>
        </div>

        <div className="relative mt-14 w-full px-4 after:absolute after:inset-x-0 after:-bottom-2 after:h-96 after:bg-linear-to-t after:from-background sm:px-8 md:px-16 lg:px-32">
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {reorderedData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button className="mt-4 gap-2 rounded-lg px-5 py-3 text-sm shadow-sm transition-colors hover:bg-primary/90 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
            <span>Navštivte nás také</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };
