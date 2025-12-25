/**
 * Update Blog Post Featured Images
 * Updates all blog post featured_image URLs to use Supabase Storage
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/update-blog-images.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function updateBlogImages() {
  console.log('🖼️  Updating blog post featured images...\n')

  try {
    // Get all blog posts
    const { data: blogPosts, error: fetchError } = await adminClient
      .from('blog_posts')
      .select('id, title, featured_image')

    if (fetchError) {
      console.error('❌ Error fetching blog posts:', fetchError)
      return
    }

    if (!blogPosts || blogPosts.length === 0) {
      console.log('⚠️  No blog posts found')
      return
    }

    console.log(`Found ${blogPosts.length} blog posts\n`)

    // Map old paths to new Supabase Storage URLs (using couple photos since blog-images bucket is empty)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const imageMapping: Record<string, string> = {
      '/images/indian-student-goes-first-lesson.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_01.jpg`,
      '/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_01.jpg`,
      '/images/medium-shot-man-with-paperwork.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_02.jpg`,
      '/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_02.jpg`,
      '/images/Gemini_Generated_Image_6cx31l6cx31l6cx3.png': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_03.jpg`,
      '/images/Gemini_Generated_Image_l957byl957byl957.png': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_04.jpg`,
      // If already updated with wrong URLs, fix them
      'https://agbuefpfkgknbboeeyqa.supabase.co/storage/v1/object/public/blog-images/blog-ai-dating.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_01.jpg`,
      'https://agbuefpfkgknbboeeyqa.supabase.co/storage/v1/object/public/blog-images/blog-safety.jpg': `${supabaseUrl}/storage/v1/object/public/couple-photos/qoupl_couple_02.jpg`,
    }

    // Update each blog post
    for (const post of blogPosts) {
      const newImageUrl = imageMapping[post.featured_image]

      if (newImageUrl) {
        const { error: updateError } = await adminClient
          .from('blog_posts')
          .update({ featured_image: newImageUrl })
          .eq('id', post.id)

        if (updateError) {
          console.error(`❌ Error updating "${post.title}":`, updateError)
        } else {
          console.log(`✅ Updated: "${post.title}"`)
          console.log(`   Old: ${post.featured_image}`)
          console.log(`   New: ${newImageUrl}\n`)
        }
      } else {
        console.log(`⚠️  No mapping found for: "${post.title}"`)
        console.log(`   Image: ${post.featured_image}\n`)
      }
    }

    console.log('✨ Blog image update complete!')
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

updateBlogImages()
