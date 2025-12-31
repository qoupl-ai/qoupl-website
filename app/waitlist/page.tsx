import WaitlistPageClient from "./waitlist-client";

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

export const metadata = {
  title: "Join Waitlist | qoupl",
  description: "Join the qoupl waitlist and be among the first to find your perfect match. Exclusive dating app for college students.",
};

export default function WaitlistPage() {
  return <WaitlistPageClient />;
}

