/**
 * Script to add love-story section to the database
 * 
 * This will:
 * 1. Insert the love-story section with order_index: 3
 * 2. Update all subsequent sections to shift their order_index by 1
 * 
 * Run: npx tsx scripts/add-love-story-section.ts
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables first
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function addLoveStorySection() {
  console.log('📝 Adding love-story section to database...\n')

  try {
    // Get the home page ID
    const { data: page, error: pageError } = await adminClient
      .from('pages')
      .select('id')
      .eq('slug', 'home')
      .single()

    if (pageError || !page) {
      console.error('❌ Error finding home page:', pageError?.message)
      process.exit(1)
    }

    const pageId = page.id
    console.log(`✅ Found home page (ID: ${pageId})\n`)

    // Get all sections with order_index >= 3
    const { data: sectionsToUpdate, error: fetchError } = await adminClient
      .from('sections')
      .select('id, order_index, component_type')
      .eq('page_id', pageId)
      .gte('order_index', 3)
      .order('order_index', { ascending: true })

    if (fetchError) {
      console.error('❌ Error fetching sections:', fetchError.message)
      process.exit(1)
    }

    console.log(`📋 Found ${sectionsToUpdate?.length || 0} sections to update\n`)

    // Update all sections with order_index >= 3 to shift by 1
    if (sectionsToUpdate && sectionsToUpdate.length > 0) {
      for (const section of sectionsToUpdate) {
        const newOrderIndex = section.order_index + 1
        const { error: updateError } = await adminClient
          .from('sections')
          .update({ order_index: newOrderIndex })
          .eq('id', section.id)

        if (updateError) {
          console.error(`❌ Error updating section ${section.component_type}:`, updateError.message)
        } else {
          console.log(`   ✅ Updated ${section.component_type}: ${section.order_index} → ${newOrderIndex}`)
        }
      }
    }

    // Insert the love-story section
    const loveStorySection = {
      component_type: 'love-story',
      section_type: 'love-story', // Some migrations may require this
      page_id: pageId,
      order_index: 3,
      published: true,
      content: {
        title: 'Love Letters from Our Couples',
        subtitle: 'Read heartfelt stories from college students who found their perfect match on qoupl',
        stories: [
          {
            image: 'love-story/qoupl_love_story_1.jpg',
            couple: 'Priya & Arjun',
            story: `My Dearest Arjun,

From the moment we matched on qoupl, I knew something special was happening. Your profile showed a love for books and coffee, just like me. When you sent that first message asking about my favorite author, I couldn't help but smile.

Our first date at the campus library turned into hours of conversation. You made me laugh with your jokes, and I felt comfortable being myself around you. That evening, I knew I had found someone who truly understood me.

Now, three months later, we're planning our future together. Thank you, qoupl, for bringing us together. Thank you, Arjun, for being you.

Forever yours,
Priya`,
          },
          {
            image: 'love-story/qoupl_love_story_2.jpg',
            couple: 'Ananya & Rohan',
            story: `My Beautiful Ananya,

I still remember the day we matched on qoupl. Your smile in your photos was so genuine, and your bio about loving music and poetry caught my attention immediately. I knew I had to message you.

Our first date at the music café was perfect. You were even more beautiful in person, and your laugh is something I'll never forget. We talked for hours, and I didn't want the evening to end.

Now, every day with you feels like a gift. You've become my best friend, my confidant, and the person I want to share everything with. Thank you, qoupl, for bringing you into my life.

With all my love,
Rohan`,
          },
          {
            image: 'love-story/qoupl_love_story_3.jpg',
            couple: 'Kavya & Vikram',
            story: `My Dearest Kavya,

When I first saw your profile on qoupl, I was immediately drawn to your warmth and intelligence. Your passion for making a difference in the world and your dedication to your studies showed me that you were someone special.

Our first date at the college café was unforgettable. You were even more beautiful in person, and your smile made my heart skip a beat. The way you listened to me and shared your thoughts made me feel like I had found my perfect match.

Now, months later, I can't imagine my life without you. You've become my best friend, my partner, and the person I want to build my future with. Thank you, qoupl, for bringing you into my life.

Forever yours,
Vikram`,
          },
        ],
      },
    }

    const { data: insertedSection, error: insertError } = await adminClient
      .from('sections')
      .insert(loveStorySection)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error inserting love-story section:', insertError.message)
      process.exit(1)
    }

    console.log(`\n✅ Successfully added love-story section with order_index: 3`)
    console.log(`\n🎉 Done! The love-story section is now above "Why Choose qoupl"`)
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
addLoveStorySection()
  .then(() => {
    console.log('\n✨ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })

