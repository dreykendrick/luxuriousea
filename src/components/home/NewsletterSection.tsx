import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail("");
    toast.success("Welcome to E & A Luxurious", {
      description: "You'll be the first to know about new collections.",
    });
  };

  return (
    <section className="py-32 lg:py-44 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Editorial header */}
          <p className="font-sans text-xs font-normal tracking-ultra uppercase text-muted-foreground mb-4">
            Stay Connected
          </p>
          <h2 
            className="font-serif text-4xl lg:text-5xl font-light mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Join the Journey
          </h2>
          <p className="font-sans text-base lg:text-lg font-light text-muted-foreground mb-12 leading-relaxed">
            Be the first to discover new collections, exclusive offers, 
            and the stories behind our craft.
          </p>

          {/* Elegant form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-background border-border px-6 text-sm font-sans placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-foreground"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 px-8 bg-foreground hover:bg-foreground/90 text-background text-xs tracking-ultra uppercase font-sans font-normal transition-all duration-500"
              >
                {isLoading ? (
                  "..."
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
            <p className="font-sans text-xs text-muted-foreground mt-6">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
