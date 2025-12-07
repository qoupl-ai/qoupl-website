import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Get answers to common questions about qoupl dating app. Learn about features, pricing, safety, account management, and more. Find everything you need to know.',
  keywords: ['qoupl FAQ', 'dating app questions', 'help', 'support', 'how to use qoupl'],
  openGraph: {
    title: 'qoupl FAQ - Frequently Asked Questions',
    description: 'Get answers to common questions about qoupl dating app.',
    type: 'website',
    url: 'https://qoupl.ai/faq',
  },
  alternates: {
    canonical: 'https://qoupl.ai/faq',
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
