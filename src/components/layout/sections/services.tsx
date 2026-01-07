import { CaseStudies3 } from '@/components/ui/case-studies-3'

const featuredCourse = {
    logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    company: "Fyzioterapie CZ",
    tags: "MANUÁLNÍ TERAPIE / CERTIFIKOVANÉ KURZY",
    title: "Komplexní vzdělávání pro moderní fyzioterapeuty.",
    subtitle: "Od základů až po pokročilé techniky",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    link: "#",
}

const courseStudies = [
    {
        logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-2.svg",
        company: "Bobath Koncept",
        tags: "NEUROLOGICKÁ REHABILITACE / PEDIATRIE",
        title: "Specializace v neurorehabilitaci.",
        subtitle: "Efektivní přístup k neurologickým pacientům",
        image: "",
        link: "#",
    },
    {
        logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-3.svg",
        company: "McKenzie Metoda",
        tags: "MECHANICKÁ DIAGNOSTIKA / TERAPIE",
        title: "Komplexní diagnostický systém.",
        subtitle: "Moderní přístup k léčbě bolesti",
        image: "",
        link: "#",
    },
]

export const ServicesSection = () => {
    return (
        <section id="services" className="w-full py-0 overflow-visible">
            <CaseStudies3
                featuredCasestudy={featuredCourse}
                casestudies={courseStudies}
            />
        </section>
    )
}
