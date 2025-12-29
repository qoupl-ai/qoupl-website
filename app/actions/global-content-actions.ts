/**
 * Global Content Actions
 * 
 * Server actions for updating global content (navbar, footer, etc.)
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { getGlobalContentSchema } from '@/lib/validation/global-content-schemas'

export async function updateGlobalContent(
  key: string,
  content: Record<string, unknown>
) {
  // Assert admin access - single source of truth for authorization
  await assertAdmin()

  const schema = getGlobalContentSchema(key)
  if (schema) {
    const parsed = schema.safeParse(content)
    if (!parsed.success) {
      throw new Error(`Invalid global content for "${key}": ${parsed.error.message}`)
    }
    content = parsed.data as Record<string, unknown>
  }

  // Use regular client (RLS will enforce admin access)
  const supabase = await createClient()
  const { error } = await supabase
    .from('global_content')
    .upsert({
      key,
      content,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(`Failed to update global content: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content/global')
  revalidatePath('/') // Homepage uses global content
}
