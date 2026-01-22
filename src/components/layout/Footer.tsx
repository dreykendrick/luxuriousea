import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  shop: [
    { name: "New Arrivals", href: "/shop?collection=new" },
    { name: "Best Sellers", href: "/shop?sort=best-sellers" },
    { name: "T-Shirts", href: "/shop?category=t-shirts" },
    { name: "Hoodies", href: "/shop?category=hoodies" },
    { name: "Accessories", href: "/shop?category=accessories" },
  ],
  help: [
    { name: "Shipping & Returns", href: "/shipping-returns" },
    { name: "Track Order", href: "/track-order" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Philosophy", href: "/about#philosophy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/EALuxurious" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/EALuxurious" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/EALuxurious" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl lg:text-3xl mb-3">
              Join the Journey
            </h3>
            <p className="text-primary-foreground/70 text-sm lg:text-base mb-6">
              Subscribe to receive exclusive updates, early access to new collections, and 
              insights into the meaning behind our designs.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-serif text-xl lg:text-2xl tracking-wide">
              E & A Luxurious
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
              Where Luxury Meets Spirituality
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-medium text-sm tracking-widest uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium text-sm tracking-widest uppercase mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium text-sm tracking-widest uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} E & A Luxurious. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:press@ealuxurious.com"
                className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Press & Wholesale: press@ealuxurious.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
