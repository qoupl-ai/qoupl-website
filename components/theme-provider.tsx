"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

function getTimeBasedTheme() {
  const hour = new Date().getHours();
  // Light mode: 6 AM to 6 PM (6-18)
  // Dark mode: 6 PM to 6 AM (18-24, 0-6)
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [defaultTheme, setDefaultTheme] = useState<string>("light");

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");

    if (!savedTheme) {
      // No saved preference, use time-based theme
      const timeBasedTheme = getTimeBasedTheme();
      setDefaultTheme(timeBasedTheme);
      localStorage.setItem("theme", timeBasedTheme);
    } else {
      // User has a preference, use it
      setDefaultTheme(savedTheme);
    }
  }, []);

  return (
    <NextThemesProvider {...props} defaultTheme={defaultTheme}>
      {children}
    </NextThemesProvider>
  );
}
