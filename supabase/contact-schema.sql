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
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_email ON blog_contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_status ON blog_contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_blog_contact_submissions_created_at ON blog_contact_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can view, public can insert
DROP POLICY IF EXISTS "Public can submit contact forms" ON blog_contact_submissions;
CREATE POLICY "Public can submit contact forms" ON blog_contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admin operations bypass RLS when using service role key

