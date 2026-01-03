"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getStorageUrl } from "@/lib/supabase/storage-url";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useMemo } from "react";

interface LoveStory {
  image: string;
  couple: string;
  story: string;
}

interface LoveStoryProps {
  data: {
    title?: string;
    subtitle?: string;
    stories?: LoveStory[];
    content?: {
      stories?: LoveStory[];
    };
  };
}


export default function LoveStory({ data = {} }: LoveStoryProps) {
  const { resolvedTheme } = useTheme();
  // Use lazy initializer to avoid calling Math.random during render
  const [heartAnimations] = useState<Array<{ duration: number; rotation: number }>>(() => {
    return Array.from({ length: 12 }).map(() => ({
      duration: 3 + Math.random() * 2,
      rotation: -15 + Math.random() * 30,
    }));
  });

  const [mounted] = useState(() => true);
  const isDark = mounted && resolvedTheme === 'dark';

  // Process stories from data or use defaults
  // Check both data.stories and data.content.stories for flexibility
  const storiesData = data?.stories || data?.content?.stories;
  const stories: LoveStory[] = useMemo(() => {
    if (storiesData && Array.isArray(storiesData) && storiesData.length > 0) {
      return storiesData.map((item: LoveStory) => {
    let imageUrl = item.image;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      if (imageUrl.includes('/')) {
        const [bucket, ...rest] = imageUrl.split('/');
        imageUrl = getStorageUrl(bucket, rest.join('/'));
      } else {
        imageUrl = getStorageUrl("love-story", imageUrl);
      }
    }
    return {
      image: imageUrl || getStorageUrl("love-story", "qoupl_love_story_1.jpg"),
      couple: item.couple || "",
      story: item.story || "",
    };
      });
    }
    return defaultLoveStories;
  }, [storiesData]);

  return (
    <section className="min-h-[calc(100vh-3.5rem)] flex items-center relative overflow-hidden py-10 md:py-14">
      {/* Decorative Hearts Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.05] z-0">
        {heartAnimations.map((anim, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0.05],
              scale: [0, 1, 0.8],
            }}
            transition={{
              duration: anim.duration,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute"
            style={{
              left: `${10 + (i * 7.5)}%`,
              top: `${15 + (i % 3) * 25}%`,
              transform: `rotate(${anim.rotation}deg)`,
            }}
          >
            <Heart className="h-12 w-12 md:h-16 md:w-16 text-primary fill-primary" strokeWidth={0.5} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
          >
            <Heart className="h-4 w-4 fill-primary" />
            <span className="text-sm font-medium">Real Love Stories</span>
          </motion.div>

          <h2 className="text-fluid-5xl leading-tight font-bold mb-4 text-title">
            {data?.title || "Love Letters from Our Couples"}
          </h2>
          <p className="text-fluid-lg leading-relaxed text-paragraph max-w-2xl mx-auto">
            {data?.subtitle || "Read heartfelt stories from college students who found their perfect match on qoupl"}
          </p>
        </motion.div>

        {/* Love Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          {stories.map((story: LoveStory, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Letter Paper - Torn edge design based on reference */}
              <div 
                className="relative flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transform hover:rotate-0 transition-all duration-300"
                  style={{
                    borderRadius: '0.25rem',
                    paddingLeft: '30px',
                    // No grid lines or margin line on any card
                    backgroundColor: isDark ? '#1a1625' : '#F3E8FF',
                    lineHeight: '1.2rem',
                    transform: 'rotate(-4deg)',
                    padding: '1rem',
                    clipPath: `polygon(
                      1% 2%, 3.5% 0.1%, 8.9% 2.7%, 16.2% 1.2%, 19.7% 0.8%, 24.7% 2%, 31.2% 0%, 35.9% 2.3%, 40.6% 0.5%, 47.1% 1.8%, 49.9% 1%, 53.8% 2.5%, 62.2% 0.4%, 67.3% 1.2%, 70.3% 0.3%, 75.8% 1.4%, 78.5% 1.7%, 84% 2.6%, 91.1% 0.5%, 93.6% 2.4%, 97.3% 0.3%, 98.9% 6%, 98.1% 11.4%, 98.6% 15.5%, 97.3% 17.8%, 97.7% 27.4%, 98.3% 28.5%, 99.7% 34.1%, 98.8% 41.9%, 98.3% 45.7%, 98.4% 50.9%, 98.7% 57.4%, 99.6% 60.4%, 99.4% 66.6%, 99.2% 69.5%, 97.4% 77.1%, 98.1% 82.3%, 99.9% 83.5%, 98.2% 91.5%, 99.3% 95.3%, 98% 98.6%, 93.6% 97.4%, 90.3% 98.3%, 86.8% 98.3%, 78.6% 98.5%, 76.4% 99.2%, 69.7% 99.8%, 64.2% 99.3%, 61.8% 99.2%, 57.2% 98.1%, 48.7% 98.3%, 46.8% 99%, 39.6% 98.9%, 33.8% 97.3%, 28.2% 99.4%, 27% 98.3%, 22.1% 98.6%, 13.1% 97.1%, 8.7% 99.3%, 2.7% 97.4%, 2% 98.2%, 2.1% 94.3%, 0.7% 90.5%, 0.9% 86.3%, 2.2% 78.2%, 0.4% 76.7%, 1.2% 72.1%, 2% 64%, 1.4% 59.8%, 0.4% 57.3%, 0.3% 49.1%, 2.9% 44.7%, 1.9% 41.3%, 0.8% 35.7%, 2.9% 31.3%, 0.8% 24.9%, 2.7% 20.5%, 0.8% 17.4%, 2.5% 8.6%, 1.1% 5.5%
                    )`,
                  }}
                >
                
                {/* Corner decorations - hearts */}
                <div className="absolute top-2 left-2 opacity-40 z-10">
                  <Heart className="h-4 w-4" style={{ color: isDark ? '#9333ea' : '#662D91' }} fill={isDark ? '#9333ea' : '#662D91'} strokeWidth={1} />
                </div>
                <div className="absolute top-2 right-2 opacity-40 z-10">
                  <Heart className="h-4 w-4" style={{ color: isDark ? '#9333ea' : '#662D91' }} fill={isDark ? '#9333ea' : '#662D91'} strokeWidth={1} />
                </div>
                <div className="absolute bottom-2 left-2 opacity-40 z-10">
                  <Heart className="h-4 w-4" style={{ color: isDark ? '#9333ea' : '#662D91' }} fill={isDark ? '#9333ea' : '#662D91'} strokeWidth={1} />
                </div>
                <div className="absolute bottom-2 right-2 opacity-40 z-10">
                  <Heart className="h-4 w-4" style={{ color: isDark ? '#9333ea' : '#662D91' }} fill={isDark ? '#9333ea' : '#662D91'} strokeWidth={1} />
                </div>

                {/* Couple Image with corner clips */}
                <div 
                  className="relative"
                  style={{
                    height: 'calc(13*1.2rem)',
                    padding: '1.2rem 1.2rem 0',
                  }}
                >
                  <div className="relative w-full h-full rounded-sm overflow-hidden">
                    <Image
                      src={story.image}
                      alt={story.couple}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 200px, 300px"
                    />
                  </div>
                  {/* Photo corner clips - Brand color */}
                  <div 
                    className="absolute"
                    style={{
                      width: '20px',
                      left: '81%',
                      top: '0',
                      height: '45px',
                      backgroundColor: isDark ? '#9333ea' : '#662D91',
                      transform: 'rotate(45deg)',
                      opacity: 0.7,
                    }}
                  />
                  <div 
                    className="absolute"
                    style={{
                      width: '20px',
                      left: '21%',
                      bottom: '-22px',
                      height: '45px',
                      backgroundColor: isDark ? '#9333ea' : '#662D91',
                      transform: 'rotate(-45deg)',
                      opacity: 0.7,
                    }}
                  />
                </div>

                {/* Letter Content */}
                <div 
                  className="relative"
                  style={{
                    padding: '1.2rem',
                  }}
                >
                  {/* Letter Text with Caveat Font */}
                  <div 
                    className="whitespace-pre-line relative z-10"
                    style={{ 
                      fontFamily: 'var(--font-caveat), cursive',
                      fontSize: '1.25rem',
                      lineHeight: '1.6rem',
                      color: isDark ? '#ffffff' : '#2c2c2c',
                    }}
                  >
                    {story.story}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

