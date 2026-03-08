
-- Create property type enum
CREATE TYPE public.property_type AS ENUM ('condo', 'villa', 'penthouse', 'house', 'townhouse', 'land');

-- Create ownership type enum  
CREATE TYPE public.ownership_type AS ENUM ('freehold', 'leasehold');

-- Create furnishing enum
CREATE TYPE public.furnishing_type AS ENUM ('furnished', 'unfurnished', 'partially_furnished');

-- Create property status enum
CREATE TYPE public.property_status AS ENUM ('available', 'sold', 'reserved', 'off_market');

-- Create listing type enum
CREATE TYPE public.listing_type AS ENUM ('sale', 'rent');

-- Create properties table with comprehensive Thai real estate fields
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic info
  title TEXT NOT NULL,
  title_ko TEXT,
  description TEXT,
  description_ko TEXT,
  
  -- Location
  province TEXT NOT NULL DEFAULT 'Bangkok',
  district TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  nearby_bts TEXT,
  nearby_facilities TEXT[],
  
  -- Property details
  property_type public.property_type NOT NULL DEFAULT 'condo',
  listing_type public.listing_type NOT NULL DEFAULT 'sale',
  ownership_type public.ownership_type NOT NULL DEFAULT 'freehold',
  furnishing public.furnishing_type DEFAULT 'furnished',
  
  -- Dimensions
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  area_sqm NUMERIC(10,2) NOT NULL,
  land_area_sqm NUMERIC(10,2),
  
  -- Building info
  floor_number INTEGER,
  total_floors INTEGER,
  year_built INTEGER,
  
  -- Pricing
  price NUMERIC(15,2) NOT NULL,
  price_per_sqm NUMERIC(10,2),
  
  -- Media
  images TEXT[] DEFAULT '{}',
  
  -- Amenities / Features
  amenities TEXT[] DEFAULT '{}',
  
  -- Status
  status public.property_status NOT NULL DEFAULT 'available',
  featured BOOLEAN DEFAULT false,
  tag TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public read policy (everyone can view available properties)
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (true);

-- Only authenticated users can insert (admin)
CREATE POLICY "Authenticated users can insert properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update  
CREATE POLICY "Authenticated users can update properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for common queries
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_province ON public.properties(province);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_featured ON public.properties(featured);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies
CREATE POLICY "Property images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');
