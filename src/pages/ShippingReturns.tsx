import { Layout } from "@/components/layout/Layout";

export default function ShippingReturns() {
  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 lg:pb-32 container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Customer Care
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
            Shipping & Returns
          </h1>

          <div className="prose prose-neutral dark:prose-invert space-y-10 font-sans text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-4">
              <h2 className="font-serif text-lg text-foreground font-normal">Shipping Policy</h2>
              <p>
                All orders are processed and shipped with care from our studio.
                Estimated delivery is <strong>3–5 business days</strong> for standard in-stock items.
              </p>
              <p>
                Pre-order items will be shipped as soon as they become available. You will receive a
                confirmation email containing tracking information once your order leaves our facility.
              </p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="font-serif text-lg text-foreground font-normal">Return Policy</h2>
              <p>
                To maintain the integrity and intention of E & A Luxurious pieces, 
                <strong> all sales are final</strong>. We do not accept returns, exchanges, or cancellations.
              </p>
              <p>
                Please review your sizing and product selections carefully before completing your purchase.
                If you receive an item that is damaged or defective upon arrival, please contact us immediately at
                our support email.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
