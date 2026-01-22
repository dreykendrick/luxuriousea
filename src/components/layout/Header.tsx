import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu } from "lucide-react";
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
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we're on a dark hero page
  const isHeroPage = location.pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/98 backdrop-blur-md border-b border-border/50"
          : isHeroPage
            ? "bg-transparent"
            : "bg-background"
      )}
    >
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 lg:h-24 items-center justify-between">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "hover:bg-transparent",
                    !isScrolled && isHeroPage ? "text-white" : "text-foreground"
                  )}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm border-r-0">
                <div className="flex flex-col space-y-10 mt-12">
                  <Link
                    to="/"
                    className="font-serif text-2xl tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    E & A Luxurious
                  </Link>
                  <div className="flex flex-col space-y-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "font-sans text-lg font-light tracking-wide transition-colors duration-300 py-1",
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
                  <div className="border-t border-border pt-8">
                    <Link
                      to="/auth"
                      className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span className="font-sans text-sm tracking-wide">Sign In</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop navigation - Left */}
          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "font-sans text-xs font-normal tracking-ultra uppercase transition-colors duration-300 elegant-underline pb-0.5",
                  location.pathname === item.href
                    ? !isScrolled && isHeroPage ? "text-white" : "text-foreground"
                    : !isScrolled && isHeroPage 
                      ? "text-white/70 hover:text-white" 
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
            className={cn(
              "font-serif text-xl lg:text-2xl tracking-tight transition-colors duration-300",
              !isScrolled && isHeroPage ? "text-white" : "text-foreground"
            )}
          >
            E & A Luxurious
          </Link>

          {/* Desktop navigation - Right */}
          <div className="hidden lg:flex lg:items-center lg:space-x-10">
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "font-sans text-xs font-normal tracking-ultra uppercase transition-colors duration-300 elegant-underline pb-0.5",
                  location.pathname === item.href
                    ? !isScrolled && isHeroPage ? "text-white" : "text-foreground"
                    : !isScrolled && isHeroPage 
                      ? "text-white/70 hover:text-white" 
                      : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/auth"
              className={cn(
                "hidden lg:flex transition-colors duration-300",
                !isScrolled && isHeroPage 
                  ? "text-white/70 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Sign in</span>
            </Link>
            <Link
              to="/cart"
              className={cn(
                "relative transition-colors duration-300",
                !isScrolled && isHeroPage 
                  ? "text-white/70 hover:text-white" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Shopping bag</span>
              {/* Cart count badge */}
              <span className={cn(
                "absolute -top-1.5 -right-1.5 h-4 w-4 text-[10px] font-sans font-medium flex items-center justify-center rounded-full",
                !isScrolled && isHeroPage 
                  ? "bg-white text-black" 
                  : "bg-foreground text-background"
              )}>
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
