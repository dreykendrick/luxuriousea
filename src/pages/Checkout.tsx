import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

const addressSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  fullName: z.string().trim().min(1, "Required").max(100),
  address1: z.string().trim().min(1, "Required").max(200),
  address2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "Required").max(100),
  state: z.string().trim().min(1, "Required").max(100),
  postalCode: z.string().trim().min(1, "Required").max(20),
  country: z.string().trim().min(1, "Required").max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 15;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: user?.email ?? "",
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : items.length > 0 ? FLAT_SHIPPING : 0;
  const total = subtotal + shipping;

  if (items.length === 0) return <Navigate to="/cart" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      const address = parsed.data;

      // Create order (pending_payment — Stripe hooks in later)
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          email: address.email,
          status: "pending_payment",
          subtotal,
          shipping_cost: shipping,
          total,
          shipping_address: address as any,
          billing_address: address as any,
        })
        .select("id, order_number")
        .single();
      if (orderErr) throw orderErr;

      // Create order items
      const itemRows = items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        variant_id: i.variantId,
        product_name: i.productName,
        product_slug: i.productSlug,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
        image_url: i.image,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
      if (itemsErr) throw itemsErr;

      clear();
      toast.success("Order placed", {
        description: `Order ${order.order_number} received.`,
      });
      navigate(`/order/${order.order_number}?just_placed=1`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Checkout failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Layout>
      <div className="pt-28 lg:pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
              Checkout
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
              Complete Your Order
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">
            {/* Address form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="font-serif text-xl font-light mb-6">Contact</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl font-light mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">Full Name</Label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">Address</Label>
                    <Input
                      value={form.address1}
                      onChange={(e) => setForm({ ...form, address1: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">
                      Apt / Suite (optional)
                    </Label>
                    <Input
                      value={form.address2}
                      onChange={(e) => setForm({ ...form, address2: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">City</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">State</Label>
                    <Input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">Postal Code</Label>
                    <Input
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">Country</Label>
                    <Input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="font-sans text-xs tracking-wide uppercase">
                      Phone (optional)
                    </Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-xl font-light mb-6">Payment</h2>
                <div className="border border-border p-6 bg-secondary/30">
                  <div className="flex items-start gap-3">
                    <Lock className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-sans text-sm mb-2">Secure payment via Stripe</p>
                      <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                        Card entry becomes available once Stripe is connected. Your order will be
                        placed now and reserved in <span className="text-foreground">Awaiting Payment</span>.
                        Our team will reach out with a secure payment link within one business day.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Button
                type="submit"
                disabled={busy}
                className="w-full h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
              >
                {busy ? "Placing order..." : `Place Order — $${total.toFixed(2)}`}
              </Button>
            </form>

            {/* Order summary */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 border border-border p-8 bg-secondary/20">
                <h2 className="font-serif text-xl font-light mb-6">Order</h2>
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto">
                  {items.map((i) => (
                    <div key={i.variantId} className="flex gap-4">
                      {i.image && (
                        <div className="w-16 aspect-[3/4] bg-secondary overflow-hidden shrink-0">
                          <img
                            src={i.image}
                            alt={i.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-light truncate">{i.productName}</p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {[i.color, i.size].filter(Boolean).join(" · ")} · Qty {i.quantity}
                        </p>
                      </div>
                      <p className="font-sans text-sm">${(i.price * i.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-6 border-t border-border font-sans text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/cart"
                  className="block text-center mt-6 font-sans text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Return to bag
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
