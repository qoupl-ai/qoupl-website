/**
 * Script to add carousel images to existing hero section
 * Run this to populate the images field in the hero section
 */

import dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables FIRST before importing adminClient
dotenv.config({ path: join(__dirname, '../.env.local') })

// Now import adminClient after env vars are loaded
import { adminClient } from '../lib/supabase/admin'

async function addHeroImages() {
  console.log('🖼️  Adding carousel images to hero section...\n')

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
      .eq('section_type', 'hero')
      .single()

    if (sectionError || !heroSection) {
      console.error('❌ Failed to find hero section:', sectionError?.message)
      return
    }

    console.log('📋 Current hero section content:', JSON.stringify(heroSection.content, null, 2))

    // Define the images
    // Note: Images 1-8 are .png, images 9-10 are .jpg
    const images = {
      women: [
        'hero-images/women/qoupl_women_03.png',
        'hero-images/women/qoupl_women_05.png',
        'hero-images/women/qoupl_women_01.png',
        'hero-images/women/qoupl_women_02.png',
        'hero-images/women/qoupl_women_04.png',
        'hero-images/women/qoupl_women_06.png',
        'hero-images/women/qoupl_women_07.png',
        'hero-images/women/qoupl_women_08.png',
        'hero-images/women/qoupl_women_09.jpg',
        'hero-images/women/qoupl_women_10.jpg',
      ],
      men: [
        'hero-images/men/qoupl_men_01.jpg',
        'hero-images/men/qoupl_men_02.jpg',
        'hero-images/men/qoupl_men_03.jpg',
        'hero-images/men/qoupl_men_04.jpg',
        'hero-images/men/qoupl_men_05.jpg',
        'hero-images/men/qoupl_men_06.jpg',
      ],
    }

    // Update the section with images
    const updatedContent = {
      ...heroSection.content,
      images,
    }

    const { error: updateError } = await adminClient
      .from('sections')
      .update({ content: updatedContent })
      .eq('id', heroSection.id)

    if (updateError) {
      console.error('❌ Failed to update hero section:', updateError.message)
      return
    }

    console.log('✅ Successfully added carousel images to hero section!')
    console.log(`   - Women images: ${images.women.length}`)
    console.log(`   - Men images: ${images.men.length}`)
    console.log(`   - Total: ${images.women.length + images.men.length} images`)
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

addHeroImages()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

