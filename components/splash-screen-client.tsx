"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/splash-screen";
import { useGlobalContent } from "@/components/global-content-provider";

export default function SplashScreenClient() {
  const [showSplash, setShowSplash] = useState(true);
  const { splashScreen } = useGlobalContent();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (!splashScreen) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Splash screen content is missing in CMS.");
    }
    return null;
  }

  if (splashScreen.show === false) {
    return null;
  }

  return (
    <AnimatePresence>
      {showSplash && (
        <SplashScreen key="splash" onComplete={handleSplashComplete} />
      )}
    </AnimatePresence>
  );
}
