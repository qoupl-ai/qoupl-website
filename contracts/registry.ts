/**
 * Section Contracts Registry
 * 
 * Central registry of all section contracts.
 * This is the single source of truth for section definitions.
 */

import type { SectionContractRegistry } from './types'
import { heroContract } from './hero'
import { blogPostContract } from './blog-post'
import { faqCategoryContract } from './faq-category'
import { featureCategoryContract } from './feature-category'
import { productFeaturesContract } from './product-features'
import { pricingPlansContract } from './pricing-plans'
import { pricingHeroContract } from './pricing-hero'
import { freeMessagesContract } from './free-messages'
import { messageBundlesContract } from './message-bundles'
import { pricingInfoContract } from './pricing-info'
import { pricingFaqContract } from './pricing-faq'
import { contactHeroContract } from './contact-hero'
import { contactInfoContract } from './contact-info'
import { contactInfoDetailsContract } from './contact-info-details'
import { howItWorksContract } from './how-it-works'
import { galleryContract } from './gallery'
import { testimonialsContract } from './testimonials'
import { appDownloadContract } from './app-download'
import { comingSoonContract } from './coming-soon'
import { timelineContract } from './timeline'
import { whyJoinContract } from './why-join'
import { contentContract } from './content'
import { valuesContract } from './values'

/**
 * Central registry of all section contracts
 */
export const sectionContracts: SectionContractRegistry = {
  'hero': heroContract,
  'blog-post': blogPostContract,
  'faq-category': faqCategoryContract,
  'feature-category': featureCategoryContract,
  'product-features': productFeaturesContract,
  'pricing-plans': pricingPlansContract,
  'pricing-hero': pricingHeroContract,
  'free-messages': freeMessagesContract,
  'message-bundles': messageBundlesContract,
  'pricing-info': pricingInfoContract,
  'pricing-faq': pricingFaqContract,
  'contact-hero': contactHeroContract,
  'contact-info': contactInfoContract,
  'contact-info-details': contactInfoDetailsContract,
  'how-it-works': howItWorksContract,
  'gallery': galleryContract,
  'testimonials': testimonialsContract,
  'app-download': appDownloadContract,
  'coming-soon': comingSoonContract,
  'timeline': timelineContract,
  'why-join': whyJoinContract,
  'content': contentContract,
  'values': valuesContract,
}

/**
 * Get contract for a section type
 */
export function getSectionContract(type: string) {
  return sectionContracts[type] || null
}

/**
 * Check if a section type has a contract
 */
export function hasSectionContract(type: string): boolean {
  return type in sectionContracts
}

/**
 * Get all registered section types
 */
export function getSectionTypes(): string[] {
  return Object.keys(sectionContracts)
}

/**
 * Get all contracts grouped by category
 */
export function getContractsByCategory(): Record<string, typeof sectionContracts> {
  const grouped: Record<string, typeof sectionContracts> = {}
  
  for (const [type, contract] of Object.entries(sectionContracts)) {
    const category = contract.metadata.category || 'uncategorized'
    if (!grouped[category]) {
      grouped[category] = {}
    }
    grouped[category][type] = contract
  }
  
  return grouped
}

