import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { parseBlogContent } from "@/lib/utils/blog-content-parser";

// Enable ISR with 3-hour revalidation (blog posts are stable content)
export const revalidate = 10800;

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

  // Handle category as array (Supabase returns it as array)
  const category = Array.isArray(post.category) ? post.category[0] : post.category;

  // Get image URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.includes('/')) {
      const [bucket, ...rest] = imagePath.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("blog-images", imagePath);
  };

  const featuredImageUrl = getImageUrl(post.featured_image);

  return (
    <div className="min-h-screen bg-background">
      {/* Article Header */}
      <article className="pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to Blog
          </Link>

          {/* Category Badge */}
          {category?.name && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold text-[#662D91] bg-[#662D91]/10 border border-[#662D91]/20">
                {category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" strokeWidth={1.5} />
                <span>{post.author}</span>
              </div>
            )}
            {post.publish_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                <span>{format(new Date(post.publish_date), 'MMMM d, yyyy')}</span>
              </div>
            )}
            {post.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" strokeWidth={1.5} />
                <span>{post.read_time} min read</span>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          {featuredImageUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
              <Image
                src={featuredImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-[#662D91] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-li:my-2
            prose-blockquote:border-l-[#662D91] prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-muted-foreground
            prose-code:text-[#662D91] prose-code:bg-[#662D91]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-img:rounded-lg prose-img:my-8 prose-img:w-full
            prose-hr:border-border prose-hr:my-8">
            <div 
              dangerouslySetInnerHTML={{ __html: parseBlogContent(post.content) }} 
              className="[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                         [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                         [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6
                         [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:my-6 [&_ul]:text-muted-foreground
                         [&_li]:my-2 [&_li]:text-muted-foreground
                         [&_strong]:text-foreground [&_strong]:font-semibold
                         [&_a]:text-[#662D91] [&_a]:hover:underline [&_a]:font-medium
                         [&_code]:text-[#662D91] [&_code]:bg-[#662D91]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono"
            />
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      <section className="py-12 md:py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#662D91] hover:underline"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" strokeWidth={1.5} />
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
