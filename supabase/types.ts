export interface AdminUser {
  id: string
  email: string
  password: string
  name: string
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  author: string
  date: string
  image: string | null
  keywords: string[] | null
  is_public: boolean
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
}

export interface BlogLike {
  id: string
  blog_id: string
  user_ip: string
  user_agent: string | null
  created_at: string
}

export interface BlogComment {
  id: string
  blog_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface BlogView {
  id: string
  blog_id: string
  user_ip: string
  user_agent: string | null
  viewed_at: string
}

export interface BlogImage {
  id: string
  blog_id: string
  image_url: string
  alt_text: string | null
  created_at: string
}

export interface AdminSession {
  id: string
  admin_id: string
  session_token: string
  expires_at: string
  created_at: string
}

export interface CreateBlogInput {
  title: string
  content: string
  excerpt?: string
  author: string
  date: string
  image?: string
  keywords?: string[]
  is_public?: boolean
}

export interface UpdateBlogInput {
  title?: string
  content?: string
  excerpt?: string
  author?: string
  date?: string
  image?: string
  keywords?: string[]
  is_public?: boolean
}

