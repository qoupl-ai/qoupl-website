import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Features - qoupl Dating App Features for College Students',
  description: 'Discover qoupl features: AI-powered matching, safety verification, rich communication tools, and premium experience designed for college students.',
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
