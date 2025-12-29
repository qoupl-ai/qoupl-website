"use client";

import Link from "next/link";
import { Calendar, Clock, ArrowRight, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getStorageUrl } from "@/lib/supabase/storage-url";

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

const gradientMap: Record<string, string> = {
  "Technology": "bg-[#662D91]",
  "Relationships": "bg-[#662D91]",
  "Safety": "from-blue-500 to-cyan-500",
  "Psychology": "bg-[#662D91]",
  "Tips & Tricks": "from-orange-500 to-amber-500",
};

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
      if (bucket) {
        return getStorageUrl(bucket, rest.join('/'));
      }
    }
    return getStorageUrl("blog-images", imagePath);
  };

  // Get gradient for category
  const getGradient = (categoryName: string | null) => {
    if (!categoryName) return "bg-[#662D91]";
    return gradientMap[categoryName] || "bg-[#662D91]";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#662D91]/5 dark:bg-[#662D91]/10 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Insights & Stories</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              qoupl{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Discover insights on dating for college students, relationships, and technology
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#662D91]/10 rounded-full blur-3xl" />
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categoryNames.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg"
                    : "bg-card border border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                const categoryName = post.category?.name || "Uncategorized";
                const gradient = getGradient(categoryName);
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group relative"
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${gradient} shadow-lg`}>
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.publish_date)}</span>
                          </div>
                          {post.read_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.read_time} min read</span>
                            </div>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                        )}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300"
                        >
                          <span>Read More</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
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
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                No articles available in this category yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#662D91]/10 to-[#662D91]/10" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#662D91] mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on dating, relationships, and the future of human connections
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-8 py-4 bg-[#662D91] text-white rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

