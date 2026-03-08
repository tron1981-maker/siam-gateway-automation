import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

const Properties = () => {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = properties.filter((p) => {
    if (typeFilter !== "all" && p.property_type !== typeFilter) return false;
    if (provinceFilter !== "all" && p.province !== provinceFilter) return false;
    if (priceFilter !== "all") {
      const price = p.price;
      if (priceFilter === "0-30m" && price > 30_000_000) return false;
      if (priceFilter === "30-60m" && (price < 30_000_000 || price > 60_000_000)) return false;
      if (priceFilter === "60-100m" && (price < 60_000_000 || price > 100_000_000)) return false;
      if (priceFilter === "100m+" && price < 100_000_000) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.title_ko?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        p.province.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const provinces = [...new Set(properties.map((p) => p.province))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">
            {t.gallery.subtitle}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-8">
            {t.properties.title}
          </h1>

          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={18} className="text-gold" />
              <span className="text-sm font-medium">{t.properties.filters}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t.properties.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={t.properties.allTypes} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.properties.allTypes}</SelectItem>
                  <SelectItem value="condo">{t.properties.types.condo}</SelectItem>
                  <SelectItem value="villa">{t.properties.types.villa}</SelectItem>
                  <SelectItem value="penthouse">{t.properties.types.penthouse}</SelectItem>
                  <SelectItem value="house">{t.properties.types.house}</SelectItem>
                  <SelectItem value="townhouse">{t.properties.types.townhouse}</SelectItem>
                  <SelectItem value="land">{t.properties.types.land}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={t.properties.allLocations} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.properties.allLocations}</SelectItem>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={t.properties.allPrices} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.properties.allPrices}</SelectItem>
                  <SelectItem value="0-30m">฿0 – ฿30M</SelectItem>
                  <SelectItem value="30-60m">฿30M – ฿60M</SelectItem>
                  <SelectItem value="60-100m">฿60M – ฿100M</SelectItem>
                  <SelectItem value="100m+">฿100M+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg h-96 animate-pulse border border-border" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t.properties.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
