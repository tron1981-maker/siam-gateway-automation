import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";

interface Property {
  id: string;
  title: string;
  title_ko: string | null;
  province: string;
  district: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  property_type: string;
  ownership_type: string;
  images: string[] | null;
  tag: string | null;
  featured: boolean | null;
}

const PropertyCard = ({ property, index = 0 }: { property: Property; index?: number }) => {
  const { language, t } = useLanguage();
  const title = language === "ko" && property.title_ko ? property.title_ko : property.title;
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0]
    : "/placeholder.svg";

  const formatPrice = (price: number) => {
    if (price >= 1_000_000) {
      return `฿${(price / 1_000_000).toFixed(1)}M`;
    }
    return `฿${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-lg overflow-hidden shadow-card-luxury border border-border hover:border-gold/30 transition-all duration-500"
    >
      <div className="relative overflow-hidden h-64">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {property.tag && (
          <div className="absolute top-4 left-4 bg-gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            {property.tag}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-background/70 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full capitalize">
          {property.ownership_type}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-xl font-semibold mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex items-center gap-1">
          <MapPin size={14} />
          {property.district ? `${property.district}, ${property.province}` : property.province}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
          <span className="flex items-center gap-1"><Bed size={14} /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize size={14} /> {property.area_sqm} sqm</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gradient-gold font-heading text-xl font-bold">
            {formatPrice(property.price)}
          </span>
          <Link to={`/properties/${property.id}`}>
            <Button variant="heroOutline" size="sm">
              {t.gallery.inquire}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
