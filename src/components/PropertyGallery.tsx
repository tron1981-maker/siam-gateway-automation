import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PropertyGallery = () => {
  const { t } = useLanguage();

  const { data: properties = [] } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // If no featured properties, get latest 3
  const { data: fallbackProperties = [] } = useQuery({
    queryKey: ["latest-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: properties.length === 0,
  });

  const displayProperties = properties.length > 0 ? properties : fallbackProperties;

  return (
    <section className="py-24 bg-navy-medium" id="properties">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">
            {t.gallery.subtitle}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            {t.gallery.title}
          </h2>
        </motion.div>

        {displayProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t.properties.noResults}</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/properties">
            <Button variant="heroOutline" size="lg">
              {t.nav.properties} →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyGallery;
