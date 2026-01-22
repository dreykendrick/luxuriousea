import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

// Sample products data - will be replaced with real data from database
const allProducts = [
  {
    id: "1",
    name: "Serenity Oversized Tee",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
    category: "T-Shirts",
    color: "White",
    slug: "serenity-oversized-tee",
    isNew: true,
  },
  {
    id: "2",
    name: "Mindful Hoodie",
    price: 165,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop",
    category: "Hoodies",
    color: "Black",
    slug: "mindful-hoodie",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Purpose Sweatshirt",
    price: 145,
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&h=750&fit=crop",
    category: "Sweatshirts",
    color: "Gray",
    slug: "purpose-sweatshirt",
  },
  {
    id: "4",
    name: "Gratitude Joggers",
    price: 125,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=750&fit=crop",
    category: "Pants",
    color: "Black",
    slug: "gratitude-joggers",
  },
  {
    id: "5",
    name: "Essence Premium Tee",
    price: 79,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop",
    category: "T-Shirts",
    color: "Black",
    slug: "essence-premium-tee",
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Tranquil Crewneck",
    price: 135,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=750&fit=crop",
    category: "Sweatshirts",
    color: "Beige",
    slug: "tranquil-crewneck",
  },
  {
    id: "7",
    name: "Harmony Set",
    price: 220,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    category: "Sets",
    color: "Gray",
    slug: "harmony-set",
    isNew: true,
  },
  {
    id: "8",
    name: "Presence Cap",
    price: 45,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=750&fit=crop",
    category: "Accessories",
    color: "Black",
    slug: "presence-cap",
  },
];

const categories = ["All", "T-Shirts", "Hoodies", "Sweatshirts", "Pants", "Sets", "Accessories"];
const colors = ["White", "Black", "Gray", "Beige"];
const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $150", min: 100, max: 150 },
  { label: "$150 - $200", min: 150, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      products = products.filter((p) => selectedColors.includes(p.color));
    }

    // Filter by price
    products = products.filter(
      (p) => p.price >= selectedPriceRange.min && p.price < selectedPriceRange.max
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "best-sellers":
        products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "newest":
      default:
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return products;
  }, [selectedCategory, selectedColors, selectedPriceRange, sortBy]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedColors([]);
    setSelectedPriceRange(priceRanges[0]);
  };

  const hasActiveFilters =
    selectedCategory !== "All" || selectedColors.length > 0 || selectedPriceRange !== priceRanges[0];

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-sm tracking-widest uppercase mb-4">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left py-2 text-sm transition-colors ${
                selectedCategory === category
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-medium text-sm tracking-widest uppercase mb-4">Color</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <label key={color} className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-medium text-sm tracking-widest uppercase mb-4">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedPriceRange(range)}
              className={`block w-full text-left py-2 text-sm transition-colors ${
                selectedPriceRange === range
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="font-serif text-3xl lg:text-4xl mb-2">Shop All</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {/* Desktop filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterContent />
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {/* Mobile filter + Sort bar */}
              <div className="flex items-center justify-between gap-4 mb-6 lg:mb-8">
                {/* Mobile filter button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 text-xs bg-accent text-accent-foreground rounded-full flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort dropdown */}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
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

              {/* Active filters pills */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80"
                    >
                      {selectedCategory}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {selectedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80"
                    >
                      {color}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedPriceRange !== priceRanges[0] && (
                    <button
                      onClick={() => setSelectedPriceRange(priceRanges[0])}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm rounded-full hover:bg-secondary/80"
                    >
                      {selectedPriceRange.label}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Products grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-accent text-accent-foreground text-xs tracking-widest uppercase px-2.5 py-1">
                              New
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="bg-primary text-primary-foreground text-xs tracking-widest uppercase px-2.5 py-1">
                              Best Seller
                            </span>
                          )}
                        </div>
                        {/* Quick view overlay */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                          <span className="text-xs tracking-widest uppercase text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/80 px-4 py-2">
                            View
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground tracking-wide uppercase">
                          {product.category}
                        </p>
                        <h3 className="font-medium text-sm lg:text-base group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No products match your filters</p>
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
