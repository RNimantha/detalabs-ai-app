/**
 * Update admin user password script
 * Updates password for existing admin user
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

async function updateAdminPassword() {
  try {
    const email = 'admin@detalabsai.com'
    const newPassword = 'DetaLabs2024!Admin'
    
    console.log('Updating admin user password...')
    console.log('Email:', email)
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { data, error } = await supabase
      .from('blog_admin_users')
      .update({
        password: hashedPassword,
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      console.error('Error updating password:', error)
    } else {
      console.log('\n✅ Admin password updated successfully!')
      console.log('Email:', data.email)
      console.log('Name:', data.name)
      console.log('\n📝 Updated Login Credentials:')
      console.log('Email: admin@detalabsai.com')
      console.log('Password: DetaLabs2024!Admin')
      console.log('\n⚠️  Please save this password securely!')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

updateAdminPassword()

