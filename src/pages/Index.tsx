import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PropertyGallery from "@/components/PropertyGallery";
import ServiceHighlights from "@/components/ServiceHighlights";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PropertyGallery />
      <ServiceHighlights />
      <LeadCaptureForm />
      <Footer />
    </div>
  );
};

export default Index;
