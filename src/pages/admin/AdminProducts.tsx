import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Edit2 } from "lucide-react";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  is_active: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_featured: boolean;
  category: { name: string } | null;
  product_variants: { stock: number }[];
  product_images: { url: string }[];
}

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        `id, slug, name, base_price, is_active, is_new, is_best_seller, is_featured,
         category:categories(name),
         product_variants(stock),
         product_images(url)`
      )
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProducts((data ?? []) as any);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(current ? "Product hidden" : "Product published");
    void load();
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-serif text-3xl lg:text-4xl font-light" style={{ letterSpacing: "-0.02em" }}>
            Products
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <Button asChild className="bg-foreground hover:bg-foreground/90 text-background h-12 px-6 font-sans text-xs tracking-ultra uppercase">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Link>
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground font-sans text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <p className="font-sans text-sm text-muted-foreground mb-4">No products found</p>
          <Button asChild variant="outline">
            <Link to="/admin/products/new">Create your first product</Link>
          </Button>
        </div>
      ) : (
        <div className="border border-border">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary/30 font-sans text-xs tracking-wide uppercase text-muted-foreground">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-right">Price</div>
            <div className="col-span-2 text-right">Stock</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((p) => {
              const totalStock = p.product_variants.reduce((s, v) => s + v.stock, 0);
              return (
                <div key={p.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
                    {p.product_images[0] ? (
                      <div className="w-12 aspect-[3/4] bg-secondary overflow-hidden shrink-0">
                        <img src={p.product_images[0].url} alt="" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 aspect-[3/4] bg-secondary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="font-sans text-sm hover:underline block truncate"
                      >
                        {p.name}
                      </Link>
                      <p className="font-sans text-xs text-muted-foreground truncate">{p.slug}</p>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-2 font-sans text-sm text-muted-foreground">
                    {p.category?.name ?? "—"}
                  </div>
                  <div className="col-span-2 md:col-span-1 font-sans text-sm md:text-right">
                    ${Number(p.base_price).toFixed(0)}
                  </div>
                  <div
                    className={`col-span-3 md:col-span-2 font-sans text-sm md:text-right ${
                      totalStock === 0 ? "text-destructive" : totalStock < 10 ? "text-accent" : ""
                    }`}
                  >
                    {totalStock}
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center gap-2 md:justify-end">
                    <button
                      onClick={() => toggleActive(p.id, p.is_active)}
                      className={`font-sans text-xs tracking-wide uppercase px-2 py-1 border ${
                        p.is_active ? "border-foreground" : "border-border text-muted-foreground"
                      }`}
                    >
                      {p.is_active ? "Live" : "Hidden"}
                    </button>
                    <Link
                      to={`/admin/products/${p.id}`}
                      className="p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
