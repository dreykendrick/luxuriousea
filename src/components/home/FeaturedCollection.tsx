import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchProducts, Product } from "@/lib/products";

export function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const p = await fetchProducts({ featured: true });
        setProducts(p.slice(0, 4));
      } catch {
        // silent
      }
    })();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-32 lg:py-44 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16 lg:mb-24">
          <div>
            <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
              New Season
            </p>
            <h2
              className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light"
              style={{ letterSpacing: "-0.02em" }}
            >
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className="group animate-editorial-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-6 image-zoom-luxury">
                {product.product_images?.[0]?.url && (
                  <img
                    src={product.product_images[0].url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain"
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
      </div>
    </section>
  );
}
