import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

interface OrderSummary {
  companyName: string;
  planType?: "free_trial" | "monthly" | "lifetime";
  items: OrderItem[];
  currency: string;
}

interface CheckoutPageProps {
  className?: string;
}

const checkoutFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  cardNumber: z.string().min(1, "Card number is required"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
    .refine((value) => {
      const [mm, yy] = value.split("/").map(Number);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;
      if (yy < currentYear) return false;
      if (yy === currentYear && mm < currentMonth) return false;
      return true;
    }, "Card has expired"),
  cvc: z.string().min(3, "CVC is required"),
  cardholderName: z.string().min(1, "Name on card is required"),
  country: z.string().min(1, "Country is required"),
  promoCode: z.string().optional(),
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

const COUNTRIES = [
  { value: "CZ", label: "Czech Republic" },
  { value: "SK", label: "Slovakia" },
  { value: "PL", label: "Poland" },
  { value: "DE", label: "Germany" },
  { value: "AT", label: "Austria" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
];

const DEFAULT_ORDER: OrderSummary = {
  companyName: "Fyzioterapie Kurzy",
  planType: "monthly",
  items: [
    {
      id: "monthly",
      name: "Monthly Plan",
      price: 30.0,
    },
  ],
  currency: "USD",
};

const CheckoutPage = ({ className }: CheckoutPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = (location.state as { order?: OrderSummary })?.order || DEFAULT_ORDER;

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [validatedPromo, setValidatedPromo] = useState<{code: string; type: string; value: number} | null>(null);

  const form = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardholderName: "",
      country: "US",
      promoCode: "",
    },
  });

  const onSubmit = async (data: CheckoutFormType) => {
    setIsProcessing(true);

    try {
      if (orderData.planType === "free_trial") {
        const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`;
        const orderDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const confirmationData = {
          orderNumber,
          orderDate,
          status: "confirmed" as const,
          email: data.email,
          items: orderData.items.map(item => ({
            ...item,
            image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
            quantity: 1,
            details: [
              { label: "Plan", value: "Free Trial" },
              { label: "Duration", value: "3 Days" },
            ],
          })),
          subtotal: 0,
          shipping: 0,
          tax: 0,
          discount: 0,
          total: 0,
          shippingAddress: {
            name: data.cardholderName,
            street: "Digital Delivery",
            city: "N/A",
            state: "N/A",
            zipCode: "00000",
            country: data.country,
          },
          shippingMethod: "Digital Delivery",
          estimatedDelivery: "Instant Access",
          paymentMethod: {
            type: "card" as const,
            lastFour: "0000",
            cardBrand: "Free",
          },
        };

        navigate("/order-confirmation", { state: { order: confirmationData } });
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          planType: orderData.planType,
          promoCode: validatedPromo?.code || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + item.price, 0);
  const total = Math.max(0, subtotal - promoDiscount);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  };

  const validatePromoCode = async (code: string) => {
    if (!code || !orderData.planType) return;

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-promo-code`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: code.toUpperCase(),
          planType: orderData.planType,
        }),
      });

      const data = await response.json();

      if (data.valid && data.promo) {
        const discount = data.promo.discountType === 'percentage'
          ? Math.floor((subtotal * data.promo.discountValue) / 100)
          : data.promo.discountValue;

        setPromoDiscount(discount);
        setValidatedPromo({
          code: data.promo.code,
          type: data.promo.discountType,
          value: data.promo.discountValue,
        });
        toast.success(`Promo code applied! $${discount} discount`);
      } else {
        setPromoDiscount(0);
        setValidatedPromo(null);
        toast.error(data.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Promo code validation error:', error);
      toast.error('Failed to validate promo code');
    }
  };

  return (
    <section className={cn("min-h-screen bg-background", className)}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid min-h-screen lg:grid-cols-2">
            <div className="border-r border-border bg-muted/20 p-8 pt-32 lg:p-12 lg:pt-40 xl:p-16 xl:pt-48">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                    alt={orderData.companyName}
                    className="size-8"
                  />
                </div>

                <div className="mb-8">
                  <p className="text-sm text-muted-foreground">{orderData.companyName}</p>
                  <p className="text-4xl font-semibold tracking-tight">
                    {formatPrice(total, orderData.currency)}
                  </p>
                </div>

                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="text-sm text-foreground">
                        {formatPrice(item.price, orderData.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Subtotal</span>
                  <span className="text-sm text-foreground">
                    {formatPrice(subtotal, orderData.currency)}
                  </span>
                </div>

                <div className="mt-4">
                  <PromoCodeField onValidate={validatePromoCode} />
                </div>

                {promoDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-sm">Discount ({validatedPromo?.code})</span>
                    <span className="text-sm">
                      -{formatPrice(promoDiscount, orderData.currency)}
                    </span>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Total
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(total, orderData.currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 pt-32 lg:p-12 lg:pt-40 xl:p-16 xl:pt-48">
              <div className="mx-auto w-full max-w-md">
                <Button
                  type="button"
                  className="h-auto w-full bg-foreground py-1 text-background hover:bg-foreground/90"
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/apple-pay-white.svg"
                    alt="Apple Pay"
                    className="h-12"
                  />
                </Button>

                <div className="my-6 flex items-center gap-4">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">
                    or pay with card
                  </span>
                  <Separator className="flex-1" />
                </div>

                <div className="space-y-6">
                  <EmailField />

                  <div>
                    <h2 className="mb-4 text-sm font-medium">Card details</h2>
                    <PaymentFields />
                  </div>

                  <CountryField />

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full bg-blue-600 text-base text-white hover:bg-blue-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Complete payment"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By completing this purchase you agree to our terms of
                    service. Your payment information is encrypted and secure.
                  </p>

                  <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Lock className="size-3" />
                      Secure checkout
                    </span>
                    <Separator orientation="vertical" className="h-4" />
                    <a
                      href="#"
                      className="hover:text-foreground hover:underline"
                    >
                      Terms
                    </a>
                    <a
                      href="#"
                      className="hover:text-foreground hover:underline"
                    >
                      Privacy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

const PromoCodeField = ({ onValidate }: { onValidate: (code: string) => void }) => {
  const form = useFormContext<CheckoutFormType>();

  return (
    <Controller
      name="promoCode"
      control={form.control}
      render={({ field }) => (
        <div className="flex gap-2">
          <Input
            {...field}
            placeholder="Coupon code"
            className="h-9 flex-1 text-sm uppercase"
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => onValidate(field.value || '')}
          >
            Apply
          </Button>
        </div>
      )}
    />
  );
};

const EmailField = () => {
  const form = useFormContext<CheckoutFormType>();

  return (
    <Controller
      name="email"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-sm font-medium" htmlFor="checkout-email">
            Email address
          </FieldLabel>
          <Input
            {...field}
            id="checkout-email"
            type="email"
            placeholder="you@company.com"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const PaymentFields = () => {
  const form = useFormContext<CheckoutFormType>();

  return (
    <div className="space-y-4">
      <Controller
        name="cardNumber"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel
                className="text-sm text-muted-foreground"
                htmlFor="checkout-card-number"
              >
                Card number
              </FieldLabel>
              <div className="flex items-center gap-1">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                  alt="Visa"
                  className="h-5 w-auto"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-5 w-auto"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/american-express-icon.svg"
                  alt="American Express"
                  className="h-5 w-auto"
                />
              </div>
            </div>
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="checkout-card-number"
                placeholder="1234 1234 1234 1234"
                aria-invalid={fieldState.invalid}
                className="rounded-b-none border-b-0"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          </div>
        )}
      />

      <div className="-mt-4 grid grid-cols-2">
        <Controller
          name="expiryDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                onChange={(e) => {
                  let val = e.target.value;
                  val = val.replace(/[^0-9/]/g, "");
                  const prev = field.value ?? "";
                  const isDeleting = val.length < prev.length;
                  if (!isDeleting) {
                    if (val.length === 2 && !val.includes("/")) {
                      val = val + "/";
                    }
                  }
                  if (val.length > 5) {
                    val = val.slice(0, 5);
                  }
                  field.onChange(val);
                }}
                placeholder="MM / YY"
                className="rounded-none rounded-bl-md border-r-0"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="cvc"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                placeholder="CVC"
                className="rounded-none rounded-br-md"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Controller
        name="cardholderName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-medium"
              htmlFor="checkout-cardholder-name"
            >
              Name on card
            </FieldLabel>
            <Input
              {...field}
              id="checkout-cardholder-name"
              placeholder="John Smith"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
};

const CountryField = () => {
  const form = useFormContext<CheckoutFormType>();

  return (
    <Controller
      name="country"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            className="text-sm font-medium"
            htmlFor="checkout-country"
          >
            Billing country
          </FieldLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="checkout-country" className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CheckoutPage;
