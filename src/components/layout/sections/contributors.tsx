"use client";

import { motion } from "framer-motion";
import { Forward } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Feature283Props {
  className?: string;
}

interface ImageData {
  src: string;
  className: string;
  name: string;
}

const Feature283 = ({ className }: Feature283Props) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images: ImageData[] = [
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
      className:
        "w-40 absolute -left-10 top-1/2 h-52 -translate-x-full -translate-y-1/2 overflow-hidden rounded-2xl",
      name: "Marie Kolářová",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
      className:
        "size-28 absolute -top-3 left-10 -translate-x-full -translate-y-full overflow-hidden rounded-2xl",
      name: "Tomáš Novotný",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
      className:
        "size-32 absolute -bottom-3 left-10 -translate-x-full translate-y-full overflow-hidden rounded-2xl",
      name: "Jana Dvořáková",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img12.jpeg",
      className:
        "w-45 absolute -right-10 top-1/2 h-52 -translate-y-1/2 translate-x-full overflow-hidden rounded-2xl",
      name: "Petr Svoboda",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img13.jpeg",
      className:
        "size-28 absolute -top-3 right-10 -translate-y-full translate-x-full overflow-hidden rounded-2xl",
      name: "Lucie Procházková",
    },
    {
      src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img3.jpeg",
      className:
        "size-32 absolute -bottom-3 right-10 translate-x-full translate-y-full overflow-hidden rounded-2xl",
      name: "Martin Černý",
    },
  ];

  const title = "Naši úspěšní absolventi, na které můžete být hrdí";
  const description =
    "Setkejte se s inspirativními fyzioterapeuty, kteří prošli našimi kurzy a dnes dosahují výjimečných výsledků ve svých kariérách. Každý z těchto odborníků začal na stejném místě jako vy - s touhou rozšířit své znalosti a dovednosti. Díky našim specializovaným vzdělávacím programům se z nich stali uznávaní specialisté, kteří pomáhají tisícům pacientů po celé České republice i v zahraničí. Jejich cesta k úspěchu začala právě tady, a vaše může začít dnes. Připojte se k rostoucí komunitě profesionálů, kteří díky kvalitnímu vzdělání dosáhli svých kariérních cílů a změnili životy svých pacientů k lepšímu.";

  return (
    <section className={cn("h-full h-screen overflow-hidden py-32", className)}>
      <div className="container mx-auto flex h-full w-full flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center justify-center">
          <h2
            className="relative py-2 text-center font-sans text-4xl font-semibold tracking-tighter md:text-5xl"
          >
            {title}
          </h2>
          <p
            className="mx-auto mt-4 max-w-3xl px-5 text-center text-sm text-muted-foreground md:text-base leading-relaxed"
          >
            {description}
          </p>
          <Button className="mt-10 h-10 rounded-xl">
            Staňte se absolventem <Forward />
          </Button>
          <div>
            {images.map((image, index) => (
              <motion.div
                drag
                key={index}
                initial={{ y: "50%", opacity: 0, scale: 0.8 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  delay: index * 0.1 + 0.5,
                }}
                animate={{
                  filter:
                    hoveredIndex !== null && hoveredIndex !== index
                      ? "blur(10px)"
                      : "blur(0px)",
                  scale: hoveredIndex === index ? 1.05 : 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0,
                  },
                }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className={image.className}
              >
                <img
                  src={image.src}
                  alt={image.name}
                  className="pointer-events-none size-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature283 };
