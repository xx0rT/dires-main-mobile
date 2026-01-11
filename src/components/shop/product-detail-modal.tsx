import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { LucideIcon, Tag, Truck } from "lucide-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import { useEffect, useId, useRef, useState } from "react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { siFacebook, siInstagram, SimpleIcon, siX } from "simple-icons";
import z from "zod";

import "photoswipe/style.css";

import { cn } from "@/lib/utils";

import { Price, PriceType, PriceValue } from "@/components/shadcnblocks/price";
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
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STOCK_STATUS = {
  IN_STOCK: {
    code: "IN_STOCK",
    message: (qt?: number) =>
      qt ? `Preorder today - ${qt} left` : "Ready to ship",
    color: "oklch(64.8% 0.2 131.684)",
  },
  LOW_STOCK: {
    code: "LOW_STOCK",
    message: "Selling fast!",
    color: "oklch(76.9% 0.188 70.08)",
  },
  OUT_OF_STOCK: {
    code: "OUT_OF_STOCK",
    message: "Out of Stock",
    color: "oklch(58.6% 0.253 17.585)",
  },
} as const;

type StockStatusCode = keyof typeof STOCK_STATUS;

type Image = {
  src: string;
  alt: string;
  thumbnail: string;
  width: number;
  height: number;
};

type SocialLink = {
  link: string;
  icon: SimpleIcon;
};

type StockStatus = {
  code: StockStatusCode;
  quantity?: number;
};

interface ProductImagesProps {
  images: Image[];
  galleryID?: string;
  badges?: string[];
  link?: string;
}

interface StockStatusProps {
  status?: StockStatus;
}

type ServiceListType = {
  icon: LucideIcon;
  text: string;
}[];

interface ServicesListProps {
  list?: ServiceListType;
}

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

type Option = {
  id: string;
  value: string;
  label: string;
  thumbnail?: string;
  stockStatusCode?: StockStatusCode;
};

interface Hinges {
  label: string;
  id: string;
  min?: number;
  max?: number;
  name: FieldName;
  options?: Option[];
}

interface FormProps {
  hinges: Record<FieldName, Hinges>;
  selected?: FormType;
}

interface RadioGroupProps {
  options?: Array<Option>;
  field: ControllerRenderProps<FormType>;
}

type AccordionItemType = {
  title: string;
  value: string;
  content: {
    text?: string;
    list?: string[];
  };
};

interface AccordionSectionProps {
  section?: AccordionItemType[];
}

interface SocialMediaLinksProps {
  links?: SocialLink[];
}

interface Product {
  images: Image[];
  galleryID?: string;
  badges?: string[];
  rate: number;
  name: string;
  price: PriceType;
  stockStatus?: StockStatus;
  services?: ServiceListType;
  hinges: Record<FieldName, Hinges>;
  link: string;
  accordion?: AccordionItemType[];
  socialLinks?: SocialLink[];
}

