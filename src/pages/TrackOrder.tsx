import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Truck, CheckCircle, Clock, Search } from "lucide-react";

// Sample order data for demo
const sampleOrder = {
  orderNumber: "EA-2024-001234",
  email: "customer@example.com",
  status: "shipped",
  items: [
    { name: "Mindful Hoodie", quantity: 1, color: "Black", size: "M" },
    { name: "Essence Premium Tee", quantity: 2, color: "Black", size: "L" },
  ],
  tracking: {
    carrier: "FedEx",
    number: "1234567890",
    url: "https://www.fedex.com/track?trknbr=1234567890",
  },
  timeline: [
    { status: "Order Placed", date: "Jan 15, 2024", time: "10:30 AM", completed: true },
    { status: "Processing", date: "Jan 15, 2024", time: "2:45 PM", completed: true },
    { status: "Shipped", date: "Jan 16, 2024", time: "9:00 AM", completed: true },
    { status: "Out for Delivery", date: "Jan 18, 2024", time: "8:00 AM", completed: false },
    { status: "Delivered", date: "", time: "", completed: false },
  ],
  estimatedDelivery: "January 18-19, 2024",
};

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<typeof sampleOrder | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo: Show sample order for any input
    if (orderNumber && email) {
      setOrder({ ...sampleOrder, orderNumber, email });
    } else {
      setError("Please enter both order number and email.");
    }

    setIsSearching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
      case "processing":
        return <Clock className="h-5 w-5" />;
      case "shipped":
      case "out for delivery":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="pt-24 lg:pt-28 pb-16 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
              Order Status
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl mb-4">Track Your Order</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your order number and email to check the status of your order.
            </p>
          </div>

          {!order ? (
            /* Search form */
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="EA-2024-XXXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase"
                >
                  {isSearching ? (
                    "Searching..."
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Can't find your order?{" "}
                <a href="/contact" className="text-accent hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          ) : (
            /* Order details */
            <div className="max-w-2xl mx-auto">
              {/* Order header */}
              <div className="bg-secondary/50 p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-medium text-lg">{order.orderNumber}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{order.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Status timeline */}
              <div className="mb-8">
                <h2 className="font-serif text-xl mb-6">Order Status</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {order.timeline.map((step, index) => (
                      <div key={index} className="relative flex gap-4">
                        {/* Icon */}
                        <div
                          className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-2">
                          <p
                            className={`font-medium ${
                              step.completed ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.status}
                          </p>
                          {step.date && (
                            <p className="text-sm text-muted-foreground">
                              {step.date} at {step.time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tracking info */}
              {order.tracking && (
                <div className="bg-secondary/50 p-6 mb-8">
                  <h2 className="font-serif text-xl mb-4">Tracking Information</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Carrier</p>
                      <p className="font-medium">{order.tracking.carrier}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tracking Number</p>
                      <p className="font-medium">{order.tracking.number}</p>
                    </div>
                    <Button asChild variant="outline">
                      <a href={order.tracking.url} target="_blank" rel="noopener noreferrer">
                        Track on {order.tracking.carrier}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {/* Order items */}
              <div>
                <h2 className="font-serif text-xl mb-4">Items in This Order</h2>
                <div className="divide-y divide-border">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back button */}
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setOrder(null)}>
                  Track Another Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
