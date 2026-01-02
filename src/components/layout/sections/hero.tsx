import { ArrowRight, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ShinyText from "@/components/ui/shiny-text"

export const HeroSection = () => {
    return (
        <section className="container mx-auto w-full px-4">
            <div className="grid gap-12 py-24 md:grid-cols-2 md:items-center md:gap-14 lg:grid-cols-[0.8fr,1.2fr] lg:gap-20 xl:gap-24 xl:py-32">
                {/* Left side - Copy */}
                <div className="space-y-8 text-center md:space-y-10 md:text-left" data-aos="fade-right">
                    <Badge
                        variant="outline"
                        className="rounded-2xl py-2 text-sm"
                    >
                        <span className="mr-2 text-primary">
                            <Badge>Nové</Badge>
                        </span>
                        <span> Přihlaste se do našich nadcházejících kurzů! </span>
                    </Badge>

                    <div className="font-bold text-4xl md:text-5xl lg:text-6xl">
                        <h1>
                            Ovládněte{" "}
                            <ShinyText
                                text="České Fyzioterapeutické Techniky"
                                speed={3}
                                delay={0}
                                color="hsl(var(--primary))"
                                shineColor="hsl(var(--foreground))"
                                spread={150}
                                direction="right"
                                yoyo={true}
                                pauseOnHover={false}
                                className="inline-block font-bold"
                            />
                        </h1>
                    </div>

                    <p className="mx-auto max-w-lg text-muted-foreground text-lg leading-relaxed md:mx-0 lg:text-xl xl:max-w-xl">
                        {`Učte se od certifikovaných českých odborníků využívajících osvědčené rehabilitační metody.
            Komplexní kurzy kombinující teorii, praxi a praktické zkušenosti.`}
                    </p>

                    <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0 md:justify-start">
                        <Button
                            asChild
                            size="lg"
                            className="group/arrow rounded-full"
                        >
                            <Link to="/auth/sign-up">
                                Přihlásit se nyní
                                <ArrowRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full"
                        >
                            <Link
                                to="#courses"
                                className="flex items-center gap-2"
                            >
                                Zobrazit kurzy
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right side - Preview */}
                <div className="group relative lg:scale-115" data-aos="fade-left" data-aos-delay="200">
                    {/* Enhanced animated glow effect */}
                    <div className="absolute inset-0 -z-10">
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[75%] w-[85%] animate-pulse bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-3xl" />
                    </div>

                    {/* Browser Window Container */}
                    <div className="relative mx-auto w-full overflow-hidden rounded-t-md border border-border/50 bg-background shadow-2xl transition-all duration-500 group-hover:shadow-primary/20">
                        {/* Browser Navigation Bar */}
                        <div className="relative flex h-8 items-center justify-between border-b border-border/50 bg-muted/50 px-4">
                            {/* Traffic Light Buttons */}
                            <div className="flex space-x-2">
                                <div className="size-2 rounded-full bg-red-500" />
                                <div className="size-2 rounded-full bg-yellow-500" />
                                <div className="size-2 rounded-full bg-green-500" />
                            </div>
                            
                            {/* URL Bar */}
                            <div className="-translate-x-1/2 absolute left-1/2 w-[30%] max-w-md">
                                <div className="flex h-5 items-center justify-center gap-2 rounded-md bg-background/80 px-Z shadow-sm ">
                                    <Lock className="size-2 text-muted-foreground" />
                                    <div className="text-muted-foreground text-xs">
                                        Dires.cz
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <video
                        className="relative flex w-full items-center"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/logos/uvodnistrana.mp4" type="video/mp4" />
                    </video>

                    {/* Decorative elements */}
                    <div className="-right-8 -bottom-8 absolute -z-10 size-32 rounded-full bg-primary/30 blur-3xl lg:size-40" />
                    <div className="-top-8 -left-8 absolute -z-10 size-28 rounded-full bg-primary/30 blur-3xl lg:size-36" />
                </div>
            </div>
        </section>
    )
}

