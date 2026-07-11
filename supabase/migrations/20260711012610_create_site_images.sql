-- Create site_images table
CREATE TABLE public.site_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  recommended_aspect_ratio TEXT NOT NULL,
  max_file_size TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_images TO anon, authenticated;
GRANT ALL ON public.site_images TO service_role;

ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site images" ON public.site_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage site images" ON public.site_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_site_images_updated_at
  BEFORE UPDATE ON public.site_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.site_images (key, name, url, recommended_aspect_ratio, max_file_size) VALUES
  ('home_hero', 'Home Page Hero', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1280&fit=crop&q=90', '3:2 (Horizontal)', '5MB'),
  ('editorial_section', 'Editorial Section Image', 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&h=1125&fit=crop&q=90', '4:5 (Portrait)', '3MB'),
  ('about_hero', 'About Page Hero', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop', '16:9 (Landscape)', '5MB'),
  ('about_founders', 'About Page Founders Photo', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop', '4:5 (Portrait)', '3MB')
ON CONFLICT (key) DO NOTHING;

-- Create Storage Bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable storage RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage policies for site-images bucket
CREATE POLICY "Public Access site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

CREATE POLICY "Admin Upload site-images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin Update site-images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin Delete site-images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'));
