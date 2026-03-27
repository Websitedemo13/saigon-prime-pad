
-- Create site_content table for CMS
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read content (public website)
CREATE POLICY "Anyone can read site content"
ON public.site_content FOR SELECT
USING (true);

-- Anyone can update (no auth required as per user request)
CREATE POLICY "Anyone can update site content"
ON public.site_content FOR UPDATE
USING (true);

-- Anyone can insert
CREATE POLICY "Anyone can insert site content"
ON public.site_content FOR INSERT
WITH CHECK (true);

-- Anyone can delete
CREATE POLICY "Anyone can delete site content"
ON public.site_content FOR DELETE
USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default content for each section
INSERT INTO public.site_content (section_key, content) VALUES
('logo', '{"text": "VSM", "subtitle": "Real Estate", "imageUrl": ""}'),
('hero', '{"title": "Đầu Tư Bất Động Sản Thông Minh Tại TP.HCM", "subtitle": "Khám phá những cơ hội đầu tư sinh lời cao nhất tại thị trường bất động sản sôi động nhất Việt Nam cùng đội ngũ chuyên gia hàng đầu VSM Real Estate", "videoUrl": ""}'),
('about', '{"title": "Về VSM Real Estate", "description": "Với hơn 15 năm kinh nghiệm trong lĩnh vực bất động sản, VSM Real Estate tự hào là đối tác tin cậy của hàng nghìn nhà đầu tư thông minh tại TP.HCM", "stats": [{"label": "Năm kinh nghiệm", "value": "15+"}, {"label": "Dự án thành công", "value": "500+"}, {"label": "Khách hàng tin tưởng", "value": "10K+"}, {"label": "Tỷ lệ hài lòng", "value": "98%"}], "videoUrl": ""}'),
('reviews', '{"title": "Khách Hàng Nói Gì Về VSM", "subtitle": "Hàng nghìn khách hàng đã tin tưởng lựa chọn VSM Real Estate"}'),
('contact', '{"title": "Liên Hệ Với Chúng Tôi", "subtitle": "Đừng chần chừ, hãy để VSM Real Estate đồng hành cùng bạn", "phone": "0123.456.789", "email": "info@vsm-realestate.com", "address": "123 Nguyễn Huệ, Quận 1, TP.HCM"}'),
('footer', '{"companyName": "VSM Real Estate", "description": "Đối tác tin cậy trong lĩnh vực bất động sản cao cấp tại TP.HCM", "copyright": "© 2024 VSM Real Estate. All rights reserved."}');
