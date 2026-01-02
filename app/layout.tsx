import type { Metadata } from "next";
import { Poppins, DM_Sans, Source_Code_Pro, Caveat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Poppins - used as the main font (same as testimonials cards)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-google-sans-flex",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const poppinsBrand = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: 'swap',
  preload: true,
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-code-pro",
  display: 'swap',
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-caveat",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://qoupl.ai'),
  title: {
    default: 'qoupl - Be couple with qoupl | Dating App for College Students',
    template: '%s | qoupl'
  },
  description: 'qoupl (coupl, couple, qouple) - Be couple with qoupl. The exclusive dating and matchmaking app for college students and university students aged 18-25. Find your perfect match, boyfriend, or girlfriend on campus with AI-powered matching, verified student profiles, and safe dating. Best college dating app for campus romance. Join thousands of college students finding love and relationships.',
  keywords: [
    // Brand name variations and common typos
    'qoupl',
    'qoupl app',
    'quoupl',
    'qoupl.ai',
    'qoupl dating',
    'couple',
    'coupl',
    'qouple',
    'kouple',
    'koupel',
    'qoupel',
    'qoupil',
    'qouplapp',
    'q oupl',
    'qou pl',
    'qoup',
    'oupl',
    'qoupl ai',

    // College dating - primary keywords
    'college dating app',
    'dating app for college students',
    'university dating',
    'campus dating app',
    'student dating',
    'college dating',
    'campus dating',
    'university dating app',

    // Be couple variations
    'be couple',
    'become couple',
    'make couple',
    'find couple',
    'couple app',
    'coupling app',
    'be couple with qoupl',

    // College romance and relationships
    'college romance',
    'dating for students',
    'college relationships',
    'find love in college',
    'college couple',
    'student matchmaking',
    'campus relationships',
    'college singles',
    'university romance',
    'campus love',
    'student couples',

    // Age and demographic specific
    'dating app 18-25',
    'dating 18-25',
    'young adult dating',
    '18 to 25 dating',
    'college age dating',
    'dating for 18 year olds',
    'dating for young adults',

    // Feature-based keywords
    'AI dating app',
    'AI matching app',
    'verified college profiles',
    'verified student dating',
    'safe dating for students',
    'secure college dating',

    // Platform and service type
    'college dating platform',
    'student dating platform',
    'meet college students',
    'campus match',
    'student romance app',
    'college love app',
    'campus matchmaking',
    'university matchmaking',

    // Action-oriented searches
    'find girlfriend in college',
    'find boyfriend in college',
    'meet students',
    'date college students',
    'college dating site',
    'best college dating app',
    'top student dating app',

    // Location-based
    'dating app for campus',
    'on campus dating',
    'college campus dating',
    'university campus dating'
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
    title: 'qoupl - Be couple with qoupl | Dating App for College Students',
    description: 'qoupl (couple, coupl) - The exclusive dating app for college students aged 18-25. Find your perfect match, boyfriend, or girlfriend on campus with AI-powered matching, verified student profiles, and safe dating. Best college dating app.',
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
    title: 'qoupl - Be couple with qoupl | Dating App for College Students',
    description: 'qoupl (couple, coupl) - Best college dating app for students aged 18-25. Find your match on campus with AI-powered matching and verified student profiles.',
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
      <body className={`${poppins.variable} ${poppinsBrand.variable} ${dmSans.variable} ${sourceCodePro.variable} ${caveat.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* Lazy load analytics scripts after page is interactive */}
        <Script
          src="/_vercel/speed-insights/script.js"
          strategy="lazyOnload"
        />
        <Script
          src="/_vercel/insights/script.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
