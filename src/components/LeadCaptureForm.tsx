import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const steps = ["Personal Info", "Investment Details", "Contact"];

const LeadCaptureForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    propertyType: "",
    message: "",
    phone: "",
  });

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    toast.success("Thank you! Our team will contact you within 24 hours.");
    setStep(0);
    setFormData({ name: "", email: "", budget: "", propertyType: "", message: "", phone: "" });
  };

  return (
    <section className="py-24 bg-navy-medium" id="consultation">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-3">
            Begin Your Journey
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Private Consultation
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl p-8 shadow-card-luxury"
        >
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i <= step
                      ? "bg-gold-gradient text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:inline text-muted-foreground">
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? "bg-gold" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {step === 0 && (
                <>
                  <div>
                    <Label className="text-foreground">Full Name</Label>
                    <Input
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 bg-secondary border-border"
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <Label className="text-foreground">Budget Range (THB)</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger className="mt-1.5 bg-secondary border-border">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-30m">฿10M – ฿30M</SelectItem>
                        <SelectItem value="30-60m">฿30M – ฿60M</SelectItem>
                        <SelectItem value="60-100m">฿60M – ฿100M</SelectItem>
                        <SelectItem value="100m+">฿100M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-foreground">Property Interest</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger className="mt-1.5 bg-secondary border-border">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="condo">Luxury Condominium</SelectItem>
                        <SelectItem value="villa">Beachfront Villa</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="mixed">Mixed / Portfolio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label className="text-foreground">Phone / WhatsApp</Label>
                    <Input
                      placeholder="+66 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Additional Notes</Label>
                    <Textarea
                      placeholder="Tell us about your ideal property or any specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1.5 bg-secondary border-border min-h-[100px]"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button variant="hero" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSubmit}>
                Submit Inquiry
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
