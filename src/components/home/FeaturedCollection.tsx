import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample featured products - will be replaced with real data
const featuredProducts = [
  {
    id: "1",
    name: "Serenity Oversized Tee",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
    category: "T-Shirts",
    slug: "serenity-oversized-tee",
  },
  {
    id: "2",
    name: "Mindful Hoodie",
    price: 165,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop",
    category: "Hoodies",
    slug: "mindful-hoodie",
  },
  {
    id: "3",
    name: "Purpose Sweatshirt",
    price: 145,
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&h=750&fit=crop",
    category: "Sweatshirts",
    slug: "purpose-sweatshirt",
  },
  {
    id: "4",
    name: "Gratitude Joggers",
    price: 125,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=750&fit=crop",
    category: "Pants",
    slug: "gratitude-joggers",
  },
];

export function FeaturedCollection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-light tracking-ultra uppercase text-accent mb-2">
              New Season
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl">Featured Collection</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-sm tracking-widest uppercase text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/80 px-4 py-2">
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
                <p className="text-sm text-muted-foreground">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
