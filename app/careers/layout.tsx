import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Careers - Join qoupl Team',
  description: 'Join the qoupl team and help build the future of dating for college students.',
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

