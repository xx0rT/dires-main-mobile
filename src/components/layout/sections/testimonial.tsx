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
    name: "John Doe",
    username: "johndoe",
    date: "2023-10-05",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    content:
      "This platform has completely transformed the way I manage my projects. The tools are not only intuitive but also incredibly powerful, allowing me to streamline my workflow like never before. It's a game-changer for productivity!",
  },
  {
    id: "2",
    name: "Jane Smith",
    username: "janesmith",
    date: "2023-09-30",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    content:
      "The collaboration features are truly outstanding, allowing my team and I to work together seamlessly no matter where we are, which has made remote work significantly easier. The real-time editing and intuitive sharing options have transformed how we operate, eliminating the headaches of version control and endless email chains.",
  },
  {
    id: "3",
    name: "Alice Johnson",
    username: "alicej",
    date: "2023-09-25",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    content: "The analytics are a game-changer!",
  },
  {
    id: "4",
    name: "Bob Brown",
    username: "bobbrown",
    date: "2023-09-20",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "I love how easy it is to integrate this platform with my existing tools. It has streamlined my workflow significantly, saving me hours every week.",
  },
  {
    id: "5",
    name: "Charlie Davis",
    username: "charlied",
    date: "2023-09-15",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    content:
      "The design templates are fantastic. They've helped me deliver projects faster without compromising on quality. Highly recommend!",
  },
  {
    id: "6",
    name: "Eva Wilson",
    username: "evawilson",
    date: "2023-09-10",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp",
    content:
      "This platform has made project management so much easier. It's intuitive, efficient, and keeps everyone on the same page.",
  },
  {
    id: "7",
    name: "Frank Miller",
    username: "frankm",
    date: "2023-09-05",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp",
    content:
      "The branding tools are amazing. They've helped us maintain consistency across all our campaigns, which has been a huge win for our team.",
  },
  {
    id: "8",
    name: "Grace Lee",
    username: "gracelee",
    date: "2023-08-30",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp",
    content:
      "The vector editing tools are fantastic. They've made my creative process so much smoother and more enjoyable.",
  },
  {
    id: "9",
    name: "Henry Garcia",
    username: "henryg",
    date: "2023-08-25",
    avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
    content:
      "The animation features are incredible. They've taken my projects to the next level, and I couldn't be happier with the results.",
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

          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <span>
              Discover how <b>Shadcnblocks</b> is transforming workflows across
              industries.
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
            <span className="flex items-center gap-1">
              <span>See More</span>
              <span className="text-muted/80">-</span>
              <span className="text-muted/80">Feedback</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/80" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };
