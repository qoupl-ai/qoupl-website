/**
 * Check Sections Table Schema
 * 
 * This script checks what columns actually exist in the sections table
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkSchema() {
  console.log('\n🔍 Checking sections table schema...\n')

  // Get one section to see what fields it has
  const { data: sample, error } = await adminClient
    .from('sections')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('❌ Error:', error)
    
    // Try to get table info via raw query
    const { data: tableInfo, error: tableError } = await adminClient.rpc('exec_sql', {
      query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'sections'
        ORDER BY ordinal_position;
      `
    })
    
    if (tableError) {
      console.error('❌ Could not get table info:', tableError)
    } else {
      console.log('📊 Table columns:')
      console.log(tableInfo)
    }
    return
  }

  if (sample) {
    console.log('✅ Sample section found:')
    console.log('📋 Columns:', Object.keys(sample))
    console.log('\n📄 Sample data:')
    console.log(JSON.stringify(sample, null, 2))
  } else {
    console.log('⚠️  No sections found')
  }
}

checkSchema().catch(console.error)

