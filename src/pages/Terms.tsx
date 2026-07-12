import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="pt-32 lg:pt-40 pb-24 lg:pb-32 container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light mb-12" style={{ letterSpacing: "-0.02em" }}>
            Terms of Service
          </h1>

          <div className="prose prose-neutral dark:prose-invert space-y-8 font-sans text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-serif text-lg text-foreground font-normal">1. Terms</h2>
              <p>
                By accessing this website, you are agreeing to be bound by these Terms of Service, 
                all applicable laws and regulations, and agree that you are responsible for compliance 
                with any applicable local laws.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="font-serif text-lg text-foreground font-normal">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) 
                on E & A Luxurious's website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="font-serif text-lg text-foreground font-normal">3. Disclaimer</h2>
              <p>
                The materials on E & A Luxurious's website are provided on an 'as is' basis. E & A Luxurious 
                makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                including, without limitation, implied warranties or conditions of merchantability, fitness for 
                a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="font-serif text-lg text-foreground font-normal">4. Limitations</h2>
              <p>
                In no event shall E & A Luxurious or its suppliers be liable for any damages arising out of the 
                use or inability to use the materials on E & A Luxurious's website, even if E & A Luxurious 
                or an authorized representative has been notified orally or in writing of the possibility of 
                such damage.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
