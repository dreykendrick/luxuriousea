import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    toast.success("Welcome to the E & A community", {
      description: "You'll receive exclusive updates and early access to new collections.",
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-light tracking-ultra uppercase text-accent mb-4">
            Stay Connected
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl mb-4">
            Join the Journey
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Be the first to receive new collection announcements, exclusive offers, 
            and insights into the meaning behind our designs.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-background border-border"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-sm tracking-widest uppercase"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
