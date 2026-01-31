import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const itemVariants = cva(
  "flex w-full gap-3 p-4 transition-colors",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        muted: "bg-muted/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Item = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(itemVariants({ variant }), className)}
    {...props}
  />
));
Item.displayName = "Item";

const ItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border rounded-lg overflow-hidden", className)}
    {...props}
  />
));
ItemGroup.displayName = "ItemGroup";

const ItemMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
));
ItemMedia.displayName = "ItemMedia";

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
));
ItemContent.displayName = "ItemContent";

const ItemTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-medium", className)} {...props} />
));
ItemTitle.displayName = "ItemTitle";

export { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle };
