/**
 * Zod Schemas for Section Validation
 * 
 * Type-safe validation for all section types.
 * Used in section-actions and section-editor.
 * 
 * These schemas validate the `data` field of sections, which is stored as JSONB in the database.
 * The schemas mirror the TypeScript interfaces defined in src/types/section.ts
 */

import { z } from 'zod'

// Base section schema
export const baseSectionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  order_index: z.number().int().min(0),
  published: z.boolean(),
})

// Hero section schema
export const heroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    tagline: z.string().default(''),
    subtitle: z.string().default(''),
    description: z.string().default(''),
    showTagline: z.boolean().default(true),
    showSubtitle: z.boolean().default(true),
    showDescription: z.boolean().default(true),
    badge: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    stats: z.array(z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
    images: z.object({
      women: z.array(z.object({
        image: z.string().default(''),
        alt: z.string().default(''),
      })).default([]),
      men: z.array(z.object({
        image: z.string().default(''),
        alt: z.string().default(''),
      })).default([]),
      grid: z.array(z.object({
        image: z.string().default(''),
        alt: z.string().default(''),
      })).default([]),
    }).default({}),
    cta: z.object({
      text: z.string().default(''),
      buttonText: z.string().default(''),
      link: z.string().default(''),
      subtext: z.string().default(''),
      badge: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
      showBadge: z.boolean().default(false),
      showSubtext: z.boolean().default(false),
    }).default({}),
    decorative: z.object({
      icon: z.string().default(''),
      show: z.boolean().default(false),
      showParticles: z.boolean().default(false),
    }).default({}),
    floatingBadge: z.object({
      value: z.string().default(''),
      label: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
  }),
})

// Blog post section schema
export const blogPostSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    slug: z.string().default(''),
    excerpt: z.string().default(''),
    content: z.string().default(''),
    category_id: z.string().default(''),
    category_label: z.string().default(''),
    author: z.string().default(''),
    publish_date: z.string().default(''),
    read_time: z.number().int().min(0).default(0),
    featured_image: z.string().default(''),
    featured_image_alt: z.string().default(''),
  }),
})

// FAQ category section schema
export const faqCategorySectionSchema = baseSectionSchema.extend({
  data: z.object({
    category_id: z.string().default(''),
    category_label: z.string().default(''),
    faqs: z.array(z.object({
      question: z.string().default(''),
      answer: z.string().default(''),
      order_index: z.number().int().min(0).default(0),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Feature category section schema
export const featureCategorySectionSchema = baseSectionSchema.extend({
  data: z.object({
    hero: z.object({
      title: z.string().default(''),
      titleHighlight: z.string().default(''),
      subtitle: z.string().default(''),
      showTitle: z.boolean().default(true),
      showSubtitle: z.boolean().default(true),
    }).default({}),
    features: z.array(z.object({
      title: z.string().default(''),
      icon: z.string().default(''),
      color: z.string().default(''),
      image: z.string().default(''),
      imageAlt: z.string().default(''),
      show: z.boolean().default(true),
      features: z.array(z.object({
        title: z.string().default(''),
        description: z.string().default(''),
        icon: z.string().default(''),
        show: z.boolean().default(true),
      })).default([]),
    })).default([]),
    cta: z.object({
      title: z.string().default(''),
      subtitle: z.string().default(''),
      buttonText: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
  }),
})

// Product Features section schema
export const productFeaturesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    subtitle: z.string().default(''),
    showTitle: z.boolean().default(true),
    showSubtitle: z.boolean().default(true),
    highlightIcon: z.string().default(''),
    features: z.array(z.object({
      icon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      highlights: z.array(z.string()).default([]),
      image: z.string().default(''),
      imageAlt: z.string().default(''),
      color: z.string().default(''),
      showHighlights: z.boolean().default(true),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Pricing plans section schema
export const pricingPlansSectionSchema = baseSectionSchema.extend({
  data: z.object({
    plans: z.array(z.object({
      icon: z.string().default(''),
      name: z.string().default(''),
      price: z.number().min(0).default(0),
      currency: z.string().default(''),
      billing_period: z.string().default(''),
      description: z.string().default(''),
      features: z.array(z.string()).default([]),
      featureIcon: z.string().default(''),
      showFeatures: z.boolean().default(true),
      is_popular: z.boolean().default(false),
      order_index: z.number().int().min(0).default(0),
    })).default([]),
  }),
})

// Pricing hero section schema
export const pricingHeroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    showTitle: z.boolean().default(true),
    showSubtitle: z.boolean().default(true),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
  }),
})

// Free messages section schema
export const freeMessagesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    count: z.number().int().min(0).default(0),
    title: z.string().default(''),
    description: z.string().default(''),
    icon: z.string().default(''),
    show: z.boolean().default(true),
    showIcon: z.boolean().default(true),
  }),
})

// Message bundles section schema
export const messageBundlesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    price_per_message: z.number().min(0).default(0),
    gst_rate: z.number().min(0).max(100).default(0),
    currencySymbol: z.string().default(''),
    icon: z.string().default(''),
    showIcon: z.boolean().default(true),
    show: z.boolean().default(true),
    bundles: z.array(z.object({
      messages: z.number().int().min(0).default(0),
      popular: z.boolean().default(false),
      label: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
    min_messages: z.number().int().min(0).default(0),
    max_messages: z.number().int().min(0).default(0),
    title: z.string().default(''),
    subtitle: z.string().default(''),
    labels: z.object({
      popular: z.string().default(''),
      messages: z.string().default(''),
      customBundleTitle: z.string().default(''),
      customBundleSubtitle: z.string().default(''),
      quantityLabel: z.string().default(''),
      basePriceLabel: z.string().default(''),
      gstLabel: z.string().default(''),
      totalLabel: z.string().default(''),
      purchaseLabel: z.string().default(''),
    }).default({}),
  }),
})

// Pricing info section schema
export const pricingInfoSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    items: z.array(z.string()).default([]),
    icon: z.string().default(''),
    itemIcon: z.string().default(''),
    show: z.boolean().default(true),
    showIcon: z.boolean().default(true),
    showItemIcon: z.boolean().default(true),
  }),
})

