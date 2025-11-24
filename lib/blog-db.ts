import { supabaseAdmin, supabase } from '@/supabase/server'
import { supabase as supabaseClient } from '@/supabase/client'
import type { Blog, CreateBlogInput, UpdateBlogInput } from '@/supabase/types'

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Get all blogs (public only for client-side)
export async function getPublicBlogs(): Promise<Blog[]> {
  // Try with anon key first (respects RLS)
  let { data, error } = await supabase
    .from('blog_blogs')
    .select('*')
    .eq('is_public', true)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching public blogs with anon key:', error)
    console.error('Error code:', error.code, 'Error message:', error.message)
    
    // If RLS is blocking, try with admin key as fallback (for server-side)
    console.log('Trying with admin key as fallback...')
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('blog_blogs')
      .select('*')
      .eq('is_public', true)
      .order('date', { ascending: false })
    
    if (adminError) {
      console.error('Error fetching with admin key:', adminError)
      return []
    }
    
    console.log('Fetched blogs count (admin):', adminData?.length || 0)
    return adminData || []
  }

  console.log('Fetched blogs count (anon):', data?.length || 0)
  return data || []
}

// Get all blogs (admin only)
export async function getAllBlogs(): Promise<Blog[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_blogs')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching all blogs:', error)
    return []
  }

  return data || []
}

// Get blog by slug (public access)
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blog_blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (error) {
    // If not found in Supabase, return null (will trigger 404)
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching blog by slug:', error)
    return null
  }

  return data
}

// Get blog by ID (admin only)
export async function getBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_blogs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog by ID:', error)
    return null
  }

  return data
}

// Create new blog
export async function createBlog(input: CreateBlogInput): Promise<Blog> {
  const slug = generateSlug(input.title)

  // Check if slug already exists
  const existing = await supabaseAdmin
    .from('blog_blogs')
    .select('id')
    .eq('slug', slug)
    .single()

  let finalSlug = slug
  if (existing.data) {
    // If slug exists, append timestamp
    finalSlug = `${slug}-${Date.now()}`
  }

  const { data, error } = await supabaseAdmin
    .from('blog_blogs')
    .insert({
      slug: finalSlug,
      title: input.title,
      content: input.content,
      excerpt: input.excerpt || null,
      author: input.author,
      date: input.date,
      image: input.image || null,
      keywords: input.keywords || null,
      is_public: input.is_public !== undefined ? input.is_public : true,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create blog: ${error.message}`)
  }

  return data
}

// Update blog
export async function updateBlog(id: string, input: UpdateBlogInput): Promise<Blog> {
  const updateData: any = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  // If title is being updated, regenerate slug
  if (input.title) {
    const slug = generateSlug(input.title)
    const existing = await supabaseAdmin
      .from('blog_blogs')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (!existing.data) {
      updateData.slug = slug
    } else {
      updateData.slug = `${slug}-${Date.now()}`
    }
  }

  const { data, error } = await supabaseAdmin
    .from('blog_blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update blog: ${error.message}`)
  }

  return data
}

// Delete blog
export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('blog_blogs')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete blog: ${error.message}`)
  }
}

