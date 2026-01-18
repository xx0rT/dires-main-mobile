import { createClient } from "npm:@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  email: string;
  password: string;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    const { email, password }: RequestBody = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const verificationCode = generateVerificationCode();

    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const encodedPassword = btoa(String.fromCharCode(...new Uint8Array(passwordData)));

    const { error: deleteError } = await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("Error deleting old registration:", deleteError);
    }

    const { error: insertError } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        password_hash: encodedPassword,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create verification request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║            VERIFICATION CODE FOR TESTING                   ║
╠════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(45)} ║
║  Code:  ${verificationCode.padEnd(45)} ║
╠════════════════════════════════════════════════════════════╣
║  NOTE: In production, this code would be sent via email   ║
║        For now, use the code displayed above              ║
╚════════════════════════════════════════════════════════════╝
    `);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code sent successfully",
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
