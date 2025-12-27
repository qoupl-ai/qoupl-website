import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'About Us - qoupl Dating App for College Students',
  description: 'Learn about qoupl, the exclusive dating app for college students. Our mission, values, and vision for revolutionizing online dating.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

