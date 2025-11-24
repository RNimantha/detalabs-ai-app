-- Storage Policies for blog-images bucket
-- Run this in Supabase SQL Editor after creating the blog-images bucket

-- Allow public read access to blog-images bucket
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects
FOR SELECT 
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload (admin only via service role)
CREATE POLICY IF NOT EXISTS "Authenticated users can upload" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated users to update their own uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete" ON storage.objects
FOR DELETE 
USING (bucket_id = 'blog-images');

