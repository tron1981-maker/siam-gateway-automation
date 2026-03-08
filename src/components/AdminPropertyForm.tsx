import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { X, Plus, Upload } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

interface Props {
  property?: PropertyRow | null;
  onSaved: () => void;
  onCancel: () => void;
}

const AMENITY_OPTIONS = [
  "Swimming Pool", "Gym", "Parking", "24h Security", "Rooftop", "Garden",
  "Sauna", "Tennis Court", "Children's Playground", "Concierge", "EV Charging",
  "Smart Home", "Private Pool", "Sea View", "City View", "River View"
];

const AdminPropertyForm = ({ property, onSaved, onCancel }: Props) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState<Partial<PropertyInsert>>({
    title: "",
    title_ko: "",
    description: "",
    description_ko: "",
    province: "Bangkok",
    district: "",
    address: "",
    nearby_bts: "",
    nearby_facilities: [],
    property_type: "condo",
    listing_type: "sale",
    ownership_type: "freehold",
    furnishing: "furnished",
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 0,
    land_area_sqm: null,
    floor_number: null,
    total_floors: null,
    year_built: null,
    price: 0,
    price_per_sqm: null,
    images: [],
    amenities: [],
    status: "available",
    featured: false,
    tag: "",
  });

  useEffect(() => {
    if (property) {
      setForm({ ...property });
    }
  }, [property]);

  const handleChange = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageUploading(true);

    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file);
      if (error) {
        toast.error(`Upload failed: ${file.name}`);
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("property-images").getPublicUrl(path);
      newImages.push(publicUrl);
    }

    setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    setImageUploading(false);
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      const current = prev.amenities || [];
      return {
        ...prev,
        amenities: current.includes(amenity)
          ? current.filter((a) => a !== amenity)
          : [...current, amenity],
      };
    });
  };

  const [facilityInput, setFacilityInput] = useState("");
  const addFacility = () => {
    if (!facilityInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      nearby_facilities: [...(prev.nearby_facilities || []), facilityInput.trim()],
    }));
    setFacilityInput("");
  };

  const removeFacility = (index: number) => {
    setForm((prev) => ({
      ...prev,
      nearby_facilities: (prev.nearby_facilities || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.area_sqm) {
      toast.error(t.adminForm.requiredFields);
      return;
    }
    setLoading(true);

    const payload: PropertyInsert = {
      title: form.title!,
      title_ko: form.title_ko || null,
      description: form.description || null,
      description_ko: form.description_ko || null,
      province: form.province || "Bangkok",
      district: form.district || null,
      address: form.address || null,
      nearby_bts: form.nearby_bts || null,
      nearby_facilities: form.nearby_facilities || [],
      property_type: form.property_type || "condo",
      listing_type: form.listing_type || "sale",
      ownership_type: form.ownership_type || "freehold",
      furnishing: form.furnishing || "furnished",
      bedrooms: form.bedrooms || 1,
      bathrooms: form.bathrooms || 1,
      area_sqm: form.area_sqm!,
      land_area_sqm: form.land_area_sqm || null,
      floor_number: form.floor_number || null,
      total_floors: form.total_floors || null,
      year_built: form.year_built || null,
      price: form.price!,
      price_per_sqm: form.price_per_sqm || null,
      images: form.images || [],
      amenities: form.amenities || [],
      status: form.status || "available",
      featured: form.featured || false,
      tag: form.tag || null,
    };

    let error;
    if (property) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", property.id));
    } else {
      ({ error } = await supabase.from("properties").insert(payload));
    }

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(property ? t.adminForm.updated : t.adminForm.created);
      onSaved();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">
          {property ? t.adminForm.editProperty : t.adminForm.addProperty}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title EN */}
        <div>
          <Label>{t.adminForm.titleEn} *</Label>
          <Input value={form.title || ""} onChange={(e) => handleChange("title", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.titleKo}</Label>
          <Input value={form.title_ko || ""} onChange={(e) => handleChange("title_ko", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label>{t.adminForm.descriptionEn}</Label>
          <Textarea value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="mt-1 bg-secondary border-border min-h-[100px]" />
        </div>
        <div className="md:col-span-2">
          <Label>{t.adminForm.descriptionKo}</Label>
          <Textarea value={form.description_ko || ""} onChange={(e) => handleChange("description_ko", e.target.value)} className="mt-1 bg-secondary border-border min-h-[100px]" />
        </div>

        {/* Location */}
        <div>
          <Label>{t.adminForm.province} *</Label>
          <Input value={form.province || ""} onChange={(e) => handleChange("province", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.district}</Label>
          <Input value={form.district || ""} onChange={(e) => handleChange("district", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.address}</Label>
          <Input value={form.address || ""} onChange={(e) => handleChange("address", e.target.value)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.nearbyBts}</Label>
          <Input value={form.nearby_bts || ""} onChange={(e) => handleChange("nearby_bts", e.target.value)} placeholder="e.g. Phrom Phong" className="mt-1 bg-secondary border-border" />
        </div>

        {/* Property details */}
        <div>
          <Label>{t.adminForm.propertyType}</Label>
          <Select value={form.property_type} onValueChange={(v) => handleChange("property_type", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="condo">Condominium</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t.adminForm.listingType}</Label>
          <Select value={form.listing_type} onValueChange={(v) => handleChange("listing_type", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t.adminForm.ownership}</Label>
          <Select value={form.ownership_type} onValueChange={(v) => handleChange("ownership_type", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="freehold">Freehold</SelectItem>
              <SelectItem value="leasehold">Leasehold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t.adminForm.furnishing}</Label>
          <Select value={form.furnishing || "furnished"} onValueChange={(v) => handleChange("furnishing", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="furnished">Furnished</SelectItem>
              <SelectItem value="partially_furnished">Partially Furnished</SelectItem>
              <SelectItem value="unfurnished">Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Numbers */}
        <div>
          <Label>{t.adminForm.bedrooms}</Label>
          <Input type="number" min={0} value={form.bedrooms || ""} onChange={(e) => handleChange("bedrooms", parseInt(e.target.value) || 0)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.bathrooms}</Label>
          <Input type="number" min={0} value={form.bathrooms || ""} onChange={(e) => handleChange("bathrooms", parseInt(e.target.value) || 0)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.areaSqm} *</Label>
          <Input type="number" min={0} value={form.area_sqm || ""} onChange={(e) => handleChange("area_sqm", parseFloat(e.target.value) || 0)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.landAreaSqm}</Label>
          <Input type="number" min={0} value={form.land_area_sqm || ""} onChange={(e) => handleChange("land_area_sqm", parseFloat(e.target.value) || null)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.floorNumber}</Label>
          <Input type="number" min={0} value={form.floor_number || ""} onChange={(e) => handleChange("floor_number", parseInt(e.target.value) || null)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.totalFloors}</Label>
          <Input type="number" min={0} value={form.total_floors || ""} onChange={(e) => handleChange("total_floors", parseInt(e.target.value) || null)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.yearBuilt}</Label>
          <Input type="number" min={1900} max={2030} value={form.year_built || ""} onChange={(e) => handleChange("year_built", parseInt(e.target.value) || null)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Pricing */}
        <div>
          <Label>{t.adminForm.price} (THB) *</Label>
          <Input type="number" min={0} value={form.price || ""} onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <Label>{t.adminForm.pricePerSqm}</Label>
          <Input type="number" min={0} value={form.price_per_sqm || ""} onChange={(e) => handleChange("price_per_sqm", parseFloat(e.target.value) || null)} className="mt-1 bg-secondary border-border" />
        </div>

        {/* Status */}
        <div>
          <Label>{t.adminForm.status}</Label>
          <Select value={form.status || "available"} onValueChange={(v) => handleChange("status", v)}>
            <SelectTrigger className="mt-1 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="off_market">Off Market</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{t.adminForm.tag}</Label>
          <Input value={form.tag || ""} onChange={(e) => handleChange("tag", e.target.value)} placeholder="e.g. Featured, New Listing" className="mt-1 bg-secondary border-border" />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <Switch checked={!!form.featured} onCheckedChange={(v) => handleChange("featured", v)} />
          <Label>{t.adminForm.featured}</Label>
        </div>
      </div>

      {/* Images */}
      <div>
        <Label className="mb-2 block">{t.adminForm.images}</Label>
        <div className="flex flex-wrap gap-3 mb-3">
          {(form.images || []).map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-gold/50 transition-colors">
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            {imageUploading ? (
              <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={20} className="text-muted-foreground" />
            )}
          </label>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <Label className="mb-2 block">{t.adminForm.amenities}</Label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                (form.amenities || []).includes(a)
                  ? "bg-gold/20 border-gold text-gold"
                  : "bg-secondary border-border text-muted-foreground hover:border-gold/30"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Facilities */}
      <div>
        <Label className="mb-2 block">{t.adminForm.nearbyFacilities}</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={facilityInput}
            onChange={(e) => setFacilityInput(e.target.value)}
            placeholder="e.g. Central Embassy 500m"
            className="bg-secondary border-border"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
          />
          <Button type="button" variant="heroOutline" size="sm" onClick={addFacility}>
            <Plus size={16} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.nearby_facilities || []).map((f, i) => (
            <span key={i} className="bg-secondary text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
              {f}
              <button onClick={() => removeFacility(i)}><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button variant="ghost" onClick={onCancel}>{t.adminForm.cancel}</Button>
        <Button variant="hero" onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : (property ? t.adminForm.save : t.adminForm.create)}
        </Button>
      </div>
    </div>
  );
};

export default AdminPropertyForm;
