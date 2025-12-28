# Section Contracts

This directory contains the formal Section Contract system for the CMS.

## Overview

Each section type in the CMS is backed by a **Section Contract** that defines:
- **Zod Schema**: Type-safe validation for section content
- **Default Data**: Default structure when creating new sections
- **Editor Component**: React component for editing in CMS
- **Renderer Component**: React component for rendering on frontend
- **Metadata**: Label, description, icon, and category

## Structure

```
contracts/
├── types.ts          # Base contract interface definition
├── registry.ts       # Central registry of all contracts
├── hero.ts           # Hero section contract
├── blog-post.ts      # Blog post section contract
├── faq-category.ts   # FAQ category section contract
├── ...               # (20 more section contracts)
└── README.md         # This file
```

## Usage

### Get a Contract

```typescript
import { getSectionContract } from '@/contracts/registry'

const heroContract = getSectionContract('hero')
if (heroContract) {
  // Use contract.schema, contract.defaultData, etc.
}
```

### Check if Contract Exists

```typescript
import { hasSectionContract } from '@/contracts/registry'

if (hasSectionContract('hero')) {
  // Section type is contract-backed
}
```

### Get All Section Types

```typescript
import { getSectionTypes } from '@/contracts/registry'

const allTypes = getSectionTypes()
// Returns: ['hero', 'blog-post', 'faq-category', ...]
```

### Get Contracts by Category

```typescript
import { getContractsByCategory } from '@/contracts/registry'

const byCategory = getContractsByCategory()
// Returns: { 'layout': {...}, 'content': {...}, 'commerce': {...}, ... }
```

## Section Types

All 23 section types are contract-backed:

### Layout Sections
- `hero` - Hero section with title, subtitle, CTA
- `contact-hero` - Contact page hero
- `pricing-hero` - Pricing page hero

### Content Sections
- `blog-post` - Blog post content
- `faq-category` - FAQ category with questions
- `feature-category` - Feature category with features
- `how-it-works` - Step-by-step explanation
- `gallery` - Image gallery with carousel
- `testimonials` - Customer testimonials
- `contact-info` - Contact information items
- `contact-info-details` - Detailed contact info cards
- `timeline` - Chronological timeline
- `why-join` - Reasons to join
- `values` - Company values
- `content` - Generic flexible content

### Commerce Sections
- `pricing-plans` - Pricing plan options
- `free-messages` - Free message count info
- `message-bundles` - Message bundle pricing
- `pricing-info` - Pricing information
- `pricing-faq` - Pricing FAQs

### CTA Sections
- `app-download` - App download with platform links
- `coming-soon` - Coming soon section

## Contract Interface

```typescript
interface SectionContract<T = Record<string, unknown>> {
  type: string
  schema: z.ZodSchema<T>
  defaultData: T
  editor: ComponentType<{
    value: T
    onChange: (data: T) => void
    sectionId?: string
  }>
  renderer: ComponentType<{ data: T }>
  metadata: {
    label: string
    description: string
    icon?: string
    category?: string
  }
}
```

## Adding a New Section Type

1. Create a new contract file: `contracts/my-section.ts`
2. Define the contract with schema, default data, editor, and renderer
3. Import and add to `contracts/registry.ts`

Example:

```typescript
// contracts/my-section.ts
import { z } from 'zod'
import type { SectionContract } from './types'

const mySectionDataSchema = z.object({
  title: z.string(),
  content: z.string(),
})

const MySectionEditor: React.ComponentType<{...}> = () => { ... }
const MySectionRenderer: React.ComponentType<{...}> = () => { ... }

export const mySectionContract: SectionContract<z.infer<typeof mySectionDataSchema>> = {
  type: 'my-section',
  schema: mySectionDataSchema,
  defaultData: { title: '', content: '' },
  editor: MySectionEditor,
  renderer: MySectionRenderer,
  metadata: {
    label: 'My Section',
    description: 'Description of my section',
    icon: 'icon-name',
    category: 'content',
  },
}
```

## Notes

- **Editor Components**: Currently placeholders. Will be implemented during CMS editor refactor.
- **Renderer Components**: Use existing section components from `components/sections/`
- **Schemas**: Extracted from `lib/validation/section-schemas.ts` where available
- **Default Data**: Provides sensible defaults for new sections

## Status

✅ All 23 section types have contracts defined
✅ Central registry created
✅ Type-safe contract interface
⏳ Editor components are placeholders (to be implemented)
✅ Renderer components use existing section components

