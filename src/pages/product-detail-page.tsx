import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  Store,
  Truck,
  ZoomIn,
} from "lucide-react";
import PhotoSwipeLightbox, { PhotoSwipe } from "photoswipe/lightbox";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import "photoswipe/style.css";

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
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StockStatusCode = "IN_STOCK" | "OUT_OF_STOCK";

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

interface ProductImagesProps {
  images: Array<{
    alt: string;
    width: number;
    height: number;
    srcset: string;
    src: string;
    sizes: string;
  }>;
  galleryID: string;
}

interface Option {
  id: string;
  value: string;
  label: string;
  stockInfo: StockInfo;
  price?: price;
}

interface Hinges {
  label: string;
  id: string;
  name: FieldName;
  options?: Option[];
  min?: number;
  max?: number;
}

interface ProductFormProps {
  hinges: Record<FieldName, Hinges>;
  onSubmit: SubmitHandler<FormType>;
  stockInfo?: StockInfo;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  selectedColor?: string;
  productInfo: {
    name: string;
    thumbnail: {
      src: string;
      alt: string;
    };
    price?: price;
  };
}

type price = {
  regular?: number;
  sale?: number;
  currency?: string;
};

interface PriceProps extends price {
  size?: "default" | "sm";
}

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

interface ColorRadioGroupProps {
  options?: Array<Option>;
  field: ControllerRenderProps<FormType>;
}

interface ProductInfoSectionsProps {
  info: {
    title: string;
    content: string | string[];
  }[];
}

interface RecommendedProductsProps {
  products: {
    name: string;
    price: price;
    link: string;
    image: {
      src: string;
      alt: string;
    };
    category: string;
  }[];
}

interface QuantityProps {
  field: ControllerRenderProps<FormType>;
  max?: number;
  min?: number;
}

const PRODUCT_DETAILS = {
  name: "Profesionální masážní stůl",
  color: "Modrá",
  thumbnail: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-3.jpg",
    alt: "Profesionální masážní stůl",
  },
  images: [
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112729-3.jpg",
      alt: "Profesionální masážní stůl",
      width: 1920,
      height: 1080,
      sizes: "(max-width: 1240px) 100vw, 60vw",
    },
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-mathilde-14792096-3.jpg",
      alt: "Detail čalounění",
      width: 1920,
      height: 1080,
      sizes: "(max-width: 1240px) 100vw, 60vw",
    },
    {
      srcset:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-1.jpg 640w",
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-cottonbro-6626409-3.jpg",
      alt: "Nastavitelná výška",
      width: 1920,
      height: 1080,
      sizes: "(max-width: 1240px) 100vw, 60vw",
    },
  ],
  description:
    "Zažijte profesionální úroveň rehabilitace s tímto prémiové masážním stolem. Navržen speciálně pro fyzioterapeuty a maséry s ohledem na maximální pohodlí pacientů i dlouhodobou odolnost.",
  hinges: {
    color: {
      label: "Barva",
      id: "color",
      name: "color",
      options: [
        {
          id: "modra",
          value: "modra",
          label: "Modrá",
          stockInfo: {
            stockStatusCode: "IN_STOCK" as StockStatusCode,
          },
          price: {
            regular: 25990.0,
            sale: 21990.0,
            currency: "CZK",
          },
        },
        {
          id: "cerna",
          value: "cerna",
          label: "Černá",
          stockInfo: {
            stockStatusCode: "IN_STOCK" as StockStatusCode,
            stockQuantity: 10,
          },
          price: {
            regular: 25990.0,
            currency: "CZK",
          },
        },
        {
          id: "bila",
          value: "bila",
          label: "Bílá",
          stockInfo: {
            stockStatusCode: "OUT_OF_STOCK" as StockStatusCode,
          },
          price: {
            regular: 25990.0,
            currency: "CZK",
          },
        },
      ],
    },
    quantity: {
      label: "Množství",
      id: "quantity",
      name: "quantity",
      min: 1,
      max: 99,
    },
  } as Record<FieldName, Hinges>,
  accordion: [
    {
      title: "Popis produktu",
      content:
        "Tento profesionální masážní stůl kombinuje ergonomický design s vynikající stabilitou. Vyrobený z vysoce kvalitních materiálů odolných dezinfekci, je ideální pro fyzioterapeutické ordinace, rehabilitační centra i mobilní maséry.",
    },
    {
      title: "Pokyny k údržbě",
      content:
        "Čistěte měkkým hadříkem s dezinfekčním roztokem vhodným pro zdravotnické pomůcky. Pravidelně kontrolujte stabilitu šroubových spojů. Skladujte v suchém prostředí bez přímého slunečního záření.",
    },
    {
      title: "Materiály a rozměry",
      content: [
        "Vysoce odolné PU čalounění odolné dezinfekci",
        "Kovová konstrukce s práškovým lakováním",
        "Vysoce hustý molitan 8 cm",
        "Rozměry: 190 cm D x 70 cm Š x 60-85 cm V",
        "Nosnost: 250 kg",
      ],
    },
    {
      title: "Doprava a vrácení zboží",
      content:
        "Doprava zdarma při objednávce nad 1 500 Kč. Zboží lze vrátit do 30 dnů od zakoupení. Nabízíme také osobní odběr v našem showroomu v Praze.",
    },
  ],
};

