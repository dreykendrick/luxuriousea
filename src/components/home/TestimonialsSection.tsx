import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "The quality is extraordinary. Every piece feels intentional, like it was made just for me. This is what luxury should be.",
    author: "Alexandra R.",
    location: "New York",
  },
  {
    id: 2,
    quote: "I've never felt more connected to what I wear. E & A Luxurious understands that clothing is more than fabric—it's an extension of who we are.",
    author: "Michael T.",
    location: "Los Angeles",
  },
  {
    id: 3,
    quote: "Timeless elegance with a soulful touch. The craftsmanship speaks for itself. I'm a customer for life.",
    author: "Sarah M.",
    location: "London",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 lg:py-44 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 lg:mb-20">
            <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
              Voices
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl font-light" style={{ letterSpacing: "-0.02em" }}>
              From Our Community
            </h2>
          </div>

          {/* Testimonial */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <div 
              className={`text-center transition-all duration-600 ${
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
              style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed mb-10 italic" style={{ letterSpacing: "-0.01em" }}>
                "{testimonials[currentIndex].quote}"
              </blockquote>
              <div className="space-y-1">
                <p className="font-sans text-sm font-normal tracking-wide">
                  {testimonials[currentIndex].author}
                </p>
                <p className="font-sans text-xs text-muted-foreground tracking-wide uppercase">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </div>
          </div>

          {/* Minimal navigation */}
          <div className="flex items-center justify-center gap-8 mt-12">
            <button
              onClick={goToPrev}
              className="p-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(index);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex 
                      ? "bg-foreground w-6" 
                      : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
