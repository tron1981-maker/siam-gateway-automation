import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { language, setLanguage, t } = useLanguage();

  const toggleLang = () => setLanguage(language === "en" ? "ko" : "en");

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
              <Link to="/properties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.properties}</Link>
              <a href="/#consultation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.consultation}</a>
            </>
          )}
          <button onClick={toggleLang} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Globe size={16} />
            {language === "en" ? "한국어" : "EN"}
          </button>
          <Link to={isAdmin ? "/" : "/admin"}>
            <Button variant="heroOutline" size="sm">
              {isAdmin ? t.nav.viewSite : t.nav.admin}
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
              <Link to="/properties" className="block text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t.nav.properties}</Link>
              <a href="/#consultation" className="block text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>{t.nav.consultation}</a>
            </>
          )}
          <button onClick={toggleLang} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Globe size={16} />
            {language === "en" ? "한국어" : "EN"}
          </button>
          <Link to={isAdmin ? "/" : "/admin"} onClick={() => setIsOpen(false)}>
            <Button variant="heroOutline" size="sm" className="w-full">
              {isAdmin ? t.nav.viewSite : t.nav.admin}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
