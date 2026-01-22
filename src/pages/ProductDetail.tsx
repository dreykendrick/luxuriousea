import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, Minus, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

// Sample product data - will be replaced with real data
const productData = {
  id: "2",
  name: "Mindful Hoodie",
  price: 165,
  description: "Our signature hoodie, designed for those who seek comfort with intention. Crafted from premium organic cotton blend, this piece embodies the perfect balance of luxury and mindfulness.",
  images: [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&h=1250&fit=crop&q=90",
    "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=1000&h=1250&fit=crop&q=90",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&h=1250&fit=crop&q=90",
  ],
  category: "Hoodies",
  colors: [
    { name: "Black", value: "#1a1a1a" },
    { name: "Charcoal", value: "#36454f" },
    { name: "Stone", value: "#d4c4b0" },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  stock: {
    "Black-XS": 3,
    "Black-S": 8,
    "Black-M": 12,
    "Black-L": 6,
    "Black-XL": 4,
    "Black-XXL": 2,
    "Charcoal-S": 5,
    "Charcoal-M": 7,
    "Charcoal-L": 3,
    "Stone-M": 0,
    "Stone-L": 2,
  } as Record<string, number>,
  craft: {
    fabric: "80% Organic Cotton, 20% Recycled Polyester",
    fit: "Relaxed, oversized silhouette. Model is 6'1\" wearing size M.",
    care: "Machine wash cold with like colors. Tumble dry low. Do not bleach.",
  },
  meaning: "The Mindful Hoodie represents our commitment to conscious living. The subtle embroidered details are inspired by ancient symbols of inner peace, reminding you to stay present in every moment.",
  shipping: "Complimentary shipping on orders over $150. Estimated delivery: 3-5 business days.",
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const stockKey = `${selectedColor.name}-${selectedSize}`;
  const currentStock = productData.stock[stockKey] ?? 0;

  const getStockLabel = () => {
    if (!selectedSize) return null;
    if (currentStock === 0) return { text: "Currently Unavailable", subtle: true };
    if (currentStock <= 3) return { text: `Only ${currentStock} remaining`, subtle: false };
    return { text: "Available", subtle: true };
  };

  const stockLabel = getStockLabel();

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (currentStock === 0) {
      toast.error("This item is currently unavailable");
      return;
    }
    toast.success("Added to bag", {
      description: `${productData.name} — ${selectedColor.name}, ${selectedSize}`,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length);
  };

  return (
    <Layout>
      <div className="pt-28 lg:pt-32 pb-24 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-12 lg:mb-16">
            <ol className="flex items-center gap-2 font-sans text-xs tracking-wide text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground/50">/</li>
              <li>
                <Link to="/shop" className="hover:text-foreground transition-colors duration-300">
                  Shop
                </Link>
              </li>
              <li className="text-muted-foreground/50">/</li>
              <li className="text-foreground">{productData.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image gallery - dominant, editorial */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-[4/5] bg-secondary overflow-hidden image-zoom-luxury">
                <img
                  src={productData.images[currentImageIndex]}
                  alt={productData.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Minimal navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors duration-300"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors duration-300"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Thumbnail row */}
              <div className="flex gap-3">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-[4/5] w-20 overflow-hidden transition-opacity duration-300 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-50 hover:opacity-75"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${productData.name} ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info - refined spacing */}
            <div className="lg:py-8">
              <div className="mb-10">
                <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                  {productData.category}
                </p>
                <h1 
                  className="font-serif text-3xl lg:text-4xl xl:text-5xl font-light mb-5"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {productData.name}
                </h1>
                <p className="font-sans text-xl lg:text-2xl font-light">${productData.price}</p>
              </div>

              <p className="font-sans text-base font-light text-muted-foreground leading-relaxed mb-12">
                {productData.description}
              </p>

              {/* Color selection */}
              <div className="mb-8">
                <label className="block font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                  Color — {selectedColor.name}
                </label>
                <div className="flex gap-3">
                  {productData.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full transition-all duration-300 ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-foreground ring-offset-4 ring-offset-background"
                          : "hover:ring-1 hover:ring-muted-foreground hover:ring-offset-2 hover:ring-offset-background"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <span className="sr-only">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-sans text-xs tracking-ultra uppercase text-muted-foreground">
                    Size
                  </label>
                  <button className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 underline underline-offset-4">
                    Size Guide
                  </button>
                </div>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full h-14 font-sans text-sm border-border">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {productData.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stockLabel && (
                  <p className={`font-sans text-xs mt-3 ${stockLabel.subtle ? "text-muted-foreground" : "text-foreground"}`}>
                    {stockLabel.text}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-10">
                <label className="block font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-14 w-14 flex items-center justify-center hover:bg-secondary transition-colors duration-300"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-sans text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                    className="h-14 w-14 flex items-center justify-center hover:bg-secondary transition-colors duration-300"
                    disabled={quantity >= currentStock && currentStock > 0}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to bag + Wishlist */}
              <div className="flex gap-4 mb-10">
                <Button
                  onClick={handleAddToBag}
                  className="flex-1 h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal transition-all duration-500"
                  disabled={currentStock === 0 && selectedSize !== ""}
                >
                  {currentStock === 0 && selectedSize !== "" ? "Unavailable" : "Add to Bag"}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 border-border hover:bg-secondary"
                >
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </div>

              {/* Shipping note */}
              <p className="font-sans text-xs text-muted-foreground border-t border-border pt-8 mb-10">
                {productData.shipping}
              </p>

              {/* Product details accordion - editorial style */}
              <Accordion type="single" collapsible className="border-t border-border">
                <AccordionItem value="meaning" className="border-b border-border">
                  <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                    The Intention Behind This Piece
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-serif text-base italic text-muted-foreground leading-relaxed pb-4">
                      "{productData.meaning}"
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="craft" className="border-b border-border">
                  <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                    Craft & Materials
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 font-sans text-sm text-muted-foreground pb-4">
                      <p><span className="text-foreground">Fabric:</span> {productData.craft.fabric}</p>
                      <p><span className="text-foreground">Fit:</span> {productData.craft.fit}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care" className="border-b border-border">
                  <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="font-sans text-sm text-muted-foreground pb-4">{productData.craft.care}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="font-sans text-xs tracking-ultra uppercase py-6 hover:no-underline">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 font-sans text-sm text-muted-foreground pb-4">
                      <p>{productData.shipping}</p>
                      <p>
                        We accept returns within 30 days of delivery.{" "}
                        <Link to="/shipping-returns" className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors duration-300">
                          View full policy
                        </Link>
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Sticky mobile add to bag - refined */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border p-5 lg:hidden z-40">
          <div className="flex items-center gap-5">
            <div className="flex-1 min-w-0">
              <p className="font-serif text-base font-light truncate">{productData.name}</p>
              <p className="font-sans text-sm text-muted-foreground">${productData.price}</p>
            </div>
            <Button
              onClick={handleAddToBag}
              className="px-8 h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
              disabled={currentStock === 0 && selectedSize !== ""}
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
