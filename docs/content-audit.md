# Content Audit

This audit lists all public pages, sections, and visible UI elements, plus global UI and admin/CMS UI.

## Pages -> Sections Mapping

### Public Pages
- `/` (Home)
  - Global UI: `components/navbar.tsx`, `components/sections/footer.tsx`, `components/splash-screen.tsx`.
  - Sections rendered from Supabase via `SectionsRenderer` (contracts):
    - `hero` (animated hero)
    - `how-it-works`
    - `product-features`
    - `gallery`
    - `testimonials`
    - `app-download`
    - `coming-soon`

- `/about`
  - `hero`
  - `values` (mission/vision layout)
  - `values` (core values layout)
  - `timeline`
  - `why-join`
  - `app-download`

- `/features`
  - `feature-category`

- `/pricing`
  - `pricing-hero`
  - `pricing-plans`
  - `free-messages`
  - `message-bundles`
  - `pricing-info`
  - `pricing-faq`

- `/contact`
  - `contact-hero`
  - `contact-info`
  - `contact-info-details`

- `/careers`
  - `hero`
  - `coming-soon`
  - `values`
  - `why-join`

- `/faq`
  - `faq-category` (section data)
  - Page-level hero + CTA blocks in `app/faq/faq-client.tsx`

- `/blog`
  - Blog listing UI in `app/blog/blog-client.tsx` (hero, category filter, cards, empty state, newsletter)
  - Data from `blog_posts` + `blog_categories`

- `/blog/[slug]`
  - Blog post UI in `app/blog/[slug]/page.tsx` (hero, metadata, content, related posts CTA)
  - Data from `blog_posts` + `blog_categories`

- `/safety`
  - `content` (legal layout)

- `/privacy`
  - `content` (legal layout)

- `/terms`
  - `content` (legal layout)

- `/community-guidelines`
  - `content` (legal layout)

### Special / Global Content
- `__global__` (not public)
  - Global UI data sourced from Supabase (`navbar`, `footer`, `social_links`).
  - Global UI controls (`theme_toggle`, `waitlist_modal`, `splash_screen`, `legal_ui`, `error_ui`, `loading_ui`).
  - Page-level UI configs (`faq_ui`, `blog_ui`).

### Admin/CMS Pages
- `/login` (Supabase Auth UI)
- `/add-content` (dashboard)
- `/add-content/pages` (pages list)
- `/add-content/pages/[slug]` (page editor)
- `/add-content/global` (global content editor)
- `/add-content/blog` (blog CRUD)
- `/add-content/faqs` (FAQ CRUD)
- `/add-content/features` (feature CRUD)
- `/add-content/pricing` (pricing CRUD)
- `/add-content/media` (media library + upload)
- `/add-content/history` (audit log)
- `/add-content/waitlist` (waitlist list)

## Section Types -> Visible UI Elements

### hero (`components/sections/animated-hero.tsx`, `app/about/about-client.tsx`)
- Title, tagline, subtitle, description.
- Badge (text, icon, show toggle).
- Stats (text, icon, show).
- CTA (text/buttonText, link, icon, badge text, subtext, show toggles).
- Decorative icon + show toggles (badge/particles).
- Floating badge (value, label, icon, show).
- Images: women[], men[], grid[] (image path + alt).

### how-it-works (`components/sections/how-it-works.tsx`)
- Title + title highlight + showTitle.
- Steps[]: step label/number, title, description, image path, alt, showImage, showBadge.

### product-features (`components/sections/product-features.tsx`)
- Title, subtitle, showTitle, showSubtitle.
- Highlight icon (for bullet highlights).
- Features[]: icon, title, description, highlights[], image path + alt, color, showHighlights, show.

### gallery (`components/sections/gallery.tsx`)
- Title, titleHighlight, subtitle.
- Badge (text, icon, show).
- Images[]: image path, alt, title, story.
- CTA (text, highlight, show).
- Success badge (text, show).
- Icons: badge, story.

### testimonials (`components/sections/testimonials.tsx`)
- Title, titleHighlight, subtitle.
- Badge (text, icon, show).
- Testimonials[]: name, image path, alt, text, location, rating, date, showRating.
- Stats (text, icon, show).
- Icons: quote, heart, rating.

