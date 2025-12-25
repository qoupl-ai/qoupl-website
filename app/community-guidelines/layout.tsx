import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Community Guidelines - qoupl',
  description: 'Community Guidelines for qoupl dating application',
}

export default function CommunityGuidelinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

