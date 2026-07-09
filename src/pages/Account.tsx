import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}

const statusLabel: Record<string, string> = {
  pending_payment: "Awaiting Payment",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const Account = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null } | null>(
    null
  );

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [{ data: ords }, { data: prof }] = await Promise.all([
        supabase
          .from("orders")
          .select("id, order_number, status, total, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("full_name, email").eq("id", user.id).maybeSingle(),
      ]);
      setOrders((ords ?? []) as OrderRow[]);
      setProfile(prof as any);
    })();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                Your Account
              </p>
              <h1
                className="font-serif text-4xl lg:text-5xl font-light"
                style={{ letterSpacing: "-0.02em" }}
              >
                {profile?.full_name || "Welcome"}
              </h1>
              <p className="font-sans text-sm text-muted-foreground mt-2">{profile?.email}</p>
            </div>
            <div className="flex gap-3">
              {isAdmin && (
                <Button asChild variant="outline" className="h-12 px-6 font-sans text-xs tracking-ultra uppercase">
                  <Link to="/admin">Admin Panel</Link>
                </Button>
              )}
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="h-12 px-6 font-sans text-xs tracking-ultra uppercase"
              >
                Sign Out
              </Button>
            </div>
          </div>

          <section>
            <h2 className="font-serif text-2xl font-light mb-8">Order History</h2>
            {orders.length === 0 ? (
              <div className="border border-border p-12 text-center">
                <p className="font-sans text-sm text-muted-foreground mb-6">
                  You have no orders yet.
                </p>
                <Button asChild className="bg-foreground hover:bg-foreground/90 text-background h-12 px-8 font-sans text-xs tracking-ultra uppercase">
                  <Link to="/shop">Begin Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="border-t border-border">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    to={`/order/${o.order_number}`}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border py-6 hover:bg-secondary/30 transition-colors px-4 -mx-4"
                  >
                    <div>
                      <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                        Order
                      </p>
                      <p className="font-sans text-sm">{o.order_number}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                        Date
                      </p>
                      <p className="font-sans text-sm">
                        {format(new Date(o.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                        Status
                      </p>
                      <p className="font-sans text-sm">{statusLabel[o.status] ?? o.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground mb-1">
                        Total
                      </p>
                      <p className="font-sans text-sm">${Number(o.total).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
