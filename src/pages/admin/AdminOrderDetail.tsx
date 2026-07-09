import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending_payment", label: "Awaiting Payment" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState({ carrier: "", number: "", url: "" });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const { data } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .eq("id", id)
        .maybeSingle();
      setOrder(data);
      if (data) {
        setStatus(data.status);
        setTracking({
          carrier: data.tracking_carrier ?? "",
          number: data.tracking_number ?? "",
          url: data.tracking_url ?? "",
        });
        setNotes(data.notes ?? "");
      }
      setLoading(false);
    })();
  }, [id]);

  async function save() {
    if (!id) return;
    setSaving(true);
    const { error } = await supabase
      .from("orders")
      .update({
        status: status as any,
        tracking_carrier: tracking.carrier || null,
        tracking_number: tracking.number || null,
        tracking_url: tracking.url || null,
        notes: notes || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
  }

  if (loading) return <p className="text-center py-12 text-muted-foreground">Loading...</p>;
  if (!order) return <p className="text-center py-12 text-muted-foreground">Order not found</p>;

  const addr = order.shipping_address ?? {};

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 font-sans text-xs tracking-wide uppercase text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-2">
            {format(new Date(order.created_at), "MMM d, yyyy · h:mm a")}
          </p>
          <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            {order.order_number}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">{order.email}</p>
        </div>
        <Button
          onClick={save}
          disabled={saving}
          className="bg-foreground hover:bg-foreground/90 text-background h-11 px-6 font-sans text-xs tracking-ultra uppercase"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <section className="border border-border p-6">
            <h2 className="font-serif text-xl font-light mb-6">Items</h2>
            <div className="divide-y divide-border">
              {order.order_items.map((i: any) => (
                <div key={i.id} className="py-4 flex gap-4">
                  {i.image_url && (
                    <div className="w-16 aspect-[3/4] bg-secondary overflow-hidden shrink-0">
                      <img src={i.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-sans text-sm">{i.product_name}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">
                      {[i.color, i.size].filter(Boolean).join(" · ")} · Qty {i.quantity}
                    </p>
                  </div>
                  <p className="font-sans text-sm">${(Number(i.price) * i.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 mt-4 space-y-2 font-sans text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>${Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Tracking */}
          <section className="border border-border p-6">
            <h2 className="font-serif text-xl font-light mb-6">Shipping & Tracking</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Carrier</Label>
                <Input
                  value={tracking.carrier}
                  onChange={(e) => setTracking({ ...tracking, carrier: e.target.value })}
                  placeholder="USPS, FedEx, UPS..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Tracking #</Label>
                <Input
                  value={tracking.number}
                  onChange={(e) => setTracking({ ...tracking, number: e.target.value })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs tracking-wide uppercase">Tracking URL</Label>
                <Input
                  value={tracking.url}
                  onChange={(e) => setTracking({ ...tracking, url: e.target.value })}
                  placeholder="https://..."
                  className="h-11"
                />
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="border border-border p-6">
            <h2 className="font-serif text-xl font-light mb-4">Internal Notes</h2>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about this order..."
              className="h-11"
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="border border-border p-6">
            <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
              Status
            </h3>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="border border-border p-6">
            <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
              Shipping To
            </h3>
            <div className="font-sans text-sm space-y-1">
              <p>{addr.fullName}</p>
              <p className="text-muted-foreground">{addr.address1}</p>
              {addr.address2 && <p className="text-muted-foreground">{addr.address2}</p>}
              <p className="text-muted-foreground">
                {addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="text-muted-foreground">{addr.country}</p>
              {addr.phone && <p className="text-muted-foreground pt-2">{addr.phone}</p>}
            </div>
          </section>

          {order.stripe_payment_intent_id && (
            <section className="border border-border p-6">
              <h3 className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-3">
                Stripe
              </h3>
              <p className="font-sans text-xs break-all">{order.stripe_payment_intent_id}</p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
