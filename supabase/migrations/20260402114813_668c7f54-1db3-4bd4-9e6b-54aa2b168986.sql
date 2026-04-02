
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  service TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read contact submissions"
ON public.contact_submissions FOR SELECT
USING (true);

CREATE POLICY "Anyone can update contact submissions"
ON public.contact_submissions FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete contact submissions"
ON public.contact_submissions FOR DELETE
USING (true);

CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
