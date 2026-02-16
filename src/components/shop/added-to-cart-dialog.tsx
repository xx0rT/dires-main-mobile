import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/lib/cart-context";

interface AddedToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CartItem | null;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function AddedToCartDialog({
  open,
  onOpenChange,
  item,
}: AddedToCartDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="size-4" />
            </div>
            Pridano do kosiku
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={item.image}
              alt={item.name}
              className="size-full object-contain p-1"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {item.subtitle}
            </p>
            <p className="font-semibold">{item.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Pocet: {item.quantity}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 pt-1">
          <Button asChild size="lg" className="w-full gap-2">
            <Link to="/kosik" onClick={() => onOpenChange(false)}>
              <ShoppingBag className="size-4" />
              Prejit k pokladne
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={() => onOpenChange(false)}
          >
            Pokracovat v nakupu
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
