/**
 * Zod Schemas for Global Content
 *
 * Used for CMS validation and rendering of global UI content.
 */

import { z } from 'zod'

const imageSchema = z.object({
  image: z.string().default(''),
  alt: z.string().default(''),
  width: z.number().int().min(0).default(0),
  height: z.number().int().min(0).default(0),
  show: z.boolean().default(true),
})

const linkSchema = z.object({
  href: z.string().default(''),
  label: z.string().default(''),
  show: z.boolean().default(true),
})

const iconLinkSchema = z.object({
  icon: z.string().default(''),
  url: z.string().default(''),
  label: z.string().default(''),
  show: z.boolean().default(true),
})

export const navbarContentSchema = z.object({
  logo: imageSchema.default({}),
  links: z.array(linkSchema).default([]),
  mobile_toggle: z.object({
    open_icon: z.string().default(''),
    close_icon: z.string().default(''),
    aria_label: z.string().default(''),
    show: z.boolean().default(true),
  }).default({}),
})

export const footerContentSchema = z.object({
  brand: z.object({
    show: z.boolean().default(true),
    description: z.string().default(''),
    logo: imageSchema.default({}),
  }).default({}),
  columns: z.object({
    product: z.object({
      show: z.boolean().default(true),
      title: z.string().default(''),
      links: z.array(linkSchema).default([]),
    }).default({}),
    company: z.object({
      show: z.boolean().default(true),
      title: z.string().default(''),
      links: z.array(linkSchema).default([]),
    }).default({}),
    legal: z.object({
      show: z.boolean().default(true),
      title: z.string().default(''),
      links: z.array(linkSchema).default([]),
    }).default({}),
  }).default({}),
  copyright: z.object({
    show: z.boolean().default(true),
    primary_prefix: z.string().default(''),
    company: z.string().default(''),
    year: z.string().default(''),
    show_year: z.boolean().default(true),
    primary_suffix: z.string().default(''),
    secondary_text: z.string().default(''),
    show_secondary: z.boolean().default(true),
  }).default({}),
  theme_toggle: z.object({
    show: z.boolean().default(true),
  }).default({}),
})

export const socialLinksSchema = z.object({
  links: z.array(iconLinkSchema).default([]),
})

export const themeToggleSchema = z.object({
  show: z.boolean().default(true),
  aria_label: z.string().default(''),
  label: z.string().default(''),
  options: z.array(z.object({
    value: z.enum(['light', 'dark', 'system']).default('system'),
    label: z.string().default(''),
    icon: z.string().default(''),
    show: z.boolean().default(true),
  })).default([]),
})

