import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bonabana.png.asset.json";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage.url}
          alt="E and A Luxurious - Where Luxury Meets Spirituality"
          className="absolute inset-0 w-full h-full object-cover object-top animate-editorial-scale"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        {/* Subtle grain texture */}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Editorial tagline */}
          <p 
            className="font-sans text-xs sm:text-sm font-light tracking-ultra uppercase text-white/70 mb-8 animate-editorial-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Est. 2024
          </p>

          {/* Main headline - Large editorial serif */}
          <h1 
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-[0.9] mb-10 animate-editorial-fade-up"
            style={{ animationDelay: "0.5s", letterSpacing: "-0.03em" }}
          >
            Where Luxury
            <br />
            <span className="italic">Meets Spirituality</span>
          </h1>

          {/* Single CTA */}
          <div 
            className="animate-editorial-fade-up" 
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-white/90 h-14 px-10 text-xs tracking-ultra uppercase font-sans font-normal transition-all duration-500 hover:tracking-widest"
            >
              <Link to="/shop">
                Explore Collection
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-subtle-float z-10">
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-[10px] tracking-ultra uppercase text-white/50">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
