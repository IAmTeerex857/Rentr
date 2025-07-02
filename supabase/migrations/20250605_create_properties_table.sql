-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  purpose TEXT NOT NULL CHECK (purpose IN ('rent', 'sale')),
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area DECIMAL(10, 2) NOT NULL,
  area_unit TEXT NOT NULL DEFAULT 'm²',
  property_type TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented'))
);

-- Create RLS policies for properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policy for viewing properties (anyone can view active properties)
CREATE POLICY "Anyone can view active properties" 
  ON public.properties 
  FOR SELECT 
  USING (status = 'active');

-- Policy for inserting properties (authenticated users only)
CREATE POLICY "Users can insert their own properties" 
  ON public.properties 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Policy for updating properties (owners only)
CREATE POLICY "Users can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Policy for deleting properties (owners only)
CREATE POLICY "Users can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS properties_location_idx ON public.properties USING gin (location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_property_type_idx ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties (price);
CREATE INDEX IF NOT EXISTS properties_purpose_idx ON public.properties (purpose);
CREATE INDEX IF NOT EXISTS properties_owner_id_idx ON public.properties (owner_id);
