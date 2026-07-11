import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteImage } from "@/lib/siteImages";

const DEFAULT_EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&h=1125&fit=crop&q=90";

export function EditorialSection() {
  const editorialImage = useSiteImage("editorial_section", DEFAULT_EDITORIAL_IMAGE);
  return (
    <section className="py-32 lg:py-44 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Editorial image with elegant treatment */}
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden image-zoom-luxury">
              <img
                src={editorialImage}
                alt="The meaning behind the collection"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative line */}
            <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-px bg-primary-foreground/20" />
          </div>
          {/* Editorial content */}
          <div className="lg:py-12">
            <p className="font-sans text-xs font-normal tracking-ultra uppercase text-primary-foreground/60 mb-6">
              The Philosophy
            </p>
            <h2 
              className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light mb-10 leading-[1.1]"
              style={{ letterSpacing: "-0.02em" }}
            >
              Meaning Behind
              <br />
              <span className="italic">the Collection</span>
            </h2>
            <div className="space-y-6 text-primary-foreground/70 mb-12 max-w-lg">
              <p className="font-sans text-base lg:text-lg font-light leading-relaxed">
                Every piece carries a deeper purpose. We believe that what we wear 
                should be more than fabric and thread — it should be a daily reminder 
                of our intentions and aspirations.
              </p>
              <p className="font-sans text-base lg:text-lg font-light leading-relaxed">
                From the selection of premium materials to the subtle details in every 
                stitch, we pour intention into our craft. When you wear E & A Luxurious, 
                you're embodying a philosophy of conscious living.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center text-xs font-sans tracking-ultra uppercase text-primary-foreground hover:text-primary-foreground/70 transition-colors duration-500 group elegant-underline pb-1"
            >
              Discover Our Story
              <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
