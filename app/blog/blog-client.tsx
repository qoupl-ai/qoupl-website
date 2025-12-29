"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import { resolveLucideIcon } from "@/lib/utils/icons";

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
  ui: {
    list?: {
      hero?: {
        badge?: {
          text?: string;
          icon?: string;
          show?: boolean;
        };
        title?: string;
        titleHighlight?: string;
        subtitle?: string;
        showTitle?: boolean;
        showSubtitle?: boolean;
      };
      filter?: {
        all_label?: string;
        show?: boolean;
      };
      cards?: {
        read_more_label?: string;
        read_more_icon?: string;
        date_icon?: string;
        time_icon?: string;
        read_time_suffix?: string;
      };
      empty_state?: {
        show?: boolean;
        icon?: string;
        title?: string;
        description?: string;
      };
    };
  };
}

const gradientMap: Record<string, string> = {
  Technology: "bg-[#662D91]",
  Relationships: "bg-[#662D91]",
  Safety: "from-blue-500 to-cyan-500",
  Psychology: "bg-[#662D91]",
  "Tips & Tricks": "from-orange-500 to-amber-500",
};

export default function BlogClient({ posts, categories, ui }: BlogClientProps) {
  const listUi = ui.list || {};
  const hero = listUi.hero || {};
  const badge = hero.badge || {};
  const filter = listUi.filter || {};
  const cards = listUi.cards || {};
  const emptyState = listUi.empty_state || {};

  const BadgeIcon = resolveLucideIcon(badge.icon);
  const DateIcon = resolveLucideIcon(cards.date_icon);
  const TimeIcon = resolveLucideIcon(cards.time_icon);
  const ReadMoreIcon = resolveLucideIcon(cards.read_more_icon);
  const EmptyIcon = resolveLucideIcon(emptyState.icon);

  if (badge.show !== false && badge.icon && !BadgeIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Blog hero badge icon is missing or invalid in CMS.");
  }
  if (cards.date_icon && !DateIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Blog card date icon is missing or invalid in CMS.");
  }
  if (cards.time_icon && !TimeIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Blog card time icon is missing or invalid in CMS.");
  }
  if (cards.read_more_icon && !ReadMoreIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Blog card read more icon is missing or invalid in CMS.");
  }
  if (emptyState.icon && !EmptyIcon && process.env.NODE_ENV !== "production") {
    throw new Error("Blog empty state icon is missing or invalid in CMS.");
  }

  const showFilter = filter.show !== false;
  const allLabel = filter.all_label || "";

  if (showFilter && !allLabel && process.env.NODE_ENV !== "production") {
    throw new Error("Blog filter 'All' label is missing in CMS.");
  }

  const [selectedCategory, setSelectedCategory] = useState<string>(allLabel);

  const categoryNames = showFilter
    ? [allLabel, ...categories.map((cat) => cat.name)]
    : categories.map((cat) => cat.name);

  const filteredPosts = !showFilter || selectedCategory === allLabel
    ? posts
    : posts.filter((post) => post.category?.name === selectedCategory);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return "";
    return resolveStorageUrl(imagePath);
  };

  const getGradient = (categoryName: string | null) => {
    if (!categoryName) return "bg-[#662D91]";
    return gradientMap[categoryName] || "bg-[#662D91]";
  };

  const title = hero.title || "";
  const highlight = hero.titleHighlight || "";

  const renderTitle = () => {
    if (!highlight) return title;
    const index = title.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return title;
    const before = title.slice(0, index);
    const match = title.slice(index, index + highlight.length);
    const after = title.slice(index + highlight.length);
    return (
      <>
        {before}
        <span className="bg-[#662D91] bg-clip-text text-transparent">{match}</span>
        {after}
      </>
    );
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
            {badge.show !== false && badge.text && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm"
              >
                {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
                <span className="text-sm font-semibold">{badge.text}</span>
              </motion.div>
            )}

            {hero.showTitle !== false && title && (
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                {renderTitle()}
              </h1>
            )}
            {hero.showSubtitle !== false && hero.subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {hero.subtitle}
              </p>
            )}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#662D91]/10 rounded-full blur-3xl" />
      </section>

      {/* Category Filter */}
      {showFilter && categoryNames.length > 0 && (
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
      )}

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                const categoryName = post.category?.name || "";
                const gradient = getGradient(categoryName);
                const imageUrl = getImageUrl(post.featured_image);
                const dateLabel = formatDate(post.publish_date);
                const readTimeSuffix = cards.read_time_suffix || "";

                if (post.featured_image && !imageUrl && process.env.NODE_ENV !== "production") {
                  throw new Error(`Blog post \"${post.title}\" has an invalid featured image URL.`);
                }

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
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Category badge */}
                        {categoryName && (
                          <div className="absolute top-4 left-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${gradient} shadow-lg`}>
                              {categoryName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          {dateLabel && (
                            <div className="flex items-center gap-1">
                              {DateIcon && <DateIcon className="h-4 w-4" />}
                              <span>{dateLabel}</span>
                            </div>
                          )}
                          {post.read_time && (readTimeSuffix || TimeIcon) && (
                            <div className="flex items-center gap-1">
                              {TimeIcon && <TimeIcon className="h-4 w-4" />}
                              <span>
                                {post.read_time}
                                {readTimeSuffix ? ` ${readTimeSuffix}` : ""}
                              </span>
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

                        {cards.read_more_label && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300"
                          >
                            <span>{cards.read_more_label}</span>
                            {ReadMoreIcon && (
                              <ReadMoreIcon className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                            )}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            emptyState.show !== false && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                {EmptyIcon && (
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <EmptyIcon className="h-10 w-10 text-primary" />
                  </div>
                )}
                {emptyState.title && (
                  <h3 className="text-2xl font-bold mb-2">{emptyState.title}</h3>
                )}
                {emptyState.description && (
                  <p className="text-muted-foreground">{emptyState.description}</p>
                )}
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
