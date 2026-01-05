import { Link } from "react-router-dom"
import { useState } from "react"
import GithubIcon from "@/components/icons/github-icon"
import LinkedInIcon from "@/components/icons/linkedin-icon"
import XIcon from "@/components/icons/x-icon"
import { Card, CardFooter, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TeamProps {
    imageUrl: string
    firstName: string
    lastName: string
    positions: string[]
    socialNetworks: SocialNetworkProps[]
    bio: string
    education: string[]
    specializations: string[]
    yearsOfExperience: number
}
interface SocialNetworkProps {
    name: string
    url: string
}
export const TeamSection = () => {
    const [selectedMember, setSelectedMember] = useState<TeamProps | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const teamList: TeamProps[] = [
        {
            imageUrl:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Petr",
            lastName: "Svoboda",
            positions: ["Specialista Manuální Terapie", "30 Let Klinické Praxe"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/dires"
                }
            ],
            bio: "Dr. Petr Svoboda je uznávaný odborník v oblasti manuální terapie s více než třemi desetiletími klinické praxe. Jeho přístup kombinuje tradiční české metody s moderními rehabilitačními technikami, čímž poskytuje studentům komplexní vzdělání v této oblasti.",
            education: [
                "Lékařská fakulta Univerzity Karlovy, Praha",
                "Certifikace v Manuální Terapii, Rakousko",
                "Pokročilá certifikace v Myofasciální Terapii"
            ],
            specializations: [
                "Manuální terapie páteře",
                "Myofasciální terapie",
                "Léčba chronické bolesti",
                "Funkční diagnostika"
            ],
            yearsOfExperience: 30
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Jana",
            lastName: "Nováková",
            positions: ["Expertka na Sportovní Rehabilitaci", "Bývalá Fyzioterapeutka Olympijského Týmu"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/dires"
                }
            ],
            bio: "Dr. Jana Nováková přináší bohaté zkušenosti ze světa špičkového sportu. Jako bývalá fyzioterapeutka olympijského týmu pomáhala atletům dosahovat vrcholných výkonů a nyní předává své znalosti dalším generacím fyzioterapeutů.",
            education: [
                "Fakulta tělesné výchovy a sportu, Univerzita Karlova",
                "Certifikace ve Sportovní Rehabilitaci, USA",
                "Specializace v Prevenci Sportovních Zranění"
            ],
            specializations: [
                "Sportovní zranění",
                "Funkční trénink",
                "Prevence zranění",
                "Regenerace atletů"
            ],
            yearsOfExperience: 18
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Martin",
            lastName: "Dvořák",
            positions: ["Neurologická Rehabilitace", "Certifikovaný Instruktor Vojtovy Metody"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/dires"
                }
            ],
            bio: "Dr. Martin Dvořák je předním odborníkem v neurologické rehabilitaci a certifikovaným instruktorem Vojtovy metody. Jeho hluboké porozumění neurologickým poruchám a inovativní přístupy k terapii pomohly stovkám pacientů zlepšit kvalitu života.",
            education: [
                "Neurologická klinika, Fakultní nemocnice Motol",
                "Certifikace Vojtovy Metody, Mnichov",
                "Bobath Koncept, certifikace"
            ],
            specializations: [
                "Vojtova metoda",
                "Bobath koncept",
                "Neurologická rehabilitace",
                "Léčba mozkové obrny"
            ],
            yearsOfExperience: 22
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Eva",
            lastName: "Horáková",
            positions: ["Vedoucí Dětské Fyzioterapie", "Specialistka na Vývoj Dítěte"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/dires"
                }
            ],
            bio: "Dr. Eva Horáková je renomovaná specialistka v oblasti dětské fyzioterapie s hlubokým porozuměním vývojových milníků a poruch. Její laskavý přístup a odbornost vytvářejí ideální prostředí pro učení o péči o nejmenší pacienty.",
            education: [
                "Pediatrická klinika, Univerzita Karlova",
                "Certifikace v Dětské Fyzioterapii",
                "Specializace ve Vývojových Poruchách"
            ],
            specializations: [
                "Dětská fyzioterapie",
                "Vývojové poruchy",
                "Senzomotorická stimulace",
                "Raná intervence"
            ],
            yearsOfExperience: 15
        }
    ]

    const handleCardClick = (member: TeamProps) => {
        setSelectedMember(member)
        setIsDialogOpen(true)
    }
    const socialIcon = (socialName: string) => {
        switch (socialName) {
            case "LinkedIn":
                return <LinkedInIcon />
            case "Github":
                return <GithubIcon />
            case "X":
                return <XIcon />
        }
    }

    return (
        <section id="team" className="container mx-auto px-4 py-16 sm:py-20">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-center text-lg text-primary tracking-wider">
                    Tým
                </h2>

                <h2 className="text-center font-bold text-3xl md:text-4xl">
                    Naši Odborní Lektoři
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teamList.map((member, index) => (
                    <Card
                        key={index}
                        className="group flex h-full flex-col overflow-hidden bg-muted/60 py-0 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                        onClick={() => handleCardClick(member)}
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={member.imageUrl}
                                alt={`${member.firstName} ${member.lastName}`}
                                width={300}
                                height={300}
                                className="aspect-square w-full object-cover saturate-0 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:saturate-100"
                            />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                        </div>

                        <div className="flex-1 px-6">
                            <CardTitle className="mb-2 text-xl">
                                {member.firstName}
                                <span className="ml-2 font-semibold text-primary">
                                    {member.lastName}
                                </span>
                            </CardTitle>

                            <div className="space-y-1">
                                {member.positions.map((position, idx) => (
                                    <div
                                        key={idx}
                                        className="text-muted-foreground text-sm leading-relaxed"
                                    >
                                        {position}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CardFooter className="mb-6 flex gap-3">
                            {member.socialNetworks.map(({ name, url }, idx) => (
                                <Link
                                    key={idx}
                                    to={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all duration-200 hover:scale-110 hover:opacity-80"
                                    aria-label={`Visit ${member.firstName}'s ${name} profile`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {socialIcon(name)}
                                </Link>
                            ))}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    {selectedMember && (
                        <>
                            <DialogHeader>
                                <div className="flex items-start gap-6 mb-4">
                                    <img
                                        src={selectedMember.imageUrl}
                                        alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                                        className="w-32 h-32 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <DialogTitle className="text-3xl mb-2">
                                            {selectedMember.firstName}{" "}
                                            <span className="text-primary">
                                                {selectedMember.lastName}
                                            </span>
                                        </DialogTitle>
                                        <div className="space-y-1">
                                            {selectedMember.positions.map((position, idx) => (
                                                <p key={idx} className="text-muted-foreground text-sm">
                                                    {position}
                                                </p>
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {selectedMember.yearsOfExperience} let praxe
                                        </p>
                                    </div>
                                </div>
                                <DialogDescription className="text-base leading-relaxed">
                                    {selectedMember.bio}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Vzdělání a Certifikace</h3>
                                    <ul className="space-y-2">
                                        {selectedMember.education.map((edu, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{edu}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Specializace</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMember.specializations.map((spec, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    {selectedMember.socialNetworks.map(({ name, url }, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                to={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                {socialIcon(name)}
                                                <span>{name}</span>
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    )
}