type ProductQuickView5Props = Partial<Product> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PRODUCT_DETAILS: Product = {
  images: [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Modern-White-Headphones-2.png",
      thumbnail:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Modern-White-Headphones-2.png",
      alt: "Modern white headphones",
      width: 992,
      height: 1200,
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Cozy-Workspace-Setup-2.png",
      thumbnail:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Cozy-Workspace-Setup-2.png",
      alt: "Headphones on a workspace setup",
      width: 840,
      height: 1200,
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Modern-Headphones-with-Hands-2.jpeg",
      thumbnail:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Modern-Headphones-with-Hands-2.jpeg",
      alt: "Hands holding modern headphones",
      width: 1200,
      height: 800,
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/pexels-sound-on-3394651-1.jpg",
      thumbnail:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/pexels-sound-on-3394651-1.jpg",
      alt: "Minimal headphone setup",
      width: 640,
      height: 640,
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/pexels-sound-on-3394653-1.jpg",
      thumbnail:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/pexels-sound-on-3394653-1.jpg",
      alt: "Close-up of headphones",
      width: 640,
      height: 640,
    },
  ],
  badges: ["New"],
  rate: 4.5,
  name: "Modern White Headphones",
  price: {
    regular: 499.0,
    currency: "USD",
  },
  stockStatus: {
    code: "IN_STOCK",
    quantity: 450,
  },
  services: [
    {
      icon: Truck,
      text: "Fast worldwide delivery",
    },
    {
      icon: Tag,
      text: "Buy 5, get 2 free",
    },
  ],
  hinges: {
    color: {
      label: "Color",
      id: "color",
      name: "color",
      options: [
        {
          id: "color-1",
          value: "color-1",
          label: "Green",
          thumbnail:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Green-Headphone-Close-Up-1.jpeg",
          stockStatusCode: "IN_STOCK",
        },
        {
          id: "color-2",
          value: "color-2",
          label: "Purple",
          thumbnail:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Sleek-Purple-Headphones-1.jpeg",
          stockStatusCode: "IN_STOCK",
        },
        {
          id: "color-3",
          value: "color-3",
          label: "White",
          thumbnail:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/a3c68c13-44ef-4937-abf9-15f9add112b0.png",
          stockStatusCode: "IN_STOCK",
        },
        {
          id: "color-4",
          value: "color-4",
          label: "Black",
          thumbnail:
            "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/electronics/Sleek-Black-2-Headphones-1.jpeg",
          stockStatusCode: "IN_STOCK",
        },
      ],
    },
    quantity: {
      label: "Quantity",
      id: "quantity",
      name: "quantity",
      min: 1,
      max: 90,
    },
  },
  link: "/product/1",
  accordion: [
    {
      value: "description",
      title: "Description",
      content: {
        text: "Experience rich, immersive sound with these modern over-ear headphones. Designed for comfort, durability, and exceptional audio clarity, they deliver deep bass, crisp highs, and balanced mids—perfect for music lovers, gamers, and everyday listeners. With soft cushioned ear cups and an adjustable headband, they're built for long listening sessions without fatigue.",
      },
    },
    {
      value: "features",
      title: "Features",
      content: {
        list: [
          "- High-fidelity sound with enhanced bass",
          "- Soft memory-foam ear cushions for all-day comfort",
          "- Lightweight, foldable design for easy carrying",
          "- Noise-isolating ear cups to reduce ambient sound",
          "- Compatible with all Bluetooth-enabled devices",
        ],
      },
    },
    {
      value: "shipping",
      title: "Shipping",
      content: {
        text: "Free shipping on orders over $50. Most orders are delivered within 5–7 business days. Tracking details will be sent to your email once the order is shipped.",
      },
    },
  ],
  socialLinks: [
    { icon: siFacebook, link: "#" },
    { icon: siX, link: "#" },
    { icon: siInstagram, link: "#" },
  ],
};

