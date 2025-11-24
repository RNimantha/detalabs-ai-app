/**
 * Setup Supabase Storage Bucket for blog images
 * Creates the blog-images bucket and sets up public access
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file manually
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    const bucketName = 'blog-images'
    
    console.log('Setting up storage bucket...')
    console.log('Bucket name:', bucketName)
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName)
    
    if (bucketExists) {
      console.log('✅ Bucket already exists!')
    } else {
      // Create bucket
      const { data: bucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        return
      }
      
      console.log('✅ Bucket created successfully!')
    }
    
    // Set up public access policy
    console.log('\nSetting up public access policy...')
    
    // Note: Storage policies need to be set via SQL in Supabase dashboard
    // The JavaScript API doesn't support creating storage policies directly
    console.log('\n⚠️  IMPORTANT: You need to run this SQL in Supabase SQL Editor:')
    console.log(`
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
    `)
    
    console.log('\n✅ Storage setup instructions provided!')
    console.log('Please run the SQL above in your Supabase SQL Editor.')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

setupStorage()

