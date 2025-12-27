import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Contact qoupl support team for college students. Get help, report issues, or share feedback about the dating app for students aged 18-25. We are here to help you be couple with qoupl.',
  keywords: ['contact qoupl', 'student support', 'college dating help', 'campus dating support', 'support team', 'couple', 'coupl'],
  openGraph: {
    title: 'Contact qoupl - College Dating App Support',
    description: 'Contact qoupl support team for college students. Get help, report issues, or share feedback.',
    type: 'website',
    url: 'https://qoupl.ai/contact',
  },
  alternates: {
    canonical: 'https://qoupl.ai/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