const ProductQuickView5 = ({
  images = PRODUCT_DETAILS.images,
  badges = PRODUCT_DETAILS.badges,
  rate = PRODUCT_DETAILS.rate,
  name = PRODUCT_DETAILS.name,
  price = PRODUCT_DETAILS.price,
  stockStatus = PRODUCT_DETAILS.stockStatus,
  services = PRODUCT_DETAILS.services,
  hinges = PRODUCT_DETAILS.hinges,
  link = PRODUCT_DETAILS.link,
  accordion = PRODUCT_DETAILS.accordion,
  socialLinks = PRODUCT_DETAILS.socialLinks,
  open,
  onOpenChange,
}: ProductQuickView5Props) => {
  const { regular, sale, currency } = price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={
          {
            "--dialog-height": "calc(100dvh - 2.5rem)",
            "--dialog-max-height": "45rem",
          } as React.CSSProperties
        }
        className="h-[var(--dialog-height)] w-dvw max-w-300! border-none p-0 max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:h-[calc(100dvh-100px)] max-md:translate-0! max-md:overflow-auto md:max-h-[var(--dialog-max-height)] md:w-[calc(100dvw-4rem)]"
      >
        <div className="grid grid-cols-1 gap-5 max-md:p-10 max-sm:px-5 md:h-[var(--dialog-height)] md:max-h-[var(--dialog-max-height)] md:grid-cols-2">
          <div className="hide-scrollbar max-h-[var(--dialog-max-height)] md:h-[var(--dialog-height)] md:overflow-auto md:py-10 md:pl-10">
            <ProductImages badges={badges} images={images} link={link} />
          </div>
          <div className="hide-scrollbar md:h-[var(--dialog-height)] md:max-h-[var(--dialog-max-height)] md:overflow-auto md:py-10 md:pr-10">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Rating
                    rate={rate}
                    className="[&_svg]:size-4 [&>div]:size-4"
                  />
                  <p className="text-sm">({rate})</p>
                </div>
                <DialogTitle className="text-3xl leading-tight font-bold">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline cursor-pointer"
                  >
                    {name}
                  </a>
                </DialogTitle>
                <Price
                  onSale={sale != null}
                  className="items-end text-xl leading-relaxed"
                >
                  <PriceValue price={sale} currency={currency} variant="sale" />
                  <PriceValue
                    price={regular}
                    currency={currency}
                    variant="regular"
                  />
                </Price>
              </div>
              <div className="space-y-2 border-y py-4">
                <StockStatus status={stockStatus} />
                <ServicesList list={services} />
              </div>
              <div className="mt-7.5 space-y-3">
                <Form hinges={hinges} />
                <Button
                  asChild
                  variant="link"
                  className="px-0 underline underline-offset-4"
                >
                  <a href={link} target="_blank" rel="noopener noreferrer">View details</a>
                </Button>
                <AccordionSection section={accordion} />
              </div>
              <div className="mt-10">
                <SocialMediaLinks links={socialLinks} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ProductImages = ({ images, galleryID, badges, link }: ProductImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  const generatedGalleryID = useId();
  const PhotoSwipeID = galleryID?.trim() ?? generatedGalleryID;

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#" + PhotoSwipeID,
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
          html: `
            <button type="button" id="pswp-close" class="${buttonClassName}">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          `,
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
          html: `
            <div id="pswp-indicator" class="${indicatorClassName} h-8.5 px-4 !rounded-full">
            </div>
          `,
          onInit: (el, pswp) => {
            const indicatorElem = el.querySelector("#pswp-indicator");
            let prevIndex = -1;

            pswp.on("change", () => {
              prevIndex = pswp.currIndex;
              if (indicatorElem) {
                indicatorElem.innerHTML = `${prevIndex + 1} / ${pswp.getNumItems()}`;
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
          html: `
          <div class="flex items-center justify-between px-4">
            <button id="pswp-prev" class="${buttonClassName}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button id="pswp-next" class="${buttonClassName}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          `,
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
  }, [PhotoSwipeID]);

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

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images) return;

  return (
    <div className="space-y-4" id={PhotoSwipeID}>
      <div className="relative">
        <Carousel setApi={setApi} className="group">
          <CarouselContent className="-ml-0 max-md:-ml-4">
            {images.map((img, index) => (
              <CarouselItem className="pl-0 max-md:pl-4" key={index}>
                <AspectRatio>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="block size-full object-cover object-center hover:opacity-95 transition-opacity"
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
              {badges?.map((item, index) => (
                <Badge key={index}>{item}</Badge>
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
                data-state={index === current ? "active" : "inactive"}
                className="size-18 shrink-0 basis-18 overflow-hidden rounded-xs border-border data-[state=active]:ring-2"
                key={index}
                onClick={() => handleThumbnailClick(index)}
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
};

const StockStatus = ({ status }: StockStatusProps) => {
  if (!status) return;

  return (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0 basis-3">
        <div
          style={{
            backgroundColor: STOCK_STATUS[status.code].color,
          }}
          className="size-3 rounded-full"
        ></div>
      </div>
      <p className="flex-1 leading-normal">
        {status.code === STOCK_STATUS.IN_STOCK.code
          ? STOCK_STATUS.IN_STOCK.message(status?.quantity)
          : STOCK_STATUS[status.code].message}
      </p>
    </div>
  );
};

const ServicesList = ({ list }: ServicesListProps) => {
  if (!list) return;

  return (
    <ul className="space-y-2">
      {list.map((item, index) => (
        <li className="flex items-center gap-2.5" key={index}>
          <item.icon className="size-4 shrink-0" />
          <p className="flex-1 leading-normal">{item.text}</p>
        </li>
      ))}
    </ul>
  );
};

const formSchema = z.object({
  color: z.string(),
  quantity: z.number(),
});

const Form = ({ hinges, selected }: FormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: selected?.color ?? "",
      quantity: selected?.quantity ?? 1,
    },
  });

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  const colorHinges = hinges?.color;
  const quantityHinges = hinges?.quantity;

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {colorHinges && (
            <Controller
              control={form.control}
              name={colorHinges.name}
              render={({ field }) => (
                <FieldSet className="gap-2">
                  <FieldLegend className="text-sm leading-normal">
                    {colorHinges.label}
                  </FieldLegend>
                  <ColorRadioGroup
                    field={field}
                    options={colorHinges.options}
                  />
                </FieldSet>
              )}
            />
          )}
          {quantityHinges && (
            <Controller
              control={form.control}
              name={quantityHinges.name}
              render={({ field }) => (
                <FieldSet>
                  <FieldLegend className="text-sm leading-normal">
                    {quantityHinges.label}
                  </FieldLegend>
                  <QuantityInput
                    onValueChange={field.onChange}
                    inputProps={{ ...field }}
                    className="max-w-30 rounded-sm"
                  />
                </FieldSet>
              )}
            />
          )}
        </div>
        <div className="mt-8 space-y-2.5">
          <Button size="lg" className="w-full uppercase">
            Add to cart
          </Button>
          <Button size="lg" variant="outline" className="w-full uppercase">
            Buy it now
          </Button>
        </div>
      </form>
    </div>
  );
};

const ColorRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return;

  return (
    <RadioGroup
      {...field}
      value={field.value as string}
      onValueChange={field.onChange}
      className="flex flex-wrap items-center gap-3"
    >
      {options.map((item, index) => (
        <Field key={index} className="shrink-0 basis-15!">
          <FieldLabel
            htmlFor={item.id}
            className="size-15! cursor-pointer overflow-hidden rounded-md border p-0.5 duration-400 has-checked:ring has-disabled:opacity-60"
          >
            <RadioGroupItem
              id={item.id}
              className="sr-only"
              value={item.value}
              aria-label={`Select ${item.label}`}
              disabled={item.stockStatusCode === STOCK_STATUS.OUT_OF_STOCK.code}
            />
            <div
              style={{
                backgroundImage: `url(${item.thumbnail})`,
              }}
              className="size-full overflow-hidden rounded-sm bg-cover bg-center bg-no-repeat"
            ></div>
          </FieldLabel>
        </Field>
      ))}
    </RadioGroup>
  );
};

const AccordionSection = ({ section }: AccordionSectionProps) => {
  if (!section) return;

  return (
    <Accordion type="multiple" className="w-full border-y border-border">
      {section.map(({ value, title, content }, index) => (
        <AccordionItem value={value} key={index}>
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
                  {content.list.map((text, index) => (
                    <li className="leading-relaxed" key={`list-${index}`}>
                      {text}
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
};

const SocialMediaLinks = ({ links }: SocialMediaLinksProps) => {
  if (!links) return;

  return (
    <div className="space-y-3">
      <p className="uppercase">Share</p>
      <ul className="flex flex-wrap gap-1">
        {links.map(({ icon, link }) => (
          <li key={crypto.randomUUID()}>
            <Button size="icon" asChild variant="ghost">
              <a href={link}>
                <img
                  className="hidden size-5 dark:block"
                  alt={icon.title}
                  src={`https://cdn.simpleicons.org/${icon.slug}/white`}
                />
                <img
                  className="size-5 dark:hidden"
                  alt={icon.title}
                  src={`https://cdn.simpleicons.org/${icon.slug}/black`}
                />
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ProductQuickView5 };
