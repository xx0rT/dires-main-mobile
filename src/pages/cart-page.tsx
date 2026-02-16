import {
  Minus,
  Plus,
  RefreshCcw,
  Shield,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "@/lib/cart-context";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatPrice(price: number) {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const shipping = subtotal >= 3600 ? 0 : 240;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <section className="py-32">
        <div className="container mx-auto max-w-lg text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="size-8 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-2xl font-semibold">Vas kosik je prazdny</h1>
          <p className="mb-8 text-muted-foreground">
            Vypada to, ze jste jeste nic nepridali.
          </p>
          <Button asChild>
            <Link to="/obchod">Pokracovat v nakupu</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <h1 className="mb-8 text-3xl font-semibold">Nakupni kosik</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.slug}
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
                        className="size-full object-contain p-2"
                      />
                    </AspectRatio>
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {item.subtitle}
                      </p>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <Badge
                        variant="secondary"
                        className="mt-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      >
                        Skladem
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity - 1)
                        }
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
                        onClick={() =>
                          updateQuantity(item.slug, item.quantity + 1)
                        }
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
                        {formatPrice(item.price)} za kus
                      </p>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.slug)}
                    >
                      <Trash2 className="mr-1.5 size-4" />
                      Odebrat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Souhrn objednavky
              </h2>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ShoppingCart className="size-4" />
                    {itemCount}{" "}
                    {itemCount === 1
                      ? "polozka"
                      : itemCount < 5
                        ? "polozky"
                        : "polozek"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mezisoucet</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Doprava</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Zdarma</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Celkem</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full">
                Pokracovat k pokladne
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Dane vypocitany pri placeni
              </p>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="size-5 shrink-0" />
                  <span>Doprava zdarma nad 3 600 Kc</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RefreshCcw className="size-5 shrink-0" />
                  <span>Bezplatne vraceni do 30 dnu</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="size-5 shrink-0" />
                  <span>Bezpecna platba</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
