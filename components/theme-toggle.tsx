"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return null;
  }

  // Use resolvedTheme to show the actual theme being used (when system is selected)
  // Use theme to show the selected preference (dark/light/system)
  const displayTheme = theme === "system" ? resolvedTheme : theme;
  const currentIcon = displayTheme === "dark" ? <Moon className="h-5 w-5" /> : displayTheme === "light" ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {currentIcon}
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-32 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
              theme === "dark" ? "bg-muted font-medium" : ""
            }`}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
              theme === "light" ? "bg-muted font-medium" : ""
            }`}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
              theme === "system" ? "bg-muted font-medium" : ""
            }`}
          >
            <Monitor className="h-4 w-4" />
            System
          </button>
        </div>
      )}
    </div>
  );
}
