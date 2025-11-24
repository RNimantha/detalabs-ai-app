/**
 * Setup Contact Submissions Table in Supabase
 * Creates the blog_contact_submissions table and RLS policies
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

async function setupContactSchema() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'contact-schema.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📋 Contact Schema SQL:')
    console.log('=' .repeat(60))
    console.log(sql)
    console.log('=' .repeat(60))
    console.log('\n')
    
    // Attempt to execute via RPC (if available) or provide instructions
    console.log('⚠️  Supabase JavaScript client cannot execute arbitrary SQL for security reasons.')
    console.log('📝 Please run this SQL in your Supabase SQL Editor:\n')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the SQL above')
    console.log('4. Click "Run" to execute\n')
    
    // Try to check if table exists using a query
    console.log('🔍 Checking if table already exists...')
    const { data, error } = await supabase
      .from('blog_contact_submissions')
      .select('id')
      .limit(1)
    
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.log('❌ Table does not exist yet. Please run the SQL above to create it.')
      } else {
        console.log('⚠️  Could not check table status:', error.message)
        console.log('Please run the SQL above in Supabase SQL Editor.')
      }
    } else {
      console.log('✅ Table already exists!')
      console.log('If you need to update it, run the SQL above in Supabase SQL Editor.')
    }
    
  } catch (error) {
    console.error('Error:', error)
    console.log('\n📝 Please manually run the SQL from supabase/contact-schema.sql in your Supabase SQL Editor.')
  }
}

setupContactSchema()

