import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Search } from "lucide-react";

interface OrderRow {
  id: string;
  order_number: string;
  email: string;
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

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, email, status, total, created_at")
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    })();
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!o.order_number.toLowerCase().includes(s) && !o.email.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
          Orders
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          {orders.length} total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-sans text-sm text-muted-foreground">No orders match.</p>
        </div>
      ) : (
        <div className="border border-border">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/30 font-sans text-xs tracking-wide uppercase text-muted-foreground">
            <div className="col-span-3">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/30 transition-colors"
              >
                <p className="col-span-6 md:col-span-3 font-sans text-sm">{o.order_number}</p>
                <p className="col-span-6 md:col-span-3 font-sans text-sm text-muted-foreground truncate">
                  {o.email}
                </p>
                <p className="col-span-6 md:col-span-2 font-sans text-sm text-muted-foreground">
                  {format(new Date(o.created_at), "MMM d, yyyy")}
                </p>
                <p className="col-span-3 md:col-span-2 font-sans text-sm">
                  {statusLabel[o.status] ?? o.status}
                </p>
                <p className="col-span-3 md:col-span-2 font-sans text-sm md:text-right">
                  ${Number(o.total).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
