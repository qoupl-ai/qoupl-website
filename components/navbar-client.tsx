"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";
import type { NavbarContent } from "@/lib/supabase/content";

interface NavbarClientProps {
  content: NavbarContent;
}

export default function NavbarClient({ content }: NavbarClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      // Show navbar only after user starts scrolling
      if (latest > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  const navLinks = Array.isArray(content.links)
    ? content.links.filter((link) => link.show !== false)
    : [];

  const logoSrc = resolveStorageUrl(content.logo?.image);
  const logoWidth = content.logo?.width ?? 0;
  const logoHeight = content.logo?.height ?? 0;
  if (!logoSrc || logoWidth <= 0 || logoHeight <= 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Navbar logo image is missing or invalid.");
    }
    return null;
  }

  const toggleConfig = content.mobile_toggle;
  const OpenIcon = resolveLucideIcon(toggleConfig?.open_icon);
  const CloseIcon = resolveLucideIcon(toggleConfig?.close_icon);
  const showToggle = toggleConfig?.show !== false;
  const toggleLabel = toggleConfig?.aria_label ?? "";

  if (showToggle && (!OpenIcon || !CloseIcon)) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Navbar mobile toggle icons are missing or invalid.");
    }
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 glass-navbar"
    >
      {/* Liquid Glass Reflection Layers - Light Mode Only */}
      <div 
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 30%, transparent 70%)",
        }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-60 dark:hidden"
        style={{
          background: "radial-gradient(ellipse at top, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
        }}
      />
      
      {/* Dark Mode Reflection - Subtle */}
      <div 
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <Image
              src={logoSrc}
              alt={content.logo?.alt || ""}
              width={logoWidth}
              height={logoHeight}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#662D91]"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#662D91] rounded-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            {showToggle && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                aria-label={toggleLabel}
              >
                {isMobileMenuOpen ? (
                  CloseIcon ? <CloseIcon className="h-5 w-5" /> : null
                ) : (
                  OpenIcon ? <OpenIcon className="h-5 w-5" /> : null
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 border-t border-white/10 dark:border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#662D91] bg-[#662D91]/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
