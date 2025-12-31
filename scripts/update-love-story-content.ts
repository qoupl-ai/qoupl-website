import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function updateLoveStoryContent() {
  console.log('📝 Updating love-story section content...\n')

  try {
    // Get the home page ID
    const { data: page, error: pageError } = await supabase
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

    // Find the love-story section
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('page_id', pageId)
      .eq('component_type', 'love-story')
      .single()

    if (sectionError || !section) {
      console.error('❌ Error finding love-story section:', sectionError?.message)
      console.log('💡 Run the add-love-story-section.ts script first to create the section')
      process.exit(1)
    }

    console.log(`✅ Found love-story section (ID: ${section.id})\n`)

    // Update the content
    const updatedContent = {
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
    }

    const { error: updateError } = await supabase
      .from('sections')
      .update({ content: updatedContent })
      .eq('id', section.id)

    if (updateError) {
      console.error('❌ Error updating love-story section:', updateError.message)
      process.exit(1)
    }

    console.log('✅ Successfully updated love-story section content')
    console.log('   - Removed emojis from signatures')
    console.log('   - Updated stories with mix of boy/girl perspectives')
    console.log('\n🎉 Done!')
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
updateLoveStoryContent()

