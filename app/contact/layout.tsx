import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact qoupl support team. Get help, report issues, or share feedback. We are here to help you with any questions about our dating platform.',
  keywords: ['contact qoupl', 'customer support', 'help', 'get in touch', 'support team'],
  openGraph: {
    title: 'Contact qoupl - Get in Touch',
    description: 'Contact qoupl support team. Get help, report issues, or share feedback.',
    type: 'website',
    url: 'https://qoupl.ai/contact',
  },
  alternates: {
    canonical: 'https://qoupl.ai/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
