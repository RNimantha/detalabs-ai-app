# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

## 2. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 3. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/complete-schema.sql` to create all tables (recommended)
   OR run `supabase/schema.sql` and `supabase/interactions-schema.sql` and `supabase/contact-schema.sql` separately

## 4. Create Storage Bucket

### Option A: Use the Setup Script (Recommended)

Run the setup script to automatically create the bucket:

```bash
node supabase/setup-storage.js
```

Then run the storage policies SQL (see below).

### Option B: Manual Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `blog-images`
3. Set it to **Public** bucket
4. Enable RLS (Row Level Security)
5. Run the SQL from `supabase/storage-policies.sql` in SQL Editor

## 5. Create Admin User

Run this SQL in Supabase SQL Editor to create your first admin user:

```sql
-- Replace with your desired email and password
-- Password will be hashed automatically
INSERT INTO blog_admin_users (email, password, name)
VALUES (
  'admin@detalabsai.com',
  '$2b$10$YourHashedPasswordHere', -- Use bcrypt to hash your password
  'Admin User'
);
```

Or use this Node.js script to create an admin:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hashed = await bcrypt.hash(password, 10);
console.log(hashed); // Use this in the SQL INSERT above
```

## 6. Storage Policies

After creating the storage bucket, run the storage policies SQL:

1. Go to Supabase SQL Editor
2. Run the SQL from `supabase/storage-policies.sql`

Or copy and paste this SQL:

```sql
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
```

## 7. Fix RLS Policy (If Blogs Not Showing)

If your blogs exist in the database but don't show on the frontend, run this SQL:

```sql
-- Fix RLS Policy
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON blog_blogs;
CREATE POLICY "Public blogs are viewable by everyone" 
ON blog_blogs
FOR SELECT 
USING (is_public = true);
```

Or use the file: `supabase/fix-rls-policy.sql`

## 8. Test the Setup

1. Start your dev server: `npm run dev`
2. Go to `/admin/login`
3. Login with your admin credentials
4. You should be redirected to `/admin/uploader`
5. Visit `/blog` to see your published blogs

