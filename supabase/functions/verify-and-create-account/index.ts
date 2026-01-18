import { createClient } from "npm:@supabase/supabase-js@2.90.1";

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
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: "Email and code are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabaseAdmin.rpc("cleanup_expired_verification_codes");

    const { data: verificationData, error: fetchError } = await supabaseAdmin
      .from("email_verification_codes")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !verificationData) {
      return new Response(
        JSON.stringify({ error: "Ověřovací kód nebyl nalezen nebo vypršel" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (new Date(verificationData.expires_at) < new Date()) {
      await supabaseAdmin
        .from("email_verification_codes")
        .delete()
        .eq("email", email);

      return new Response(
        JSON.stringify({ error: "Ověřovací kód vypršel" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (verificationData.attempts >= 5) {
      await supabaseAdmin
        .from("email_verification_codes")
        .delete()
        .eq("email", email);

      return new Response(
        JSON.stringify({ error: "Příliš mnoho neúspěšných pokusů" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (verificationData.code !== code) {
      const newAttempts = verificationData.attempts + 1;
      await supabaseAdmin
        .from("email_verification_codes")
        .update({ attempts: newAttempts })
        .eq("email", email);

      return new Response(
        JSON.stringify({
          error: "Neplatný ověřovací kód",
          attemptsRemaining: 5 - newAttempts,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: verificationData.password_hash,
      email_confirm: true,
    });

    if (createError) {
      console.error("User creation error:", createError);
      return new Response(
        JSON.stringify({ error: "Nepodařilo se vytvořit účet" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabaseAdmin
      .from("email_verification_codes")
      .delete()
      .eq("email", email);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Účet byl úspěšně vytvořen",
        user: userData.user,
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
