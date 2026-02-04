"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Feature283Props {
  className?: string;
}

const Feature283 = ({ className }: Feature283Props) => {
  const column1Images = [
    {
      src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Posilovací guma",
      height: "23rem",
    },
    {
      src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Masážní pomůcky",
      height: "28rem",
    },
    {
      src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Balanční cvičení",
      height: "12rem",
    },
  ];

  const column2Images = [
    {
      src: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Fyzioterapie",
      height: "13rem",
    },
    {
      src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Rehabilitační cvičení",
      height: "32rem",
    },
    {
      src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Terapeutické pomůcky",
      height: "18rem",
    },
  ];

  const column3Images = [
    {
      src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Balanční podložka",
      height: "32rem",
    },
    {
      src: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Manuální terapie",
      height: "32rem",
    },
  ];

  const column4Images = [
    {
      src: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Protahovací cvičení",
      height: "13rem",
    },
    {
      src: "https://images.pexels.com/photos/3768593/pexels-photo-3768593.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Masážní terapie",
      height: "22.5rem",
    },
    {
      src: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Rehabilitační sezení",
      height: "22rem",
    },
  ];

  return (
    <section className={cn("py-32", className)}>
      <div className="relative container mx-auto">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="grid gap-4">
            {column1Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="grid gap-4">
            {column2Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: -50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="grid gap-4">
            {column3Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 4 */}
          <div className="grid gap-4">
            {column4Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: -50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
            <div className="h-17 w-full rounded-2xl bg-muted"></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 max-w-7xl mx-auto">
          {/* Column 1 */}
          <div className="grid gap-4">
            {column1Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="grid gap-4">
            {column2Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: -50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="grid gap-4">
            {column3Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
          </div>

          {/* Column 4 */}
          <div className="grid gap-4">
            {column4Images.map((image, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: -50,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                key={index}
                className="w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: image.height }}
              >
                <img
                  className="h-full w-full rounded-2xl object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              </motion.div>
            ))}
            <div className="h-17 w-full rounded-2xl bg-muted"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature283 };
