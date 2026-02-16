import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabbedFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  content: {
    title: string;
    description: string;
    image: string;
    className?: string;
  };
}

interface TabbedFeaturesProps {
  heading: string;
  subheading?: string;
  features: TabbedFeature[];
  className?: string;
}

export function TabbedFeatures({
  heading,
  subheading,
  features,
  className,
}: TabbedFeaturesProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="flex gap-3 max-md:flex-col">
        <h2 className="flex-1 text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">
          {heading}
        </h2>
        {subheading && (
          <p className="flex-1 self-end text-lg font-medium text-muted-foreground">
            {subheading}
          </p>
        )}
      </div>

      <Tabs
        defaultValue={features[0]?.title}
        orientation="vertical"
        className="mt-8 grid grid-cols-1 gap-4 rounded-xl border p-4 md:mt-12 lg:grid-cols-4"
      >
        <TabsList className="flex h-auto flex-col justify-start rounded-xl bg-muted p-1.5">
          {features.map((feature) => (
            <TabsTrigger
              key={feature.title}
              value={feature.title}
              className="w-full justify-start rounded-lg px-4 py-3 text-start whitespace-normal transition-colors duration-300 data-[state=active]:shadow-xl lg:px-6 lg:py-4"
            >
              <div>
                <feature.icon className="size-7 md:size-8 lg:size-9" />
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {features.map((feature) => (
          <TabsContent
            className={cn(
              "col-span-1 m-0 overflow-hidden rounded-xl bg-background lg:col-span-3",
              feature.content.className,
            )}
            key={feature.title}
            value={feature.title}
          >
            <div className="max-w-2xl pb-4 text-balance">
              <h4 className="inline font-semibold">
                {feature.content.title}{" "}
              </h4>
              <span className="mt-2 font-medium text-pretty text-muted-foreground">
                {feature.content.description}
              </span>
            </div>
            <img
              src={feature.content.image}
              alt={feature.title}
              className="h-[420px] w-full rounded-lg object-cover lg:h-[512px] lg:flex-1"
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
