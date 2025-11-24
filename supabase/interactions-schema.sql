-- Additional schema for blog interactions
-- Run this AFTER running the main schema.sql

-- Add view_count and like_count columns to blog_blogs if they don't exist
ALTER TABLE blog_blogs 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Blog likes table
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blog_blogs(id) ON DELETE CASCADE,
  user_ip VARCHAR(45) NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(blog_id, user_ip)
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blog_blogs(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blog views table (for tracking unique views)
CREATE TABLE IF NOT EXISTS blog_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blog_blogs(id) ON DELETE CASCADE,
  user_ip VARCHAR(45) NOT NULL,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_ip ON blog_likes(user_ip);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_is_approved ON blog_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_user_ip ON blog_views(user_ip);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for likes (public read, insert)
DROP POLICY IF EXISTS "Public can view likes" ON blog_likes;
CREATE POLICY "Public can view likes" ON blog_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can like blogs" ON blog_likes;
CREATE POLICY "Public can like blogs" ON blog_likes
  FOR INSERT WITH CHECK (true);

-- RLS Policies for comments (public read approved, insert)
DROP POLICY IF EXISTS "Public can view approved comments" ON blog_comments;
CREATE POLICY "Public can view approved comments" ON blog_comments
  FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public can add comments" ON blog_comments;
CREATE POLICY "Public can add comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

-- RLS Policies for views (public insert)
DROP POLICY IF EXISTS "Public can track views" ON blog_views;
CREATE POLICY "Public can track views" ON blog_views
  FOR INSERT WITH CHECK (true);

