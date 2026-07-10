import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="relative h-[60vh] lg:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
              alt="E & A Luxurious brand"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/60" />
          </div>
          <div className="relative text-center text-primary-foreground px-4">
            <p className="text-sm font-light tracking-ultra uppercase mb-4 text-accent">
              Our Story
            </p>
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl max-w-3xl">
              Where Luxury Meets Spirituality
            </h1>
          </div>
        </section>

        {/* Founders */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
                  The Founders
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl mb-6">
                  Emmanuel & Ainekisha
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    E & A Luxurious was born from a shared vision between Emmanuel and Ainekisha — 
                    two individuals who believed that fashion could be more than just clothing. 
                    They envisioned a brand that would serve as a daily reminder of what matters most: 
                    presence, purpose, and the pursuit of a meaningful life.
                  </p>
                  <p>
                    Both founders come from diverse backgrounds in fashion, design, and mindfulness 
                    practices. Their combined expertise has allowed them to create garments that not 
                    only look exceptional but also carry a deeper intention in every stitch.
                  </p>
                  <p>
                    "We wanted to create something that people would reach for not just because 
                    it looks good, but because it makes them feel connected to something greater," 
                    says Emmanuel. "Every piece we design is meant to inspire mindfulness."
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative aspect-[4/5]">
                <img
                  src="https://ibb.co/tT4S1ZD3&fit=crop"
                  alt="Founders Emmanuel and Ainekisha"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="philosophy" className="py-20 lg:py-28 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
                Our Philosophy
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl mb-8">
                Craftsmanship with Intention
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>
                  At E & A Luxurious, we believe that true luxury lies not in excess, but in 
                  intention. Every garment we create is designed to be more than just clothing — 
                  it's a wearable reminder to live with purpose.
                </p>
                <p>
                  Our designs draw inspiration from ancient wisdom traditions, mindfulness practices, 
                  and the timeless pursuit of inner peace. We incorporate subtle symbolic elements 
                  into our pieces, creating garments that carry deeper meaning for those who wear them.
                </p>
                <p>
                  We source only the finest materials, partner with ethical manufacturers, and 
                  ensure that every step of our process aligns with our values of quality, 
                  sustainability, and conscious creation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
                What We Stand For
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-serif text-2xl text-accent">M</span>
                </div>
                <h3 className="font-serif text-xl mb-3">Mindfulness</h3>
                <p className="text-muted-foreground">
                  Every piece is designed to remind you to stay present and intentional in your daily life.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-serif text-2xl text-accent">Q</span>
                </div>
                <h3 className="font-serif text-xl mb-3">Quality</h3>
                <p className="text-muted-foreground">
                  We use only premium materials and work with skilled artisans to ensure lasting excellence.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="font-serif text-2xl text-accent">P</span>
                </div>
                <h3 className="font-serif text-xl mb-3">Purpose</h3>
                <p className="text-muted-foreground">
                  We believe fashion should serve a greater purpose — to inspire and elevate the human spirit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl mb-6">
              Begin Your Journey
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Explore our collection and discover pieces that resonate with your 
              pursuit of meaning and mindful living.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/shop">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
