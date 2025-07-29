export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
}
