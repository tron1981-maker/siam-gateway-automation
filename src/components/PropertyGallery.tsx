import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    image: property1,
    title: "The Residences at Sukhumvit",
    location: "Sukhumvit Soi 24, Bangkok",
    price: "฿45,000,000",
    beds: 3,
    area: "210 sqm",
    tag: "Featured",
  },
  {
    image: property2,
    title: "Oceanfront Villa Natai",
    location: "Natai Beach, Phuket",
    price: "฿120,000,000",
    beds: 5,
    area: "680 sqm",
    tag: "Exclusive",
  },
  {
    image: property3,
    title: "Sky Penthouse Sathorn",
    location: "Sathorn Road, Bangkok",
    price: "฿78,000,000",
    beds: 4,
    area: "420 sqm",
    tag: "New Listing",
  },
];

const PropertyGallery = () => {
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
            Curated Collection
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Featured Properties
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-card rounded-lg overflow-hidden shadow-card-luxury border border-border hover:border-gold/30 transition-all duration-500"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-gold-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {property.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-1">
                  {property.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {property.location}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
                  <span>{property.beds} Bedrooms</span>
                  <span>{property.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gradient-gold font-heading text-xl font-bold">
                    {property.price}
                  </span>
                  <Button variant="heroOutline" size="sm">
                    Inquire Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyGallery;
