/**
 * Test Page Query - Uses same client as pages
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPageQuery(slug: string) {
  console.log(`\nTesting ${slug}...`)
  
  // Get page
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id, slug, title, published')
    .eq('slug', slug)
    .maybeSingle()
  
  if (pageError) {
    console.error(`❌ Page error:`, pageError)
    return
  }
  
  if (!page) {
    console.error(`❌ Page not found`)
    return
  }
  
  console.log(`✅ Page found: ${page.title} (published: ${page.published})`)
  
  // Get sections
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('id, component_type, published, order_index')
    .eq('page_id', page.id)
    .order('order_index')
  
  if (sectionsError) {
    console.error(`❌ Sections error:`, sectionsError)
    return
  }
  
  console.log(`✅ Found ${sections?.length || 0} sections:`)
  sections?.forEach(s => {
    console.log(`   - ${s.component_type} (published: ${s.published})`)
  })
}

async function main() {
  await testPageQuery('faq')
  await testPageQuery('about')
  await testPageQuery('home')
}

main().catch(console.error)