export const waitlistModalSchema = z.object({
  show: z.boolean().default(true),
  logo: imageSchema.default({}),
  header: z.object({
    title: z.string().default(''),
    subtitle: z.string().default(''),
  }).default({}),
  close_button: z.object({
    icon: z.string().default(''),
    aria_label: z.string().default(''),
  }).default({}),
  select_icon: z.string().default(''),
  decorative: z.object({
    icon: z.string().default(''),
    show: z.boolean().default(true),
  }).default({}),
  required_indicator: z.string().default(''),
  validation: z.object({
    age_error: z.string().default(''),
    submit_error: z.string().default(''),
  }).default({}),
  form: z.object({
    name: z.object({
      label: z.string().default(''),
      placeholder: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    email: z.object({
      label: z.string().default(''),
      placeholder: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    phone: z.object({
      label: z.string().default(''),
      placeholder: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    gender: z.object({
      label: z.string().default(''),
      placeholder: z.string().default(''),
      icon: z.string().default(''),
      options: z.array(z.object({
        value: z.string().default(''),
        label: z.string().default(''),
        show: z.boolean().default(true),
      })).default([]),
      show: z.boolean().default(true),
    }).default({}),
    age: z.object({
      label: z.string().default(''),
      helper: z.string().default(''),
      placeholder: z.string().default(''),
      min: z.number().int().min(0).default(0),
      max: z.number().int().min(0).default(0),
      show: z.boolean().default(true),
    }).default({}),
    looking_for: z.object({
      label: z.string().default(''),
      placeholder: z.string().default(''),
      icon: z.string().default(''),
      options: z.array(z.object({
        value: z.string().default(''),
        label: z.string().default(''),
        show: z.boolean().default(true),
      })).default([]),
      show: z.boolean().default(true),
    }).default({}),
  }).default({}),
  submit: z.object({
    text: z.string().default(''),
    icon: z.string().default(''),
    loading_text: z.string().default(''),
    loading_icon: z.string().default(''),
    show: z.boolean().default(true),
  }).default({}),
  privacy_note: z.object({
    prefix: z.string().default(''),
    terms_label: z.string().default(''),
    terms_url: z.string().default(''),
    separator: z.string().default(''),
    privacy_label: z.string().default(''),
    privacy_url: z.string().default(''),
    suffix: z.string().default(''),
    show: z.boolean().default(true),
  }).default({}),
  success: z.object({
    show: z.boolean().default(true),
    icon: z.string().default(''),
    title: z.string().default(''),
    subtitle: z.string().default(''),
    details: z.string().default(''),
    next_title: z.string().default(''),
    next_items: z.array(z.string()).default([]),
    confetti_icon: z.string().default(''),
  }).default({}),
})

export const splashScreenSchema = z.object({
  show: z.boolean().default(true),
  logo: imageSchema.default({}),
})

export const legalUiSchema = z.object({
  last_updated_label: z.string().default(''),
  highlight_terms: z.array(z.string()).default([]),
  default_item_icon: z.string().default(''),
})

export const errorUiSchema = z.object({
  icon: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  retry_label: z.string().default(''),
  retry_icon: z.string().default(''),
  home_label: z.string().default(''),
  home_icon: z.string().default(''),
  details_label: z.string().default(''),
})

export const loadingUiSchema = z.object({
  icon: z.string().default(''),
  text: z.string().default(''),
})

export const faqUiSchema = z.object({
  hero: z.object({
    title: z.string().default(''),
    titleHighlight: z.string().default(''),
    description: z.string().default(''),
    show: z.boolean().default(true),
  }).default({}),
  icons: z.object({
    expand: z.string().default(''),
    collapse: z.string().default(''),
  }).default({}),
  empty_state: z.object({
    show: z.boolean().default(true),
    icon: z.string().default(''),
    title: z.string().default(''),
    description: z.string().default(''),
  }).default({}),
  cta: z.object({
    show: z.boolean().default(true),
    title: z.string().default(''),
    description: z.string().default(''),
    primary: z.object({
      label: z.string().default(''),
      link: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    secondary: z.object({
      label: z.string().default(''),
      link: z.string().default(''),
      icon: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
  }).default({}),
})

export const blogUiSchema = z.object({
  list: z.object({
    hero: z.object({
      badge: z.object({
        text: z.string().default(''),
        icon: z.string().default(''),
        show: z.boolean().default(true),
      }).default({}),
      title: z.string().default(''),
      titleHighlight: z.string().default(''),
      subtitle: z.string().default(''),
      showTitle: z.boolean().default(true),
      showSubtitle: z.boolean().default(true),
    }).default({}),
    filter: z.object({
      all_label: z.string().default(''),
      show: z.boolean().default(true),
    }).default({}),
    cards: z.object({
      read_more_label: z.string().default(''),
      read_more_icon: z.string().default(''),
      date_icon: z.string().default(''),
      time_icon: z.string().default(''),
      read_time_suffix: z.string().default(''),
    }).default({}),
    empty_state: z.object({
      show: z.boolean().default(true),
      icon: z.string().default(''),
      title: z.string().default(''),
      description: z.string().default(''),
    }).default({}),
  }).default({}),
  detail: z.object({
    back_link: z.string().default(''),
    back_label: z.string().default(''),
    back_icon: z.string().default(''),
    metadata: z.object({
      author_icon: z.string().default(''),
      date_icon: z.string().default(''),
      time_icon: z.string().default(''),
      read_time_suffix: z.string().default(''),
    }).default({}),
    related: z.object({
      show: z.boolean().default(true),
      title: z.string().default(''),
      cta_label: z.string().default(''),
      cta_link: z.string().default(''),
      cta_icon: z.string().default(''),
    }).default({}),
  }).default({}),
})

export const contactInfoSchema = z.object({
  email: z.string().default(''),
  phone: z.string().default(''),
  address: z.string().default(''),
  support_email: z.string().default(''),
})

export const siteConfigSchema = z.object({
  waitlist_count: z.number().int().min(0).default(0),
  tagline: z.string().default(''),
  subtitle: z.string().default(''),
})

export const globalContentSchemas = {
  navbar: navbarContentSchema,
  footer: footerContentSchema,
  social_links: socialLinksSchema,
  theme_toggle: themeToggleSchema,
  waitlist_modal: waitlistModalSchema,
  splash_screen: splashScreenSchema,
  legal_ui: legalUiSchema,
  error_ui: errorUiSchema,
  loading_ui: loadingUiSchema,
  faq_ui: faqUiSchema,
  blog_ui: blogUiSchema,
  contact_info: contactInfoSchema,
  site_config: siteConfigSchema,
} as const

export type GlobalContentKey = keyof typeof globalContentSchemas

export function getGlobalContentSchema(key: string) {
  return globalContentSchemas[key as GlobalContentKey] || null
}

export type NavbarContentData = z.infer<typeof navbarContentSchema>
export type FooterContentData = z.infer<typeof footerContentSchema>
export type SocialLinksData = z.infer<typeof socialLinksSchema>
export type ThemeToggleContentData = z.infer<typeof themeToggleSchema>
export type WaitlistModalContentData = z.infer<typeof waitlistModalSchema>
export type SplashScreenContentData = z.infer<typeof splashScreenSchema>
export type LegalUiContentData = z.infer<typeof legalUiSchema>
export type ErrorUiContentData = z.infer<typeof errorUiSchema>
export type LoadingUiContentData = z.infer<typeof loadingUiSchema>
export type FaqUiContentData = z.infer<typeof faqUiSchema>
export type BlogUiContentData = z.infer<typeof blogUiSchema>
export type ContactInfoContentData = z.infer<typeof contactInfoSchema>
export type SiteConfigContentData = z.infer<typeof siteConfigSchema>
