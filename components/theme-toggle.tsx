"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { useGlobalContent } from "@/components/global-content-provider";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { themeToggle } = useGlobalContent();

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

  if (!themeToggle || themeToggle.show === false) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Theme toggle content is missing in CMS.");
    }
    return null;
  }

  // Use resolvedTheme to show the actual theme being used (when system is selected)
  // Use theme to show the selected preference (dark/light/system)
  const displayTheme = theme === "system" ? resolvedTheme : theme;
  const visibleOptions = (themeToggle.options || []).filter((option) => option.show !== false);
  const currentOption = visibleOptions.find((option) => option.value === displayTheme);
  const CurrentIcon = resolveLucideIcon(currentOption?.icon);

  if (!CurrentIcon) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Theme toggle icons are missing or invalid.");
    }
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label={themeToggle.aria_label || ""}
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-32 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
          {visibleOptions.map((option) => {
            const OptionIcon = resolveLucideIcon(option.icon);
            if (!OptionIcon) return null;
            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
                  theme === option.value ? "bg-muted font-medium" : ""
                }`}
              >
                <OptionIcon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
