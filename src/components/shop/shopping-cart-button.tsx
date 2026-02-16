import { ShoppingBag } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCartSheet } from "@/components/shop/shopping-cart-sheet";

interface ShoppingCartButtonProps {
  className?: string;
}

const ShoppingCartButton = ({ className }: ShoppingCartButtonProps) => {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className={cn("inline-flex", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="relative gap-2"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="size-4" />
        <span className="hidden sm:inline">Kosik</span>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
      <ShoppingCartSheet open={open} onOpenChange={setOpen} />
    </div>
  );
};

export { ShoppingCartButton };
