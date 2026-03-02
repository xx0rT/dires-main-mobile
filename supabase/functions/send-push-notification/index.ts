import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { importPKCS8, SignJWT } from "npm:jose@5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const APNS_KEY_ID = Deno.env.get("APNS_KEY_ID") ?? "";
const APNS_TEAM_ID = Deno.env.get("APNS_TEAM_ID") ?? "";
const APNS_PRIVATE_KEY = Deno.env.get("APNS_PRIVATE_KEY") ?? "";
const APNS_BUNDLE_ID = Deno.env.get("APNS_BUNDLE_ID") ?? "cz.dires.app";
const APNS_HOST = "https://api.push.apple.com";

let cachedToken: { jwt: string; expiresAt: number } | null = null;

async function getApnsJwt(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.jwt;
  }

  const keyData = APNS_PRIVATE_KEY.replace(/\\n/g, "\n");
  const privateKey = await importPKCS8(keyData, "ES256");

  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: APNS_KEY_ID })
    .setIssuer(APNS_TEAM_ID)
    .setIssuedAt(now)
    .sign(privateKey);

  cachedToken = { jwt, expiresAt: now + 3500 };
  return jwt;
}

async function sendApnsPush(
  deviceToken: string,
  title: string,
  body: string,
  data: Record<string, string> = {},
): Promise<boolean> {
  try {
    const jwt = await getApnsJwt();

    const payload = {
      aps: {
        alert: { title, body },
        sound: "default",
        badge: 1,
        "mutable-content": 1,
      },
      ...data,
    };

    const response = await fetch(
      `${APNS_HOST}/3/device/${deviceToken}`,
      {
        method: "POST",
        headers: {
          authorization: `bearer ${jwt}`,
          "apns-topic": APNS_BUNDLE_ID,
          "apns-push-type": "alert",
          "apns-priority": "10",
          "apns-expiration": "0",
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(`APNs error for token ${deviceToken.slice(0, 8)}...: ${response.status} ${err}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("APNs send error:", err);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { recipient_user_id, sender_name, message_content, conversation_id, trainer_id } =
      await req.json();

    if (!recipient_user_id || !message_content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: tokens } = await supabaseAdmin
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", recipient_user_id);

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: "No device tokens found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const title = sender_name || "Nova zprava";
    const body =
      message_content.length > 100
        ? message_content.slice(0, 100) + "..."
        : message_content;

    const notificationData: Record<string, string> = {};
    if (conversation_id) notificationData.conversation_id = conversation_id;
    if (trainer_id) notificationData.trainer_id = trainer_id;

    let sent = 0;
    const failedTokens: string[] = [];

    for (const { token, platform } of tokens) {
      if (platform === "ios" || platform === "web") {
        const success = await sendApnsPush(token, title, body, notificationData);
        if (success) {
          sent++;
        } else {
          failedTokens.push(token);
        }
      }
    }

    if (failedTokens.length > 0) {
      await supabaseAdmin
        .from("device_tokens")
        .delete()
        .eq("user_id", recipient_user_id)
        .in("token", failedTokens);
    }

    return new Response(
      JSON.stringify({ sent, failed: failedTokens.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Push notification error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
