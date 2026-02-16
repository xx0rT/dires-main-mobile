import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface BentoItem {
  title: React.ReactNode;
  description: string[];
  image: {
    src: string;
    alt: string;
    className?: string;
  };
  imagePosition: "header" | "content";
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

interface BentoFeaturesProps {
  label?: string;
  items: BentoItem[];
  className?: string;
}

export function BentoFeatures({ label, items, className }: BentoFeaturesProps) {
  return (
    <section className={cn("relative overflow-hidden py-16 md:py-24", className)}>
      {label && (
        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      )}

      <div className="relative z-10 mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
        {items.map((item, index) => (
          <Card
            key={`bento-${index}`}
            className={cn("col-span-1 shadow-lg", item.className)}
          >
            <CardHeader className={item.headerClassName}>
              {item.imagePosition === "header" && (
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className={cn("object-cover", item.image.className)}
                />
              )}
              <CardTitle className="mt-0! text-3xl">{item.title}</CardTitle>
              {item.description.map((desc, i) => (
                <CardDescription
                  key={`desc-${i}`}
                  className="mt-3 text-base font-medium leading-snug"
                >
                  {desc}
                </CardDescription>
              ))}
            </CardHeader>
            <CardContent className={item.contentClassName}>
              {item.imagePosition === "content" && (
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  className={cn(
                    "self-center object-cover",
                    item.image.className,
                  )}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
