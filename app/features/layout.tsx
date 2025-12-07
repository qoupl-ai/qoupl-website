import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - AI Matching, Verified Profiles & More',
  description: 'Explore qoupl features: AI-powered matching, photo verification, smart icebreakers, end-to-end encryption, and premium dating experience. Find your perfect match with advanced technology.',
  keywords: ['dating app features', 'AI matching', 'verified profiles', 'smart matching', 'dating technology'],
  openGraph: {
    title: 'qoupl Features - AI Matching, Verified Profiles & More',
    description: 'Explore qoupl features: AI-powered matching, photo verification, smart icebreakers, and premium dating experience.',
    type: 'website',
    url: 'https://qoupl.ai/features',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'qoupl Features - AI Matching, Verified Profiles & More',
    description: 'Explore qoupl features: AI-powered matching, photo verification, smart icebreakers, and premium dating experience.',
  },
  alternates: {
    canonical: 'https://qoupl.ai/features',
  },
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
