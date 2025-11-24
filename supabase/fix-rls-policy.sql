-- Fix RLS Policy for blog_blogs to allow public read access
-- Run this in Supabase SQL Editor

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON blog_blogs;

-- Create the policy with proper permissions
CREATE POLICY "Public blogs are viewable by everyone" 
ON blog_blogs
FOR SELECT 
USING (is_public = true);

-- Verify the policy exists
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'blog_blogs';

-- Test query (should return public blogs)
SELECT id, slug, title, is_public 
FROM blog_blogs 
WHERE is_public = true;

