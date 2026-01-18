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
    let user = null;

    if (authHeader) {
      try {
        const userResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
          headers: {
            Authorization: authHeader,
            apikey: Deno.env.get("SUPABASE_ANON_KEY") || "",
          },
        });

        if (userResponse.ok) {
          user = await userResponse.json();
        }
      } catch (error) {
        console.log("Could not get authenticated user, proceeding as guest");
      }
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
      if (!user) {
        return new Response(
          JSON.stringify({
            error: "Authentication required for free trial",
            requiresAuth: true,
          }),
          {
            status: 401,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const supabaseClient = await import("npm:@supabase/supabase-js@2");
      const supabase = supabaseClient.createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 3);

      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_type: "free_trial",
          status: "trialing",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
        });

      if (subError) {
        console.error("Error creating trial subscription:", subError);
        throw subError;
      }

      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-invoice-email`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail: user.email,
          customerName: user.email.split('@')[0],
          planType: "free_trial",
          planName: "Zkušební verze zdarma",
          amount: 0,
          currency: "usd",
          orderNumber: `TRIAL-${Date.now()}`,
          orderDate: new Date().toLocaleDateString('cs-CZ'),
        }),
      });

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

    const formData = new URLSearchParams();
    formData.append("payment_method_types[]", "card");
    formData.append("line_items[0][price_data][currency]", "usd");
    formData.append("line_items[0][price_data][product_data][name]", selectedPlan.name);
    formData.append("line_items[0][price_data][product_data][description]", `${selectedPlan.name} subscription`);
    formData.append("line_items[0][price_data][unit_amount]", finalPrice.toString());

    if (selectedPlan.recurring) {
      formData.append("line_items[0][price_data][recurring][interval]", "month");
    }

    formData.append("line_items[0][quantity]", "1");
    formData.append("mode", selectedPlan.recurring ? "subscription" : "payment");
    formData.append("success_url", `${req.headers.get("origin")}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`);
    formData.append("cancel_url", `${req.headers.get("origin")}/checkout`);

    if (user) {
      formData.append("client_reference_id", user.id);
      formData.append("metadata[userEmail]", user.email);
      formData.append("metadata[userName]", user.email.split('@')[0]);
    }

    formData.append("metadata[planType]", planType);

    if (promoCode) {
      formData.append("metadata[promoCode]", promoCode);
    }

    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
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
