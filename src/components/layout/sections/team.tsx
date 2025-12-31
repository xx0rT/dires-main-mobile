import { Link } from "react-router-dom"
import GithubIcon from "@/components/icons/github-icon"
import LinkedInIcon from "@/components/icons/linkedin-icon"
import XIcon from "@/components/icons/x-icon"
import { Card, CardFooter, CardTitle } from "@/components/ui/card"

interface TeamProps {
    imageUrl: string
    firstName: string
    lastName: string
    positions: string[]
    socialNetworks: SocialNetworkProps[]
}
interface SocialNetworkProps {
    name: string
    url: string
}
export const TeamSection = () => {
    const teamList: TeamProps[] = [
        {
            imageUrl:
                "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Petr",
            lastName: "Svoboda",
            positions: ["Manual Therapy Specialist", "30 Years Clinical Experience"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/czech-physio-academy"
                }
            ]
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Jana",
            lastName: "Nováková",
            positions: ["Sports Rehabilitation Expert", "Former Olympic Team Physiotherapist"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/czech-physio-academy"
                }
            ]
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Martin",
            lastName: "Dvořák",
            positions: ["Neurological Rehabilitation", "Vojta Method Certified Instructor"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/czech-physio-academy"
                }
            ]
        },
        {
            imageUrl:
                "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            firstName: "Dr. Eva",
            lastName: "Horáková",
            positions: ["Pediatric Physiotherapy Lead", "Child Development Specialist"],
            socialNetworks: [
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com/company/czech-physio-academy"
                }
            ]
        }
    ]
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
                    Team
                </h2>

                <h2 className="text-center font-bold text-3xl md:text-4xl">
                    Our Expert Instructors
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teamList.map(
                    (
                        {
                            imageUrl,
                            firstName,
                            lastName,
                            positions,
                            socialNetworks
                        },
                        index
                    ) => (
                        <Card
                            key={index}
                            className="group flex h-full flex-col overflow-hidden bg-muted/60 py-0"
                        >
                            {/* Header - Image Section */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={`${firstName} ${lastName}`}
                                    width={300}
                                    height={300}
                                    className="aspect-square w-full object-cover saturate-0 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:saturate-100"
                                />
                            </div>

                            {/* Content - Name and Positions Section */}
                            <div className="flex-1 px-6">
                                <CardTitle className="mb-2 text-xl">
                                    {firstName}
                                    <span className="ml-2 font-semibold text-primary">
                                        {lastName}
                                    </span>
                                </CardTitle>

                                <div className="space-y-1">
                                    {positions.map((position, index) => (
                                        <div
                                            key={index}
                                            className="text-muted-foreground text-sm leading-relaxed"
                                        >
                                            {position}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer - Social Links Section */}
                            <CardFooter className="mb-6 flex gap-3">
                                {socialNetworks.map(({ name, url }, index) => (
                                    <Link
                                        key={index}
                                        to={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all duration-200 hover:scale-110 hover:opacity-80"
                                        aria-label={`Visit ${firstName}'s ${name} profile`}
                                    >
                                        {socialIcon(name)}
                                    </Link>
                                ))}
                            </CardFooter>
                        </Card>
                    )
                )}
            </div>
        </section>
    )
}