const RECOMMENDED_PRODUCTS = [
  {
    category: "Rehabilitace",
    name: "Balanční podložka",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112738-1.jpg",
      alt: "Balanční podložka",
    },
    link: "#",
    price: {
      regular: 1290.0,
      currency: "CZK",
    },
  },
  {
    category: "Vybavení",
    name: "Terapeutické míče",
    image: {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/furniture/pexels-kseniachernaya-11112749-1.jpg",
      alt: "Terapeutické míče",
    },
    link: "#",
    price: {
      regular: 890.0,
      currency: "CZK",
    },
  },
];

export default function ProductDetailPage() {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "modra",
      quantity: 1,
    },
  });

  const colorHinges = PRODUCT_DETAILS.hinges?.color;
  const color = form.watch("color");

  const selectedItem = useMemo(() => {
    return colorHinges?.options?.find((item) => item.value === color);
  }, [color, colorHinges]);

  const price = selectedItem?.price;
  const stockInfo = selectedItem?.stockInfo;

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <section className="px-4 py-32 font-dm-sans lg:px-12">
      <div className="mx-auto w-full max-w-[88.125rem]">
        <div className="relative grid grid-cols-1 gap-7 gap-7.5 lg:grid-cols-5 xl:gap-18">
          <div className="lg:col-span-3">
            <ProductImages
              images={PRODUCT_DETAILS.images}
              galleryID="gallery-product"
            />
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-14 flex flex-col gap-4.5">
              <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight xl:text-[2.5rem]">
                {PRODUCT_DETAILS.name}
              </h1>
              <div className="flex flex-col">
                <Price
                  regular={price?.regular}
                  sale={price?.sale}
                  currency={price?.currency}
                />
              </div>
              <p>{PRODUCT_DETAILS.description}</p>
              <ProductForm
                hinges={PRODUCT_DETAILS.hinges}
                form={form}
                onSubmit={onSubmit}
                selectedColor={selectedItem?.label}
                stockInfo={stockInfo}
                productInfo={{
                  name: PRODUCT_DETAILS.name,
                  price: price,
                  thumbnail: PRODUCT_DETAILS.thumbnail,
                }}
              />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm">
                    Doprava zdarma při objednávce nad 1 500 Kč
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  <span className="text-sm">Vrácení do 30 dnů zdarma</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <span className="text-sm">
                    Možnost vyzvednutí v našem showroomu v Praze
                  </span>
                </div>
              </div>
              <RecommendedProducts products={RECOMMENDED_PRODUCTS} />
              <ProductInfoSections info={PRODUCT_DETAILS.accordion} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ProductImages = ({ images, galleryID }: ProductImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
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
        <button id="pswp-prev" class=" !bg-white flex !size-12 border text-white p-2 rounded-full">
        <svg class="stroke-black m-auto size-6 stroke-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button id="pswp-close" class=" !bg-white flex !size-15.5 border text-white p-2 rounded-full">
        <svg class="stroke-black m-auto size-7.5 stroke-1" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
        <button id="pswp-next" class=" !bg-white flex !size-12 border text-white p-2 rounded-full">
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

            (
              pswp as PhotoSwipe & { customToolbarEl?: HTMLElement }
            ).customToolbarEl = el;
          },
        });
      }
    });

    lightbox.on("close", () => {
      const pswp = lightbox.pswp as PhotoSwipe & {
        customToolbarEl?: HTMLElement;
      };
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

  if (!images) return;

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
            {images.map((img, index) => {
              return (
                <CarouselItem
                  key={`product-detail-image-${index}`}
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
              );
            })}
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
};

const Price = ({ regular, sale, currency, size }: PriceProps) => {
  if (!regular || !currency) return;

  const formatCurrency = (
    value: number,
    currency: string = "USD",
    locale: string = "en-US",
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      {sale && (
        <div
          data-sale={!!sale}
          data-size={size}
          aria-label="sale price"
          className="text-xl leading-normal font-semibold data-[sale=true]:text-red-600 data-[size=sm]:text-base"
        >
          {formatCurrency(sale, currency)}
        </div>
      )}
      <div
        data-sale={!!sale}
        data-size={size}
        aria-label="regular price"
        className="text-xl leading-relaxed font-bold data-[sale=true]:text-base data-[sale=true]:font-normal data-[sale=true]:text-muted-foreground data-[sale=true]:line-through data-[size=sm]:text-base"
      >
        {formatCurrency(regular, currency)}
      </div>
    </div>
  );
};

const formSchema = z.object({
  quantity: z.number().min(1).max(99),
  color: z.string(),
});

const ProductForm = ({
  hinges,
  form,
  onSubmit,
  stockInfo,
  selectedColor,
  productInfo,
}: ProductFormProps) => {
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const stickyFormRef = useRef<HTMLDivElement>(null);

  const colorHinges = hinges?.color;
  const quantityHinges = hinges?.quantity;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (stickyFormRef.current) {
            stickyFormRef.current.classList.toggle(
              "translate-y-full",
              entry.isIntersecting,
            );
          }
        });
      },
      {
        threshold: 0.02,
      },
    );
    if (cartButtonRef.current) {
      observer.observe(cartButtonRef.current);
    }
  }, []);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-7"
      >
        {colorHinges && (
          <FormField
            control={form.control}
            name={colorHinges.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  asChild
                  className="text-sm leading-relaxed font-bold"
                >
                  <h2>
                    {colorHinges.label}:{" "}
                    <span className="font-normal">{selectedColor}</span>
                  </h2>
                </FormLabel>
                <FormControl>
                  <ColorRadioGroup field={field} options={colorHinges.options} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <div className="flex flex-wrap items-center justify-start gap-4">
          {quantityHinges && (
            <FormField
              control={form.control}
              name={quantityHinges.name}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Quantity
                      field={field}
                      max={quantityHinges?.max}
                      min={quantityHinges?.min}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <div className="flex-1">
            <Button
              variant="secondary"
              className="w-full"
              disabled={stockInfo?.stockStatusCode === "OUT_OF_STOCK"}
              ref={cartButtonRef}
            >
              Přidat do košíku
            </Button>
          </div>
        </div>
        <div className="flex w-full shrink-0 basis-full flex-col gap-6">
          <Button
            className="w-full"
            size="lg"
            disabled={stockInfo?.stockStatusCode === "OUT_OF_STOCK"}
          >
            Koupit nyní
          </Button>
        </div>
        <div
          ref={stickyFormRef}
          className="fixed inset-x-0 bottom-0 z-40 w-full translate-y-full border-t transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-2 bg-background px-4 py-2.5">
            <div className="hidden items-center gap-5 md:flex">
              <div className="size-[5.625rem] overflow-hidden rounded-[0.375rem]">
                <img
                  src={productInfo.thumbnail.src}
                  alt={productInfo.thumbnail.alt}
                  className="block size-full object-cover object-center"
                />
              </div>
              <div>
                <div className="mb-1 text-lg font-medium">
                  {productInfo.name}
                </div>
                {productInfo.price ? (
                  <Price size="sm" {...productInfo.price} />
                ) : null}
              </div>
            </div>
            <div className="flex flex-1 gap-3 md:flex-none">
              {colorHinges && (
                <FormField
                  control={form.control}
                  name={colorHinges.name}
                  render={({ field }) => (
                    <FormItem className="flex-1 md:flex-none">
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full min-w-20">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorHinges?.options?.map((item, index) => (
                            <SelectItem
                              key={`product-select-color-${index}`}
                              value={item.id}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              {quantityHinges && (
                <FormField
                  control={form.control}
                  name={quantityHinges.name}
                  render={({ field }) => (
                    <FormItem className="hidden md:grid">
                      <FormControl>
                        <Quantity
                          field={field}
                          min={quantityHinges.min}
                          max={quantityHinges.max}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <div className="flex-1 md:flex-none">
                <Button
                  className="w-full"
                  disabled={stockInfo?.stockStatusCode === "OUT_OF_STOCK"}
                >
                  Přidat do košíku
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const Quantity = ({ field, max, min }: QuantityProps) => {
  return (
    <div className="flex h-9 w-32 items-center justify-between overflow-hidden rounded-md border shadow-xs">
      <Button
        onClick={() =>
          field.onChange(Math.max(min || 1, Number(field.value || 1) - 1))
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
          } else if (!isNaN(parsed)) {
            field.onChange(parsed);
          }
        }}
        type="number"
        min={min ? min : 1}
        max={max ? max : 99}
        className="h-full flex-1 [appearance:textfield] rounded-none border-0 text-center focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        onClick={() =>
          field.onChange(Math.min(max || 99, Number(field.value || 1) + 1))
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
};

const ColorRadioGroup = ({ options, field }: ColorRadioGroupProps) => {
  if (!options) return;

  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={(value) => {
        if (value != field.value && value) {
          field.onChange(value);
        }
      }}
      className="flex w-full flex-wrap items-start gap-2"
    >
      {options &&
        options.map((item, index) => (
          <FormItem key={`product-detail-color-${index}`}>
            <FormLabel
              htmlFor={item.id}
              className="relative flex h-9 min-w-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground has-data-[disabled=true]:cursor-not-allowed has-data-[disabled=true]:opacity-50"
            >
              <RadioGroupItem
                id={item.id}
                className="sr-only"
                value={item.value}
                aria-label={`Select ${item.label}`}
                data-disabled={
                  item.stockInfo.stockStatusCode === "OUT_OF_STOCK"
                }
              />
              <div>{item.label}</div>
              {item.stockInfo.stockStatusCode === "OUT_OF_STOCK" && (
                <span className="absolute top-0 bottom-0 left-1/2 z-10 block h-full w-0 rotate-45 border-l"></span>
              )}
            </FormLabel>
          </FormItem>
        ))}
    </RadioGroup>
  );
};

const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
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

  if (!products) return;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-base font-medium tracking-tighter xl:text-xl">
          Související produkty
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
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {products.map((item, index) => (
            <CarouselItem key={`product-detail-recommended-${index}`}>
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
                    <a
                      href={item.link}
                      className="relative block h-fit w-fit !p-0 text-lg leading-[1.5] font-medium after:absolute after:start-0 after:bottom-[0.35rem] after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-foreground after:transition-transform after:duration-200 after:content-[''] hover:after:origin-left hover:after:scale-x-100"
                    >
                      {item.name}
                    </a>
                    <div className="mt-1">
                      <Price
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
};

const ProductInfoSections = ({ info }: ProductInfoSectionsProps) => {
  if (!info) return;

  return (
    <Accordion type="multiple" className="w-full border-b">
      {info.map((item, index) => (
        <AccordionItem
          value={`product-info-${index}`}
          key={`product-detail-info-${index}`}
        >
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-sm leading-normal text-balance">
            {Array.isArray(item.content) ? (
              <ul className="list-inside list-disc pl-5">
                {item.content.map((item, index) => (
                  <li key={`product-detail-info-item-${index}`}>{item}</li>
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
};
