/**
 * Diagnostic script to check if blog page exists and has sections
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST before importing admin client
const envPath = resolve(__dirname, '../.env.local')
dotenv.config({ path: envPath })

// Import after env is loaded
import { adminClient } from '../lib/supabase/admin'

async function checkBlogPage() {
  console.log('🔍 Checking blog page...\n')

  try {
    // Check if blog page exists
    const { data: page, error: pageError } = await adminClient
      .from('pages')
      .select('*')
      .eq('slug', 'blog')
      .single()

    if (pageError) {
      console.error('❌ Error fetching blog page:', pageError.message)
      return
    }

    if (!page) {
      console.error('❌ Blog page not found in database')
      console.log('\n💡 The blog page should exist. Creating it...')
      
      const { data: newPage, error: createError } = await adminClient
        .from('pages')
        .insert({
          slug: 'blog',
          title: 'Blog',
          description: 'Latest updates and articles',
          published: true,
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ Failed to create blog page:', createError.message)
        return
      }

      console.log('✅ Created blog page:', newPage.id)
      console.log('\n📋 Blog page details:')
      console.log('   - ID:', newPage.id)
      console.log('   - Slug:', newPage.slug)
      console.log('   - Title:', newPage.title)
      console.log('   - Published:', newPage.published)
      console.log('\n💡 You can now add sections to this page from the CMS.')
      return
    }

    console.log('✅ Blog page found:')
    console.log('   - ID:', page.id)
    console.log('   - Slug:', page.slug)
    console.log('   - Title:', page.title)
    console.log('   - Published:', page.published)
    console.log('   - Description:', page.description || 'No description')

    // Check sections
    const { data: sections, error: sectionsError } = await adminClient
      .from('sections')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (sectionsError) {
      console.error('❌ Error fetching sections:', sectionsError.message)
      return
    }

    console.log(`\n📦 Sections: ${sections?.length || 0}`)
    
    if (sections && sections.length > 0) {
      sections.forEach((section, index) => {
        console.log(`\n   Section ${index + 1}:`)
        console.log('   - ID:', section.id)
        console.log('   - Type:', section.component_type)
        console.log('   - Order:', section.order_index)
        console.log('   - Published:', section.published)
        if (section.content?.title) {
          console.log('   - Title:', section.content.title)
        }
      })
    } else {
      console.log('\n💡 No sections found. This is why the page appears empty.')
      console.log('   You can add sections from the CMS at: /add-content/pages/blog')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkBlogPage()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

