import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Users, Zap, TrendingUp, CheckCircle2, AlertCircle, Plus, Pencil, Trash2, Building2, LogOut } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminPropertyForm from "@/components/AdminPropertyForm";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

const revenueData = [
  { month: "Jul", revenue: 12 },
  { month: "Aug", revenue: 18 },
  { month: "Sep", revenue: 15 },
  { month: "Oct", revenue: 25 },
  { month: "Nov", revenue: 32 },
  { month: "Dec", revenue: 28 },
];

const leads = [
  { id: 1, name: "James Whitfield", email: "j.whitfield@gmail.com", budget: "฿60M–฿100M", interest: "Penthouse", status: "new" as const, date: "2025-01-15" },
  { id: 2, name: "Akira Tanaka", email: "a.tanaka@corp.jp", budget: "฿100M+", interest: "Villa", status: "progress" as const, date: "2025-01-14" },
  { id: 3, name: "Sarah Chen", email: "sarah.c@outlook.com", budget: "฿30M–฿60M", interest: "Condo", status: "closed" as const, date: "2025-01-13" },
  { id: 4, name: "Hans Mueller", email: "h.mueller@web.de", budget: "฿60M–฿100M", interest: "Villa", status: "new" as const, date: "2025-01-15" },
  { id: 5, name: "Priya Sharma", email: "priya.s@mail.in", budget: "฿10M–฿30M", interest: "Condo", status: "progress" as const, date: "2025-01-12" },
];

const workflows = [
  { name: "Lead → Airtable Sync", time: "2 min ago", status: "success" },
  { name: "Telegram Notification", time: "2 min ago", status: "success" },
  { name: "Email Auto-Reply", time: "15 min ago", status: "success" },
  { name: "Weekly Report Gen", time: "6 hrs ago", status: "success" },
  { name: "Facebook Lead Import", time: "12 hrs ago", status: "warning" },
];

const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyRow | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "properties">("dashboard");

  // Auth check disabled for easy access

  const { data: properties = [] } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.deleteConfirm)) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Deleted");
    }
  };

  const handleEdit = (property: PropertyRow) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormSaved = () => {
    setShowForm(false);
    setEditingProperty(null);
    queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!user) return null;

  const statusBadge = (status: "new" | "progress" | "closed") => {
    const map = {
      new: { label: t.admin.statusNew, variant: "new" as const },
      progress: { label: t.admin.statusProgress, variant: "progress" as const },
      closed: { label: t.admin.statusClosed, variant: "closed" as const },
    };
    return <Badge variant={map[status].variant}>{map[status].label}</Badge>;
  };

  const stats = [
    { icon: Users, label: t.admin.newLeadsToday, value: "12", sub: t.admin.fromYesterday },
    { icon: Zap, label: t.admin.activeAutomations, value: "5 / 5", sub: t.admin.allOperational, pulse: true },
    { icon: TrendingUp, label: t.admin.revenueForecast, value: "฿28M", sub: t.admin.january },
    { icon: Building2, label: t.admin.totalProperties, value: String(properties.length), sub: `${properties.filter(p => p.status === 'available').length} ${t.admin.propertiesLive}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-heading text-3xl font-bold">{t.admin.dashboard}</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut size={16} className="mr-1.5" /> {t.admin.logout}
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">{t.admin.subtitle}</p>

          {/* Tab navigation */}
          <div className="flex gap-1 mb-8 bg-card border border-border rounded-lg p-1 w-fit">
            <button
              onClick={() => { setActiveTab("dashboard"); setShowForm(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-gold-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.admin.dashboard}
            </button>
            <button
              onClick={() => { setActiveTab("properties"); setShowForm(false); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "properties" ? "bg-gold-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t.admin.manageProperties}
            </button>
          </div>
        </motion.div>

        {activeTab === "dashboard" && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="p-6 bg-card border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gold/10"><stat.icon className="w-5 h-5 text-gold" /></div>
                      {stat.pulse && <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-slow" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-heading text-3xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <Card className="lg:col-span-2 p-6 bg-card border-border">
                <h3 className="font-heading text-lg font-semibold mb-4">{t.admin.monthlyRevenue}</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 20% 18%)" />
                    <XAxis dataKey="month" stroke="hsl(220 15% 55%)" fontSize={12} />
                    <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222 40% 10%)", border: "1px solid hsl(222 20% 18%)", borderRadius: "8px", color: "hsl(40 20% 92%)" }} />
                    <Bar dataKey="revenue" fill="hsl(43 76% 52%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-heading text-lg font-semibold mb-1">{t.admin.n8nSync}</h3>
                <p className="text-xs text-muted-foreground mb-4">{t.admin.lastTriggers}</p>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{t.admin.systemHealth}</span>
                    <span className="text-gold font-medium">98%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold-gradient" style={{ width: "98%" }} />
                  </div>
                </div>
                <div className="space-y-3">
                  {workflows.map((w) => (
                    <div key={w.name + w.time} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {w.status === "success" ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertCircle className="w-4 h-4 text-warning" />}
                        <span className="text-sm">{w.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{w.time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* CRM Table */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-heading text-lg font-semibold mb-4">{t.admin.recentInquiries}</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead>{t.admin.name}</TableHead>
                      <TableHead>{t.admin.emailCol}</TableHead>
                      <TableHead>{t.admin.budgetCol}</TableHead>
                      <TableHead>{t.admin.interest}</TableHead>
                      <TableHead>{t.admin.status}</TableHead>
                      <TableHead>{t.admin.date}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                        <TableCell>{lead.budget}</TableCell>
                        <TableCell>{lead.interest}</TableCell>
                        <TableCell>{statusBadge(lead.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}

        {activeTab === "properties" && (
          <div>
            {showForm ? (
              <Card className="p-6 bg-card border-border">
                <AdminPropertyForm
                  property={editingProperty}
                  onSaved={handleFormSaved}
                  onCancel={() => { setShowForm(false); setEditingProperty(null); }}
                />
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-semibold">{t.admin.manageProperties}</h2>
                  <Button variant="hero" onClick={() => { setEditingProperty(null); setShowForm(true); }}>
                    <Plus size={16} className="mr-1.5" /> {t.admin.addProperty}
                  </Button>
                </div>

                {properties.length === 0 ? (
                  <Card className="p-12 bg-card border-border text-center">
                    <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t.admin.noProperties}</p>
                  </Card>
                ) : (
                  <Card className="bg-card border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead></TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {properties.map((p) => (
                            <TableRow key={p.id} className="border-border hover:bg-secondary/50">
                              <TableCell>
                                <img
                                  src={p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg"}
                                  alt=""
                                  className="w-16 h-12 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{p.title}</TableCell>
                              <TableCell className="text-muted-foreground">{p.district ? `${p.district}, ${p.province}` : p.province}</TableCell>
                              <TableCell className="capitalize">{p.property_type}</TableCell>
                              <TableCell>฿{p.price.toLocaleString()}</TableCell>
                              <TableCell>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  p.status === "available" ? "bg-success/20 text-success" :
                                  p.status === "reserved" ? "bg-warning/20 text-warning" :
                                  p.status === "sold" ? "bg-destructive/20 text-destructive" :
                                  "bg-secondary text-muted-foreground"
                                }`}>
                                  {p.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                                    <Pencil size={14} />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
