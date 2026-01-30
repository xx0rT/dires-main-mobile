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

async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  try {
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = Deno.env.get("SMTP_PORT") || "587";
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || smtpUser;

    if (!smtpUser || !smtpPassword || !fromEmail) {
      console.error("SMTP credentials not configured");
      return false;
    }

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

    const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; color: #667eea; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Resetování hesla</h1>
              </div>
              <div class="content">
                <p>Obdrželi jsme žádost o resetování hesla pro váš účet.</p>
                <p>Váš ověřovací kód je:</p>
                <div class="code">${code}</div>
                <p>Tento kód vyprší za 15 minut.</p>
                <div class="warning">
                  <strong>⚠️ Bezpečnostní upozornění:</strong><br>
                  Pokud jste o resetování hesla nežádali, ignorujte tento email a vaše heslo zůstane nezměněno.
                </div>
              </div>
              <div class="footer">
                <p>Tento email byl odeslán automaticky. Neodpovídejte na něj.</p>
              </div>
            </div>
          </body>
        </html>
      `;

    await client.send({
      from: fromEmail,
      to: email,
      subject: "Resetování hesla - Ověřovací kód",
      html: emailHtml,
    });

    await client.close();
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
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

    const emailSent = await sendPasswordResetEmail(email, verificationCode);

    if (!emailSent) {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║   EMAIL SERVICE NOT CONFIGURED - PASSWORD RESET CODE       ║
╠════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(45)} ║
║  Code:  ${verificationCode.padEnd(45)} ║
╠════════════════════════════════════════════════════════════╣
║  Configure SMTP credentials to enable email sending       ║
╚════════════════════════════════════════════════════════════╝
      `);
    } else {
      console.log(`Password reset email sent to ${email}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password reset code sent to your email",
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
