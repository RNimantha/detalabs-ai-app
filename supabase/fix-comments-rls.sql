-- Fix RLS Policies for blog_comments to allow public inserts
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Public can add comments" ON blog_comments;

-- Create policy for viewing approved comments
CREATE POLICY "Public can view approved comments" 
ON blog_comments
FOR SELECT 
USING (is_approved = true);

-- Create policy for inserting comments (allow anyone to insert)
CREATE POLICY "Public can add comments" 
ON blog_comments
FOR INSERT 
WITH CHECK (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'blog_comments';

