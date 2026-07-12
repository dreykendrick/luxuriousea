import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");

  let event;
  try {
    const body = await req.text();
    if (signature && STRIPE_WEBHOOK_SECRET) {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } else {
      console.warn("Webhook running without signature verification (STRIPE_WEBHOOK_SECRET not set)");
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent;

    if (orderId) {
      console.log(`Processing successful payment for Order ID: ${orderId}`);
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      const { error } = await supabase
        .from("orders")
        .update({
          status: "processing",
          stripe_payment_intent_id: paymentIntentId,
        })
        .eq("id", orderId);

      if (error) {
        console.error("Failed to update order status in DB:", error);
        return new Response(JSON.stringify({ error: "Database update failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log(`Order ${orderId} successfully set to processing status`);
    } else {
      console.warn("No orderId found in session metadata");
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
