import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ZoomIn,
} from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, type ControllerRenderProps, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import "photoswipe/style.css";

import {
  getProductBySlug,
  PRODUCTS,
  type ProductData,
  type ProductImage,
} from "@/lib/products-data";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DetailImage {
  src: string;
  srcset: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
}

function toDetailImage(img: ProductImage): DetailImage {
  const isExternal = img.src.startsWith("http");
  if (!isExternal) {
    return {
      src: img.src,
      srcset: "",
      sizes: "",
      alt: img.alt,
      width: img.width,
      height: img.height,
    };
  }
  const baseUrl = img.src.replace(/&w=\d+/, "");
  return {
    src: `${baseUrl}&w=2400`,
    srcset: `${baseUrl}&w=2400 2400w, ${baseUrl}&w=1920 1920w, ${baseUrl}&w=640 640w`,
    sizes: "(max-width: 1240px) 100vw, 60vw",
    alt: img.alt,
    width: 2400,
    height: Math.round(2400 * (img.height / img.width)),
  };
}

function formatCurrency(value: number, currency: string): string {
  const locale = currency === "CZK" ? "cs-CZ" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

const formSchema = z.object({
  quantity: z.number().min(1).max(99),
});

type FormType = z.infer<typeof formSchema>;

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();

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

  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: ProductData }) {
  const navigate = useNavigate();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { quantity: 1 },
  });

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const stickyFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (stickyFormRef.current) {
            stickyFormRef.current.classList.toggle(
              "translate-y-full",
              entry.isIntersecting,
            );
          }
        }
      },
      { threshold: 0.02 },
    );
    if (cartButtonRef.current) {
      observer.observe(cartButtonRef.current);
    }
    return () => observer.disconnect();
  }, [product.slug]);

  const detailImages = product.images.map(toDetailImage);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);
  const { regular, sale, currency } = product.price;

  const recommendedProducts = otherProducts.map((p) => ({
    name: p.name,
    price: p.price,
    link: `/produkt/${p.slug}`,
    image: { src: p.image, alt: p.name },
    category: p.subtitle,
  }));

  const infoSections = product.accordion.map((a) => ({
    title: a.title,
    content: a.content.list || a.content.text || "",
  }));

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <section className="px-4 py-16 md:py-24 lg:px-12">
      <div className="mx-auto w-full max-w-[88.125rem]">
        <button
          type="button"
          onClick={() => navigate("/obchod")}
          className="mb-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zpet do obchodu
        </button>

        <div className="relative grid grid-cols-1 gap-7 gap-y-7.5 lg:grid-cols-5 xl:gap-18">
          <div className="lg:col-span-3">
            <ProductImages
              images={detailImages}
              galleryID={`gallery-${product.slug}`}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-14 flex flex-col gap-4.5">
              {product.badge && (
                <Badge variant="secondary" className="w-fit">
                  {product.badge}
                </Badge>
              )}
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {product.subtitle}
              </p>
              <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight xl:text-[2.5rem]">
                {product.name}
              </h1>
              <div className="flex flex-col">
                <ProductPrice
                  regular={regular}
                  sale={sale}
                  currency={currency}
                />
              </div>
              <p>{product.description}</p>

              {product.note && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {product.note}
                </p>
              )}

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-7"
              >
                <div className="flex flex-wrap items-center justify-start gap-4">
                  <Controller
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <Field>
                        <Quantity field={field} min={1} max={99} />
                      </Field>
                    )}
                  />
                  <div className="flex-1">
                    <Button
                      variant="secondary"
                      className="w-full"
                      ref={cartButtonRef}
                    >
                      Pridat do kosiku
                    </Button>
                  </div>
                </div>
                <div className="flex w-full shrink-0 basis-full flex-col gap-6">
                  <Button className="w-full" size="lg">
                    Koupit nyni
                  </Button>
                </div>

                {createPortal(
                  <div
                    ref={stickyFormRef}
                    className="fixed inset-x-0 bottom-0 z-50 w-full translate-y-full border-t bg-background transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                      <div className="hidden items-center gap-5 md:flex">
                        <div className="size-[5.625rem] overflow-hidden rounded-[0.375rem]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="block size-full object-cover object-center"
                          />
                        </div>
                        <div>
                          <div className="mb-1 text-lg font-medium">
                            {product.name}
                          </div>
                          <ProductPrice
                            size="sm"
                            regular={regular}
                            sale={sale}
                            currency={currency}
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 gap-3 md:flex-none">
                        <Controller
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <Field className="hidden md:grid">
                              <Quantity field={field} min={1} max={99} />
                            </Field>
                          )}
                        />
                        <div className="flex-1 md:flex-none">
                          <Button className="w-full">Pridat do kosiku</Button>
                        </div>
                      </div>
                    </div>
                  </div>,
                  document.body,
                )}
              </form>

              <div className="flex flex-col gap-4">
                {product.services.map((s, i) => (
                  <div className="flex items-center gap-2" key={`svc-${i}`}>
                    <s.icon className="h-5 w-5" />
                    <span className="text-sm">{s.text}</span>
                  </div>
                ))}
              </div>

              <RecommendedProducts products={recommendedProducts} />
              <ProductInfoSections info={infoSections} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductImages({
  images,
  galleryID,
}: {
  images: DetailImage[];
  galleryID: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

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

    lightbox.on("uiRegister", () => {
      if (lightbox?.pswp?.ui) {
        lightbox.pswp.ui.registerElement({
          name: "custom-toolbar",
          order: 10,
          isButton: false,
          appendTo: "root",
          className:
            "absolute bottom-7.5 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 items-center gap-7",
          html: `
            <button id="pswp-prev" class="!bg-white flex !size-12 border text-white p-2 rounded-full">
              <svg class="stroke-black m-auto size-6 stroke-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button id="pswp-close" class="!bg-white flex !size-15.5 border text-white p-2 rounded-full">
              <svg class="stroke-black m-auto size-7.5 stroke-1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
            <button id="pswp-next" class="!bg-white flex !size-12 border text-white p-2 rounded-full">
              <svg class="stroke-black m-auto size-6 stroke-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          `,
          onInit: (el, pswp) => {
            el.querySelector("#pswp-prev")?.addEventListener("click", () =>
              pswp.prev(),
            );
            el.querySelector("#pswp-next")?.addEventListener("click", () =>
              pswp.next(),
            );
            el.querySelector("#pswp-close")?.addEventListener("click", () =>
              pswp.close(),
            );
            // biome-ignore lint/suspicious/noExplicitAny: PhotoSwipe custom toolbar ref
            (pswp as any).customToolbarEl = el;
          },
        });
      }
    });

    lightbox.on("close", () => {
      // biome-ignore lint/suspicious/noExplicitAny: PhotoSwipe custom toolbar ref
      const pswp = lightbox.pswp as any;
      if (pswp?.customToolbarEl) {
        pswp.customToolbarEl.remove();
        pswp.customToolbarEl = undefined;
      }
    });

    return () => lightbox.destroy();
  }, [galleryID]);

  useEffect(() => {
    if (!api) return;
    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1);
    updateCurrent();
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
    <div>
      <div className="overflow-hidden rounded-3xl" id={galleryID}>
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            loop: true,
            breakpoints: {
              "(min-width: 1024px)": {
                active: false,
                align: "start",
                loop: false,
              },
            },
          }}
        >
          <CarouselContent className="-ml-1 lg:grid lg:grid-cols-1 lg:gap-2.5">
            {images.map((img, index) => (
              <CarouselItem
                key={`img-${index}`}
                className="group w-full pl-1"
              >
                <AspectRatio
                  ratio={1}
                  className="w-full overflow-hidden rounded-3xl bg-muted"
                >
                  <a
                    href={img.src}
                    data-pswp-width={img.width}
                    data-pswp-height={img.height}
                    data-pswp-srcset={img.srcset}
                    target="_blank"
                    rel="noreferrer"
                    data-cropped="true"
                  >
                    <img
                      srcSet={img.srcset}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes={img.sizes}
                      className="block size-full object-cover object-center"
                    />
                  </a>
                  <Badge
                    className="pointer-events-none absolute top-5 right-5 h-10 w-10 rounded-full bg-background p-1.5 text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    variant="secondary"
                  >
                    <ZoomIn />
                  </Badge>
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="lg:hidden">
        <div className="mt-3.5 flex items-center justify-center">
          <Button variant="ghost" size="icon" onClick={() => api?.scrollPrev()}>
            <ChevronLeft />
          </Button>
          <div className="min-w-6 text-center text-sm">
            {current}/{images.length}
          </div>
          <Button variant="ghost" size="icon" onClick={() => api?.scrollNext()}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProductPriceProps {
  regular: number;
  sale?: number;
  currency: string;
  size?: "default" | "sm";
}

function ProductPrice({ regular, sale, currency, size }: ProductPriceProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      {sale && (
        <div
          data-sale={!!sale}
          data-size={size}
          className="text-xl leading-normal font-semibold data-[sale=true]:text-red-600 data-[size=sm]:text-base"
        >
          {formatCurrency(sale, currency)}
        </div>
      )}
      <div
        data-sale={!!sale}
        data-size={size}
        className="text-xl leading-relaxed font-bold data-[sale=true]:text-base data-[sale=true]:font-normal data-[sale=true]:text-muted-foreground data-[sale=true]:line-through data-[size=sm]:text-base"
      >
        {formatCurrency(regular, currency)}
      </div>
    </div>
  );
}

function Quantity({
  field,
  max = 99,
  min = 1,
}: {
  field: ControllerRenderProps<FormType, "quantity">;
  max?: number;
  min?: number;
}) {
  return (
    <div className="flex h-9 w-32 items-center justify-between overflow-hidden rounded-md border shadow-xs">
      <Button
        onClick={() =>
          field.onChange(Math.max(min, Number(field.value || 1) - 1))
        }
        variant="ghost"
        type="button"
        size="icon"
        className="rounded-none"
      >
        <Minus />
      </Button>
      <Input
        {...field}
        value={field.value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          const parsed = parseInt(raw, 10);
          if (raw === "") {
            field.onChange("");
          } else if (!Number.isNaN(parsed)) {
            field.onChange(parsed);
          }
        }}
        type="number"
        min={min}
        max={max}
        className="h-full flex-1 [appearance:textfield] rounded-none border-0 text-center focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        onClick={() =>
          field.onChange(Math.min(max, Number(field.value || 1) + 1))
        }
        variant="ghost"
        type="button"
        size="icon"
        className="rounded-none"
      >
        <Plus />
      </Button>
    </div>
  );
}

