import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing signature or webhook secret");
    }

    const body = await req.text();
    const event = JSON.parse(body);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { planType, promoCode, userEmail, userName } = session.metadata;
        const customerId = session.customer;
        const subscriptionId = session.subscription;
        const userId = session.client_reference_id;

        if (!userId) {
          console.error("No user ID in session");
          break;
        }

        const periodStart = new Date();
        const periodEnd = new Date();
        if (planType === "free_trial") {
          periodEnd.setDate(periodEnd.getDate() + 3);
        } else if (planType === "monthly") {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else if (planType === "lifetime") {
          periodEnd.setFullYear(periodEnd.getFullYear() + 100);
        }

        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userId)
          .single();

        let subscription;
        if (existingSub) {
          const { data, error } = await supabase
            .from("subscriptions")
            .update({
              plan: planType,
              status: planType === "free_trial" ? "trialing" : "active",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              current_period_start: periodStart.toISOString(),
              current_period_end: periodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .select()
            .single();

          if (error) {
            console.error("Error updating subscription:", error);
            throw error;
          }
          subscription = data;
        } else {
          const { data, error } = await supabase
            .from("subscriptions")
            .insert({
              user_id: userId,
              plan: planType,
              status: planType === "free_trial" ? "trialing" : "active",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              current_period_start: periodStart.toISOString(),
              current_period_end: periodEnd.toISOString(),
            })
            .select()
            .single();

          if (error) {
            console.error("Error creating subscription:", error);
            throw error;
          }
          subscription = data;
        }

        const planNames = {
          free_trial: "Zkušební verze zdarma",
          monthly: "Měsíční plán",
          lifetime: "Doživotní přístup"
        };

        const amount = session.amount_total / 100;

        try {
          await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-invoice-email`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerEmail: userEmail || "customer@example.com",
              customerName: userName || "Customer",
              planType: planType,
              planName: planNames[planType as keyof typeof planNames] || planType,
              amount: amount,
              currency: session.currency || "usd",
              orderNumber: `ORD-${Date.now()}`,
              orderDate: new Date().toLocaleDateString('cs-CZ'),
            }),
          });
        } catch (emailError) {
          console.error("Error sending invoice email:", emailError);
        }

        if (promoCode && subscription) {
          const { data: promoData } = await supabase
            .from("promo_codes")
            .select("id, current_uses")
            .eq("code", promoCode)
            .single();

          if (promoData) {
            await supabase.from("promo_codes").update({
              current_uses: (promoData.current_uses || 0) + 1,
            }).eq("id", promoData.id);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await supabase
          .from("subscriptions")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