// Pricing FAQ section schema
export const pricingFaqSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    faqs: z.array(z.object({
      question: z.string().default(''),
      answer: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
    cta: z.object({
      text: z.string().default(''),
      link: z.string().default(''),
      buttonText: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
  }),
})

// How it works section schema
export const howItWorksSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    showTitle: z.boolean().default(true),
    steps: z.array(z.object({
      step: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      image: z.string().default(''),
      imageAlt: z.string().default(''),
      showImage: z.boolean().default(true),
      showBadge: z.boolean().default(true),
    })).default([]),
  }),
})

// Gallery section schema
export const gallerySectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    images: z.array(z.object({
      image: z.string().default(''),
      alt: z.string().default(''),
      title: z.string().default(''),
      story: z.string().default(''),
    })).default([]),
    cta: z.object({
      text: z.string().default(''),
      highlight: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    successBadge: z.object({
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    icons: z.object({
      badge: z.string().default(''),
      story: z.string().default(''),
    }).default({}),
  }),
})

// Testimonials section schema
export const testimonialsSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    testimonials: z.array(z.object({
      name: z.string().default(''),
      image: z.string().default(''),
      imageAlt: z.string().default(''),
      text: z.string().default(''),
      location: z.string().default(''),
      rating: z.number().int().min(0).max(5).default(0),
      date: z.string().default(''),
      showRating: z.boolean().default(true),
    })).default([]),
    stats: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    icons: z.object({
      quote: z.string().default(''),
      heart: z.string().default(''),
      rating: z.string().default(''),
    }).default({}),
  }),
})

// App download section schema
export const appDownloadSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    benefits: z.array(z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      showIcon: z.boolean().default(true),
    })).default([]),
    showBenefits: z.boolean().default(true),
    cta: z.object({
      text: z.string().default(''),
      subtext: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
      showSubtext: z.boolean().default(false),
      secondaryText: z.string().default(''),
      secondaryLink: z.string().default(''),
      secondaryIcon: z.string().default(''),
      showSecondary: z.boolean().default(false),
    }).default({}),
    card: z.object({
      title: z.string().default(''),
      subtitle: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
      platformsLabel: z.string().default(''),
      showPlatforms: z.boolean().default(false),
      statsPrefix: z.string().default(''),
      statsHighlight: z.string().default(''),
      statsSuffix: z.string().default(''),
      showStats: z.boolean().default(false),
    }).default({}),
    platforms: z.array(z.object({
      label: z.string().default(''),
      name: z.string().default(''),
      iconImage: z.string().default(''),
      iconAlt: z.string().default(''),
      coming: z.boolean().default(true),
      show: z.boolean().default(true),
    })).default([]),
    images: z.object({
      decorative: z.array(z.object({
        image: z.string().default(''),
        alt: z.string().default(''),
      })).default([]),
    }).default({}),
  }),
})

// Coming soon section schema
export const comingSoonSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    cta: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      link: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    callout: z.object({
      title: z.string().default(''),
      description: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    footer_note: z.string().default(''),
    platforms: z.array(z.object({
      label: z.string().default(''),
      name: z.string().default(''),
      iconImage: z.string().default(''),
      iconAlt: z.string().default(''),
      coming: z.boolean().default(true),
      show: z.boolean().default(true),
    })).default([]),
    showPlatforms: z.boolean().default(true),
    stats: z.object({
      prefix: z.string().default(''),
      highlight: z.string().default(''),
      suffix: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    screenshots: z.array(z.object({
      image: z.string().default(''),
      alt: z.string().default(''),
    })).default([]),
    showScreenshots: z.boolean().default(true),
  }),
})

