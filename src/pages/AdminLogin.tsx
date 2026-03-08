import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-3xl font-bold">{t.adminLogin.title}</h1>
          <p className="text-muted-foreground mt-2">{t.adminLogin.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
          <Button variant="hero" className="w-full" size="lg">
            {t.adminLogin.signIn}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
