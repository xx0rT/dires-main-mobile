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
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
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

    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === email);

    if (userExists) {
      return new Response(
        JSON.stringify({ error: "Tento email je již zaregistrován" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    await supabaseAdmin
      .from("email_verification_codes")
      .delete()
      .eq("email", email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const { error: insertError } = await supabaseAdmin
      .from("email_verification_codes")
      .insert({
        email,
        code,
        password_hash: passwordHash,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create verification code" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .code-box { background: #f4f4f4; border: 2px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ověřte svůj email</h1>
          </div>
          <p>Děkujeme za registraci! Pro dokončení vytvoření účtu prosím zadejte tento ověřovací kód:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p>Tento kód vyprší za 15 minut.</p>
          <p>Pokud jste o tento kód nežádali, můžete tento email ignorovat.</p>
          <div class="footer">
            <p>Tento email byl odeslán automaticky, neodpovídejte na něj.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");

      if (resendApiKey) {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "noreply@yourdomain.com",
            to: email,
            subject: "Ověřte svůj email",
            html: emailHtml,
          }),
        });

        if (!resendResponse.ok) {
          const error = await resendResponse.text();
          console.error("Resend API error:", error);
        }
      } else {
        console.log("=== VERIFICATION CODE ===");
        console.log(`Email: ${email}`);
        console.log(`Code: ${code}`);
        console.log("========================");
      }
    } catch (e) {
      console.error("Email sending error:", e);
      console.log("=== VERIFICATION CODE (fallback) ===");
      console.log(`Email: ${email}`);
      console.log(`Code: ${code}`);
      console.log("====================================");
    }

    const isDevelopment = !Deno.env.get("RESEND_API_KEY");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Ověřovací kód byl odeslán na váš email",
        ...(isDevelopment && { code, email }),
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
