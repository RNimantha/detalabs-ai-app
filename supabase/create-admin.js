/**
 * Script to create an admin user in Supabase
 * 
 * Usage:
 * 1. Install bcryptjs: npm install bcryptjs
 * 2. Set environment variables:
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 3. Run: node supabase/create-admin.js
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
  rl.question('Enter admin email: ', async (email) => {
    rl.question('Enter admin password: ', async (password) => {
      rl.question('Enter admin name: ', async (name) => {
        try {
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
            console.error('Error creating admin:', error)
          } else {
            console.log('Admin user created successfully!')
            console.log('ID:', data.id)
            console.log('Email:', data.email)
            console.log('Name:', data.name)
          }
        } catch (error) {
          console.error('Error:', error)
        } finally {
          rl.close()
        }
      })
    })
  })
}

createAdmin()