interface RecommendedProduct {
  name: string;
  price: { regular: number; sale?: number; currency: string };
  link: string;
  image: { src: string; alt: string };
  category: string;
}

function RecommendedProducts({
  products,
}: {
  products: RecommendedProduct[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) return;
    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1);
    updateCurrent();
    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-base font-medium tracking-tighter xl:text-xl">
          Dalsi produkty
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => api?.scrollPrev()}>
            <ChevronLeft />
          </Button>
          <div className="w-6 text-center text-sm">
            {current}/{products.length}
          </div>
          <Button variant="ghost" size="icon" onClick={() => api?.scrollNext()}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {products.map((item, index) => (
            <CarouselItem key={`rec-${index}`}>
              <div className="rounded-[1.25rem] bg-muted p-2.5">
                <div className="grid grid-cols-[minmax(0,4.125rem)_minmax(0,1fr)] items-center gap-3">
                  <div>
                    <div className="aspect-square w-full overflow-hidden rounded-[0.625rem]">
                      <img
                        src={item.image.src}
                        alt={item.image.alt}
                        className="block size-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-sm text-foreground/50">
                      {item.category}
                    </div>
                    <Link
                      to={item.link}
                      className="relative block h-fit w-fit !p-0 text-lg leading-[1.5] font-medium after:absolute after:start-0 after:bottom-[0.35rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1">
                      <ProductPrice
                        regular={item.price.regular}
                        sale={item.price.sale}
                        currency={item.price.currency}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function ProductInfoSections({
  info,
}: {
  info: { title: string; content: string | string[] }[];
}) {
  return (
    <Accordion type="multiple" className="w-full border-b">
      {info.map((item, index) => (
        <AccordionItem value={`info-${index}`} key={`info-${index}`}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-sm leading-normal text-balance">
            {Array.isArray(item.content) ? (
              <ul className="list-inside list-disc pl-5">
                {item.content.map((text, i) => (
                  <li key={`list-${i}`}>{text}</li>
                ))}
              </ul>
            ) : (
              item.content
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
