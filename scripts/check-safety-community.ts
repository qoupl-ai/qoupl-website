/**
 * Check Safety and Community Guidelines Content
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkPage(slug: string) {
  console.log(`\n=== ${slug} ===`)
  
  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()
  
  if (!page) {
    console.log('Page not found')
    return
  }
  
  const { data: sections } = await supabase
    .from('sections')
    .select('section_type, content')
    .eq('page_id', page.id)
    .eq('published', true)
  
  console.log(`Found ${sections?.length || 0} sections`)
  
  sections?.forEach((s, i) => {
    console.log(`\nSection ${i + 1}: ${s.section_type}`)
    console.log('Content structure:', JSON.stringify(s.content, null, 2).substring(0, 500))
  })
}

async function main() {
  await checkPage('safety')
  await checkPage('community-guidelines')
}

main().catch(console.error)

