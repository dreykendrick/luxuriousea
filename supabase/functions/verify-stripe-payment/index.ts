import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

serve(async (req) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { sessionId, orderNumber } = await req.json();

    if (!sessionId || !orderNumber) {
      return new Response(JSON.stringify({ error: "Missing sessionId or orderNumber" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Retrieve session from Stripe
    console.log(`Retrieving Stripe session: ${sessionId}`);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      console.warn(`Payment verification failed. Status: ${session.payment_status}`);
      return new Response(JSON.stringify({ success: false, error: "Payment not completed" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Initialize Supabase Client with Service Role Key to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the order by orderNumber
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (orderErr || !order) {
      console.error("Order fetch error:", orderErr);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Check if the order is already updated to processing or if we need to do it
    if (order.status === "pending_payment") {
      console.log(`Payment confirmed. Updating Order ${orderNumber} to processing.`);
      
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: "processing",
          stripe_session_id: session.id,
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
        })
        .eq("id", order.id);

      if (updateErr) {
        console.error("DB update error:", updateErr);
        throw updateErr;
      }
    }

    return new Response(JSON.stringify({ success: true, status: "processing" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Verification error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
