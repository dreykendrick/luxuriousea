import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 lg:pb-32 container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
            Privacy Policy
          </h1>

          <div className="prose prose-neutral dark:prose-invert space-y-8 font-sans text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-lg text-foreground font-normal">Information We Collect</h2>
              <p>
                We collect information you provide directly to us when you make a purchase, subscribe to our 
                newsletter, or interact with customer support. This may include your name, email address, shipping 
                address, and payment processing details.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="font-serif text-lg text-foreground font-normal">How We Use Your Information</h2>
              <p>
                We use the information we collect to fulfill your orders, provide customer assistance, send 
                marketing and update communications (if you have opted-in), and to improve the visual design 
                and overall shopping experience of our site.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="font-serif text-lg text-foreground font-normal">Information Security</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information. 
                We use secure encrypted channels (SSL) for transaction processing, and your financial data 
                is stored securely by our checkout handlers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
