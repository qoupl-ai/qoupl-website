import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Affordable Plans for Everyone',
  description: 'qoupl pricing: Pay per message with flexible bundles. No hidden fees, no subscriptions. Free to join, affordable pricing for meaningful connections. Join thousands finding love.',
  keywords: ['dating app pricing', 'qoupl cost', 'affordable dating', 'dating subscription', 'pay per message'],
  openGraph: {
    title: 'qoupl Pricing - Affordable Plans for Everyone',
    description: 'qoupl pricing: Pay per message with flexible bundles. No hidden fees, no subscriptions.',
    type: 'website',
    url: 'https://qoupl.ai/pricing',
  },
  alternates: {
    canonical: 'https://qoupl.ai/pricing',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
