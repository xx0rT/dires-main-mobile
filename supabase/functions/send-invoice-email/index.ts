import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoiceRequest {
  customerEmail: string;
  customerName: string;
  planType: string;
  planName: string;
  amount: number;
  currency: string;
  orderNumber: string;
  orderDate: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = Deno.env.get("SMTP_PORT") || "587";
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || smtpUser;
    const OWNER_EMAIL = "txrxo.troxx@gmail.com";

    if (!smtpUser || !smtpPassword || !fromEmail) {
      throw new Error("SMTP credentials are not configured");
    }

    const {
      customerEmail,
      customerName,
      planType,
      planName,
      amount,
      currency,
      orderNumber,
      orderDate,
    }: InvoiceRequest = await req.json();

    const formatPrice = (amount: number, currency: string) => {
      return new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(amount);
    };

    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .total { font-size: 20px; font-weight: bold; color: #667eea; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Děkujeme za váš nákup!</h1>
    </div>
    <div class="content">
      <p>Dobrý den ${customerName},</p>
      <p>Vaše platba byla úspěšně zpracována. Níže naleznete detaily vaší objednávky:</p>

      <div class="invoice-details">
        <div class="detail-row">
          <span>Číslo objednávky:</span>
          <strong>${orderNumber}</strong>
        </div>
        <div class="detail-row">
          <span>Datum:</span>
          <span>${orderDate}</span>
        </div>
        <div class="detail-row">
          <span>Plán:</span>
          <span>${planName}</span>
        </div>
        <div class="detail-row">
          <span>Typ:</span>
          <span>${planType}</span>
        </div>
        <div class="detail-row">
          <span class="total">Celková částka:</span>
          <span class="total">${formatPrice(amount, currency)}</span>
        </div>
      </div>

      <p>Váš přístup byl aktivován a můžete začít používat všechny funkce vašeho plánu.</p>

      <div class="footer">
        <p>Máte-li jakékoliv dotazy, neváhejte nás kontaktovat.</p>
        <p>S pozdravem,<br>Tým Fyzioterapie Kurzy</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const ownerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10b981; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎉 Nový nákup!</h2>
    </div>
    <div class="content">
      <p><strong>Nová objednávka byla právě dokončena:</strong></p>

      <div class="details">
        <div class="detail-row"><strong>Zákazník:</strong> ${customerName}</div>
        <div class="detail-row"><strong>Email:</strong> ${customerEmail}</div>
        <div class="detail-row"><strong>Plán:</strong> ${planName}</div>
        <div class="detail-row"><strong>Typ:</strong> ${planType}</div>
        <div class="detail-row"><strong>Částka:</strong> ${formatPrice(amount, currency)}</div>
        <div class="detail-row"><strong>Číslo objednávky:</strong> ${orderNumber}</div>
        <div class="detail-row"><strong>Datum:</strong> ${orderDate}</div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const SMTPClient = (await import("https://deno.land/x/denomailer@1.6.0/mod.ts")).default;

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
        to: customerEmail,
        subject: `Faktura za váš nákup - ${orderNumber}`,
        html: customerEmailHtml,
      });

      await client.send({
        from: fromEmail,
        to: OWNER_EMAIL,
        subject: `Nový nákup: ${planName} - ${formatPrice(amount, currency)}`,
        html: ownerEmailHtml,
      });

      await client.close();
    } catch (emailError) {
      await client.close();
      throw emailError;
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending invoice emails:", error);
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
