import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Home, Tags, Users, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/images", label: "Site Images", icon: Image },
];


const AdminLayout = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [user, loading, isAdmin, navigate, location.pathname]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-sans text-sm text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-secondary/20">
        <div className="p-6 border-b border-border">
          <Link to="/" className="block">
            <p className="font-serif text-lg tracking-tight">E & A Luxurious</p>
            <p className="font-sans text-[10px] tracking-ultra uppercase text-muted-foreground mt-1">
              Admin
            </p>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 font-sans text-sm transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Home className="h-4 w-4" />
            View Site
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 font-sans text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="font-serif text-lg">
            E & A · Admin
          </Link>
          <button onClick={() => signOut()} className="text-muted-foreground">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex border-t border-border overflow-x-auto">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex-1 min-w-fit px-4 py-3 text-center font-sans text-xs tracking-wide uppercase transition-colors",
                  isActive
                    ? "text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main */}
      <main className="flex-1 pt-32 md:pt-0 overflow-x-hidden">
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
