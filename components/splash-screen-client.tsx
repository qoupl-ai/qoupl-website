"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/splash-screen";

export default function SplashScreenClient() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <SplashScreen key="splash" onComplete={handleSplashComplete} />
      )}
    </AnimatePresence>
  );
}

