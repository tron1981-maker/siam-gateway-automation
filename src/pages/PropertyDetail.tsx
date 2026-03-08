import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bed, Bath, Maximize, MapPin, Building2, Calendar,
  Shield, Sofa, Layers, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-card rounded-xl border border-border" />
            <div className="h-8 bg-card rounded w-1/2" />
            <div className="h-4 bg-card rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-lg">{t.properties.notFound}</p>
          <Link to="/properties">
            <Button variant="heroOutline" className="mt-4">{t.properties.backToList}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = language === "ko" && property.title_ko ? property.title_ko : property.title;
  const description = language === "ko" && property.description_ko ? property.description_ko : property.description;
  const images = property.images && property.images.length > 0 ? property.images : ["/placeholder.svg"];

  const formatPrice = (price: number) => `฿${price.toLocaleString()}`;

  const furnishingLabel: Record<string, string> = {
    furnished: language === "ko" ? "풀 퍼니시드" : "Furnished",
    unfurnished: language === "ko" ? "언퍼니시드" : "Unfurnished",
    partially_furnished: language === "ko" ? "부분 퍼니시드" : "Partially Furnished",
  };

  const ownershipLabel: Record<string, string> = {
    freehold: language === "ko" ? "프리홀드 (소유권)" : "Freehold",
    leasehold: language === "ko" ? "리스홀드 (임대권)" : "Leasehold",
  };

  const typeLabel: Record<string, string> = {
    condo: language === "ko" ? "콘도미니엄" : "Condominium",
    villa: language === "ko" ? "빌라" : "Villa",
    penthouse: language === "ko" ? "펜트하우스" : "Penthouse",
    house: language === "ko" ? "단독주택" : "House",
    townhouse: language === "ko" ? "타운하우스" : "Townhouse",
    land: language === "ko" ? "토지" : "Land",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back button */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">{t.properties.backToList}</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image gallery */}
          <div className="relative rounded-xl overflow-hidden mb-8 h-[400px] md:h-[500px]">
            <img
              src={images[currentImage]}
              alt={title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-2 rounded-full hover:bg-background/90 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm p-2 rounded-full hover:bg-background/90 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i === currentImage ? "bg-gold" : "bg-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {property.tag && (
              <div className="absolute top-4 left-4 bg-gold-gradient text-primary-foreground text-sm font-semibold px-4 py-1.5 rounded-full">
                {property.tag}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{title}</h1>
                <p className="text-muted-foreground flex items-center gap-1.5 text-lg">
                  <MapPin size={18} />
                  {property.district ? `${property.district}, ${property.province}` : property.province}
                  {property.nearby_bts && ` · BTS ${property.nearby_bts}`}
                </p>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Bed, label: t.detail.bedrooms, value: property.bedrooms },
                  { icon: Bath, label: t.detail.bathrooms, value: property.bathrooms },
                  { icon: Maximize, label: t.detail.area, value: `${(property.area_sqm * 0.3025).toFixed(1)}${language === "ko" ? "평" : " py"}` },
                  { icon: Building2, label: t.detail.type, value: typeLabel[property.property_type] || property.property_type },
                ].map((spec) => (
                  <div key={spec.label} className="bg-card border border-border rounded-lg p-4 text-center">
                    <spec.icon size={20} className="mx-auto text-gold mb-2" />
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {description && (
                <div>
                  <h2 className="font-heading text-2xl font-semibold mb-4">{t.detail.description}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
                </div>
              )}

              {/* Details grid */}
              <div>
                <h2 className="font-heading text-2xl font-semibold mb-4">{t.detail.details}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, label: t.detail.ownership, value: ownershipLabel[property.ownership_type] },
                    { icon: Sofa, label: t.detail.furnishing, value: property.furnishing ? furnishingLabel[property.furnishing] : "-" },
                    { icon: Layers, label: t.detail.currentFloor, value: property.floor_number ? `${property.floor_number}${language === "ko" ? "층" : "F"}` : "-" },
                    { icon: Building2, label: t.detail.totalFloors, value: property.total_floors ? `${property.total_floors}${language === "ko" ? "층" : "F"}` : "-" },
                    { icon: Calendar, label: t.detail.yearBuilt, value: property.year_built || "-" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                      <d.icon size={18} className="text-gold shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{d.label}</p>
                        <p className="font-medium">{d.value}</p>
                      </div>
                    </div>
                  ))}
                  {property.land_area_sqm && (
                    <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                      <Maximize size={18} className="text-gold shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.detail.landArea}</p>
                        <p className="font-medium">{(property.land_area_sqm * 0.3025).toFixed(1)}{language === "ko" ? "평" : " py"}</p>
                      </div>
                    </div>
                  )}
                   {property.price_per_sqm && (
                    <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                      <Building2 size={18} className="text-gold shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t.detail.pricePerSqm}</p>
                        <p className="font-medium">฿{Math.round(property.price_per_sqm / 0.3025).toLocaleString()}/{language === "ko" ? "평" : "py"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-semibold mb-4">{t.detail.amenities}</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="bg-secondary text-sm px-3 py-1.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Price & CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t.detail.askingPrice}</p>
                  <p className="text-gradient-gold font-heading text-3xl font-bold">
                    {formatPrice(property.price)}
                  </p>
                  {property.listing_type === "rent" && (
                    <span className="text-muted-foreground text-sm">/ {t.detail.month}</span>
                  )}
                </div>

                <a href="/#consultation">
                  <Button variant="hero" className="w-full" size="lg">
                    {t.detail.inquireNow}
                  </Button>
                </a>

                {property.nearby_facilities && property.nearby_facilities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">{t.detail.nearby}</p>
                    <div className="space-y-1.5">
                      {property.nearby_facilities.map((f) => (
                        <p key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin size={12} className="text-gold shrink-0" /> {f}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
