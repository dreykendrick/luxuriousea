import { useState } from "react";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Truck, Clock, Search } from "lucide-react";
import { format } from "date-fns";

const trackSchema = z.object({
  orderNumber: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(255),
});

const timeline = [
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

const statusRank: Record<string, number> = {
  pending_payment: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
  returned: -1,
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = trackSchema.safeParse({ orderNumber, email });
    if (!parsed.success) {
      setError("Please enter a valid order number and email.");
      return;
    }
    setBusy(true);
    try {
      // We do NOT expose orders to anon via RLS; call an RPC or public function later.
      // For now, attempt a public read scoped to matching email — but orders are user-scoped.
      // Fall back to a signed-in lookup: for guests we tell them to check their email link.
      const { data } = await supabase
        .from("orders")
        .select(
          `id, order_number, status, email, tracking_carrier, tracking_number, tracking_url,
           created_at, order_items(product_name, size, color, quantity)`
        )
        .eq("order_number", parsed.data.orderNumber)
        .eq("email", parsed.data.email)
        .maybeSingle();

      if (!data) {
        setError(
          "We couldn't find an order with those details. Guest orders can be tracked from the confirmation email link."
        );
      } else {
        setOrder(data);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const rank = order ? statusRank[order.status] ?? 0 : 0;

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-2xl">
          <div className="text-center mb-12">
            <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
              Order Status
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-light" style={{ letterSpacing: "-0.02em" }}>
              Track Your Order
            </h1>
          </div>

          {!order ? (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Order Number</Label>
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="EA-2026-XXXXXX"
                  className="h-12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              {error && <p className="font-sans text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={busy}
                className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
              >
                {busy ? "Searching..." : (<><Search className="h-4 w-4 mr-2" />Track Order</>)}
              </Button>
            </form>
          ) : (
            <div>
              <div className="border border-border p-6 mb-10 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">Order</p>
                  <p className="font-sans text-sm">{order.order_number}</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">Placed</p>
                  <p className="font-sans text-sm">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="font-serif text-xl font-light mb-6">Status</h2>
                <div className="space-y-6">
                  {timeline.map((t, i) => {
                    const done = rank >= i + 1;
                    return (
                      <div key={t.key} className="flex gap-4 items-center">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            done ? "bg-foreground text-background" : "border border-border"
                          }`}
                        >
                          {done ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <p className={`font-sans text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                          {t.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.tracking_number && (
                <div className="border border-border p-6 mb-10">
                  <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
                    Tracking
                  </h3>
                  <p className="font-sans text-sm mb-3">
                    {order.tracking_carrier} · {order.tracking_number}
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-xs tracking-ultra uppercase underline underline-offset-4"
                    >
                      Track Package
                    </a>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setOrder(null)}
                className="h-11 px-6 font-sans text-xs tracking-ultra uppercase"
              >
                Track Another
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
