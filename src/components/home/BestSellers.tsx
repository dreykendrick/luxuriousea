import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sample best sellers - will be replaced with real data
const bestSellers = [
  {
    id: "5",
    name: "Essence Premium Tee",
    price: 79,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90",
    slug: "essence-premium-tee",
  },
  {
    id: "6",
    name: "Tranquil Crewneck",
    price: 135,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90",
    slug: "tranquil-crewneck",
  },
  {
    id: "7",
    name: "Harmony Set",
    price: 220,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop&q=90",
    slug: "harmony-set",
  },
];

export function BestSellers() {
  return (
    <section className="py-32 lg:py-44 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Centered editorial header */}
        <div className="text-center mb-16 lg:mb-24">
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Most Loved
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light" style={{ letterSpacing: "-0.02em" }}>
            Best Sellers
          </h2>
        </div>

        {/* Large 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {bestSellers.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group animate-editorial-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-background mb-8 image-zoom-luxury">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-serif text-xl lg:text-2xl font-light group-hover:text-muted-foreground transition-colors duration-500">
                  {product.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Elegant CTA */}
        <div className="text-center mt-20">
          <Link
            to="/shop?sort=best-sellers"
            className="inline-flex items-center text-xs font-sans tracking-ultra uppercase hover:text-muted-foreground transition-colors duration-500 group elegant-underline pb-1"
          >
            Shop All Best Sellers
            <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
