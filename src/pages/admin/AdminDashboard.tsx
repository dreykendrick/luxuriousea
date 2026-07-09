import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingBag, DollarSign, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    pendingOrders: 0,
    revenue: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    void (async () => {
      const [products, orders, variants, recent, items] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total, status"),
        supabase.from("product_variants").select("id, product_id, stock, size, color, products(name, slug)").lte("stock", 3),
        supabase.from("orders").select("id, order_number, email, total, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("order_items").select("product_name, product_slug, quantity"),
      ]);

      const revenue = (orders.data ?? [])
        .filter((o: any) => !["cancelled", "pending_payment"].includes(o.status))
        .reduce((s: number, o: any) => s + Number(o.total), 0);
      const pending = (orders.data ?? []).filter((o: any) => o.status === "pending_payment").length;

      // Top products by quantity sold
      const counts: Record<string, { name: string; slug: string; qty: number }> = {};
      (items.data ?? []).forEach((i: any) => {
        const k = i.product_slug ?? i.product_name;
        if (!counts[k]) counts[k] = { name: i.product_name, slug: i.product_slug, qty: 0 };
        counts[k].qty += i.quantity;
      });
      const top = Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 5);

      setStats({
        productCount: products.count ?? 0,
        orderCount: orders.data?.length ?? 0,
        pendingOrders: pending,
        revenue,
        lowStock: variants.data?.length ?? 0,
      });
      setRecentOrders(recent.data ?? []);
      setTopProducts(top);
    })();
  }, []);

  const cards = [
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign },
    { label: "Orders", value: stats.orderCount, icon: ShoppingBag, sub: `${stats.pendingOrders} pending` },
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "Low Stock Variants", value: stats.lowStock, icon: AlertCircle, alert: stats.lowStock > 0 },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          Overview of orders, revenue, and inventory.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`border p-6 ${
              c.alert ? "border-accent bg-accent/5" : "border-border bg-secondary/20"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="font-sans text-xs tracking-wide uppercase text-muted-foreground">
                {c.label}
              </p>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-serif text-3xl font-light">{c.value}</p>
            {c.sub && <p className="font-sans text-xs text-muted-foreground mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-light">Recent Orders</h2>
            <Link to="/admin/orders" className="font-sans text-xs tracking-wide uppercase text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground py-8 text-center border border-border">
              No orders yet
            </p>
          ) : (
            <div className="border border-border divide-y divide-border">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/admin/orders/${o.id}`}
                  className="block p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <p className="font-sans text-sm truncate">{o.order_number}</p>
                      <p className="font-sans text-xs text-muted-foreground truncate">
                        {o.email}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-sans text-sm">${Number(o.total).toFixed(2)}</p>
                      <p className="font-sans text-xs text-muted-foreground capitalize">
                        {o.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Top products */}
        <section>
          <h2 className="font-serif text-xl font-light mb-4">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground py-8 text-center border border-border">
              No sales yet
            </p>
          ) : (
            <div className="border border-border divide-y divide-border">
              {topProducts.map((p) => (
                <div key={p.slug || p.name} className="p-4 flex justify-between">
                  <p className="font-sans text-sm">{p.name}</p>
                  <p className="font-sans text-sm text-muted-foreground">
                    {p.qty} sold
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
