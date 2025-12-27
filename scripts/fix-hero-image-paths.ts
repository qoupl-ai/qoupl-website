/**
 * Script to fix hero image paths in database
 * Images 9 and 10 should be .jpg, not .png
 */

import dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables FIRST before importing adminClient
dotenv.config({ path: join(__dirname, '../.env.local') })

// Now import adminClient after env vars are loaded
import { adminClient } from '../lib/supabase/admin'

async function fixHeroImagePaths() {
  console.log('🔧 Fixing hero image paths in database...\n')

  try {
    // Get the home page
    const { data: homePage, error: pageError } = await adminClient
      .from('pages')
      .select('id')
      .eq('slug', 'home')
      .single()

    if (pageError || !homePage) {
      console.error('❌ Failed to find home page:', pageError?.message)
      return
    }

    // Get the hero section
    const { data: heroSection, error: sectionError } = await adminClient
      .from('sections')
      .select('*')
      .eq('page_id', homePage.id)
      .eq('component_type', 'hero')
      .single()

    if (sectionError || !heroSection) {
      console.error('❌ Failed to find hero section:', sectionError?.message)
      return
    }

    console.log('📋 Current hero section images:', JSON.stringify(heroSection.content?.images, null, 2))

    // Fix the image paths - images 9 and 10 should be .jpg
    const currentImages = heroSection.content?.images || { women: [], men: [] }
    const fixedWomenImages = (currentImages.women || []).map((path: string) => {
      // Fix paths for images 9 and 10
      if (path.includes('qoupl_women_09.png')) {
        return path.replace('qoupl_women_09.png', 'qoupl_women_09.jpg')
      }
      if (path.includes('qoupl_women_10.png')) {
        return path.replace('qoupl_women_10.png', 'qoupl_women_10.jpg')
      }
      return path
    })

    const updatedContent = {
      ...heroSection.content,
      images: {
        ...currentImages,
        women: fixedWomenImages,
      },
    }

    const { error: updateError } = await adminClient
      .from('sections')
      .update({ content: updatedContent })
      .eq('id', heroSection.id)

    if (updateError) {
      console.error('❌ Failed to update hero section:', updateError.message)
      return
    }

    console.log('✅ Successfully fixed hero image paths!')
    console.log('   Fixed images 9 and 10 from .png to .jpg')
    console.log('📋 Updated images:', JSON.stringify(updatedContent.images, null, 2))
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

fixHeroImagePaths()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

