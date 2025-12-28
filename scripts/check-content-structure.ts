/**
 * Check Content Structure
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkContent(slug: string) {
  console.log(`\nChecking ${slug}...`)
  
  const { data: page } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()
  
  if (!page) return
  
  const { data: sections } = await supabase
    .from('sections')
    .select('section_type, content')
    .eq('page_id', page.id)
    .eq('published', true)
    .limit(1)
  
  if (sections && sections.length > 0) {
    const firstSection = sections[0]!
    console.log(`Component type: ${firstSection.section_type}`)
    console.log(`Content keys:`, Object.keys(firstSection.content || {}))
    console.log(`Content sample:`, JSON.stringify(firstSection.content, null, 2).substring(0, 200))
  }
}

async function main() {
  await checkContent('faq')
  await checkContent('about')
  await checkContent('home')
}

main().catch(console.error)

