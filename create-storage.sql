-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true);

-- Enable RLS for the bucket
CREATE POLICY "Give users authenticated access to files" ON storage.objects
  FOR ALL USING (bucket_id = 'files' AND auth.role() = 'authenticated');

SELECT 'Storage bucket created successfully!' as message;
