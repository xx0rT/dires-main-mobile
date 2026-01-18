import { createClient } from "npm:@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  email: string;
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

    const { email }: RequestBody = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users.some(u => u.email === email);

    if (!userExists) {
      return new Response(
        JSON.stringify({ error: "No account found with this email" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const verificationCode = generateVerificationCode();

    const { error: deleteError } = await supabase
      .from("password_reset_requests")
      .delete()
      .eq("email", email);

    if (deleteError && deleteError.code !== "PGRST116") {
      console.error("Error deleting old reset request:", deleteError);
    }

    const { error: insertError } = await supabase
      .from("password_reset_requests")
      .insert({
        email,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create password reset request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`
╔════════════════════════════════════════════════════════════╗
║         PASSWORD RESET CODE FOR TESTING                    ║
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
        message: "Password reset code sent successfully",
        verificationCode: verificationCode,
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
