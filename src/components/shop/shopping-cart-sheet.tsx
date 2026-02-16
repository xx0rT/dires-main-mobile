import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type CartItem, useCart } from "@/lib/cart-context";

function formatPrice(value: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface ShoppingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShoppingCartSheet = ({ open, onOpenChange }: ShoppingCartSheetProps) => {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        className="flex w-[92dvw] flex-col gap-0 p-0 sm:max-w-[28rem] lg:max-w-[32rem] [&>button]:hidden"
      >
        <SheetHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
          <SheetTitle className="text-lg font-semibold">
            Nakupni kosik
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "polozka" : itemCount < 5 ? "polozky" : "polozek"})
              </span>
            )}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="size-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {itemCount === 0 ? (
          <EmptyCartState onClose={() => onOpenChange(false)} />
        ) : (
          <>
            <div className="flex-1 overflow-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={item.slug}>
                    <CartItemRow
                      item={item}
                      onRemove={() => removeItem(item.slug)}
                      onIncrement={() =>
                        updateQuantity(item.slug, item.quantity + 1)
                      }
                      onDecrement={() =>
                        updateQuantity(item.slug, item.quantity - 1)
                      }
                    />
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="mt-0 block border-t px-5 py-4">
              <div className="space-y-4">
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mezisouc et</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doprava</span>
                    <span className="text-sm text-emerald-600">Zdarma</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between pt-1">
                    <span className="text-base font-semibold">Celkem</span>
                    <span className="text-base font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2"
                  asChild
                  onClick={() => onOpenChange(false)}
                >
                  <Link to="/kosik">
                    K pokladne
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

const EmptyCartState = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="size-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Vas kosik je prazdny</h3>
        <p className="text-sm text-muted-foreground">
          Vypadá to, ze jste jeste nic nepridali. Prohlednejte nas obchod a
          najdete neco, co se vam libi.
        </p>
      </div>
      <Button onClick={onClose} className="gap-2" asChild>
        <Link to="/obchod">
          Pokracovat v nakupu
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
};

const CartItemRow = memo(
  ({
    item,
    onRemove,
    onIncrement,
    onDecrement,
  }: {
    item: CartItem;
    onRemove: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
  }) => {
    return (
      <div className="flex gap-4">
        <div className="w-20 shrink-0">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={item.image}
              alt={item.name}
              className="block size-full object-contain p-1"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-1">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-lg border">
              <button
                type="button"
                onClick={onDecrement}
                disabled={item.quantity <= 1}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="flex w-8 items-center justify-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

export { ShoppingCartSheet };
