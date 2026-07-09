import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { fetchProducts, fetchCategories, Product } from "@/lib/products";
import { toast } from "sonner";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $150", min: 100, max: 150 },
  { label: "$150 – $200", min: 150, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const initialSort = searchParams.get("sort") ?? "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Extract color list from all products (from images/variants would be ideal; using product name inference isn't reliable)
  // We infer available colors from a separate fetch if needed. For now, allow filter but keep it minimal.

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "all") list = list.filter((p) => p.category?.slug === selectedCategory);
    list = list.filter(
      (p) => Number(p.base_price) >= selectedPriceRange.min && Number(p.base_price) < selectedPriceRange.max
    );
    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case "price-high":
        list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      case "best-sellers":
        list.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      case "newest":
      default:
        list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    }
    return list;
  }, [products, selectedCategory, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedColors([]);
    setSelectedPriceRange(priceRanges[0]);
  };

  const hasActive =
    selectedCategory !== "all" || selectedColors.length > 0 || selectedPriceRange !== priceRanges[0];

  const FilterContent = () => (
    <div className="space-y-10">
      <div>
        <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-6">
          Category
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`block w-full text-left py-1.5 font-sans text-sm transition-colors ${
              selectedCategory === "all" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`block w-full text-left py-1.5 font-sans text-sm transition-colors ${
                selectedCategory === c.slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-6">
          Price
        </h3>
        <div className="space-y-3">
          {priceRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => setSelectedPriceRange(r)}
              className={`block w-full text-left py-1.5 font-sans text-sm transition-colors ${
                selectedPriceRange === r ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {hasActive && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full h-12 text-xs tracking-ultra uppercase font-sans font-normal"
        >
          Clear All
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-16 lg:mb-20">
            <h1
              className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Shop
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              {loading ? "..." : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}
            </p>
          </div>

          <div className="flex gap-12 lg:gap-16">
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <FilterContent />
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-10 lg:mb-14">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden h-12 text-xs tracking-ultra uppercase font-sans font-normal">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="font-serif text-xl font-light">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-10">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-3 ml-auto">
                  <span className="font-sans text-xs text-muted-foreground hidden sm:inline tracking-wide uppercase">Sort</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] h-12 font-sans text-sm border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="best-sellers">Best Sellers</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-secondary mb-5" />
                      <div className="h-4 bg-secondary w-2/3 mb-2" />
                      <div className="h-4 bg-secondary w-1/3" />
                    </div>
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filtered.map((product, idx) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group animate-editorial-fade-up"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-5 image-zoom-luxury">
                        {product.product_images?.[0]?.url && (
                          <img
                            src={product.product_images[0].url}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-base lg:text-lg font-light group-hover:text-muted-foreground transition-colors duration-500">
                          {product.name}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground">
                          ${Number(product.base_price).toFixed(0)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="font-sans text-muted-foreground mb-6">No pieces match your selection</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