### app-download (`components/sections/app-download.tsx`)
- Title, subtitle.
- Badge (text, icon, show).
- Benefits[]: text, icon, showIcon; showBenefits toggle.
- CTA: text, icon, subtext, show flags, secondaryText/link/icon/show.
- Card: title, subtitle, icon, show; platforms label/show; stats prefix/highlight/suffix/show.
- Platforms[]: label, name, icon image + alt, coming, show.
- Decorative images[]: image path + alt.

### coming-soon (`components/sections/coming-soon.tsx`)
- Title, subtitle.
- Badge (text, icon, show).
- CTA (text, icon, link, show).
- Callout (title, description, show).
- Footer note text.
- Platforms[]: label, name, icon image + alt, coming, show; showPlatforms toggle.
- Stats: prefix, highlight, suffix, icon, show.
- Screenshots[]: image path + alt; showScreenshots toggle.

### feature-category (`app/features/features-client.tsx`)
- Hero: title, titleHighlight, subtitle, showTitle, showSubtitle.
- Categories[]: title, icon, color, image path + alt, show.
- Features[] inside category: title, description, icon, show.
- CTA: title, subtitle, buttonText, show.

### pricing-hero (`app/pricing/pricing-client.tsx`)
- Title, titleHighlight, subtitle, showTitle, showSubtitle.
- Badge (icon, text, show).

### pricing-plans (`app/pricing/pricing-client.tsx`)
- Plans[]: icon, name, price, currency, billing period, description, features[], feature icon, showFeatures, is_popular, order_index.

### free-messages (`app/pricing/pricing-client.tsx`)
- Count, title, description, icon, show, showIcon.

### message-bundles (`app/pricing/pricing-client.tsx`)
- Title, subtitle.
- Pricing config: price_per_message, gst_rate, currencySymbol, min_messages, max_messages.
- Bundles[]: messages, popular, label, show.
- Labels: popular, messages, customBundleTitle, customBundleSubtitle, quantityLabel, basePriceLabel, gstLabel, totalLabel, purchaseLabel.
- Icon + showIcon + show.

### pricing-info (`app/pricing/pricing-client.tsx`)
- Title.
- Items[] (strings).
- Icons: section icon, item icon; showIcon/showItemIcon; show.

### pricing-faq (`app/pricing/pricing-client.tsx`)
- Title.
- FAQs[]: question, answer, show.
- CTA: text, buttonText, link, show.

### contact-hero (`app/contact/contact-client.tsx`)
- Title, titleHighlight, subtitle.
- Badge (icon, text, show).

### contact-info (`app/contact/contact-client.tsx`)
- Title.
- Items[]: icon, title, details, link, show.

### contact-info-details (`app/contact/contact-client.tsx`)
- Title, description.
- Items[]: icon, title, description, show.
- FAQ link block: text, url, icon, title, description, show.
- Form: title, required indicator, labels/placeholders (name/email/subject/message), submit text/icon, sending text, success title/message/icon, error message, toast success/error, show.

### timeline (`app/about/about-client.tsx`)
- Title, titleHighlight, subtitle.
- Badge (text, icon, show).
- Item icon + showItemIcon.
- Timeline[]: year, event, description, show.

### why-join (`app/about/about-client.tsx`, `app/careers/careers-client.tsx`)
- Title, titleHighlight, subtitle.
- Badge (text, icon, show).
- Items[]: icon, title, description, color, show.

### values (`app/about/about-client.tsx`, `app/careers/careers-client.tsx`)
- useMissionVisionLayout toggle.
- Title, titleHighlight, subtitle.
- Badge (text, icon, show).
- Values[]: icon, label, labelIcon, title, description, body[], color, show.

### faq-category (`app/faq/page.tsx`)
- category_id, category_label.
- FAQs[]: question, answer, order_index, show.

### blog-post (contract placeholder)
- title, slug, excerpt, content, category_id, category_label, author, publish_date, read_time.
- featured_image + featured_image_alt.

### content (`app/safety`, `app/privacy`, `app/terms`, `app/community-guidelines`)
- key, title, lastUpdated.
- Sections[]: heading, content, items[], show.
- Legal layout uses per-page icon, highlight terms, and item icons.

## Global UI Elements

- Navbar (`components/navbar.tsx`, `components/navbar-client.tsx`)
  - Logo image path + alt.
  - Nav links (label + href).
  - Mobile menu toggle icons + aria label.

