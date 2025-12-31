import * as dotenv from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function check() {
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'home').single()
  
  if (!page) {
    console.error('Page not found')
    return
  }
  
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', page.id)
    .order('order_index')
  
  console.log('Sections:', sections?.map(s => ({ 
    type: s.component_type, 
    order: s.order_index, 
    published: s.published 
  })))
}

check()

