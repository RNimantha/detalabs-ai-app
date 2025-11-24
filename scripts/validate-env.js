/**
 * Validate required environment variables before build
 * This script will fail the build if required Supabase variables are missing
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
]

const optionalEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_FROM',
]

console.log('🔍 Validating environment variables...\n')

let hasErrors = false
const missing = []
const empty = []

// Check required variables
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (!value) {
    missing.push(varName)
    hasErrors = true
  } else if (value.trim() === '') {
    empty.push(varName)
    hasErrors = true
  } else {
    console.log(`✅ ${varName}: Set`)
  }
})

// Check optional variables
console.log('\n📋 Optional environment variables:')
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: Set`)
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`)
  }
})

if (hasErrors) {
  console.error('\n❌ Build failed: Missing required environment variables!\n')
  
  if (missing.length > 0) {
    console.error('Missing variables:')
    missing.forEach((varName) => {
      console.error(`  - ${varName}`)
    })
  }
  
  if (empty.length > 0) {
    console.error('\nEmpty variables:')
    empty.forEach((varName) => {
      console.error(`  - ${varName}`)
    })
  }
  
  console.error('\n💡 Please set these in Netlify Dashboard:')
  console.error('   Site Settings > Environment Variables\n')
  
  process.exit(1)
}

console.log('\n✅ All required environment variables are set!')
console.log('🚀 Proceeding with build...\n')

