import { ArrowRight, Lock, Volume2, VolumeX } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PatternPlaceholder } from "@/components/shadcnblocks/pattern-placeholder"
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

export const HeroSection = () => {
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play()
        }
    }, [])

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    return (
        <section className="relative min-h-screen w-full pb-0 flex flex-col">
            <PatternPlaceholder />
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(125% 125% at 50% 90%, var(--background) 40%, var(--primary) 100%)",
                }}
            />
            <div className="container relative z-10 mx-auto w-full px-4 flex-1 flex flex-col pt-4">
                <div className="grid gap-8 py-16 md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:gap-16 xl:gap-20 xl:py-20 flex-1">
                {/* Left side - Copy */}
                <div className="space-y-6 text-center md:space-y-7" data-aos="fade-right">
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
                            Staňte se{" "}
                            <span className="bg-gradient-to-r from-[#7033ff] to-primary bg-clip-text text-transparent">
                                Certifikovaným Fyzioterapeutem
                            </span>
                        </h1>
                    </div>

                    <p className="mx-auto max-w-lg text-muted-foreground text-lg leading-relaxed lg:text-xl xl:max-w-xl">
                        Profesionální kurzy od českých odborníků. Získejte mezinárodně uznávaný certifikát během měsíců.
                    </p>

                    <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <Button
                            asChild
                            size="lg"
                            className="group/arrow rounded-full"
                        >
                            <Link to="/auth/sign-up">
                                Začít zdarma
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
                                to="#pricing"
                                className="flex items-center gap-2"
                            >
                                Zobrazit ceník
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
                    <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl transition-all duration-500 group-hover:shadow-primary/20">
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
                                <div className="flex h-5 items-center justify-center gap-2 rounded-md bg-background/80 px-2 shadow-sm">
                                    <Lock className="size-2 text-muted-foreground" />
                                    <div className="text-muted-foreground text-xs">
                                        Dires.cz
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Container */}
                        <div className="relative">
                            <video
                                ref={videoRef}
                                className="relative flex w-full items-center"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/logos/uvodnistrana.mp4" type="video/mp4" />
                            </video>

                            {/* Sound Control Button */}
                            <button
                                onClick={toggleMute}
                                className="absolute bottom-4 right-4 z-20 flex items-center justify-center rounded-full bg-background/80 p-2.5 backdrop-blur-sm transition-all hover:bg-background hover:scale-110 border border-border/50 shadow-lg"
                                aria-label={isMuted ? "Zapnout zvuk" : "Vypnout zvuk"}
                            >
                                {isMuted ? (
                                    <VolumeX className="size-4 text-muted-foreground" />
                                ) : (
                                    <Volume2 className="size-4 text-primary" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="-right-8 -bottom-8 absolute -z-10 size-32 rounded-full bg-primary/30 blur-3xl lg:size-40" />
                    <div className="-top-8 -left-8 absolute -z-10 size-28 rounded-full bg-primary/30 blur-3xl lg:size-36" />
                </div>
            </div>

            {/* Trusted by section - positioned at bottom */}
            <div className="relative w-full pb-8 pt-4 mt-auto">
                <div className="group relative m-auto max-w-7xl px-6" data-aos="fade-up">
                    <div className="flex flex-col items-center md:flex-row gap-4">
                        <div className="md:max-w-44 md:border-r md:pr-6">
                            <p className="text-end">Trusted by the best teams</p>
                        </div>
                        <div className="relative py-6 md:w-[calc(100%-11rem)]">
                            <InfiniteSlider
                                speedOnHover={20}
                                speed={40}
                                gap={112}>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                        alt="Nvidia Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>

                                <div className="flex">
                                    <img
                                        className="mx-auto h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/column.svg"
                                        alt="Column Logo"
                                        height="16"
                                        width="auto"
                                    />
                                </div>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/github.svg"
                                        alt="GitHub Logo"
                                        height="16"
                                        width="auto"
                                    />
                                </div>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/nike.svg"
                                        alt="Nike Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-5 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                        alt="Lemon Squeezy Logo"
                                        height="20"
                                        width="auto"
                                    />
                                </div>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-4 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/laravel.svg"
                                        alt="Laravel Logo"
                                        height="16"
                                        width="auto"
                                    />
                                </div>
                                <div className="flex">
                                    <img
                                        className="mx-auto h-7 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/lilly.svg"
                                        alt="Lilly Logo"
                                        height="28"
                                        width="auto"
                                    />
                                </div>

                                <div className="flex">
                                    <img
                                        className="mx-auto h-6 w-fit dark:invert"
                                        src="https://html.tailus.io/blocks/customers/openai.svg"
                                        alt="OpenAI Logo"
                                        height="24"
                                        width="auto"
                                    />
                                </div>
                            </InfiniteSlider>

                            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                            <ProgressiveBlur
                                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                direction="left"
                                blurIntensity={1}
                            />
                            <ProgressiveBlur
                                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                direction="right"
                                blurIntensity={1}
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </section>
    )
}

