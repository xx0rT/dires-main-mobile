import { LucideIcon, Package, RotateCcw, Store, Truck } from "lucide-react";

export interface ProductImage {
  src: string;
  alt: string;
  thumbnail: string;
  width: number;
  height: number;
}

export interface ProductAccordionItem {
  value: string;
  title: string;
  content: {
    text?: string;
    list?: string[];
  };
}

export interface ProductService {
  icon: LucideIcon;
  text: string;
}

export interface ProductData {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  images: ProductImage[];
  price: {
    regular: number;
    sale?: number;
    currency: string;
  };
  pricePrefix?: string;
  features?: string[];
  note?: string;
  badge?: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel?: string;
  rate: number;
  services: ProductService[];
  accordion: ProductAccordionItem[];
}

export const PRODUCTS: ProductData[] = [
  {
    slug: "lineseat",
    name: "Lineseat",
    subtitle: "Ergonomicky sedak",
    description:
      "Nase pomucka pro stabilni a funkcni sed v aute nebo v kancelari.",
    image:
      "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      {
        src: "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Lineseat ergonomicky sedak",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Lineseat detail",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/6454128/pexels-photo-6454128.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Lineseat v pouziti",
        width: 1280,
        height: 853,
      },
    ],
    price: {
      regular: 3900,
      sale: 2900,
      currency: "CZK",
    },
    badge: "Akce",
    note: "Akce je platna do vyprodani zasob!",
    rate: 4.5,
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O produktu",
    services: [
      { icon: Truck, text: "Doprava zdarma po cele CR" },
      { icon: RotateCcw, text: "Vraceni do 30 dnu zdarma" },
      { icon: Store, text: "Moznost vyzvednuti v nasem showroomu" },
    ],
    accordion: [
      {
        value: "popis",
        title: "Popis produktu",
        content: {
          text: "Lineseat je inovativni ergonomicky sedak, ktery vam pomuze udrzet spravne drzeni tela pri sezeni. At uz travite hodiny v kancelari nebo za volantem, Lineseat podporuje vasi pater a pomaha predchazet bolestem zad. Navrzeno fyzioterapeuty s 20letou zkusenosti.",
        },
      },
      {
        value: "materialy",
        title: "Materialy a rozmery",
        content: {
          list: [
            "Vysokokvalitni pena s tvarovou pameti",
            "Protiskluzova spodni strana",
            "Pratelny potah na zip",
            "Rozmery: 45 x 40 x 8 cm",
          ],
        },
      },
      {
        value: "doprava",
        title: "Doprava a vraceni",
        content: {
          text: "Doprava po cele CR zdarma. Zbozi lze vratit do 30 dnu od zakoupeni v originalnim obalu. Doruceni obvykle do 3-5 pracovnich dnu.",
        },
      },
    ],
  },
  {
    slug: "correctfoot",
    name: "Correctfoot",
    subtitle: "Balancni desticka",
    description: "Balancni desticka pro trenink koncetin.",
    image:
      "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      {
        src: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Correctfoot balancni desticka",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Correctfoot v pouziti",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3984340/pexels-photo-3984340.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Correctfoot detail",
        width: 1280,
        height: 853,
      },
    ],
    price: {
      regular: 2900,
      currency: "CZK",
    },
    pricePrefix: "od",
    note: "Vyber ze dvou variant.",
    rate: 4.0,
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O produktu",
    services: [
      { icon: Truck, text: "Doprava zdarma po cele CR" },
      { icon: RotateCcw, text: "Vraceni do 30 dnu zdarma" },
      { icon: Package, text: "Vyber ze dvou variant" },
    ],
    accordion: [
      {
        value: "popis",
        title: "Popis produktu",
        content: {
          text: "Correctfoot balancni desticka je navrzena ve spolupraci s fyzioterapeuty. Pomaha zlepsit stabilitu, propriocepci a koordinaci. Idealni pro rehabilitaci po zranenich kotnika a kolena.",
        },
      },
      {
        value: "varianty",
        title: "Varianty",
        content: {
          list: [
            "Varianta Basic - pro zacatecniky a mirnou rehabilitaci",
            "Varianta Pro - pro pokrocile a intenzivni trenink",
            "Obe varianty vyrobeny z kvalitniho dreva",
            "Protiskluzovy povrch",
          ],
        },
      },
      {
        value: "doprava",
        title: "Doprava a vraceni",
        content: {
          text: "Doprava po cele CR zdarma. Zbozi lze vratit do 30 dnu od zakoupeni v originalnim obalu.",
        },
      },
    ],
  },
  {
    slug: "4core",
    name: "4CORE",
    subtitle: "Treninkovy program",
    description: "Online treninkovy program pro zlepseni kondice a zdravi.",
    image:
      "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      {
        src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "4CORE treninkovy program",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "4CORE cviceni",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "4CORE trenink",
        width: 1280,
        height: 853,
      },
    ],
    price: {
      regular: 4900,
      currency: "CZK",
    },
    features: ["70 dni treninku", "15 minut denne"],
    note: "Dozivotni pristup!",
    rate: 4.8,
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "Vyzkouset",
    services: [
      { icon: Package, text: "Okamzity pristup po zakoupeni" },
      { icon: Store, text: "Dozivotni pristup ke vsem materialam" },
    ],
    accordion: [
      {
        value: "obsah",
        title: "Co program obsahuje",
        content: {
          list: [
            "70 dnu strukturovaneho treninku",
            "Video navody ke kazdemu cviku",
            "Postupne zvysovani narocnosti",
            "Dozivotni pristup ke vsem materialam",
          ],
        },
      },
      {
        value: "komu",
        title: "Pro koho je urcen",
        content: {
          text: "Program je vhodny pro vsechny urovne zdatnosti. At uz jste uplny zacatecnik nebo pokrocily sportovec, 4CORE se prizpusobi vasemu tempu.",
        },
      },
      {
        value: "fungovani",
        title: "Jak to funguje",
        content: {
          text: "Po zakoupeni ziskate okamzity pristup do online platformy. Kazdy den obdrzite novy trenink s video navodem. Staci 15 minut denne.",
        },
      },
    ],
  },
  {
    slug: "fyziotrenink",
    name: "Fyziotrenink",
    subtitle: "Kniha",
    description:
      "Aktualizovane vydani knihy Fyziotrenink - Pohyb jako lek.",
    image:
      "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      {
        src: "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Kniha Fyziotrenink",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/5473188/pexels-photo-5473188.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Fyziotrenink obsah",
        width: 1280,
        height: 853,
      },
      {
        src: "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=1280",
        thumbnail:
          "https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=200",
        alt: "Fyziotrenink cviky",
        width: 1280,
        height: 853,
      },
    ],
    price: {
      regular: 450,
      currency: "CZK",
    },
    note: "Cena je vcetne dopravy!",
    rate: 4.7,
    ctaPrimaryLabel: "Koupit",
    ctaSecondaryLabel: "O knize",
    services: [
      { icon: Truck, text: "Cena vcetne postovneho a balneho" },
      { icon: Package, text: "Doruceni do 3-5 pracovnich dnu" },
    ],
    accordion: [
      {
        value: "oknize",
        title: "O knize",
        content: {
          text: "Fyziotrenink - Pohyb jako lek je prakticky pruvodce, ktery vam ukazuje, jak vyuzit pohyb jako nastroj pro zlepseni zdravi. Obsahuje desitky cviku s detailnimi popisy a ilustracemi.",
        },
      },
      {
        value: "obsah",
        title: "Obsah knihy",
        content: {
          list: [
            "Zaklady funkcniho treninku",
            "Cviky pro spravne drzeni tela",
            "Rehabilitacni programy",
            "Prevence zraneni",
            "Treninkove plany pro ruzne urovne",
          ],
        },
      },
      {
        value: "doprava",
        title: "Doprava",
        content: {
          text: "Kniha je zasilana postou s dorucenim do 3-5 pracovnich dnu. Cena jiz zahrnuje postovne a balne.",
        },
      },
    ],
  },
];

export function getProductBySlug(slug: string): ProductData | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
