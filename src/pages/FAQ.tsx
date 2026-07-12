import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Estimated delivery time is 3–5 business days for standard in-stock orders. For pre-orders, items are dispatched immediately as they arrive at our inventory."
    },
    {
      q: "Can I return or exchange my order?",
      a: "All sales are final. To maintain the exclusive and intentional quality of our spiritual luxury pieces, we do not support returns, exchanges, or order cancellations once placed."
    },
    {
      q: "How do I care for my garments?",
      a: "We recommend reviewing the care instructions detailed on each product page or checking the fabric tag sewn inside the garment to prolong its life, shape, and fabric finish."
    },
    {
      q: "What makes E & A Luxurious unique?",
      a: "Our collections are designed at the intersection of premium fashion and spiritual intention. Each piece is crafted using carefully sourced luxury materials, constructed with high attention to detail, and inspired by mindful, elevated living."
    }
  ];

  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 lg:pb-32 container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Assistance
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
            Frequently Asked Questions
          </h1>

          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border">
                <AccordionTrigger className="font-sans text-sm tracking-wide uppercase py-6 text-left hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm text-muted-foreground leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  );
}
