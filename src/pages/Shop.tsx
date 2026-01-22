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
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90",
    category: "T-Shirts",
    color: "White",
    slug: "serenity-oversized-tee",
    isNew: true,
  },
  {
    id: "2",
    name: "Mindful Hoodie",
    price: 165,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=90",
    category: "Hoodies",
    color: "Black",
    slug: "mindful-hoodie",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Purpose Sweatshirt",
    price: 145,
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop&q=90",
    category: "Sweatshirts",
    color: "Gray",
    slug: "purpose-sweatshirt",
  },
  {
    id: "4",
    name: "Gratitude Joggers",
    price: 125,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop&q=90",
    category: "Pants",
    color: "Black",
    slug: "gratitude-joggers",
  },
  {
    id: "5",
    name: "Essence Premium Tee",
    price: 79,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90",
    category: "T-Shirts",
    color: "Black",
    slug: "essence-premium-tee",
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Tranquil Crewneck",
    price: 135,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90",
    category: "Sweatshirts",
    color: "Beige",
    slug: "tranquil-crewneck",
  },
  {
    id: "7",
    name: "Harmony Set",
    price: 220,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop&q=90",
    category: "Sets",
    color: "Gray",
    slug: "harmony-set",
    isNew: true,
  },
  {
    id: "8",
    name: "Presence Cap",
    price: 45,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop&q=90",
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
    <div className="space-y-10">
      {/* Categories */}
      <div>
        <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-6">
          Category
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left py-1.5 font-sans text-sm transition-colors duration-300 ${
                selectedCategory === category
                  ? "text-foreground"
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
        <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-6">
          Color
        </h3>
        <div className="space-y-4">
          {colors.map((color) => (
            <label key={color} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
                className="border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
              />
              <span className="font-sans text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {color}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-6">
          Price
        </h3>
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedPriceRange(range)}
              className={`block w-full text-left py-1.5 font-sans text-sm transition-colors duration-300 ${
                selectedPriceRange === range
                  ? "text-foreground"
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
          {/* Page header */}
          <div className="mb-16 lg:mb-20">
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light mb-4" style={{ letterSpacing: "-0.02em" }}>
              Shop
            </h1>
            <p className="font-sans text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="flex gap-12 lg:gap-16">
            {/* Desktop filters */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <FilterContent />
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              {/* Mobile filter + Sort bar */}
              <div className="flex items-center justify-between gap-4 mb-10 lg:mb-14">
                {/* Mobile filter button */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="lg:hidden h-12 text-xs tracking-ultra uppercase font-sans font-normal"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 h-5 w-5 text-[10px] bg-foreground text-background rounded-full flex items-center justify-center">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm overflow-y-auto border-r-0">
                    <SheetHeader>
                      <SheetTitle className="font-serif text-xl font-light">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-10">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort dropdown */}
                <div className="flex items-center gap-3 ml-auto">
                  <span className="font-sans text-xs text-muted-foreground hidden sm:inline tracking-wide uppercase">
                    Sort
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px] h-12 font-sans text-sm border-border">
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
                <div className="flex flex-wrap gap-2 mb-10">
                  {selectedCategory !== "All" && (
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary font-sans text-xs tracking-wide hover:bg-secondary/80 transition-colors duration-300"
                    >
                      {selectedCategory}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {selectedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary font-sans text-xs tracking-wide hover:bg-secondary/80 transition-colors duration-300"
                    >
                      {color}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                  {selectedPriceRange !== priceRanges[0] && (
                    <button
                      onClick={() => setSelectedPriceRange(priceRanges[0])}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary font-sans text-xs tracking-wide hover:bg-secondary/80 transition-colors duration-300"
                    >
                      {selectedPriceRange.label}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Products grid - larger images, simpler cards */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group animate-editorial-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-5 image-zoom-luxury">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-serif text-base lg:text-lg font-light group-hover:text-muted-foreground transition-colors duration-500">
                          {product.name}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground">
                          ${product.price}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="font-sans text-muted-foreground mb-6">No pieces match your selection</p>
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="h-12 px-8 text-xs tracking-ultra uppercase font-sans font-normal"
                  >
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
