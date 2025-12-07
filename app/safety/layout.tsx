import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Safety & Security - Your Protection Matters',
  description: 'qoupl prioritizes your safety with photo verification, ID verification, end-to-end encryption, 24/7 moderation, and reporting tools. Safe dating experience guaranteed.',
  keywords: ['dating app safety', 'secure dating', 'verified profiles', 'safe online dating', 'dating security'],
  openGraph: {
    title: 'qoupl Safety & Security - Your Protection Matters',
    description: 'qoupl prioritizes your safety with photo verification, ID verification, and 24/7 moderation.',
    type: 'website',
    url: 'https://qoupl.ai/safety',
  },
  alternates: {
    canonical: 'https://qoupl.ai/safety',
  },
}

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
