
-- Create a public storage bucket for site media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

-- Allow anyone to upload files to the bucket
CREATE POLICY "Anyone can upload site media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'site-media');

-- Allow anyone to read files from the bucket
CREATE POLICY "Anyone can read site media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-media');

-- Allow anyone to update files in the bucket
CREATE POLICY "Anyone can update site media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'site-media');

-- Allow anyone to delete files in the bucket
CREATE POLICY "Anyone can delete site media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'site-media');
