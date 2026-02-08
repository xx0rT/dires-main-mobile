import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CourseCheckoutRequest {
  courseId: string;
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

    const supabaseClient = await import("npm:@supabase/supabase-js@2");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = supabaseClient.createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { courseId }: CourseCheckoutRequest = await req.json();

    const supabase = supabaseClient.createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price, description")
      .eq("id", courseId)
      .maybeSingle();

    if (courseError || !course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existing } = await supabase
      .from("course_purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Course already purchased" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const priceInCents = Math.round(course.price * 100);

    const origin = req.headers.get("origin");
    let baseUrl: string;

    if (origin) {
      baseUrl = origin;
    } else {
      const referer = req.headers.get("referer");
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          baseUrl = `${refererUrl.protocol}//${refererUrl.host}`;
        } catch {
          baseUrl = referer.split("?")[0].split("#")[0].replace(/\/$/, "");
        }
      } else {
        baseUrl = "https://your-domain.com";
      }
    }

    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }

    const formData = new URLSearchParams();
    formData.append("payment_method_types[]", "card");
    formData.append("line_items[0][price_data][currency]", "czk");
    formData.append(
      "line_items[0][price_data][product_data][name]",
      course.title
    );
    formData.append(
      "line_items[0][price_data][product_data][description]",
      course.description || ""
    );
    formData.append(
      "line_items[0][price_data][unit_amount]",
      priceInCents.toString()
    );
    formData.append("line_items[0][quantity]", "1");
    formData.append("mode", "payment");
    formData.append(
      "success_url",
      `${baseUrl}/courses?purchased=${courseId}`
    );
    formData.append("cancel_url", `${baseUrl}/courses`);
    formData.append("client_reference_id", user.id);
    formData.append("metadata[userId]", user.id);
    formData.append("metadata[courseId]", courseId);
    formData.append("metadata[type]", "course_purchase");

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
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating course checkout:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
