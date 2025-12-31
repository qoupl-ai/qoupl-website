/**
 * Database Structure Verification Script
 * 
 * Queries actual Supabase database to verify table structure
 * Run: npm run verify:db
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

interface TableInfo {
  table: string
  columns: string[]
  issues: string[]
}

async function verifyDatabaseStructure() {
  console.log('🔍 Verifying Database Structure...\n')
  console.log('=' .repeat(60))

  const results: TableInfo[] = []
  const keyTables = [
    'pages',
    'sections',
    'global_content',
    'blog_posts',
    'blog_categories',
    'faqs',
    'faq_categories',
    'features',
    'feature_categories',
    'pricing_plans',
    'media',
    'waitlist_signups',
    'contact_submissions',
    'content_history',
    'admin_users'
  ]

  // 1. Check which tables exist
  console.log('\n📊 STEP 1: Checking which tables exist...\n')
  
  for (const table of keyTables) {
    try {
      // Try to query the table (will fail if doesn't exist)
      const { data, error } = await adminClient
        .from(table)
        .select('*')
        .limit(0) // Just check if table exists

      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log(`❌ ${table}: Table does NOT exist`)
        } else {
          console.log(`⚠️  ${table}: Error - ${error.message}`)
        }
      } else {
        console.log(`✅ ${table}: Table exists`)
        
        // Get sample row to see actual columns
        const { data: sample } = await adminClient
          .from(table)
          .select('*')
          .limit(1)
          .maybeSingle()

        if (sample) {
          const columns = Object.keys(sample)
          results.push({
            table,
            columns,
            issues: []
          })
        } else {
          // Table exists but empty, try to get schema from TypeScript types
          results.push({
            table,
            columns: [],
            issues: ['Table exists but is empty - cannot determine columns']
          })
        }
      }
    } catch (err: any) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }

  // 2. Analyze columns for key tables
  console.log('\n\n📋 STEP 2: Analyzing column structure...\n')
  console.log('=' .repeat(60))

  const tablesToAnalyze = ['pages', 'sections', 'waitlist_signups', 'contact_submissions', 'blog_posts']

  for (const table of tablesToAnalyze) {
    const tableInfo = results.find(r => r.table === table)
    if (!tableInfo || tableInfo.columns.length === 0) {
      console.log(`\n⚠️  ${table}: Skipping (table not found or empty)`)
      continue
    }

    console.log(`\n📌 ${table.toUpperCase()}:`)
    console.log(`   Columns (${tableInfo.columns.length}): ${tableInfo.columns.join(', ')}`)

    // Check for specific issues
    const issues: string[] = []

    // Check sections.component_type
    if (table === 'sections') {
      if (tableInfo.columns.includes('component_type')) {
        console.log('   ✅ Has component_type column')
      } else if (tableInfo.columns.includes('section_type')) {
        console.log('   ⚠️  Has section_type (should be component_type)')
        issues.push('Uses section_type instead of component_type')
      } else {
        console.log('   ❌ Missing component_type column!')
        issues.push('Missing component_type column')
      }
    }

    // Check IP address type (can't check type from sample, but check if exists)
    if (tableInfo.columns.includes('ip_address')) {
      console.log('   ✅ Has ip_address column')
      issues.push('ip_address should be INET type (currently likely TEXT)')
    }

    // Check status field
    if (tableInfo.columns.includes('status')) {
      console.log('   ✅ Has status column')
      issues.push('status should be ENUM type (currently likely TEXT)')
    }

    // Check for missing important columns
    if (table === 'pages') {
      if (!tableInfo.columns.includes('deleted_at')) {
        issues.push('Missing deleted_at (soft delete)')
      }
      if (!tableInfo.columns.includes('seo_title')) {
        issues.push('Missing seo_title (SEO optimization)')
      }
    }

    if (table === 'waitlist_signups') {
      if (!tableInfo.columns.includes('email')) {
        issues.push('Missing email column!')
      } else {
        // Check if unique constraint exists (can't verify from sample, but note it)
        issues.push('email should have UNIQUE constraint')
      }
      if (tableInfo.columns.includes('ip_address')) {
        issues.push('ip_address should be INET type, not TEXT')
      }
    }

    if (table === 'blog_posts') {
      if (!tableInfo.columns.includes('tags')) {
        issues.push('Missing tags column (TEXT[] or JSONB)')
      }
      if (!tableInfo.columns.includes('search_vector')) {
        issues.push('Missing search_vector (full-text search)')
      }
    }

    if (issues.length > 0) {
      console.log(`\n   ⚠️  Issues found (${issues.length}):`)
      issues.forEach(issue => console.log(`      - ${issue}`))
      tableInfo.issues = issues
    } else {
      console.log('   ✅ No obvious issues found')
    }
  }

  // 3. Check for data inconsistencies
  console.log('\n\n🔍 STEP 3: Checking data consistency...\n')
  console.log('=' .repeat(60))

  // Check sections for component_type values
  try {
    const { data: sections } = await adminClient
      .from('sections')
      .select('component_type')
      .limit(100)

    if (sections && sections.length > 0) {
      const types = new Set(sections.map(s => (s as any).component_type || (s as any).section_type).filter(Boolean))
      console.log(`\n📌 Sections component_type values found: ${Array.from(types).join(', ')}`)
      
      if (types.size > 10) {
        console.log('   ⚠️  Many different component types - consider using ENUM')
      }
    }
  } catch (err: any) {
    console.log(`   ⚠️  Could not check sections: ${err.message}`)
  }

  // Check waitlist for email duplicates
  try {
    const { data: waitlist } = await adminClient
      .from('waitlist_signups')
      .select('email')
      .limit(1000)

    if (waitlist && waitlist.length > 0) {
      const emails = waitlist.map(w => w.email)
      const uniqueEmails = new Set(emails)
      const duplicates = emails.length - uniqueEmails.size
      
      if (duplicates > 0) {
        console.log(`\n⚠️  waitlist_signups: Found ${duplicates} duplicate emails (need UNIQUE constraint)`)
      } else {
        console.log(`\n✅ waitlist_signups: No duplicate emails in sample (${emails.length} records checked)`)
      }
    }
  } catch (err: any) {
    console.log(`   ⚠️  Could not check waitlist: ${err.message}`)
  }

  // 4. Summary
  console.log('\n\n📊 SUMMARY\n')
  console.log('=' .repeat(60))

  const tablesWithIssues = results.filter(r => r.issues.length > 0)
  const tablesOK = results.filter(r => r.issues.length === 0 && r.columns.length > 0)

  console.log(`\n✅ Tables OK: ${tablesOK.length}`)
  tablesOK.forEach(t => console.log(`   - ${t.table}`))

  if (tablesWithIssues.length > 0) {
    console.log(`\n⚠️  Tables with issues: ${tablesWithIssues.length}`)
    tablesWithIssues.forEach(t => {
      console.log(`\n   ${t.table}:`)
      t.issues.forEach(issue => console.log(`      - ${issue}`))
    })
  }

  console.log('\n\n📝 RECOMMENDATIONS:\n')
  console.log('1. Run SQL queries in Supabase SQL Editor to verify exact column types')
  console.log('2. Check for missing indexes (see SUPABASE_DATABASE_OPTIMIZATION.md)')
  console.log('3. Add missing constraints (UNIQUE, CHECK, etc.)')
  console.log('4. Convert TEXT to ENUMs where appropriate')
  console.log('5. Add soft delete columns (deleted_at)')
  console.log('6. Add full-text search indexes')

  console.log('\n✅ Verification complete!\n')
}

// Run verification
verifyDatabaseStructure().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})

