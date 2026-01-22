import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Alexandra M.",
    location: "New York",
    rating: 5,
    text: "The quality is exceptional. Each piece feels like it was made with genuine care and intention. The Mindful Hoodie has become my go-to for meditation sessions and everyday wear.",
    product: "Mindful Hoodie",
  },
  {
    id: 2,
    name: "Marcus J.",
    location: "Los Angeles",
    rating: 5,
    text: "Finally, a brand that understands that luxury isn't just about price — it's about meaning. The craftsmanship and attention to detail is unmatched.",
    product: "Essence Premium Tee",
  },
  {
    id: 3,
    name: "Sofia R.",
    location: "Miami",
    rating: 5,
    text: "I've never felt more connected to what I wear. The philosophy behind E & A Luxurious resonates deeply. These aren't just clothes — they're reminders to be present.",
    product: "Harmony Set",
  },
  {
    id: 4,
    name: "Daniel K.",
    location: "Chicago",
    rating: 5,
    text: "The Gratitude Joggers are the most comfortable pants I've ever owned. The material is premium, and I appreciate the thoughtful design. Worth every penny.",
    product: "Gratitude Joggers",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm font-light tracking-ultra uppercase text-accent mb-2">
            Community Voices
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl">What Our Community Says</h2>
        </div>

        {/* Testimonial carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 z-10 hover:bg-secondary"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous testimonial</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 z-10 hover:bg-secondary"
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next testimonial</span>
          </Button>

          {/* Testimonial content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-8 lg:px-16"
                >
                  <div className="text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="font-serif text-xl lg:text-2xl leading-relaxed mb-8 text-foreground/90">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author */}
                    <div className="space-y-1">
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location} · {testimonial.product}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-accent" : "bg-border"
                }`}
              >
                <span className="sr-only">Go to testimonial {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
