
CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  location text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  price_num numeric NOT NULL DEFAULT 0,
  price_per_m2 text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  area_num numeric NOT NULL DEFAULT 0,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT '',
  roi text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  gallery text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  description text NOT NULL DEFAULT '',
  amenities text[] NOT NULL DEFAULT '{}',
  developer text NOT NULL DEFAULT '',
  year_built text NOT NULL DEFAULT '',
  floors integer NOT NULL DEFAULT 0,
  parking text NOT NULL DEFAULT '',
  nearby_places text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read properties" ON public.properties FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert properties" ON public.properties FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update properties" ON public.properties FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete properties" ON public.properties FOR DELETE TO public USING (true);

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
