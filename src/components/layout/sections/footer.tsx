import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Car,
  Clock,
  Footprints,
  Mail,
  MapPin,
  Phone,
  Train,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Obchod", href: "/obchod" },
  { label: "Blog", href: "/blog" },
  { label: "Cenik", href: "/#pricing" },
  { label: "Tym", href: "/tym" },
];

const SOCIAL_LINKS = [
  { label: "Linkedin", href: site.links.linkedin },
  { label: "Twitter", href: site.links.twitter },
];

const LEGAL_LINKS = [
  { label: "Ochrana soukromi", href: "#privacy" },
  { label: "Obchodni podminky", href: "#terms" },
];

const LECTORS = [
  {
    name: "MUDr. Jana Novakova",
    role: "Vedouci Fyzioterapeutka",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar1.jpg",
    speciality: "Sportovni medicina",
  },
  {
    name: "Mgr. Petr Svoboda",
    role: "Fyzioterapeut",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar2.jpg",
    speciality: "Manualni terapie",
  },
  {
    name: "Bc. Marketa Dvorakova",
    role: "Fyzioterapeutka",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar3.jpg",
    speciality: "Detska fyzioterapie",
  },
  {
    name: "Mgr. Tomas Prochazka",
    role: "Fyzioterapeut a Maser",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar4.jpg",
    speciality: "Sportovni masaze",
  },
];

const DEFAULT_MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.394269715919!2d14.403041690252623!3d50.079700516325545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1770755195968!5m2!1sen!2scz";

const TRAVEL_MODES = [
  {
    id: "default",
    label: "Mapa",
    icon: MapPin,
    src: DEFAULT_MAP_SRC,
  },
  {
    id: "car",
    label: "Autem",
    icon: Car,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=d&output=embed",
  },
  {
    id: "transit",
    label: "MHD",
    icon: Train,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=r&output=embed",
  },
  {
    id: "walking",
    label: "Pesky",
    icon: Footprints,
    src: "https://maps.google.com/maps?saddr=Staromestske+namesti,+Praha&daddr=Dires+fyzio,+Praha&dirflg=w&output=embed",
  },
] as const;

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const linkHover = {
  rest: { x: 0 },
  hover: { x: 3, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [activeMode, setActiveMode] = useState("default");

  const currentSrc =
    TRAVEL_MODES.find((m) => m.id === activeMode)?.src ?? DEFAULT_MAP_SRC;

  return (
    <footer className="mx-3 mt-16 mb-4 overflow-hidden rounded-2xl bg-muted/60 sm:mx-5 lg:mx-6">
      <motion.div
        className="mx-auto px-5 pt-10 pb-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {/* ── Lectors showcase ── */}
        <motion.div variants={fadeUp}>
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Nasi Lektori
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Ucte se od tech nejlepsich -- certifikovani odbornici s letitou praxi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LECTORS.map((lector) => (
              <Link key={lector.name} to="/tym">
                <motion.div
                  className="group relative overflow-hidden rounded-xl bg-neutral-200/60 dark:bg-neutral-900 p-3.5 transition-colors"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lector.image}
                      alt={lector.name}
                      className="size-11 rounded-full object-cover ring-2 ring-neutral-300 dark:ring-neutral-700 transition-all group-hover:ring-neutral-400 dark:group-hover:ring-neutral-500"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                        {lector.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {lector.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-block rounded-md bg-neutral-300/60 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
                      {lector.speciality}
                    </span>
                    <ArrowUpRight className="size-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-600 dark:group-hover:text-neutral-200" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              A dalsi 2 odbornici v nasem tymu
            </p>
            <Link to="/tym">
              <motion.span
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                whileHover={{ x: 2 }}
              >
                Zobrazit cely tym
                <ArrowRight className="size-3" />
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* ── Separator ── */}
        <motion.div variants={fadeUp} className="my-7">
          <Separator className="bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        {/* ── Main grid: brand + nav + map ── */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Left column */}
          <motion.div variants={fadeUp} className="space-y-5">
            <div>
              <Link to="/" className="inline-block">
                <img
                  src="/logo.svg"
                  alt={site.name}
                  className="h-7 dark:invert"
                />
              </Link>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {site.description}. Pripojte se k tisicum spokojenych
                klientu a zacnete svou cestu k lepsimu zdravi.
              </p>
            </div>

            <Separator className="bg-neutral-200 dark:bg-neutral-800" />

            <div className="grid grid-cols-3 gap-5 text-[13px]">
              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                  Navigace
                </p>
                <ul className="space-y-1.5">
                  {NAVIGATION.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href}>
                        <motion.span
                          className="inline-flex text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          variants={linkHover}
                          initial="rest"
                          whileHover="hover"
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                  Socialni site
                </p>
                <ul className="space-y-1.5">
                  {SOCIAL_LINKS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <motion.span
                          className="group inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          variants={linkHover}
                          initial="rest"
                          whileHover="hover"
                        >
                          {item.label}
                          <ArrowUpRight className="size-3 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </motion.span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                  Kontakt
                </p>
                <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li>
                    <a
                      href={`mailto:${site.mailSupport}`}
                      className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <Mail className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                      {site.mailSupport}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    +420 123 456 789
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    Po-Pa 8:00 - 18:00
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    Praha, Ceska republika
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right column: map */}
          <motion.div variants={fadeUp}>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                <MapPin className="size-3.5" />
                Kde nas najdete
              </h4>
              <div className="flex gap-1 rounded-lg bg-neutral-200/70 dark:bg-neutral-900 p-0.5">
                {TRAVEL_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = activeMode === mode.id;
                  return (
                    <motion.button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={cn(
                        "relative flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                        isActive
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      )}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="travel-pill"
                          className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 shadow-sm"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 28,
                          }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1">
                        <Icon className="size-3" />
                        {mode.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={activeMode}
                  src={currentSrc}
                  className="aspect-[4/3] w-full lg:aspect-[16/10]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dires fyzio location"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Separator ── */}
        <motion.div variants={fadeUp} className="my-7">
          <Separator className="bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        {/* ── Newsletter ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-start gap-5 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white sm:text-xl">
              Nenech si ujit zadnou novinku!
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Prihlasit se k odberu novinek v souladu s narizenim na ochranu
              osobnich udaju (GDPR).
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <Input
              type="email"
              placeholder="vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full min-w-[200px] rounded-lg border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 sm:w-56"
            />
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                type="submit"
                size="sm"
                className="h-10 rounded-lg bg-neutral-900 dark:bg-white px-5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                Odebírat
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* ── Separator ── */}
        <motion.div variants={fadeUp} className="my-5">
          <Separator className="bg-neutral-200 dark:bg-neutral-800" />
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-between gap-3 text-[11px] text-neutral-500 dark:text-neutral-500 sm:flex-row"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>&copy; {new Date().getFullYear()} {site.name}. Vsechna prava vyhrazena.</span>
            <span className="hidden text-neutral-300 dark:text-neutral-700 sm:inline">|</span>
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <span className="inline-flex items-center gap-1">
            Vytvoreno
            <Link
              target="_blank"
              to="https://xx0rt.github.io/Tr0xx/"
              className="inline-flex items-center gap-0.5 font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <img
                src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                alt="Troxx"
                width={13}
                height={13}
                className="dark:invert"
              />
              Troxx
            </Link>
          </span>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export { FooterSection };
