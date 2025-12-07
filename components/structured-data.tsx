import React from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'qoupl',
  alternateName: 'qoupl Dating App',
  url: 'https://qoupl.ai',
  logo: 'https://qoupl.ai/images/quoupl.svg',
  description: 'qoupl is a next-generation dating app that helps you find genuine connections through AI-powered matching and verified profiles.',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/qoupl',
    'https://facebook.com/qoupl',
    'https://instagram.com/qoupl',
    'https://linkedin.com/company/qoupl',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@qoupl.ai',
    availableLanguage: ['English'],
  },
};

// WebSite Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'qoupl',
  url: 'https://qoupl.ai',
  description: 'Find your perfect match with qoupl - the modern dating app',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://qoupl.ai/?s={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// WebApplication Schema
export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'qoupl',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'iOS, Android, Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '10000',
  },
  description: 'qoupl is the next generation dating app with AI-powered matching, verified profiles, and safe dating experience.',
};

// FAQ Schema Generator
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList Schema Generator
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Article Schema Generator
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image || 'https://qoupl.ai/og-image.svg',
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: article.author || 'qoupl',
    },
    publisher: {
      '@type': 'Organization',
      name: 'qoupl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://qoupl.ai/images/quoupl.svg',
      },
    },
  };
}
