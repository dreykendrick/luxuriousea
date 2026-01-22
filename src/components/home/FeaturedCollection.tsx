import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample featured products - will be replaced with real data
const featuredProducts = [
  {
    id: "1",
    name: "Serenity Oversized Tee",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90",
    slug: "serenity-oversized-tee",
  },
  {
    id: "2",
    name: "Mindful Hoodie",
    price: 165,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=90",
    slug: "mindful-hoodie",
  },
  {
    id: "3",
    name: "Purpose Sweatshirt",
    price: 145,
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop&q=90",
    slug: "purpose-sweatshirt",
  },
  {
    id: "4",
    name: "Gratitude Joggers",
    price: 125,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop&q=90",
    slug: "gratitude-joggers",
  },
];

export function FeaturedCollection() {
  return (
    <section className="py-32 lg:py-44 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Editorial section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-24">
          <div>
            <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
              New Season
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light" style={{ letterSpacing: "-0.02em" }}>
              Featured
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center text-xs font-sans tracking-ultra uppercase text-muted-foreground hover:text-foreground transition-colors duration-500 group"
          >
            View All
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Refined product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group animate-editorial-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-6 image-zoom-luxury">
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
      </div>
    </section>
  );
}
