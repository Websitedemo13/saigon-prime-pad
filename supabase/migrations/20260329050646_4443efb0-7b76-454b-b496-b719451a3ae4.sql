ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude double precision DEFAULT NULL;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude double precision DEFAULT NULL;

UPDATE public.properties SET latitude = 10.7942, longitude = 106.7214 WHERE slug = 'can-ho-cao-cap-vinhomes-central-park';
UPDATE public.properties SET latitude = 10.7952, longitude = 106.7220 WHERE slug = 'penthouse-landmark-81-skyview';
UPDATE public.properties SET latitude = 10.7865, longitude = 106.7510 WHERE slug = 'shophouse-the-sun-avenue';
UPDATE public.properties SET latitude = 10.8456, longitude = 106.8120 WHERE slug = 'biet-thu-vuon-ecopark-riverside';
UPDATE public.properties SET latitude = 10.8032, longitude = 106.7445 WHERE slug = 'can-ho-studio-masteri-an-phu';
UPDATE public.properties SET latitude = 10.7720, longitude = 106.7230 WHERE slug = 'dat-nen-khu-do-thi-sala';
UPDATE public.properties SET latitude = 10.7717, longitude = 106.7044 WHERE slug = 'van-phong-hang-a-bitexco';
UPDATE public.properties SET latitude = 10.7980, longitude = 106.7620 WHERE slug = 'nha-pho-lakeview-city';
UPDATE public.properties SET latitude = 10.7295, longitude = 106.7185 WHERE slug = 'can-ho-the-ascentia-phu-my-hung';