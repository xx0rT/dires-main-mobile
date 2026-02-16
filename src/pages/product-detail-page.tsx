import clsx from "clsx";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "photoswipe/style.css";

import {
  getProductBySlug,
  PRODUCTS,
  type ProductAccordionItem,
  type ProductData,
  type ProductImage,
  type ProductService,
} from "@/lib/products-data";

import { Price, PriceValue } from "@/components/shadcnblocks/price";
import QuantityInput from "@/components/shadcnblocks/quantity-input";
import { Rating } from "@/components/shadcnblocks/rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = useMemo(
    () => (productId ? getProductBySlug(productId) : undefined),
    [productId],
  );

  if (!product) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-32">
        <h1 className="text-2xl font-bold">Produkt nenalezen</h1>
        <p className="mt-2 text-muted-foreground">
          Tento produkt nebyl nalezen v nasem obchode.
        </p>
        <Button asChild className="mt-6">
          <Link to="/obchod">Zpet do obchodu</Link>
        </Button>
      </section>
    );
  }

  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);
  const { regular, sale, currency } = product.price;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <button
          type="button"
          onClick={() => navigate("/obchod")}
          className="mb-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zpet do obchodu
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductImages
            images={product.images}
            badges={product.badge ? [product.badge] : undefined}
          />

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {product.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Rating
                  rate={product.rate}
                  className="[&_svg]:size-4 [&>div]:size-4"
                />
                <p className="text-sm">({product.rate})</p>
              </div>
              <h1 className="text-3xl leading-tight font-bold">
                {product.name}
              </h1>
              <Price
                onSale={sale != null}
                className="items-end text-xl leading-relaxed"
              >
                {product.pricePrefix && (
                  <span className="text-base text-muted-foreground">
                    {product.pricePrefix}
                  </span>
                )}
                <PriceValue
                  price={sale}
                  currency={currency}
                  variant="sale"
                />
                <PriceValue
                  price={regular}
                  currency={currency}
                  variant="regular"
                />
              </Price>
            </div>

            <div className="space-y-2 border-y py-4">
              <ServicesList services={product.services} />
            </div>

            {product.note && (
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {product.note}
              </p>
            )}

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm leading-normal">Pocet</p>
                <QuantityInput className="max-w-30 rounded-sm" />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button size="lg" className="w-full uppercase">
                <ShoppingCart className="mr-2 size-4" />
                Pridat do kosiku
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full uppercase"
              >
                Koupit nyni
              </Button>
            </div>

            <AccordionSection sections={product.accordion} />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">
            Dalsi produkty
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherProducts.map((p) => (
              <RelatedProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductImages({
  images,
  badges,
}: {
  images: ProductImage[];
  badges?: string[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
  const generatedGalleryID = useId();
  const galleryID = generatedGalleryID;

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: `#${galleryID}`,
      children: "a",
      bgOpacity: 1,
      wheelToZoom: true,
      arrowPrev: false,
      arrowNext: false,
      close: false,
      zoom: false,
      counter: false,
      mainClass: "[&>div:first-child]:!bg-background",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    lightboxRef.current = lightbox;

    const buttonClassName = cn(
      buttonVariants({
        variant: "outline",
        size: "icon",
        className: "rounded-full",
      }),
    );
    const indicatorClassName = cn(badgeVariants({ variant: "secondary" }));

    lightbox.on("uiRegister", () => {
      if (lightbox?.pswp?.ui) {
        lightbox.pswp.ui.registerElement({
          name: "custom-close-btn",
          order: 10,
          isButton: false,
          appendTo: "root",
          className: "absolute top-5 right-5",
          html: `<button type="button" id="pswp-close" class="${buttonClassName}"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button>`,
          onInit: (el, pswp) => {
            el.querySelector("#pswp-close")?.addEventListener("click", () =>
              pswp.close(),
            );
          },
        });
      }

      if (lightbox?.pswp?.ui) {
        lightbox.pswp.ui.registerElement({
          name: "custom-indicator-btn",
          order: 10,
          isButton: false,
          appendTo: "root",
          className: "absolute top-5 left-5",
          html: `<div id="pswp-indicator" class="${indicatorClassName} h-8.5 px-4 !rounded-full"></div>`,
          onInit: (el, pswp) => {
            const indicatorElem = el.querySelector("#pswp-indicator");
            pswp.on("change", () => {
              if (indicatorElem) {
                indicatorElem.innerHTML = `${pswp.currIndex + 1} / ${pswp.getNumItems()}`;
              }
            });
          },
        });
      }

      if (lightbox?.pswp?.ui) {
        lightbox.pswp.ui.registerElement({
          name: "custom-next-prev-btns",
          order: 10,
          isButton: false,
          appendTo: "root",
          className: "absolute top-1/2 inset-x-0 -translate-y-1/2",
          html: `<div class="flex items-center justify-between px-4"><button id="pswp-prev" class="${buttonClassName}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></button><button id="pswp-next" class="${buttonClassName}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button></div>`,
          onInit: (el, pswp) => {
            el.querySelector("#pswp-prev")?.addEventListener("click", () =>
              pswp.prev(),
            );
            el.querySelector("#pswp-next")?.addEventListener("click", () =>
              pswp.next(),
            );
          },
        });
      }
    });

    return () => lightbox.destroy();
  }, [galleryID]);

  useEffect(() => {
    if (!api) return;
    const updateCurrent = (api: CarouselApi) =>
      setCurrent(api?.selectedScrollSnap() ?? 0);
    updateCurrent(api);
    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  useEffect(() => {
    if (lightboxRef.current && api) {
      lightboxRef.current.on("change", () => {
        api?.scrollTo(lightboxRef.current?.pswp?.currIndex || 0);
      });
    }
  }, [api, current]);

  return (
    <div className="space-y-4 lg:sticky lg:top-24" id={galleryID}>
      <div className="relative">
        <Carousel setApi={setApi} className="group">
          <CarouselContent className="-ml-0">
            {images.map((img, index) => (
              <CarouselItem className="pl-0" key={`img-${index}`}>
                <AspectRatio>
                  <a
                    href={img.src}
                    data-pswp-width={img.width}
                    data-pswp-height={img.height}
                    className="cursor-zoom-in"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="block size-full object-cover object-center transition-opacity hover:opacity-95"
                    />
                  </a>
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <CarouselPrevious className="left-6 -translate-x-5 group-hover:translate-x-0" />
            <CarouselNext className="right-6 translate-x-5 group-hover:translate-x-0" />
          </div>
        </Carousel>
        {badges && (
          <div className="absolute inset-x-4 top-4">
            <div className="flex items-center gap-3">
              {badges.map((item, index) => (
                <Badge key={`badge-${index}`}>{item}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      <div
        className={clsx(
          "relative max-md:hidden",
          "after:pointer-events-none after:absolute after:inset-y-0 after:-end-px after:z-10 after:block after:h-full after:w-7.5 after:bg-linear-to-l after:from-background after:to-transparent",
          "before:pointer-events-none before:absolute before:inset-y-0 before:-start-px before:z-10 before:block before:h-full before:w-7.5 before:bg-linear-to-r before:from-background before:to-transparent",
        )}
      >
        <div className="hide-scrollbar w-full overflow-auto px-7.5">
          <div className="flex items-center gap-4 py-0.5">
            {images.map(({ thumbnail, alt }, index) => (
              <button
                type="button"
                data-state={index === current ? "active" : "inactive"}
                className="size-18 shrink-0 basis-18 overflow-hidden rounded-xs border-border data-[state=active]:ring-2"
                key={`thumb-${index}`}
                onClick={() => api?.scrollTo(index)}
              >
                <img
                  src={thumbnail}
                  alt={alt}
                  className="block size-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesList({ services }: { services: ProductService[] }) {
  return (
    <ul className="space-y-2">
      {services.map((item, index) => (
        <li className="flex items-center gap-2.5" key={`service-${index}`}>
          <item.icon className="size-4 shrink-0" />
          <p className="flex-1 leading-normal">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

function AccordionSection({
  sections,
}: {
  sections: ProductAccordionItem[];
}) {
  return (
    <Accordion type="multiple" className="w-full border-y border-border">
      {sections.map(({ value, title, content }, index) => (
        <AccordionItem value={value} key={`accordion-${index}`}>
          <AccordionTrigger className="font-normal uppercase hover:no-underline">
            {title}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {content.text && (
                <p className="leading-relaxed">{content.text}</p>
              )}
              {content.list && (
                <ul className="space-y-1">
                  {content.list.map((text, i) => (
                    <li className="leading-relaxed" key={`list-${i}`}>
                      - {text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function RelatedProductCard({ product }: { product: ProductData }) {
  const { regular, sale, currency } = product.price;

  return (
    <Link
      to={`/produkt/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-border/50 transition-all duration-300 hover:border-border hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={4 / 3}>
          <img
            src={product.image}
            alt={product.name}
            className="block size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge>{product.badge}</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.subtitle}
        </p>
        <h3 className="mt-1 font-semibold underline-offset-3 group-hover:underline">
          {product.name}
        </h3>
        <Price
          onSale={sale != null}
          className="mt-1 text-sm leading-normal font-bold"
        >
          {product.pricePrefix && (
            <span className="text-muted-foreground font-normal">
              {product.pricePrefix}
            </span>
          )}
          <PriceValue price={sale} currency={currency} variant="sale" />
          <PriceValue price={regular} currency={currency} variant="regular" />
        </Price>
      </div>
    </Link>
  );
}
