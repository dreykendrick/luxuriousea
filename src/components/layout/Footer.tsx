import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block font-serif text-2xl tracking-tight mb-6">
              E & A Luxurious
            </Link>
            <p className="font-sans text-sm font-light text-primary-foreground/60 leading-relaxed mb-8 max-w-xs">
              Where luxury meets spirituality. Crafted with intention, worn with purpose.
            </p>
            <div className="flex items-center space-x-5">
              <a
                href="https://instagram.com/EALuxurious"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/EALuxurious"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/EALuxurious"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-primary-foreground/40 mb-6">
              Shop
            </h3>
            <ul className="space-y-4">
              {["New Arrivals", "Best Sellers", "T-Shirts", "Hoodies", "Accessories"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/shop"
                      className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-primary-foreground/40 mb-6">
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:press@ealuxurious.com"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Press
                </a>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h3 className="font-sans text-xs font-normal tracking-ultra uppercase text-primary-foreground/40 mb-6">
              Help
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/shipping-returns"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="font-sans text-sm font-light text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-sans text-xs text-primary-foreground/40">
              © {new Date().getFullYear()} E & A Luxurious. All rights reserved.
            </p>
            <p className="font-sans text-xs text-primary-foreground/40">
              Crafted with intention. Worn with purpose.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
