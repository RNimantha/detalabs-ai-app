-- Complete Blog Schema with Interactions
-- Run this file in Supabase SQL Editor to set up everything

-- Admin users table
CREATE TABLE IF NOT EXISTS blog_admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Blogs table
CREATE TABLE IF NOT EXISTS blog_blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  image VARCHAR(500),
  keywords TEXT[],
  is_public BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add columns if they don't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_blogs' AND column_name = 'view_count') THEN
    ALTER TABLE blog_blogs ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_blogs' AND column_name = 'like_count') THEN
    ALTER TABLE blog_blogs ADD COLUMN like_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Blog images table (for Supabase Storage references)
CREATE TABLE IF NOT EXISTS blog_blog_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID REFERENCES blog_blogs(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS blog_admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES blog_admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS blog_contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, read, replied, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_blogs_slug ON blog_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blog_blogs_is_public ON blog_blogs(is_public);
CREATE INDEX IF NOT EXISTS idx_blog_blogs_date ON blog_blogs(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_admin_sessions_token ON blog_admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_blog_admin_sessions_expires ON blog_admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_ip ON blog_likes(user_ip);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_is_approved ON blog_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_user_ip ON blog_views(user_ip);
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_email ON blog_contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_status ON blog_contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_created_at ON blog_contact_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_blog_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blogs (public read access)
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON blog_blogs;
CREATE POLICY "Public blogs are viewable by everyone" ON blog_blogs
  FOR SELECT USING (is_public = true);

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

-- RLS Policies for contact submissions (public insert)
DROP POLICY IF EXISTS "Public can submit contact forms" ON blog_contact_submissions;
CREATE POLICY "Public can submit contact forms" ON blog_contact_submissions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for admin operations (will be handled by service role key)
-- Admin operations bypass RLS when using service role key

