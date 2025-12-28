/**
 * Debug Script: Check Sections in Database
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })
import { adminClient } from '../lib/supabase/admin'

async function debug() {
  console.log('Checking sections...\n')
  
  // Check pages
  const { data: pages } = await adminClient
    .from('pages')
    .select('id, slug, title, published')
    .order('slug')
  
  console.log(`Found ${pages?.length || 0} pages:\n`)
  
  for (const page of pages || []) {
    console.log(`${page.slug} (published: ${page.published})`)
    
    const { data: sections } = await adminClient
      .from('sections')
      .select('id, section_type, published, order_index')
      .eq('page_id', page.id)
      .order('order_index')
    
    if (sections && sections.length > 0) {
      sections.forEach((s: any) => {
        console.log(`  - ${s.section_type} (published: ${s.published}, order: ${s.order_index})`)
      })
    } else {
      console.log('  - No sections')
    }
    console.log('')
  }
}

debug().catch(console.error)

