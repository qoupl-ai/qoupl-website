const BLOG_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatBlogPublishDate(dateString: string): string {
  const displayDate = new Date(dateString)

  if (displayDate.getFullYear() === 2025) {
    displayDate.setFullYear(2026)
  }

  return BLOG_DATE_FORMAT.format(displayDate)
}
