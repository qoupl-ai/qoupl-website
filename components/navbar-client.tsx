"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import type { NavbarContent } from "@/lib/supabase/content";

interface NavbarClientProps {
  content: NavbarContent;
}

export default function NavbarClient({ content }: NavbarClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      // On homepage, show navbar only after scrolling
      return scrollY.on("change", (latest) => {
        if (latest > 50) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    } else {
      // On other pages, always show navbar
      setIsVisible(true);
    }
  }, [scrollY, isHomePage]);

  const navLinks = content.links;

  return (
    <motion.nav
      initial={{ y: isHomePage ? -100 : 0, opacity: isHomePage ? 0 : 1 }}
      animate={{
        y: isVisible ? 0 : (isHomePage ? -100 : 0),
        opacity: isVisible ? 1 : (isHomePage ? 0 : 1)
      }}
      transition={{ duration: 0.3 }}
      className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 bg-background border-b border-border`}
    >

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            {content.logo?.src && content.logo.src.trim() !== '' ? (
              <Image
                src={content.logo.src}
                alt={content.logo.alt ?? 'qoupl'}
                width={content.logo.width ?? 120}
                height={content.logo.height ?? 40}
                className="h-8 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-[#662D91]" style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>qoupl</span>
            )}
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
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
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
          <div className="py-4 space-y-2 border-t border-border">
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

