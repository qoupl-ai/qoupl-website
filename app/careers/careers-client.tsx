"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Users, Zap, Code, Rocket, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Icon mapping
const iconMap: Record<string, any> = {
  Heart, Users, Zap, Code, Rocket, Mail, Sparkles
};

// Fallback values
const defaultValues = [
  {
    icon: Heart,
    title: "Passion-Driven",
    description: "We're passionate about helping people find meaningful connections.",
    color: "bg-[#662D91]"
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "We believe in the power of teamwork and diverse perspectives.",
    color: "bg-[#662D91]"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We're always pushing boundaries and exploring new possibilities.",
    color: "bg-[#662D91]"
  },
  {
    icon: Code,
    title: "Excellence",
    description: "We're committed to delivering the highest quality in everything we do.",
    color: "bg-[#662D91]"
  }
];

const defaultWhyJoin = [
  {
    title: "Make an Impact",
    description: "Help millions of people find meaningful connections and lasting relationships.",
    icon: "💜"
  },
  {
    title: "Cutting-Edge Tech",
    description: "Work with the latest AI and machine learning technologies in dating.",
    icon: "🚀"
  },
  {
    title: "Great Culture",
    description: "Join a diverse, inclusive team that values your unique perspective.",
    icon: "✨"
  },
  {
    title: "Growth Opportunities",
    description: "Grow your career with learning opportunities and new challenges.",
    icon: "📈"
  },
  {
    title: "Work-Life Balance",
    description: "We believe in working smart and taking care of our team.",
    icon: "⚖️"
  },
  {
    title: "Innovation First",
    description: "Bring your ideas to life and help shape the future of dating.",
    icon: "💡"
  }
];

interface CareersClientProps {
  data: {
    sections: Array<{
      type: string;
      content: any;
    }>;
  };
}

export default function CareersClient({ data }: CareersClientProps) {
  // Extract data from sections
  const heroSection = data.sections.find(s => s.type === 'hero');
  const comingSoonSection = data.sections.find(s => s.type === 'coming-soon');
  const valuesSection = data.sections.find(s => s.type === 'values');
  const whyJoinSection = data.sections.find(s => s.type === 'why-join');

  const heroTitle = heroSection?.content?.title || "Build the Future of Dating";
  const heroSubtitle = heroSection?.content?.subtitle || "Help us create meaningful connections for college students that change lives";
  const comingSoonTitle = comingSoonSection?.content?.title || "We're Building Something Special";
  const comingSoonDescription = comingSoonSection?.content?.description || "We're currently in the development phase and will be posting job openings soon. If you're passionate about creating meaningful connections and want to be part of our journey, we'd love to hear from you!";
  const comingSoonEmail = comingSoonSection?.content?.email || "careers@qoupl.ai";
  const values = valuesSection?.content?.values || defaultValues;
  const whyJoin = whyJoinSection?.content?.items || defaultWhyJoin;

  // Process values to include icon components
  const processedValues = values.map((item: any) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] || Heart : Heart,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#662D91]/20 via-[#662D91]/20 to-[#662D91]/20 dark:from-[#662D91]/40 dark:via-[#662D91]/40 dark:to-[#662D91]/40" />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#662D91]/30 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-8 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

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
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-semibold">Join Our Team</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {heroTitle.split(' ').map((word, i) => 
                word === 'Dating' ? (
                  <span key={i} className="bg-[#662D91] bg-clip-text text-transparent">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
              {heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#662D91]/20 rounded-3xl blur-xl" />

            <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-3xl p-12 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#662D91] mb-8">
                <Sparkles className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {comingSoonTitle.split(' ').map((word, i) => 
                  word === 'Special' ? (
                    <span key={i} className="bg-[#662D91] bg-clip-text text-transparent">{word} </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h2>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {comingSoonDescription}
              </p>

              <div className="bg-[#662D91]/5 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4">Be in Touch</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Send us your resume and a note about why you'd like to join qoupl.
                  We'll reach out when positions become available.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`mailto:${comingSoonEmail}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#662D91] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Mail className="h-5 w-5" />
                    {comingSoonEmail}
                  </a>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                We're an equal opportunity employer and value diversity at our company.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.05),transparent_50%)]" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What We{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                Value
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide how we work and build together
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {processedValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 ${value.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

                  <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300">
                    <div className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-[#662D91]/10 to-[#662D91]/10" />

        <div className="container mx-auto px-4 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Join{" "}
              <span className="bg-[#662D91] bg-clip-text text-transparent">
                qoupl?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {whyJoin.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center p-6"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

