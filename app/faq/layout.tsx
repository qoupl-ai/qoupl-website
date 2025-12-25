import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | qoupl',
  description: 'Find answers to common questions about qoupl, the exclusive dating app for college students. Learn about features, safety, pricing, and more.',
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
