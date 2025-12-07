import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Dating Tips, Relationship Advice & Updates',
  description: 'Read the qoupl blog for dating tips, relationship advice, app updates, and insights on modern dating. Expert guidance for finding and maintaining meaningful connections.',
  keywords: ['dating blog', 'relationship advice', 'dating tips', 'love advice', 'modern dating'],
  openGraph: {
    title: 'qoupl Blog - Dating Tips, Relationship Advice & Updates',
    description: 'Read the qoupl blog for dating tips, relationship advice, and insights on modern dating.',
    type: 'website',
    url: 'https://qoupl.ai/blog',
  },
  alternates: {
    canonical: 'https://qoupl.ai/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
