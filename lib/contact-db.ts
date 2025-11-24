import { supabaseAdmin } from '@/supabase/server'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
  updated_at: string
}

export async function createContactSubmission(
  name: string,
  email: string,
  subject: string | null,
  message: string
): Promise<{ id: string }> {
  const { data, error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .insert({
      name,
      email,
      subject,
      message,
      status: 'new',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating contact submission:', error)
    throw new Error(`Failed to create contact submission: ${error.message}`)
  }

  return { id: data.id }
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact submissions:', error)
    throw new Error(`Failed to fetch contact submissions: ${error.message}`)
  }

  return data || []
}

export async function getContactSubmissionById(id: string): Promise<ContactSubmission | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching contact submission:', error)
    return null
  }

  return data
}

export async function updateContactSubmissionStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating contact submission:', error)
    throw new Error(`Failed to update contact submission: ${error.message}`)
  }
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact submission:', error)
    throw new Error(`Failed to delete contact submission: ${error.message}`)
  }
}

export async function getContactStats() {
  const { data, error } = await supabaseAdmin
    .from('blog_contact_submissions')
    .select('status')

  if (error) {
    console.error('Error fetching contact stats:', error)
    throw new Error(`Failed to fetch contact stats: ${error.message}`)
  }

  const total = data?.length || 0
  const newCount = data?.filter((s) => s.status === 'new').length || 0
  const readCount = data?.filter((s) => s.status === 'read').length || 0
  const repliedCount = data?.filter((s) => s.status === 'replied').length || 0
  const archivedCount = data?.filter((s) => s.status === 'archived').length || 0

  return {
    total,
    new: newCount,
    read: readCount,
    replied: repliedCount,
    archived: archivedCount,
  }
}

