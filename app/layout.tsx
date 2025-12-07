import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://qoupl.ai'),
  title: {
    default: 'qoupl - Find Your Perfect Match | Modern Dating App',
    template: '%s | qoupl'
  },
  description: 'qoupl is the next generation dating app that helps you find genuine connections. AI-powered matching, verified profiles, and safe dating experience. Join the waitlist for early access.',
  keywords: [
    'dating app',
    'qoupl',
    'online dating',
    'match making',
    'dating platform',
    'find love',
    'relationships',
    'AI dating',
    'verified profiles',
    'safe dating',
    'modern dating',
    'dating community',
    'meet singles',
    'dating for young adults',
    'couple app'
  ],
  authors: [{ name: 'qoupl' }],
  creator: 'qoupl',
  publisher: 'qoupl',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qoupl.ai',
    title: 'qoupl - Find Your Perfect Match | Modern Dating App',
    description: 'qoupl is the next generation dating app that helps you find genuine connections. AI-powered matching, verified profiles, and safe dating experience.',
    siteName: 'qoupl',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'qoupl - Find Your Perfect Match',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'qoupl - Find Your Perfect Match | Modern Dating App',
    description: 'qoupl is the next generation dating app that helps you find genuine connections. AI-powered matching, verified profiles, and safe dating experience.',
    images: ['/og-image.svg'],
    creator: '@qoupl',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.svg',
      },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://qoupl.ai',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${dmSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
