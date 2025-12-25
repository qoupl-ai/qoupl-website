import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Pricing - Affordable Dating Plans | qoupl',
  description: 'Simple, transparent pricing for qoupl. Choose the plan that works for you. Free basic features with optional premium upgrades.',
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
