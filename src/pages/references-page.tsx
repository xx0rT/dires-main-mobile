import { Reviews23 } from "@/components/shop/reviews23";
import { Reviews3 } from "@/components/shop/reviews3";

const MOCK_REVIEWS_23 = [
  {
    author: {
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
      name: "Jana K.",
      verifiedBuyer: true,
    },
    comment:
      "Skvělá péče! Po třech měsících bolestí zad jsem konečně bez potíží. Pan doktor byl velmi profesionální a trpělivý. Cviky, které mi ukázal, mi pomáhají dodnes.",
    image: "https://images.pexels.com/photos/3823495/pexels-photo-3823495.jpeg?auto=compress&cs=tinysrgb&w=800",
    product: {
      name: "Terapie zad",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=400",
      link: "#",
    },
  },
  {
    author: {
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
      name: "Martin P.",
      verifiedBuyer: true,
    },
    comment:
      "Po úrazu kolena při fotbale jsem potřeboval rychlou rehabilitaci. Díky individuálnímu přístupu a moderním metodám jsem se vrátil do hry za 6 týdnů. Vřele doporučuji!",
    image: "https://images.pexels.com/photos/6111612/pexels-photo-6111612.jpeg?auto=compress&cs=tinysrgb&w=800",
    product: {
      name: "Rehabilitace kolene",
      image: "https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=400",
      link: "#",
    },
  },
  {
    author: {
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
      name: "Eva M.",
      verifiedBuyer: true,
    },
    comment:
      "Dlouhodobé problémy s krční páteří mě trápily roky. Po sérii terapií a správných cvicích jsem konečně našla úlevu. Přístup byl velmi profesionální a vstřícný.",
    image: "https://images.pexels.com/photos/5793955/pexels-photo-5793955.jpeg?auto=compress&cs=tinysrgb&w=800",
    product: {
      name: "Terapie krční páteře",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=400",
      link: "#",
    },
  },
  {
    author: {
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      name: "Petr S.",
      verifiedBuyer: true,
    },
    comment:
      "Sportovní masáže zde jsou úžasné! Pomáhají mi s regenerací po náročných trénincích. Personál je vždy milý a profesionální. Chodím pravidelně a jsem velmi spokojený.",
    image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800",
    product: {
      name: "Sportovní masáž",
      image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400",
      link: "#",
    },
  },
  {
    author: {
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200",
      name: "Lucie H.",
      verifiedBuyer: true,
    },
    comment:
      "Po porodu jsem měla problémy s bolestmi v oblasti pánevního dna. Díky specializované péči a cíleným cvikům se mi podařilo plně se zotavit. Jsem moc vděčná!",
    image: "https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800",
    product: {
      name: "Poporodní rehabilitace",
      image: "https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg?auto=compress&cs=tinysrgb&w=400",
      link: "#",
    },
  },
];

const MOCK_REVIEWS_3 = [
  {
    id: "1",
    rating: 5,
    title: "Úžasná péče a profesionální přístup",
    content:
      "Po měsících bolestí ramene jsem konečně našla odbornou pomoc. Každá terapie byla přizpůsobena mým potřebám a terapeut si vždy udělal čas na vysvětlení postupu. Bolesti jsou pryč a mohu se opět plně věnovat svým koníčkům. Doporučuji všem!",
    author: {
      name: "Alena V.",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    date: "15. ledna 2025",
    verified: true,
    images: ["https://images.pexels.com/photos/5794032/pexels-photo-5794032.jpeg?auto=compress&cs=tinysrgb&w=400"],
    helpful: 24,
    variant: "Terapie ramene",
  },
  {
    id: "2",
    rating: 5,
    title: "Vrátil jsem se ke sportu rychleji než jsem čekal",
    content:
      "Po zranění achillovy šlachy při běhání jsem byl skeptický, zda se ještě někdy vrátím k aktivnímu sportu. Díky individuálnímu rehabilitačnímu plánu a moderním metodám léčby jsem za 8 týdnů opět na běžecké dráze. Profesionalita na nejvyšší úrovni!",
    author: {
      name: "Tomáš K.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    date: "10. ledna 2025",
    verified: true,
    helpful: 18,
    variant: "Sportovní rehabilitace",
  },
  {
    id: "3",
    rating: 5,
    title: "Konečně mohu fungovat bez bolesti",
    content:
      "Chronické bolesti dolní části zad mě trápily více než 5 let. Zkoušela jsem různé léčby, ale žádná nepomohla dlouhodobě. Tady mi sestavili komplexní plán zahrnující manuální terapii, cvičení a správné pracovní návyky. Po třech měsících jsem poprvé bez bolesti!",
    author: {
      name: "Markéta N.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    date: "5. ledna 2025",
    verified: true,
    images: ["https://images.pexels.com/photos/5793944/pexels-photo-5793944.jpeg?auto=compress&cs=tinysrgb&w=400"],
    helpful: 31,
    variant: "Terapie bederní páteře",
  },
  {
    id: "4",
    rating: 4,
    title: "Skvělé výsledky, trochu delší čekací doba",
    content:
      "Péče je opravdu na vysoké úrovni a výsledky jsou skvělé. Jediné mínus je občas delší čekací doba na termín, což ale svědčí o kvalitě služeb. Terapeut je velmi zkušený a vždy si udělá čas na všechny mé dotazy. Určitě stojí za to počkat.",
    author: {
      name: "Pavel D.",
    },
    date: "2. ledna 2025",
    verified: false,
    helpful: 12,
  },
  {
    id: "5",
    rating: 5,
    title: "Pomohli mi po autonehodě",
    content:
      "Po autonehodě jsem měl vážné problémy s krkem a rameny. Klasická medicína nabízela jen léky proti bolesti. Zde mi pomohli s komplexní rehabilitací včetně cvičení, které mohu dělat i doma. Po půl roce jsem téměř bez obtíží. Děkuji!",
    author: {
      name: "David B.",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    date: "28. prosince 2024",
    verified: true,
    images: ["https://images.pexels.com/photos/5794028/pexels-photo-5794028.jpeg?auto=compress&cs=tinysrgb&w=400"],
    helpful: 8,
    variant: "Poúrazová rehabilitace",
  },
  {
    id: "6",
    rating: 5,
    title: "Perfektní přístup k seniorům",
    content:
      "Moje maminka (78 let) trpěla artritidou a měla velké problémy s pohyblivostí. Terapeut byl nesmírně trpělivý a přizpůsobil vše jejímu věku a schopnostem. Po několika seancích je mnohem pohyblivější a sebevědomější. Jsme velmi vděční.",
    author: {
      name: "Karolína S.",
      avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200",
    },
    date: "22. prosince 2024",
    verified: true,
    helpful: 15,
    variant: "Geriatrická fyzioterapie",
  },
];

const ReferencesPage = () => {
  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        <Reviews23 reviews={MOCK_REVIEWS_23} className="w-full" />
        <Reviews3 reviews={MOCK_REVIEWS_3} title="Reference pacientů" className="w-full mx-auto" />
      </div>
    </div>
  );
};

export default ReferencesPage;
