import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "E & A Luxurious <hello@ealuxshop.dev>";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "Welcome to E & A Luxurious ✦",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to E &amp; A Luxurious</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Georgia',serif;color:#f5f0eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#111;border:1px solid #2a2a2a;">
          <!-- Header -->
          <tr>
            <td style="padding:48px 48px 32px;border-bottom:1px solid #2a2a2a;text-align:center;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#9a8a7a;font-family:Arial,sans-serif;">Est. 2024</p>
              <h1 style="margin:0;font-size:26px;font-weight:400;letter-spacing:-0.02em;color:#f5f0eb;">E &amp; A Luxurious</h1>
              <p style="margin:8px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#6b6b6b;font-family:Arial,sans-serif;">Where Luxury Meets Spirituality</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#9a8a7a;font-family:Arial,sans-serif;">You&apos;re in</p>
              <h2 style="margin:0 0 24px;font-size:24px;font-weight:400;letter-spacing:-0.02em;color:#f5f0eb;">Welcome to the Journey</h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#b0a090;font-family:Arial,sans-serif;">
                Thank you for joining the E &amp; A Luxurious community. You&apos;ll be the first to know about new collections, exclusive offers, and the stories behind our craft.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#b0a090;font-family:Arial,sans-serif;">
                Every piece we create is designed with intention — to inspire mindfulness and elevate your everyday.
              </p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f5f0eb;padding:0;">
                    <a href="https://ealuxshop.dev/shop" style="display:inline-block;padding:16px 40px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;font-family:Arial,sans-serif;">
                      Explore Collection →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #2a2a2a;text-align:center;">
              <p style="margin:0;font-size:11px;color:#4a4a4a;font-family:Arial,sans-serif;line-height:1.6;">
                You&apos;re receiving this because you subscribed at <a href="https://ealuxshop.dev" style="color:#9a8a7a;text-decoration:none;">ealuxshop.dev</a>.<br/>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      // Don't fail the subscription if email fails — the email was saved to DB
      return new Response(JSON.stringify({ success: true, emailSent: false }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(JSON.stringify({ success: true, emailSent: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
