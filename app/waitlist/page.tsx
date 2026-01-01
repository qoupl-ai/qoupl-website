/**
 * Waitlist Page - Server Component
 * Fetches waitlist page sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import WaitlistPageClient from "./waitlist-client";

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

export const metadata = {
  title: "Join Waitlist | qoupl",
  description: "Join the qoupl waitlist and be among the first to find your perfect match. Exclusive dating app for college students.",
};

export default async function WaitlistPage() {
  // Fetch waitlist page sections from database
  const sections = await getPageSections('waitlist')

  // Transform sections data
  const waitlistData = {
    sections: sections.map(section => ({
      type: section.component_type,
      content: section.content,
    })),
  }

  return <WaitlistPageClient data={waitlistData} />;
}

