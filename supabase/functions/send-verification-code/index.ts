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

    const { error: insertError } = await supabaseAdmin
      .from("email_verification_codes")
      .insert({
        email,
        code,
        password_hash: password,
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
      const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
      const smtpPort = Deno.env.get("SMTP_PORT") || "587";
      const smtpUser = Deno.env.get("SMTP_USER");
      const smtpPassword = Deno.env.get("SMTP_PASSWORD");
      const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || smtpUser;

      if (smtpUser && smtpPassword && fromEmail) {
        // Use SMTP to send email
        const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");

        const client = new SMTPClient({
          connection: {
            hostname: smtpHost,
            port: Number(smtpPort),
            tls: true,
            auth: {
              username: smtpUser,
              password: smtpPassword,
            },
          },
        });

        try {
          await client.send({
            from: fromEmail,
            to: email,
            subject: "Ověřte svůj email",
            html: emailHtml,
          });

          await client.close();
          console.log(`Verification email sent successfully to ${email}`);
        } catch (emailError) {
          console.error("SMTP send error:", emailError);
          await client.close();
          console.log("=== VERIFICATION CODE (email failed) ===");
          console.log(`Email: ${email}`);
          console.log(`Code: ${code}`);
          console.log("=======================================");
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

    const isDevelopment = !Deno.env.get("SMTP_USER");

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
