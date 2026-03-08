import { motion } from "framer-motion";
import { Building2, Shield, Headphones } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const icons = [Building2, Shield, Headphones];

const ServiceHighlights = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">
            {t.services.subtitle}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            {t.services.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center p-8 rounded-lg border border-border bg-card hover:border-gold/30 hover:shadow-luxury transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-heading text-2xl font-semibold mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