- Footer (`components/sections/footer.tsx`, `components/footer-client.tsx`)
  - Brand logo image path + alt.
  - Brand description.
  - Column titles + links.
  - Social icons + labels + URLs.
  - Copyright text + company + year.
  - Theme toggle UI.

- Theme toggle (`components/theme-toggle.tsx`, `components/cms/cms-theme-toggle.tsx`)
  - Button icon + aria label.
  - Menu labels (Dark/Light/System) + icons.

- Splash screen (`components/splash-screen.tsx`)
  - Logo image path + alt.
  - Background appearance (theme-based).

- Waitlist modal (`components/waitlist-modal.tsx`)
  - Logo image path + alt.
  - Modal title/subtitle.
  - Close button label + icon.
  - Decorative icons.
  - Form field labels, placeholders, required indicator, helper text.
  - Gender/looking-for options labels.
  - Submit button text + loading text.
  - Success title/message; error messages.

- Legal page layout (`components/legal-page-layout.tsx`)
  - Icon per page.
  - "Last Updated" label.
  - Highlight terms list.
  - Item icon mapping for list items.

- Error/Loading UI
  - `components/error-boundary.tsx` (title, description, button labels, icons).
  - `components/loading-spinner.tsx` (loading label).

## Admin/CMS UI Elements

- Login (`app/login/page.tsx`)
  - Logo image path + alt.
  - "Admin Portal" label.
  - Loading state text.
  - Supabase Auth UI labels, placeholders, and button text (email/password, sign in, forgot password, etc.).

- CMS Sidebar (`components/cms/cms-nav.tsx`)
  - Nav item labels + icons.
  - CMS label.
  - User role label (Admin).
  - Sign-out label + icon.
  - Sidebar mode labels (Expanded, Collapsed, Expand on Hover).
  - Theme menu labels (Theme, Dark, Light, System) + icons.

- CMS Dashboard (`app/add-content/page.tsx`)
  - Headings/descriptions.
  - Quick actions labels + icons.
  - Status labels (Pages, Sections, Published, Draft, Total).
  - Stats labels (Blog Posts, FAQs, Features, Pricing Plans, Media Files, Waitlist Signups).
  - Recent changes labels (actions, entity type labels, "View All History", empty state).
  - Secondary quick actions (Create Blog Post, Add FAQ, Add Feature, Upload Media).

- Pages List (`app/add-content/pages/page.tsx`)
  - Page header and description.
  - Alert title/description.
  - Card labels (Edit, View, "section(s)").
  - Published/draft icons.

- Page Editor (`app/add-content/pages/[slug]/page.tsx`)
  - Back button label.
  - Page slug label.
  - Blog preview card headings and labels.
  - Tip banner text.
  - Empty state text.
  - Section actions labels (Preview, History, Edit, Delete).

- Global Content (`app/add-content/global/page.tsx`, `components/cms/global-content-editor.tsx`)
  - Titles, descriptions, card labels.
  - Editor labels for navbar/footer/social/contact/site config fields.
  - Button labels (Edit/Create/Save/Cancel), empty state text.

- Blog/FAQ/Feature/Pricing CRUD (`app/add-content/*`, `components/cms/*-list.tsx`, `components/cms/*-dialog.tsx`, `components/cms/delete-*-dialog.tsx`)
  - List headings, descriptions, filters, empty states.
  - Form labels, helper text, placeholders, button labels, status badges.
  - Icon selectors and image upload labels.

- Media Library (`app/add-content/media/page.tsx`, `components/cms/media-grid.tsx`, `components/cms/media-upload.tsx`)
  - Headings, descriptions, category titles.
  - Upload UI labels and helper text.

- History (`app/add-content/history/page.tsx`, `components/cms/history-list.tsx`)
  - Headings, descriptions, filter labels, empty states.

- Waitlist (`app/add-content/waitlist/page.tsx`)
  - Headings, descriptions, table headers, status labels (Verified/Pending), empty states, icons.

- Section Editor (`components/cms/section-editor/*`)
  - Dialog titles/descriptions.
  - Section type labels and grouping labels (Content/CTA/Media/Advanced).
  - Field labels, add/remove actions, reorder controls, empty states.
