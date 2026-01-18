import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  planType: "free_trial" | "monthly" | "lifetime";
  promoCode?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const { planType, promoCode }: CheckoutRequest = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const plans = {
      free_trial: {
        name: "3-Day Free Trial",
        price: 0,
        priceId: "price_free_trial",
        trialDays: 3,
      },
      monthly: {
        name: "Monthly Plan",
        price: 3000,
        priceId: "price_monthly",
        recurring: true,
      },
      lifetime: {
        name: "Lifetime Access",
        price: 20000,
        priceId: "price_lifetime",
        recurring: false,
      },
    };

    const selectedPlan = plans[planType];
    if (!selectedPlan) {
      throw new Error("Invalid plan type");
    }

    let discountAmount = 0;
    if (promoCode) {
      const promoResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/rest/v1/promo_codes?code=eq.${promoCode}&is_active=eq.true`,
        {
          headers: {
            apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
            Authorization: authHeader,
          },
        }
      );

      const promoCodes = await promoResponse.json();
      if (promoCodes && promoCodes.length > 0) {
        const promo = promoCodes[0];
        if (promo.applicable_plans.includes(planType)) {
          if (promo.discount_type === "percentage") {
            discountAmount = Math.floor(
              (selectedPlan.price * promo.discount_value) / 100
            );
          } else {
            discountAmount = promo.discount_value * 100;
          }
        }
      }
    }

    const finalPrice = Math.max(0, selectedPlan.price - discountAmount);

    if (planType === "free_trial") {
      const sessionData = {
        sessionId: `trial_${Date.now()}`,
        planType: "free_trial",
        amount: 0,
        url: `${req.headers.get("origin")}/order-confirmation`,
      };

      return new Response(JSON.stringify(sessionData), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: selectedPlan.name,
            description: `${selectedPlan.name} subscription`,
          },
          unit_amount: finalPrice,
          ...(selectedPlan.recurring && {
            recurring: {
              interval: "month",
            },
          }),
        },
        quantity: 1,
      },
    ];

    const sessionParams: any = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: selectedPlan.recurring ? "subscription" : "payment",
      success_url: `${req.headers.get("origin")}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        planType,
        promoCode: promoCode || "",
      },
    };

    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(sessionParams as any).toString(),
      }
    );

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      throw new Error(`Stripe API error: ${error}`);
    }

    const session = await stripeResponse.json();

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
