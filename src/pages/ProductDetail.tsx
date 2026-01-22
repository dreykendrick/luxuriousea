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
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop",
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
  materials: "80% Organic Cotton, 20% Recycled Polyester",
  care: "Machine wash cold with like colors. Tumble dry low. Do not bleach.",
  fit: "Relaxed, oversized fit. Model is 6'1\" wearing size M.",
  meaning: "The Mindful Hoodie represents our commitment to conscious living. The subtle embroidered details are inspired by ancient symbols of inner peace, reminding you to stay present in every moment.",
  shipping: "Free shipping on orders over $150. Estimated delivery: 3-5 business days.",
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
    if (currentStock === 0) return { text: "Out of Stock", color: "text-destructive" };
    if (currentStock <= 3) return { text: `Only ${currentStock} left`, color: "text-accent" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const stockLabel = getStockLabel();

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (currentStock === 0) {
      toast.error("This item is out of stock");
      return;
    }
    toast.success("Added to bag", {
      description: `${productData.name} - ${selectedColor.name} / ${selectedSize}`,
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
      <div className="pt-20 lg:pt-24 pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/shop" className="hover:text-foreground transition-colors">
                  Shop
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{productData.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image gallery */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                <img
                  src={productData.images[currentImageIndex]}
                  alt={productData.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Thumbnail row */}
              <div className="flex gap-2">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-[3/4] w-20 overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-foreground" : "border-transparent"
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

            {/* Product info */}
            <div className="lg:py-4">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground tracking-widest uppercase mb-2">
                  {productData.category}
                </p>
                <h1 className="font-serif text-3xl lg:text-4xl mb-4">{productData.name}</h1>
                <p className="text-2xl">${productData.price}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {productData.description}
              </p>

              {/* Color selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">
                  Color: <span className="font-normal text-muted-foreground">{selectedColor.name}</span>
                </label>
                <div className="flex gap-3">
                  {productData.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name
                          ? "border-foreground scale-110"
                          : "border-border hover:border-muted-foreground"
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
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Size</label>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground">
                    Size Guide
                  </button>
                </div>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
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
                  <p className={`text-sm mt-2 ${stockLabel.color}`}>{stockLabel.text}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock || 10, q + 1))}
                      className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                      disabled={quantity >= currentStock && currentStock > 0}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to bag + Wishlist */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={handleAddToBag}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase"
                  disabled={currentStock === 0 && selectedSize !== ""}
                >
                  {currentStock === 0 && selectedSize !== "" ? "Out of Stock" : "Add to Bag"}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </div>

              {/* Shipping note */}
              <p className="text-sm text-muted-foreground border-t border-border pt-6 mb-8">
                {productData.shipping}
              </p>

              {/* Product details accordion */}
              <Accordion type="single" collapsible className="border-t border-border">
                <AccordionItem value="meaning">
                  <AccordionTrigger className="text-sm tracking-widest uppercase">
                    The Meaning Behind This Piece
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed font-serif italic">
                      {productData.meaning}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="materials">
                  <AccordionTrigger className="text-sm tracking-widest uppercase">
                    Materials & Fit
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-muted-foreground">
                      <p><strong>Materials:</strong> {productData.materials}</p>
                      <p><strong>Fit:</strong> {productData.fit}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                  <AccordionTrigger className="text-sm tracking-widest uppercase">
                    Care Instructions
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{productData.care}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-sm tracking-widest uppercase">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-muted-foreground">
                      <p>{productData.shipping}</p>
                      <p>
                        We accept returns within 30 days of delivery.{" "}
                        <Link to="/shipping-returns" className="underline hover:text-foreground">
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

        {/* Sticky mobile add to bag */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-40">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-medium">{productData.name}</p>
              <p className="text-muted-foreground">${productData.price}</p>
            </div>
            <Button
              onClick={handleAddToBag}
              className="px-8 h-12 bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase"
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
