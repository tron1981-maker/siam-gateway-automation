import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-gradient rounded-md flex items-center justify-center">
            <span className="font-heading text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-heading text-lg font-semibold">
            Siam Elite <span className="text-gradient-gold">Gateway</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {!isAdmin && (
            <>
              <a href="#properties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Properties</a>
              <a href="#consultation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Consultation</a>
            </>
          )}
          <Link to={isAdmin ? "/" : "/admin"}>
            <Button variant="heroOutline" size="sm">
              {isAdmin ? "View Site" : "Admin"}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3">
          {!isAdmin && (
            <>
              <a href="#properties" className="block text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Properties</a>
              <a href="#consultation" className="block text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Consultation</a>
            </>
          )}
          <Link to={isAdmin ? "/" : "/admin"} onClick={() => setIsOpen(false)}>
            <Button variant="heroOutline" size="sm" className="w-full">
              {isAdmin ? "View Site" : "Admin"}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
