import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorialSection() {
  return (
    <section className="py-20 lg:py-28 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=1000&fit=crop"
              alt="The meaning behind the collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="lg:py-8">
            <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
              The Philosophy
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl mb-6 leading-tight">
              The Meaning Behind the Collection
            </h2>
            <div className="space-y-4 text-primary-foreground/80 mb-8">
              <p className="leading-relaxed">
                Every piece in our collection carries a deeper purpose. We believe that 
                what we wear should be more than fabric and thread — it should be a 
                daily reminder of our intentions and aspirations.
              </p>
              <p className="leading-relaxed">
                Our designs draw inspiration from mindfulness practices, ancient wisdom, 
                and the modern pursuit of meaning. Each garment is crafted to help you 
                feel grounded, present, and connected to your higher self.
              </p>
              <p className="leading-relaxed">
                From the selection of premium materials to the subtle details in every 
                stitch, we pour intention into our craft. When you wear E & A Luxurious, 
                you're not just wearing clothes — you're embodying a philosophy of 
                conscious living.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/about">
                Discover Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
