import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample best sellers - will be replaced with real data
const bestSellers = [
  {
    id: "5",
    name: "Essence Premium Tee",
    price: 79,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=750&fit=crop",
    category: "T-Shirts",
    slug: "essence-premium-tee",
    badge: "Best Seller",
  },
  {
    id: "6",
    name: "Tranquil Crewneck",
    price: 135,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=750&fit=crop",
    category: "Sweatshirts",
    slug: "tranquil-crewneck",
    badge: "Best Seller",
  },
  {
    id: "7",
    name: "Harmony Set",
    price: 220,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop",
    category: "Sets",
    slug: "harmony-set",
    badge: "Top Rated",
  },
];

export function BestSellers() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-light tracking-ultra uppercase text-accent mb-2">
            Most Loved
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl mb-4">Best Sellers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our most cherished pieces, chosen by the E & A community
          </p>
        </div>

        {/* Product grid - 3 columns for best sellers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {bestSellers.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs tracking-widest uppercase px-3 py-1.5">
                    {product.badge}
                  </span>
                )}
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground tracking-wide uppercase">
                  {product.category}
                </p>
                <h3 className="font-serif text-lg lg:text-xl group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/shop?sort=best-sellers"
            className="inline-flex items-center text-sm tracking-widest uppercase hover:text-accent transition-colors group"
          >
            Shop All Best Sellers
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
