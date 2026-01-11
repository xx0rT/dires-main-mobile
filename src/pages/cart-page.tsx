import {
  Minus,
  Plus,
  RefreshCcw,
  Shield,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Minimalist Beige Sneakers",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
    price: 120.0,
    quantity: 1,
    variant: "Size: EU 36",
  },
  {
    id: "2",
    name: "Embroidered Blue Top",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png",
    price: 140.0,
    quantity: 1,
    variant: "Size: S",
  },
  {
    id: "3",
    name: "Classic Fedora Hat",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png",
    price: 84.0,
    quantity: 1,
    variant: "Color: Beige",
  },
];

export default function CartPage() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    setPromoError(null);
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo(promoCode.toUpperCase());
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = appliedPromo ? subtotal * 0.1 : 0;
  const shipping = 9.99;
  const total = subtotal - discount + shipping;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <section className="py-32">
        <div className="container mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-8 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Button asChild>
            <a href="/shop">Continue Shopping</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <h1 className="mb-8 text-3xl font-semibold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 rounded-xl border bg-card p-5"
                >
                  <div className="w-36 shrink-0">
                    <AspectRatio
                      ratio={1}
                      className="overflow-hidden rounded-lg bg-muted"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </AspectRatio>
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.id.padStart(6, "0")}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        In Stock
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-10 text-center text-lg font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between py-1">
                    <div className="text-right">
                      <p className="text-xl font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="mr-1.5 size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="mb-4">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 dark:bg-green-950">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        <Tag className="size-3" />
                        {appliedPromo}
                      </Badge>
                      <span className="text-sm text-green-700 dark:text-green-300">
                        10% off
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-muted-foreground hover:text-foreground"
                      onClick={removePromo}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError(null);
                        }}
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-sm text-destructive">{promoError}</p>
                    )}
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      Try
                      <Badge variant="outline" className="font-mono text-xs">
                        SAVE10
                      </Badge>
                      for 10% off
                    </p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ShoppingCart className="size-4" />
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full">
                Proceed to Checkout
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout
              </p>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="size-5 shrink-0" />
                  <span>Free shipping on orders over $150</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RefreshCcw className="size-5 shrink-0" />
                  <span>Free 30-day returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="size-5 shrink-0" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
