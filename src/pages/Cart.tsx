import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ArrowRight } from "lucide-react";

// Sample cart data - will be managed by state/context later
const initialCartItems = [
  {
    id: "1",
    name: "Mindful Hoodie",
    price: 165,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop",
    color: "Black",
    size: "M",
    quantity: 1,
    slug: "mindful-hoodie",
  },
  {
    id: "2",
    name: "Essence Premium Tee",
    price: 79,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&h=400&fit=crop",
    color: "Black",
    size: "L",
    quantity: 2,
    slug: "essence-premium-tee",
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThreshold = 150;
  const shipping = subtotal >= shippingThreshold ? 0 : 15;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="pt-24 lg:pt-28 pb-16 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center py-16">
              <h1 className="font-serif text-3xl lg:text-4xl mb-4">Your Bag is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added anything to your bag yet.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/shop">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl lg:text-4xl mb-8 lg:mb-12">Shopping Bag</h1>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2">
              {/* Free shipping progress */}
              {subtotal < shippingThreshold && (
                <div className="bg-secondary/50 p-4 mb-6">
                  <p className="text-sm text-center">
                    Add <span className="font-medium">${shippingThreshold - subtotal}</span> more for{" "}
                    <span className="font-medium">free shipping</span>
                  </p>
                  <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items list */}
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 first:pt-0">
                    <div className="flex gap-4 lg:gap-6">
                      {/* Image */}
                      <Link
                        to={`/product/${item.slug}`}
                        className="relative w-24 lg:w-32 aspect-[3/4] bg-secondary flex-shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${item.slug}`}
                              className="font-medium hover:text-accent transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.color} / {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors h-fit"
                          >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-medium">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  to="/shop"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 p-6 lg:p-8 sticky top-24">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>

                {/* Promo code */}
                <div className="mb-6">
                  <label className="block text-sm mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1"
                    />
                    <Button variant="outline" disabled={!promoCode}>
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border text-base font-medium">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Button
                  asChild
                  className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase"
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>

                {/* Security note */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
