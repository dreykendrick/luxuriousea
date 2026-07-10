import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Shield, ShieldOff } from "lucide-react";
import { format } from "date-fns";

interface CustomerRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  isAdmin: boolean;
  orderCount: number;
  spend: number;
}

const AdminCustomers = () => {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const [{ data: profiles }, { data: roles }, { data: orders }] = await Promise.all([
      supabase.from("profiles").select("id, email, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("orders").select("user_id, total, status"),
    ]);

    const adminIds = new Set((roles ?? []).filter((r: any) => r.role === "admin").map((r: any) => r.user_id));
    const stats: Record<string, { count: number; spend: number }> = {};
    (orders ?? []).forEach((o: any) => {
      if (!o.user_id) return;
      if (!stats[o.user_id]) stats[o.user_id] = { count: 0, spend: 0 };
      stats[o.user_id].count += 1;
      if (!["cancelled", "pending_payment"].includes(o.status)) {
        stats[o.user_id].spend += Number(o.total);
      }
    });

    setRows(
      (profiles ?? []).map((p: any) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        created_at: p.created_at,
        isAdmin: adminIds.has(p.id),
        orderCount: stats[p.id]?.count ?? 0,
        spend: stats[p.id]?.spend ?? 0,
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleAdmin(row: CustomerRow) {
    if (row.isAdmin) {
      if (!confirm(`Remove admin access from ${row.email}?`)) return;
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", row.id)
        .eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin access removed");
    } else {
      if (!confirm(`Grant admin access to ${row.email}?`)) return;
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: row.id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin access granted");
    }
    void load();
  }

  const filtered = rows.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return r.email.toLowerCase().includes(s) || (r.full_name ?? "").toLowerCase().includes(s);
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
          Customers
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-2">
          {rows.length} {rows.length === 1 ? "person" : "people"}
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-sans text-sm text-muted-foreground">No customers found.</p>
        </div>
      ) : (
        <div className="border border-border">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/30 font-sans text-xs tracking-wide uppercase text-muted-foreground">
            <div className="col-span-4">Customer</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Orders</div>
            <div className="col-span-2 text-right">Spend</div>
            <div className="col-span-3 text-right">Role</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-12 md:col-span-4 min-w-0">
                  <p className="font-sans text-sm truncate">{r.full_name || "—"}</p>
                  <p className="font-sans text-xs text-muted-foreground truncate">{r.email}</p>
                </div>
                <p className="col-span-6 md:col-span-2 font-sans text-xs text-muted-foreground">
                  {format(new Date(r.created_at), "MMM d, yyyy")}
                </p>
                <p className="col-span-2 md:col-span-1 font-sans text-sm md:text-right">
                  {r.orderCount}
                </p>
                <p className="col-span-4 md:col-span-2 font-sans text-sm md:text-right">
                  ${r.spend.toFixed(2)}
                </p>
                <div className="col-span-12 md:col-span-3 flex md:justify-end">
                  <button
                    onClick={() => toggleAdmin(r)}
                    className={`inline-flex items-center gap-2 font-sans text-xs tracking-wide uppercase px-3 py-2 border ${
                      r.isAdmin ? "border-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.isAdmin ? <Shield className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                    {r.isAdmin ? "Admin" : "Customer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
