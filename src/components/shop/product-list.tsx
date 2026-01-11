import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

import { Price, PriceValue } from "@/components/shadcnblocks/price";
import { ProductQuickView5 } from "@/components/shop/product-detail-modal";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

type StockStatusCode = keyof typeof STOCK_STATUS;

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

interface Product {
  name: string;
  image: {
    src: string;
    srcset?: string;
    sizes?: string;
    alt: string;
  };
  link: string;
  price: ProductPrice;
  stockStatusCode: StockStatusCode;
  badges?: Array<{
    text: string;
    color?: string;
  }>;
}

type ProductCardProps = Product & {
  onQuickView?: () => void;
};

interface FeaturedPromotion {
  kicker: string;
  title: string;
  cta: {
    link: string;
    label: string;
  };
  link: string;
  image: string;
}

type FeaturedPromotionCardProps = FeaturedPromotion;

type ProductList = Array<{
  featuredPromotion: FeaturedPromotion;
  products: Array<Product>;
}>;

const PRODUCTS_LIST: ProductList = [
  {
    featuredPromotion: {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/linh-le-giP0e750Dr8-unsplash-1.jpg",
      title: "Timeless pieces made for comfort and style.",
      kicker: "Elevate Your Everyday Spaces",
      cta: {
        label: "Shop Furniture & More",
        link: "#",
      },
      link: "#",
    },
    products: [
      {
        name: "Leather Sofa",
        price: {
          regular: 899.0,
          sale: 799.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Ceramic Mug",
        price: {
          regular: 5.99,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-20710970-15362198-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-20710970-15362198-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-20710970-15362198-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-20710970-15362198-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Tea Kettle",
        price: {
          regular: 92.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-nicola-barts-7937498-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-nicola-barts-7937498-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-nicola-barts-7937498-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-nicola-barts-7937498-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Scented Candles",
        price: {
          regular: 50.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-sueda-gln-327513956-20081033-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-sueda-gln-327513956-20081033-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-sueda-gln-327513956-20081033-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-sueda-gln-327513956-20081033-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: '5" x 7" Wood Frame',
        price: {
          regular: 20.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-4207785-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-4207785-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-4207785-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-4207785-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Sphere Lamp",
        price: {
          regular: 199.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-6825308-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-6825308-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-6825308-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-6825308-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Leather Chair",
        price: {
          regular: 899.0,
          sale: 799.0,
          currency: "USD",
        },
        link: "#",
        badges: [
          {
            text: "Best Choice!",
            color: "oklch(54.6% 0.245 262.881)",
          },
          {
            text: "Sale",
            color: "oklch(57.7% 0.245 27.325)",
          },
        ],
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Ceramic Cup",
        price: {
          regular: 19.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-bWlbcvFMUh4-unsplash-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-bWlbcvFMUh4-unsplash-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-bWlbcvFMUh4-unsplash-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-bWlbcvFMUh4-unsplash-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
    ],
  },
  {
    featuredPromotion: {
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-karolina-grabowska-4207892-1.jpg",
      title: "From candles to frames, small accents, big impressions.",
      kicker: "Details That Make a Home",
      cta: {
        label: "Explore Home Accents",
        link: "#",
      },
      link: "#",
    },
    products: [
      {
        name: "Dining Chair",
        price: {
          regular: 299.0,
          sale: 199.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "OUT_OF_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Wall Clock",
        price: {
          regular: 159.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-cottonbro-5185169-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-cottonbro-5185169-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-cottonbro-5185169-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-cottonbro-5185169-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Ceramic Plate",
        price: {
          regular: 99.0,
          sale: 89.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        badges: [
          {
            text: "Sale",
            color: "oklch(57.7% 0.245 27.325)",
          },
        ],
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-micheile-10410297-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-micheile-10410297-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-micheile-10410297-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-micheile-10410297-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Wooden Cabinet",
        price: {
          regular: 699.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112749-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112749-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112749-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112749-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Wooden Chair",
        price: {
          regular: 49.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112738-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112738-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112738-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112738-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Ceramic Cup",
        price: {
          regular: 19.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-anna-nekrashevich-8533748-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-anna-nekrashevich-8533748-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-anna-nekrashevich-8533748-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/pexels-anna-nekrashevich-8533748-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Ceramic Cup",
        price: {
          regular: 19.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-L2r9L6Llyp4-unsplash-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-L2r9L6Llyp4-unsplash-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-L2r9L6Llyp4-unsplash-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/other/cafeconcetto-L2r9L6Llyp4-unsplash-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
      {
        name: "Wooden Chair",
        price: {
          regular: 49.0,
          currency: "USD",
        },
        link: "#",
        stockStatusCode: "IN_STOCK",
        image: {
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-karolina-grabowska-7193566-3.jpg",
          srcset:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-karolina-grabowska-7193566-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-karolina-grabowska-7193566-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-karolina-grabowska-7193566-1.jpg 640w",
          alt: "",
          sizes:
            "(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw",
        },
      },
    ],
  },
];

interface ProductList10Props {
  className?: string;
}

const ProductList10 = ({ className }: ProductList10Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuickView = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className={cn("py-32", className)}>
        <div className="flex flex-col gap-5">
          {PRODUCTS_LIST.map((item, index) => (
            <div
              className="flex flex-col gap-5 lg:flex-row lg:even:flex-row-reverse"
              key={`product-list-10-featured-promo-${index}`}
            >
              <div className="flex-1/3">
                <FeaturedPromotionCard {...item.featuredPromotion} />
              </div>
              <div className="flex-2/3">
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  {item.products.map((product, index) => (
                    <ProductCard
                      {...product}
                      key={`product-10-list-card-${index}`}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <ProductQuickView5
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};

const ProductCard = ({
  image,
  name,
  price,
  stockStatusCode,
  onQuickView,
}: ProductCardProps) => {
  const { regular, sale, currency } = price;

  return (
    <Card className="group relative block rounded-none border-none bg-background p-0 shadow-none">
      <Link to="/product/1" className="absolute inset-0 z-10 size-full"></Link>
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <AspectRatio
            ratio={0.749767365}
            className="overflow-hidden rounded-xl"
          >
            <img
              srcSet={image.srcset}
              alt={image.alt}
              sizes={image.sizes}
              className="block size-full origin-center object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
          </AspectRatio>
          {stockStatusCode === STOCK_STATUS.OUT_OF_STOCK && (
            <div className="absolute start-2.5 top-2.5 z-60">
              <Badge>Sold Out</Badge>
            </div>
          )}
          {stockStatusCode === STOCK_STATUS.IN_STOCK && price.sale && (
            <div className="absolute start-2.5 top-2.5 z-60">
              <Badge variant="destructive">Sale</Badge>
            </div>
          )}
          <div className="absolute inset-x-5 top-1/2 z-60 hidden -translate-y-1/2 md:block">
            <div className="flex flex-col gap-2 opacity-0 duration-700 lg:translate-y-4 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              <Button
                disabled={stockStatusCode === STOCK_STATUS.OUT_OF_STOCK}
                className="w-full"
              >
                <ShoppingCart />
                Add to cart
              </Button>
              <Button
                variant="secondary"
                className="w-full relative z-70"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView?.();
                }}
              >
                <Eye />
                Quick View
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-3">
          <CardTitle className="leading-normal font-normal underline-offset-3 group-hover:underline">
            {name}
          </CardTitle>
          <Price
            onSale={sale != null}
            className="text-sm leading-normal font-bold"
          >
            <PriceValue
              price={sale}
              currency={currency}
              variant="sale"
              className="text-red-700"
            />
            <PriceValue price={regular} currency={currency} variant="regular" />
          </Price>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedPromotionCard = ({
  kicker,
  title,
  cta,
  link,
  image,
}: FeaturedPromotionCardProps) => {
  return (
    <Card
      style={{
        backgroundImage: `url(${image})`,
      }}
      className="relative h-full min-h-160 border-none bg-cover bg-center bg-no-repeat p-10 shadow-none md:min-h-100"
    >
      <a href={link} className="absolute inset-0 z-10 size-full"></a>
      <CardHeader className="gap-2.5 p-0">
        <p>{kicker}</p>
        <CardTitle className="text-2xl font-medium">{title}</CardTitle>
        <div className="relative z-20 mt-5">
          <Button size="lg" asChild>
            <a href={cta.link}>{cta.label}</a>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export { ProductList10 };
