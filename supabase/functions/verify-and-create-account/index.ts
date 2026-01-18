import { createClient } from "npm:@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  email: string;
  code: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, code }: RequestBody = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: pending, error: fetchError } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (fetchError || !pending) {
      return new Response(
        JSON.stringify({ error: "Verification request not found or expired" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (new Date(pending.expires_at) < new Date()) {
      await supabase
        .from("pending_registrations")
        .delete()
        .eq("email", email);

      return new Response(
        JSON.stringify({ error: "Verification code has expired" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (pending.attempts >= 5) {
      await supabase
        .from("pending_registrations")
        .delete()
        .eq("email", email);

      return new Response(
        JSON.stringify({ error: "Too many verification attempts" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (pending.verification_code !== code) {
      await supabase
        .from("pending_registrations")
        .update({ attempts: pending.attempts + 1 })
        .eq("email", email);

      return new Response(
        JSON.stringify({
          error: "Invalid verification code",
          attemptsRemaining: 5 - (pending.attempts + 1),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const decodedPassword = atob(pending.password_hash);

    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password: decodedPassword,
      email_confirm: true,
    });

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return new Response(
        JSON.stringify({ error: "Failed to create account" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account created successfully",
        user: authData.user,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
