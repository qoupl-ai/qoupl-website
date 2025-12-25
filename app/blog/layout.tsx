import { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'

export const metadata: Metadata = {
  title: 'Blog - College Dating Tips & Relationship Advice',
  description: 'Read the qoupl blog for college dating tips, student relationship advice, campus dating insights, and app updates. Expert guidance for college students aged 18-25 to be couple with qoupl.',
  keywords: ['college dating blog', 'student relationship advice', 'campus dating tips', 'college love advice', 'university dating', 'student couples'],
  openGraph: {
    title: 'qoupl Blog - College Dating Tips & Student Relationship Advice',
    description: 'Read the qoupl blog for college dating tips, student relationship advice, and campus dating insights.',
    type: 'website',
    url: 'https://qoupl.ai/blog',
  },
  alternates: {
    canonical: 'https://qoupl.ai/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
