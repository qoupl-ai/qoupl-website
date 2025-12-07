"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import AnimatedHero from "@/components/sections/animated-hero";
import HowItWorks from "@/components/sections/how-it-works";
import ProductFeatures from "@/components/sections/product-features";
import Gallery from "@/components/sections/gallery";
import Testimonials from "@/components/sections/testimonials";
import AppDownload from "@/components/sections/app-download";
import ComingSoon from "@/components/sections/coming-soon";
import Footer from "@/components/sections/footer";
import Navbar from "@/components/navbar";
import SplashScreen from "@/components/splash-screen";
import { StructuredData, organizationSchema, websiteSchema, webApplicationSchema } from "@/components/structured-data";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    // Remove splash screen with fade animation
    setShowSplash(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={webApplicationSchema} />

      {/* Main content - Always rendered so hero animations can initialize */}
      <div className="min-h-screen">
        <Navbar />
        <AnimatedHero />
        <HowItWorks />
        <ProductFeatures />
        <Gallery />
        <Testimonials />
        <AppDownload />
        <ComingSoon />
        <Footer />
      </div>

      {/* Splash Screen - Overlays on top, fades out when complete */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
