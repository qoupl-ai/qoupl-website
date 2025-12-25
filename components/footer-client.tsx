"use client";

import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FooterContent, SocialLinks } from "@/lib/supabase/content";

interface FooterClientProps {
  footerContent: FooterContent;
  socialLinks: SocialLinks;
}

export default function FooterClient({ footerContent, socialLinks }: FooterClientProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src={footerContent.brand.logo.src}
                alt={footerContent.brand.logo.alt}
                width={footerContent.brand.logo.width}
                height={footerContent.brand.logo.height}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {footerContent.brand.description}
            </p>
            <div className="flex gap-4">
              <Link
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{footerContent.columns.product.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerContent.columns.product.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">{footerContent.columns.company.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerContent.columns.company.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{footerContent.columns.legal.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerContent.columns.legal.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {footerContent.copyright.company}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              {footerContent.copyright.text}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

