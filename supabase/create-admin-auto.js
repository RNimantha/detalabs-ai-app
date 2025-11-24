/**
 * Auto-create admin user script
 * Creates admin user with predefined credentials
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
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

async function createAdmin() {
  try {
    const email = 'admin@detalabsai.com'
    const password = 'DetaLabs2024!Admin'
    const name = 'Admin User'
    
    console.log('Creating admin user...')
    console.log('Email:', email)
    console.log('Name:', name)
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('blog_admin_users')
      .insert({
        email,
        password: hashedPassword,
        name,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        console.log('Admin user already exists with this email.')
        console.log('If you want to reset the password, delete the existing user first or update it.')
      } else {
        console.error('Error creating admin:', error)
      }
    } else {
      console.log('\n✅ Admin user created successfully!')
      console.log('ID:', data.id)
      console.log('Email:', data.email)
      console.log('Name:', data.name)
      console.log('\n📝 Login Credentials:')
      console.log('Email: admin@detalabsai.com')
      console.log('Password: DetaLabs2024!Admin')
      console.log('\n⚠️  Please save this password securely!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdmin()

