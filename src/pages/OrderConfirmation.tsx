import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number;
  image_url: string | null;
}

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  email: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  shipping_address: any;
  tracking_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  order_items: OrderItem[];
}

const statusLabel: Record<string, string> = {
  pending_payment: "Awaiting Payment",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get("just_placed") === "1";
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(!!sessionId);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    void (async () => {
      if (sessionId) {
        setVerifying(true);
        try {
          const { data, error } = await supabase.functions.invoke("verify-stripe-payment", {
            body: { sessionId, orderNumber },
          });
          if (error || !data?.success) {
            throw new Error(error?.message || data?.error || "Verification failed");
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Payment verification failed";
          setVerificationError(msg);
          setVerifying(false);
          setLoading(false);
          return;
        }
        setVerifying(false);
      }

      const { data } = await supabase
        .from("orders")
        .select(
          `id, order_number, status, email, subtotal, shipping_cost, total, created_at,
           shipping_address, tracking_carrier, tracking_number, tracking_url,
           order_items(id, product_name, size, color, quantity, price, image_url)`
        )
        .eq("order_number", orderNumber)
        .maybeSingle();
      setOrder(data as any);
      setLoading(false);
    })();
  }, [orderNumber, sessionId]);

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 min-h-screen">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
          {verifying ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-2 border-foreground border-t-transparent rounded-full mx-auto mb-6" />
              <h1 className="font-serif text-2xl font-light mb-2">Verifying Payment</h1>
              <p className="font-sans text-sm text-muted-foreground">Please do not close or refresh this page.</p>
            </div>
          ) : verificationError ? (
            <div className="text-center py-20">
              <h1 className="font-serif text-2xl font-light text-destructive mb-4">Payment Verification Failed</h1>
              <p className="font-sans text-sm text-muted-foreground mb-8 max-w-md mx-auto">{verificationError}</p>
              <Button asChild variant="outline">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          ) : loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : !order ? (
            <div className="text-center py-16">
              <h1 className="font-serif text-3xl font-light mb-4">Order not found</h1>
              <Button asChild variant="outline">
                <Link to="/track-order">Track an Order</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                {justPlaced && (
                  <CheckCircle className="h-12 w-12 mx-auto mb-6 text-accent" strokeWidth={1} />
                )}
                <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                  {justPlaced ? "Thank You" : "Your Order"}
                </p>
                <h1
                  className="font-serif text-4xl lg:text-5xl font-light mb-4"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {justPlaced ? "Order Received" : order.order_number}
                </h1>
                {justPlaced && (
                  <p className="font-sans text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Crafted with intention. Worn with purpose. A confirmation has been sent to{" "}
                    <span className="text-foreground">{order.email}</span>.
                  </p>
                )}
              </div>

              <div className="border-y border-border py-8 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                    Order
                  </p>
                  <p className="font-sans text-sm">{order.order_number}</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                    Date
                  </p>
                  <p className="font-sans text-sm">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                    Status
                  </p>
                  <p className="font-sans text-sm">{statusLabel[order.status] ?? order.status}</p>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                    Total
                  </p>
                  <p className="font-sans text-sm">${Number(order.total).toFixed(2)}</p>
                </div>
              </div>

              {order.tracking_number && (
                <section className="mb-12 border border-border p-6">
                  <h2 className="font-serif text-lg font-light mb-4">Tracking</h2>
                  <p className="font-sans text-sm">
                    {order.tracking_carrier} · {order.tracking_number}
                  </p>
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-sans text-xs tracking-ultra uppercase underline underline-offset-4"
                    >
                      Track Package
                    </a>
                  )}
                </section>
              )}

              <section className="mb-12">
                <h2 className="font-serif text-2xl font-light mb-6">Items</h2>
                <div className="divide-y divide-border">
                  {order.order_items.map((i) => (
                    <div key={i.id} className="py-6 flex gap-4">
                      {i.image_url && (
                        <div className="w-20 aspect-[3/4] bg-secondary overflow-hidden shrink-0">
                          <img
                            src={i.image_url}
                            alt={i.product_name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-serif text-base font-light">{i.product_name}</p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          {[i.color, i.size].filter(Boolean).join(" · ")}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          Qty {i.quantity}
                        </p>
                      </div>
                      <p className="font-sans text-sm">
                        ${(Number(i.price) * i.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid sm:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
                    Shipping To
                  </h3>
                  {order.shipping_address && (
                    <div className="font-sans text-sm space-y-1 text-muted-foreground">
                      <p className="text-foreground">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.address1}</p>
                      {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state}{" "}
                        {order.shipping_address.postalCode}
                      </p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
                    Summary
                  </h3>
                  <div className="space-y-2 font-sans text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {Number(order.shipping_cost) === 0
                          ? "Complimentary"
                          : `$${Number(order.shipping_cost).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="text-center">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-8 font-sans text-xs tracking-ultra uppercase"
                >
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
