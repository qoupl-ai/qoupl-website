'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Heart } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publish_date: string;
  read_time: number;
  featured_image: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface BlogGridProps {
  posts: BlogPost[];
  categories: string[];
}

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category.name === selectedCategory);

  // Get category gradient - simple mapping based on category name
  const getCategoryGradient = (categoryName: string) => {
    const gradients: Record<string, string> = {
      'Technology': 'from-purple-500 to-pink-500',
      'Relationships': 'from-pink-500 to-rose-500',
      'Safety': 'from-blue-500 to-cyan-500',
      'Psychology': 'from-indigo-500 to-purple-500',
      'Tips & Tricks': 'from-orange-500 to-amber-500',
      'Dating Tips': 'from-green-500 to-emerald-500',
    };
    return gradients[categoryName] || 'from-[#662D91] to-[#8B3DB8]';
  };

  return (
    <>
      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => (
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
                const gradient = getCategoryGradient(post.category.name);

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
                    <Link href={`/blog/${post.slug}`}>
                      <motion.div
                        whileHover={{ y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="relative h-full bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                      >
                        {/* Featured Image */}
                        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                          {post.featured_image && (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${gradient} shadow-lg`}>
                              {post.category.name}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(post.publish_date), 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.read_time} min read</span>
                            </div>
                          </div>

                          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                            {post.title}
                          </h2>

                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                            <span>Read More</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
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
    </>
  );
}
