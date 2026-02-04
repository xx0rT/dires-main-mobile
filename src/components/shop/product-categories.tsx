import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type ProductCategory = {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  summary: string;
  link: string;
};

type ProductCategories2Props = {
  title?: string;
  productCategories?: ProductCategory[];
  className?: string;
};

const PRODUCT_CATEGORIES = {
  title: "Kategorie produktů",
  productCategories: [
    {
      title: "Posilovací gumy",
      summary: "Elastické pásy pro rehabilitační cvičení",
      image: {
        src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Posilovací gumy",
      },
      link: "#",
    },
    {
      title: "Masážní pomůcky",
      summary: "Profesionální nástroje pro uvolnění svalů",
      image: {
        src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Masážní pomůcky",
      },
      link: "#",
    },
    {
      title: "Balanční podložky",
      summary: "Pro zlepšení stability a koordinace",
      image: {
        src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Balanční podložky",
      },
      link: "#",
    },
    {
      title: "Rehabilitační míče",
      summary: "Pro posilování a funkční cvičení",
      image: {
        src: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Rehabilitační míče",
      },
      link: "#",
    },
    {
      title: "Terapeutické válce",
      summary: "Pro masáž a uvolnění svalového napětí",
      image: {
        src: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Terapeutické válce",
      },
      link: "#",
    },
    {
      title: "Cvičební podložky",
      summary: "Pohodlné podložky pro všechny cviky",
      image: {
        src: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600",
        alt: "Cvičební podložky",
      },
      link: "#",
    },
  ],
};

const ProductCategories2 = ({
  title = PRODUCT_CATEGORIES.title,
  productCategories = PRODUCT_CATEGORIES.productCategories,
  className,
}: ProductCategories2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="flex flex-col gap-10">
        <h2 className="animate-in text-center text-4xl leading-snug font-medium duration-600 fade-in slide-in-from-bottom-6">
          {title}
        </h2>
        <div className="gap grid grid-cols-2 gap-x-2.5 gap-y-10 lg:grid-cols-3">
          {productCategories?.map((item, index) => (
            <div
              key={item.title}
              style={{
                animationDelay: `${100 * index}ms`,
              }}
              className="animate-out opacity-0 duration-700 fade-in-100 fill-mode-forwards"
            >
              <ProductCategoryCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCategoryCard = ({
  title,
  image,
  summary,
  link,
}: ProductCategory) => {
  return (
    <Card className="rounded-none border-none bg-background p-0 shadow-none">
      <CardContent className="p-0">
        <a href={link} className="flex flex-col gap-4">
          <AspectRatio
            ratio={1.363277259}
            className="overflow-hidden rounded-xl"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="size-full origin-center object-cover object-center transition-transform duration-400 hover:scale-115"
            />
          </AspectRatio>
          <div className="space-y-1">
            <CardTitle className="text-center text-lg leading-tight font-medium sm:text-xl md:text-2xl">
              {title}
            </CardTitle>
            <CardDescription className="text-center">{summary}</CardDescription>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export { ProductCategories2 };
