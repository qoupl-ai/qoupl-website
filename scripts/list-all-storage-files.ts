import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function listAllFiles() {
  console.log('📋 Listing all storage files...\n')

  const { data: women } = await adminClient.storage.from('hero-images').list('women', { limit: 100 })
  const { data: men } = await adminClient.storage.from('hero-images').list('men', { limit: 100 })

  console.log(`\n👩 Women images (${women?.length || 0}):`)
  women?.forEach(f => console.log(`  - ${f.name}`))

  console.log(`\n👨 Men images (${men?.length || 0}):`)
  men?.forEach(f => console.log(`  - ${f.name}`))
}

listAllFiles()