// Contact Hero section schema
export const contactHeroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      icon: z.string().default(''),
      text: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
  }),
})

// Contact Info section schema
export const contactInfoSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    items: z.array(z.object({
      icon: z.string().default(''),
      title: z.string().default(''),
      details: z.string().default(''),
      link: z.string().nullable().default(null),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Contact Info Details section schema (for the info cards on the right)
export const contactInfoDetailsSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    items: z.array(z.object({
      icon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
    faq_link: z.object({
      text: z.string().default(''),
      url: z.string().default(''),
      icon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    form: z.object({
      title: z.string().default(''),
      required_indicator: z.string().default(''),
      name_label: z.string().default(''),
      name_placeholder: z.string().default(''),
      email_label: z.string().default(''),
      email_placeholder: z.string().default(''),
      subject_label: z.string().default(''),
      subject_placeholder: z.string().default(''),
      message_label: z.string().default(''),
      message_placeholder: z.string().default(''),
      submit_text: z.string().default(''),
      submit_icon: z.string().default(''),
      sending_text: z.string().default(''),
      success_title: z.string().default(''),
      success_message: z.string().default(''),
      success_icon: z.string().default(''),
      error_message: z.string().default(''),
      toast_success: z.string().default(''),
      toast_error: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
  }),
})

// Timeline section schema
export const timelineSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    itemIcon: z.string().default(''),
    showItemIcon: z.boolean().default(true),
    timeline: z.array(z.object({
      year: z.string().default(''),
      event: z.string().default(''),
      description: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Why Join section schema
export const whyJoinSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    items: z.array(z.object({
      icon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      color: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Values section schema
export const valuesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    useMissionVisionLayout: z.boolean().default(false),
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    subtitle: z.string().default(''),
    badge: z.object({
      text: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(false),
    }).default({}),
    values: z.array(z.object({
      icon: z.string().default(''),
      label: z.string().default(''),
      labelIcon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
      body: z.array(z.string()).default([]),
      color: z.string().default(''),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Generic content section schema (legal pages and shared blocks)
export const contentSectionSchema = baseSectionSchema.extend({
  data: z.object({
    key: z.string().default(''),
    title: z.string().default(''),
    icon: z.string().default(''),
    showIcon: z.boolean().default(true),
    lastUpdated: z.string().default(''),
    sections: z.array(z.object({
      heading: z.string().default(''),
      content: z.string().default(''),
      items: z.array(z.object({
        text: z.string().default(''),
        icon: z.string().default(''),
        show: z.boolean().default(true),
      })).default([]),
      isImportant: z.boolean().default(false),
      show: z.boolean().default(true),
    })).default([]),
  }),
})

// Registry of all section schemas
export const sectionSchemas: Record<string, z.ZodSchema> = {
  'hero': heroSectionSchema,
  'blog-post': blogPostSectionSchema,
  'faq-category': faqCategorySectionSchema,
  'feature-category': featureCategorySectionSchema,
  'product-features': productFeaturesSectionSchema,
  'pricing-plans': pricingPlansSectionSchema,
  'pricing-hero': pricingHeroSectionSchema,
  'free-messages': freeMessagesSectionSchema,
  'message-bundles': messageBundlesSectionSchema,
  'pricing-info': pricingInfoSectionSchema,
  'pricing-faq': pricingFaqSectionSchema,
  'contact-hero': contactHeroSectionSchema,
  'contact-info': contactInfoSectionSchema,
  'contact-info-details': contactInfoDetailsSectionSchema,
  'how-it-works': howItWorksSectionSchema,
  'gallery': gallerySectionSchema,
  'testimonials': testimonialsSectionSchema,
  'app-download': appDownloadSectionSchema,
  'coming-soon': comingSoonSectionSchema,
  'timeline': timelineSectionSchema,
  'why-join': whyJoinSectionSchema,
  'values': valuesSectionSchema,
  'content': contentSectionSchema,
}

/**
 * Get schema for a section type
 */
export function getSectionSchema(type: string): z.ZodSchema {
  return sectionSchemas[type] || baseSectionSchema.extend({
    data: z.record(z.string(), z.unknown()),
  })
}

/**
 * Validate section data
 */
export function validateSectionData(
  type: string,
  data: unknown
): { success: boolean; error?: string } {
  try {
    const schema = getSectionSchema(type)
    schema.parse({ type, data, order_index: 0, published: false })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }
    return { success: false, error: 'Validation failed' }
  }
}
