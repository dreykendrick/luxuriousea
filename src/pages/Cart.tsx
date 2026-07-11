import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 15;

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="pt-32 lg:pt-40 pb-24 min-h-screen">
          <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center py-16">
            <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
              Your Bag
            </p>
            <h1
              className="font-serif text-4xl lg:text-5xl font-light mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Your Bag is Empty
            </h1>
            <p className="font-sans text-base text-muted-foreground mb-10">
              Begin your journey through the collection.
            </p>
            <Button
              asChild
              className="bg-foreground hover:bg-foreground/90 text-background h-14 px-10 text-xs tracking-ultra uppercase font-sans font-normal"
            >
              <Link to="/shop">
                Explore Collection
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <p className="font-sans text-xs tracking-ultra uppercase text-muted-foreground mb-4">
              Your Bag
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl font-light" style={{ letterSpacing: "-0.02em" }}>
              Shopping Bag
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="border border-border p-4 mb-8">
                  <p className="font-sans text-sm text-center">
                    Add <span className="text-foreground">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</span>{" "}
                    for complimentary shipping
                  </p>
                  <div className="mt-3 h-px bg-border relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-foreground transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="divide-y divide-border border-t border-border">
                {items.map((i) => (
                  <div key={i.variantId} className="py-8 flex gap-6">
                    <Link
                      to={`/product/${i.productSlug}`}
                      className="w-24 lg:w-32 aspect-[3/4] bg-secondary overflow-hidden shrink-0"
                    >
                      {i.image && (
                        <img src={i.image} alt={i.productName} className="w-full h-full object-contain" />
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${i.productSlug}`}
                            className="font-serif text-lg font-light hover:text-muted-foreground transition-colors truncate block"
                          >
                            {i.productName}
                          </Link>
                          <p className="font-sans text-xs text-muted-foreground mt-2">
                            {[i.color, i.size].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(i.variantId)}
                          className="text-muted-foreground hover:text-foreground transition-colors h-fit"
                          aria-label="Remove"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between mt-6">
                        <div className="inline-flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(i.variantId, i.quantity - 1)}
                            className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center font-sans text-sm">{i.quantity}</span>
                          <button
                            onClick={() => updateQuantity(i.variantId, i.quantity + 1)}
                            className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-sans text-base">${(i.price * i.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link
                  to="/shop"
                  className="inline-flex items-center font-sans text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 border border-border p-8 bg-secondary/20">
                <h2 className="font-serif text-xl font-light mb-8">Order Summary</h2>
                <div className="space-y-4 font-sans text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full mt-8 h-14 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal"
                >
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
                <p className="font-sans text-xs text-muted-foreground text-center mt-4">
                  Secure checkout · Stripe
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
