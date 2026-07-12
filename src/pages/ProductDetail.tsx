import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, Minus, Plus, Heart } from "lucide-react";
import { toast } from "sonner";
import { fetchProductBySlug, Product } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    void (async () => {
      try {
        const p = await fetchProductBySlug(slug);
        if (!p) {
          setNotFound(true);
        } else {
          setProduct(p);
          const firstColor = p.product_variants?.find((v) => v.is_active)?.color ?? null;
          setSelectedColor(firstColor);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const colors = useMemo(() => {
    if (!product?.product_variants) return [];
    const seen = new Map<string, string | null>();
    product.product_variants.forEach((v) => {
      if (v.is_active && v.color && !seen.has(v.color)) {
        seen.set(v.color, v.color_hex);
      }
    });
    return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product?.product_variants) return [];
    return product.product_variants
      .filter((v) => v.is_active && (!selectedColor || v.color === selectedColor))
      .map((v) => v.size)
      .filter((s): s is string => !!s);
  }, [product, selectedColor]);

  const currentVariant = useMemo(() => {
    if (!product?.product_variants) return null;
    return product.product_variants.find(
      (v) =>
        v.is_active &&
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || v.size === selectedSize)
    );
  }, [product, selectedColor, selectedSize]);

  const currentStock = currentVariant?.stock ?? 0;
  const price = currentVariant?.price_override ?? product?.base_price ?? 0;

  const isPreorderMode = !!product?.is_preorder || (selectedSize !== null && currentStock === 0);

  const stockLabel = useMemo(() => {
    if (!selectedSize) return null;
    if (isPreorderMode) return { text: "Pre-order Available", colorClass: "text-amber-600 dark:text-amber-400" };
    if (currentStock < 2) return { text: "Low stock", colorClass: "text-amber-600 dark:text-amber-400 font-medium" };
    return { text: "Available", colorClass: "text-muted-foreground" };
  }, [selectedSize, currentStock, isPreorderMode]);

  function handleAdd() {
    if (!product) return;
    if (colors.length > 0 && !selectedColor) return toast.error("Please select a color");
    if (availableSizes.length > 0 && !selectedSize) return toast.error("Please select a size");
    if (!currentVariant) return toast.error("Selection unavailable");
    addItem(
      {
        variantId: currentVariant.id,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        size: currentVariant.size,
        color: currentVariant.color,
        price: Number(price),
        image: product.product_images?.[0]?.url ?? null,
      },
      quantity
    );
    toast.success(isPreorderMode ? "Pre-order added to bag" : "Added to bag", {
      description: `${product.name}${
        currentVariant.color || currentVariant.size
          ? " — " + [currentVariant.color, currentVariant.size].filter(Boolean).join(", ")
          : ""
      }`,
    });
  }

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 lg:pt-40 pb-24 container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
            <div className="aspect-[4/5] bg-secondary" />
            <div className="space-y-6">
              <div className="h-4 bg-secondary w-24" />
              <div className="h-12 bg-secondary w-2/3" />
              <div className="h-8 bg-secondary w-24" />
              <div className="h-24 bg-secondary" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !product) {
    return (
      <Layout>
        <div className="pt-32 lg:pt-40 pb-24 container mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl font-light mb-4">Piece Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const images = product.product_images ?? [];

  return (
    <Layout>
      <div className="pt-28 lg:pt-32 pb-24 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-8">
          <nav className="mb-12 lg:mb-16">
            <ol className="flex items-center gap-2 font-sans text-xs tracking-wide text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li className="text-muted-foreground/50">/</li>
              <li><Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link></li>
              <li className="text-muted-foreground/50">/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] bg-secondary overflow-hidden image-zoom-luxury">
                {images[imgIdx] && (
                  <img
                    src={images[imgIdx].url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setImgIdx(i)}
                      className={`relative aspect-[4/5] w-20 overflow-hidden transition-opacity duration-300 ${
                        i === imgIdx ? "opacity-100" : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      <img src={img.url} alt="" className="absolute inset-0 w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <div className="mb-10">
                {product.category && (
                  <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                    {product.category.name}
                  </p>
                )}
                {product.is_preorder && (
                  <span className="inline-block font-sans text-[10px] tracking-widest uppercase bg-amber-800/90 text-white px-3 py-1 mb-4">
                    ✦ Pre-order
                  </span>
                )}
                <h1
                  className="font-serif text-3xl lg:text-4xl xl:text-5xl font-light mb-5"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {product.name}
                </h1>
                <p className="font-sans text-xl lg:text-2xl font-light">${Number(price).toFixed(0)}</p>
              </div>

              {product.description && (
                <p className="font-sans text-base font-light text-muted-foreground leading-relaxed mb-12">
                  {product.description}
                </p>
              )}

              {colors.length > 0 && (
                <div className="mb-8">
                  <label className="block font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                    Color — {selectedColor ?? "Select"}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedColor(c.name);
                          setSelectedSize(null);
                        }}
                        className={`w-12 h-12 rounded-full transition-all duration-300 ${
                          selectedColor === c.name
                            ? "ring-2 ring-foreground ring-offset-4 ring-offset-background"
                            : "hover:ring-1 hover:ring-muted-foreground hover:ring-offset-2 hover:ring-offset-background"
                        }`}
                        style={{ backgroundColor: c.hex ?? "#ccc" }}
                        title={c.name}
                      >
                        <span className="sr-only">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="mb-8">
                  <label className="block font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                    Size
                  </label>
                  <Select value={selectedSize ?? undefined} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full h-14 font-sans text-sm border-border">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSizes.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {stockLabel && (
                    <p className={`font-sans text-xs mt-3 ${stockLabel.colorClass}`}>
                      {stockLabel.text}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-10">
                <label className="block font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-14 w-14 flex items-center justify-center hover:bg-secondary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-sans text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                    className="h-14 w-14 flex items-center justify-center hover:bg-secondary transition-colors"
                    disabled={currentStock > 0 && quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-10">
                <Button
                  onClick={handleAdd}
                  className={`flex-1 h-14 text-xs tracking-ultra uppercase font-sans font-normal transition-all duration-300 ${
                    isPreorderMode
                      ? "bg-amber-800 hover:bg-amber-700 text-white"
                      : "bg-foreground hover:bg-foreground/90 text-background"
                  }`}
                  disabled={false}
                >
                  {isPreorderMode ? "Pre-order Now" : "Add to Bag"}
                </Button>
                <Button variant="outline" size="icon" className="h-14 w-14 border-border hover:bg-secondary">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <p className="font-sans text-xs text-muted-foreground border-t border-border pt-8 mb-10">
                {isPreorderMode
                  ? "Pre-order secured. Ships when available — we'll notify you with tracking details."
                  : "Estimated delivery: 3–5 business days."}
              </p>

              <Accordion type="single" collapsible className="border-t border-border">
                {product.meaning && (
                  <AccordionItem value="meaning" className="border-b border-border">
                    <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                      The Intention Behind This Piece
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-serif text-base italic text-muted-foreground leading-relaxed pb-4">
                        "{product.meaning}"
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {(product.fabric || product.fit) && (
                  <AccordionItem value="craft" className="border-b border-border">
                    <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                      Craft & Materials
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 font-sans text-sm text-muted-foreground pb-4">
                        {product.fabric && (
                          <p><span className="text-foreground">Fabric:</span> {product.fabric}</p>
                        )}
                        {product.fit && (
                          <p><span className="text-foreground">Fit:</span> {product.fit}</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {product.care && (
                  <AccordionItem value="care" className="border-b border-border">
                    <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                      Care Instructions
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="font-sans text-sm text-muted-foreground pb-4">{product.care}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 font-sans text-sm text-muted-foreground pb-4">
                      <p>Estimated delivery: 3–5 business days.</p>
                      <p>All purchases are final. You cannot return the product once bought.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Sticky mobile add to bag */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border p-5 lg:hidden z-40">
          <div className="flex items-center gap-5">
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-light truncate">{product.name}</p>
              <p className="font-sans text-sm text-muted-foreground">${Number(price).toFixed(0)}</p>
            </div>
            <Button
              onClick={handleAdd}
              className="px-8 h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
              disabled={selectedSize !== null && currentStock === 0}
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
