import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Track Order", href: "/track-order" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm">
                <div className="flex flex-col space-y-8 mt-8">
                  <Link
                    to="/"
                    className="font-serif text-xl tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    E & A Luxurious
                  </Link>
                  <div className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "text-lg font-light tracking-wide transition-colors py-2",
                          location.pathname === item.href
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border pt-6">
                    <Link
                      to="/auth"
                      className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop navigation - Left */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-light tracking-widest uppercase transition-colors",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
          <Link
            to="/"
            className="font-serif text-lg sm:text-xl lg:text-2xl tracking-wide hover:opacity-80 transition-opacity"
          >
            E & A Luxurious
          </Link>

          {/* Desktop navigation - Right */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-light tracking-widest uppercase transition-colors",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/auth"
              className="hidden lg:flex text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Sign in</span>
            </Link>
            <Link
              to="/cart"
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Shopping bag</span>
              {/* Cart count badge - will be dynamic later */}
              <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center bg-accent text-accent-foreground rounded-full">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
