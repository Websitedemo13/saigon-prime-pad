ALTER TABLE public.properties 
ADD COLUMN detail_sections jsonb NOT NULL DEFAULT '[]'::jsonb;