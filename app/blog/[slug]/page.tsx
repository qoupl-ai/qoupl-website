import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getGlobalContentTyped } from "@/lib/supabase/content";
import type { BlogUiContentData } from "@/lib/validation/global-content-schemas";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";

// Force dynamic rendering for blog posts
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - qoupl Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const blogUi = await getGlobalContentTyped<BlogUiContentData>('blog_ui');

  const { data: post } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) {
    notFound();
  }

  if (!blogUi && process.env.NODE_ENV !== 'production') {
    throw new Error('Blog UI content is missing in CMS.');
  }

  // Handle category as array (Supabase returns it as array)
  const category = Array.isArray(post.category) ? post.category[0] : post.category;
  const detailUi = blogUi?.detail || {};
  const metadataUi = detailUi.metadata || {};
  const relatedUi = detailUi.related || {};
  const featuredImageUrl = resolveStorageUrl(post.featured_image || '');

  const BackIcon = resolveLucideIcon(detailUi.back_icon);
  const AuthorIcon = resolveLucideIcon(metadataUi.author_icon);
  const DateIcon = resolveLucideIcon(metadataUi.date_icon);
  const TimeIcon = resolveLucideIcon(metadataUi.time_icon);
  const RelatedIcon = resolveLucideIcon(relatedUi.cta_icon);

  if (process.env.NODE_ENV !== 'production') {
    if (post.featured_image && !featuredImageUrl) {
      throw new Error(`Blog post \"${post.title}\" has an invalid featured image URL.`);
    }
    if (detailUi.back_label && detailUi.back_link && detailUi.back_icon && !BackIcon) {
      throw new Error('Blog detail back icon is missing or invalid in CMS.');
    }
    if (post.author && metadataUi.author_icon && !AuthorIcon) {
      throw new Error('Blog author icon is missing or invalid in CMS.');
    }
    if (post.publish_date && metadataUi.date_icon && !DateIcon) {
      throw new Error('Blog date icon is missing or invalid in CMS.');
    }
    if (post.read_time && metadataUi.time_icon && !TimeIcon) {
      throw new Error('Blog time icon is missing or invalid in CMS.');
    }
    if (relatedUi.cta_label && relatedUi.cta_link && relatedUi.cta_icon && !RelatedIcon) {
      throw new Error('Blog related CTA icon is missing or invalid in CMS.');
    }
  }

  const showBackLink = !!(detailUi.back_label && detailUi.back_link);
  const readTimeSuffix = metadataUi.read_time_suffix || '';
  const showRelated = relatedUi.show !== false && (relatedUi.title || relatedUi.cta_label);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section with Featured Image */}
      <section className="relative overflow-hidden bg-[#662D91]/5 dark:bg-[#662D91]/10">
        <div className="container mx-auto px-4 py-12">
          {showBackLink && (
            <Link
              href={detailUi.back_link || ''}
              className="inline-flex items-center gap-2 text-primary hover:underline mb-8 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full"
            >
              {BackIcon && <BackIcon className="h-4 w-4" />}
              {detailUi.back_label}
            </Link>
          )}

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="relative w-full max-w-4xl mx-auto h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <Image
                src={featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Category Badge */}
              {category?.name && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-primary shadow-lg">
                    {category.name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Post Metadata */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
              {post.author && (
                <div className="flex items-center gap-2">
                  {AuthorIcon && <AuthorIcon className="h-5 w-5" />}
                  <span>{post.author}</span>
                </div>
              )}
              {post.publish_date && (
                <div className="flex items-center gap-2">
                  {DateIcon && <DateIcon className="h-5 w-5" />}
                  <span>{format(new Date(post.publish_date), 'MMMM d, yyyy')}</span>
                </div>
              )}
              {post.read_time && (
                <div className="flex items-center gap-2">
                  {TimeIcon && <TimeIcon className="h-5 w-5" />}
                  <span>
                    {post.read_time}
                    {readTimeSuffix ? ` ${readTimeSuffix}` : ''}
                  </span>
                </div>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      {showRelated && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            {relatedUi.title && (
              <h2 className="text-3xl font-bold mb-8">{relatedUi.title}</h2>
            )}
            <div className="text-center py-8">
              {relatedUi.cta_label && relatedUi.cta_link && (
                <Link
                  href={relatedUi.cta_link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {RelatedIcon && <RelatedIcon className="h-4 w-4" />}
                  {relatedUi.cta_label}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
