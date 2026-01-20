import {
  CheckCircle,
  CreditCard,
  Download,
  MapPin,
  Package,
  Printer,
  Truck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useSubscription } from "@/lib/use-subscription";
import { useAuth } from "@/lib/auth-context";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  details?: { label: string; value: string }[];
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "paypal" | "bank";
  lastFour?: string;
  cardBrand?: string;
  email?: string;
}

interface OrderSummaryData {
  orderNumber: string;
  orderDate: string;
  status: "confirmed" | "processing" | "shipped" | "delivered";
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery: string;
  paymentMethod: PaymentMethod;
}

const DEFAULT_ORDER: OrderSummaryData = {
  orderNumber: "ORD-2024-78432",
  orderDate: "December 14, 2024",
  status: "confirmed",
  email: "customer@example.com",
  items: [
    {
      id: "1",
      name: "Pro Subscription (Annual)",
      image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      price: 199.0,
      quantity: 1,
      details: [
        { label: "Plan", value: "Annual" },
        { label: "Billing", value: "Yearly" },
      ],
    },
  ],
  subtotal: 199.0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 199.0,
  shippingAddress: {
    name: "Alex Johnson",
    street: "1234 Maple Street, Apt 5B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  },
  shippingMethod: "Digital Delivery",
  estimatedDelivery: "Instant Access",
  paymentMethod: {
    type: "card",
    lastFour: "4242",
    cardBrand: "Visa",
  },
};

interface OrderConfirmationPageProps {
  className?: string;
}

const OrderConfirmationPage = ({ className }: OrderConfirmationPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = (location.state as { order?: OrderSummaryData })?.order || DEFAULT_ORDER;
  const { refetch } = useSubscription();
  const { session } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
      if (refetch) {
        refetch();
      }
      return;
    }

    const verifyPayment = async () => {
      console.log('🔍 Verifying payment with session ID:', sessionId);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-subscription`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Payment verification result:', result);

          if (result.subscription) {
            console.log('✅ Subscription confirmed, refreshing data...');
            if (refetch) {
              await refetch();
            }
          }
        } else {
          console.error('❌ Payment verification failed:', await response.text());
        }
      } catch (error) {
        console.error('❌ Error verifying payment:', error);
      }
    };

    verifyPayment();
  }, [refetch, session]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusBadge = (status: OrderSummaryData["status"]) => {
    const variants: Record<
      OrderSummaryData["status"],
      { label: string; className: string }
    > = {
      confirmed: {
        label: "Objednávka potvrzena",
        className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
      },
      processing: {
        label: "Zpracovává se",
        className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10",
      },
      shipped: {
        label: "Odesláno",
        className: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10",
      },
      delivered: {
        label: "Doručeno",
        className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10",
      },
    };
    return variants[status];
  };

  const statusBadge = getStatusBadge(orderData.status);

  return (
    <section className={cn("min-h-screen flex items-center justify-center py-16 md:py-24", className)}>
      <div className="container max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="size-8 text-emerald-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
            Děkujeme za vaši objednávku!
          </h1>
          <p className="text-muted-foreground">
            Potvrzující e-mail byl odeslán na{" "}
            <span className="font-medium text-foreground">{orderData.email}</span>
          </p>
        </div>

        <Card className="mb-6 shadow-none">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Číslo objednávky</p>
                <p className="font-semibold">{orderData.orderNumber}</p>
              </div>
              <Separator
                orientation="vertical"
                className="hidden h-10 md:block"
              />
              <div>
                <p className="text-sm text-muted-foreground">Datum objednávky</p>
                <p className="font-medium">{orderData.orderDate}</p>
              </div>
            </div>
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="size-5" />
                  Objednané položky
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      <div className="w-20 shrink-0">
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
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.details && (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.details.map((d, i) => (
                              <span key={d.label}>
                                {d.value}
                                {i < item.details!.length - 1 && " · "}
                              </span>
                            ))}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          Množství: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                    {index < orderData.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mezisoučet</span>
                    <span>{formatPrice(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Doprava</span>
                    <span>
                      {orderData.shipping === 0
                        ? "Zdarma"
                        : formatPrice(orderData.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daň</span>
                    <span>{formatPrice(orderData.tax)}</span>
                  </div>
                  {orderData.discount && orderData.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span>Sleva</span>
                      <span>-{formatPrice(orderData.discount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Celkem zaplaceno</span>
                    <span>{formatPrice(orderData.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="size-5" />
                  Dodací adresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{orderData.shippingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.street}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                    {orderData.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.country}
                  </p>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {orderData.shippingMethod}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Odhadované doručení: {orderData.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="size-5" />
                  Platební metoda
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.paymentMethod.type === "card" && (
                  <div className="flex items-center gap-3">
                    <img
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                      alt="Visa"
                      className="size-8"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {orderData.paymentMethod.cardBrand} končící na{" "}
                        {orderData.paymentMethod.lastFour}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Platba dokončena
                      </p>
                    </div>
                  </div>
                )}
                {orderData.paymentMethod.type === "paypal" && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                        alt="PayPal"
                        className="size-5"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        {orderData.paymentMethod.email}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="space-y-3 p-4">
                <Button className="w-full" variant="default">
                  <Package className="mr-2 size-4" />
                  Sledovat objednávku
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 size-4" />
                  Stáhnout účtenku
                </Button>
                <Button className="w-full" variant="ghost">
                  <Printer className="mr-2 size-4" />
                  Vytisknout objednávku
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-muted-foreground">
            Máte dotaz ohledně vaší objednávky?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline">
              Kontaktovat podporu
            </Button>
            <Button onClick={() => navigate("/")}>
              Pokračovat v nákupu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
