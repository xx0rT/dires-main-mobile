import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface PaymentIntentRequest {
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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase environment variables not configured");
      throw new Error("Supabase configuration missing");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !user) {
      console.error("Auth error:", userError);
      throw new Error("Unauthorized");
    }

    const { planType, promoCode }: PaymentIntentRequest = await req.json();

    if (!planType) {
      throw new Error("Plan type is required");
    }

    const plans = {
      free_trial: {
        name: "3-Day Free Trial",
        price: 0,
        recurring: false,
      },
      monthly: {
        name: "Monthly Plan",
        price: 3000,
        recurring: true,
      },
      lifetime: {
        name: "Lifetime Access",
        price: 20000,
        recurring: false,
      },
    };

    const selectedPlan = plans[planType];
    if (!selectedPlan) {
      throw new Error("Invalid plan type");
    }

    if (planType === "free_trial") {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 3);

      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const { error: subError } = await supabaseClient
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_type: "free_trial",
          status: "trialing",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
        });

      if (subError) {
        console.error("Subscription insert error:", subError);
        throw subError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          planType: "free_trial",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let discountAmount = 0;
    let promoId = null;

    if (promoCode) {
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const { data: promo } = await supabaseClient
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (promo && promo.applicable_plans.includes(planType)) {
        if (promo.discount_type === "percentage") {
          discountAmount = Math.floor(
            (selectedPlan.price * promo.discount_value) / 100
          );
        } else {
          discountAmount = promo.discount_value * 100;
        }
        promoId = promo.id;
      }
    }

    const finalPrice = Math.max(0, selectedPlan.price - discountAmount);

    if (selectedPlan.recurring) {
      const formData = new URLSearchParams();
      formData.append("customer[email]", user.email || "");
      formData.append("items[0][price_data][currency]", "usd");
      formData.append("items[0][price_data][product_data][name]", selectedPlan.name);
      formData.append("items[0][price_data][unit_amount]", finalPrice.toString());
      formData.append("items[0][price_data][recurring][interval]", "month");
      formData.append("payment_behavior", "default_incomplete");
      formData.append("payment_settings[payment_method_types][]", "card");
      formData.append("expand[]", "latest_invoice.payment_intent");
      formData.append("metadata[user_id]", user.id);
      formData.append("metadata[plan_type]", planType);
      if (promoCode) {
        formData.append("metadata[promo_code]", promoCode);
      }
      if (promoId) {
        formData.append("metadata[promo_id]", promoId);
      }

      const subscriptionResponse = await fetch(
        "https://api.stripe.com/v1/subscriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!subscriptionResponse.ok) {
        const error = await subscriptionResponse.text();
        console.error("Stripe subscription error:", error);
        throw new Error(`Stripe subscription error: ${error}`);
      }

      const subscription = await subscriptionResponse.json();

      return new Response(
        JSON.stringify({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
          planType,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const formData = new URLSearchParams();
    formData.append("amount", finalPrice.toString());
    formData.append("currency", "usd");
    formData.append("automatic_payment_methods[enabled]", "true");
    formData.append("metadata[user_id]", user.id);
    formData.append("metadata[plan_type]", planType);
    if (promoCode) {
      formData.append("metadata[promo_code]", promoCode);
    }
    if (promoId) {
      formData.append("metadata[promo_id]", promoId);
    }

    const paymentIntentResponse = await fetch(
      "https://api.stripe.com/v1/payment_intents",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!paymentIntentResponse.ok) {
      const error = await paymentIntentResponse.text();
      console.error("Stripe API error:", error);
      throw new Error(`Stripe API error: ${error}`);
    }

    const paymentIntent = await paymentIntentResponse.json();

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        planType,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
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
