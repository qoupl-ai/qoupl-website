"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  publish_date: string | null;
  read_time: number | null;
  featured_image: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface BlogClientProps {
  posts: BlogPost[];
  categories: Array<{ id: string; name: string; slug: string }>;
}


export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique category names for filter
  const categoryNames = ["All", ...categories.map(cat => cat.name)];

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category?.name === selectedCategory);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get image URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return getStorageUrl("hero-images", "men/qoupl_men_04.jpg"); // fallback
    }
    if (imagePath.startsWith('http')) return imagePath;
    // Assume it's a storage path
    if (imagePath.includes('/')) {
      const [bucket, ...rest] = imagePath.split('/');
      return getStorageUrl(bucket, rest.join('/'));
    }
    return getStorageUrl("blog-images", imagePath);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Hero content should come from database sections - keeping fallback for now */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#662D91]/10 text-[#662D91] border border-[#662D91]/20 mb-4"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="text-xs font-medium">Insights & Stories</span>
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              qoupl Blog
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Discover insights on dating for college students, relationships, and technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {categoryNames.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 cursor-pointer text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-[#662D91] text-white"
                    : "bg-card border border-border hover:border-[#662D91]/50 hover:bg-[#662D91]/5"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const categoryName = post.category?.name || "Uncategorized";
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="group"
                  >
                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full bg-card border border-border rounded-xl overflow-hidden hover:border-[#662D91] transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-[#662D91]">
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                            <span>{formatDate(post.publish_date)}</span>
                          </div>
                          {post.read_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                              <span>{post.read_time} min</span>
                            </div>
                          )}
                        </div>

                        <h2 className="text-lg font-bold mb-2 group-hover:text-[#662D91] transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-2 text-sm font-semibold text-[#662D91] group-hover:gap-3 transition-all duration-300"
                        >
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
                        </Link>
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4">
                <Heart className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold mb-2">No posts found</h3>
              <p className="text-sm text-muted-foreground">
                No articles available in this category yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-6 md:p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#662D91] mb-4">
              <Heart className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Stay Updated
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on dating, relationships, and the future of human connections
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#662D91]/50"
              />
              <Button
                size="lg"
                className="bg-[#662D91] hover:bg-[#662D91]/90 text-white"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

