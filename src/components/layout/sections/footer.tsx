import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { site } from "@/config/site";

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

const FOOTER_LINKS = [
  { label: "Ochrana soukromi", href: "#privacy" },
  { label: "Obchodni podminky", href: "#terms" },
];

interface Footer31Props {
  className?: string;
}

const Footer31 = ({ className }: Footer31Props) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section
      className={cn("mx-4 mt-24 mb-8 rounded-3xl bg-neutral-900 pt-24 sm:mx-6 lg:mx-8", className)}
    >
      <div className="dark mx-auto max-w-7xl px-6 text-neutral-100 sm:px-10 lg:px-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="flex flex-col gap-8">
            <p className="relative text-4xl font-medium tracking-tight lg:text-5xl">
              Odemknete 50+ kurzu nyni
            </p>
            <div className="space-y-1 text-sm font-light tracking-tight lg:text-base">
              <p>Podpora : </p>
              <a
                href={`mailto:${site.mailSupport}`}
                className="transition-colors hover:text-foreground/60"
              >
                {site.mailSupport}
              </a>
            </div>
          </div>
          <div className="grid w-full max-w-xs grid-cols-2 gap-10 text-sm font-light lg:text-base">
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Navigace
              </h4>
              <ul className="space-y-2">
                {NAVIGATION.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="tracking-tight text-foreground transition-colors hover:text-foreground/30"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Socialni site
              </h4>
              <ul className="space-y-2">
                {SOCIAL_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 tracking-tight text-foreground transition-colors hover:text-foreground/30"
                    >
                      {item.label}{" "}
                      <ArrowUpRight className="size-3.5 text-foreground group-hover:text-muted-foreground/50" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="my-12 h-px w-full bg-foreground/10" />

        <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground/40">
              <MapPin className="size-4" />
              Kde nas najdete
            </h4>
            <div className="overflow-hidden rounded-xl border border-foreground/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1522.394269715919!2d14.403041690252623!3d50.079700516325545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b95f56143f73b%3A0xe9fa458148e639c7!2sDires%20fyzio!5e0!3m2!1sen!2scz!4v1770755195968!5m2!1sen!2scz"
                className="aspect-[21/9] w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dires fyzio location"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 lg:w-72">
            <div className="space-y-5">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Kontakt
              </h4>
              <div className="space-y-4 text-sm font-light">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  <span>Praha, Ceska republika</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  <a
                    href={`mailto:${site.mailSupport}`}
                    className="transition-colors hover:text-foreground/60"
                  >
                    {site.mailSupport}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  <span>+420 123 456 789</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-foreground/50" />
                  <span>Po-Pa: 8:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Pravni
              </h4>
              <ul className="space-y-2 text-sm font-light">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="tracking-tight text-foreground transition-colors hover:text-foreground/30"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="my-12 h-px w-full bg-foreground/10" />

        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="flex w-full max-w-md flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
              Newsletter
            </h4>
            <p className="text-sm font-light text-foreground/60">
              Prihlaste se k odberu novinek a ziskejte informace o novych
              kurzech.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-end border-b border-b-foreground/10"
            >
              <Input
                type="email"
                placeholder="Vas email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none border-0 !bg-transparent p-0 uppercase shadow-none placeholder:text-foreground/20 focus-visible:ring-0 lg:text-base"
              />
              <Button type="submit" variant="ghost" size="sm">
                <ArrowRight />
              </Button>
            </form>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-end">
            <p className="text-sm font-light text-foreground/50">
              &copy; {new Date().getFullYear()} {site.name}. Vsechna prava
              vyhrazena.
            </p>
            <div className="flex items-center gap-2 text-sm font-light text-foreground/50">
              <span>Vytvoreno s laskou od</span>
              <Link
                target="_blank"
                to="https://xx0rt.github.io/Tr0xx/"
                className="inline-flex items-center gap-1 font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                <img
                  src="/logos/logo-website-world-wide-web-svg-png-icon-download-10.png"
                  alt="Troxx"
                  width={16}
                  height={16}
                  className="inline-block invert"
                />
                Troxx
              </Link>
            </div>
          </div>
        </div>

      </div>
      <div className="relative mt-16 h-28 overflow-hidden rounded-b-3xl sm:h-36 lg:h-48">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="absolute inset-x-0 bottom-0 translate-y-[25%]"
        >
          <svg
            viewBox="0 0 900 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <text
              x="50%"
              y="52%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              className="text-[150px] font-bold tracking-tighter text-neutral-100"
              style={{ fontFamily: "inherit", opacity: 0.15 }}
            >
              DIRES.CZ
            </text>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  return <Footer31 />;
};

export { FooterSection, Footer31 };
