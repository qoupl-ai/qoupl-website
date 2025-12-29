"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { FooterContent, SocialLinks } from "@/lib/supabase/content";
import { resolveLucideIcon } from "@/lib/utils/icons";
import { resolveStorageUrl } from "@/lib/supabase/storage-url";

interface FooterClientProps {
  footerContent: FooterContent;
  socialLinks: SocialLinks;
}

export default function FooterClient({ footerContent, socialLinks }: FooterClientProps) {
  // Ensure socialLinks has the correct structure
  const socialLinksArray = socialLinks?.links || []
  const logoSrc = resolveStorageUrl(footerContent.brand?.logo?.image)
  const logoWidth = footerContent.brand?.logo?.width ?? 0
  const logoHeight = footerContent.brand?.logo?.height ?? 0

  if (!logoSrc || logoWidth <= 0 || logoHeight <= 0) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Footer logo image is missing or invalid.");
    }
    return null;
  }

  const productLinks = footerContent.columns?.product?.links?.filter((link) => link.show !== false) || []
  const companyLinks = footerContent.columns?.company?.links?.filter((link) => link.show !== false) || []
  const legalLinks = footerContent.columns?.legal?.links?.filter((link) => link.show !== false) || []
  const showBrand = footerContent.brand?.show !== false
  const showProduct = footerContent.columns?.product?.show !== false
  const showCompany = footerContent.columns?.company?.show !== false
  const showLegal = footerContent.columns?.legal?.show !== false
  const showThemeToggle = footerContent.theme_toggle?.show !== false
  const showCopyright = footerContent.copyright?.show !== false

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          {showBrand && (
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Image
                  src={logoSrc}
                  alt={footerContent.brand?.logo?.alt || ""}
                  width={logoWidth}
                  height={logoHeight}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {footerContent.brand?.description}
              </p>
              <div className="flex gap-4">
                {socialLinksArray
                  .filter((socialLink) => socialLink.show !== false)
                  .map((socialLink, index) => {
                    const IconComponent = resolveLucideIcon(socialLink.icon)
                    if (!IconComponent) {
                      if (process.env.NODE_ENV !== "production") {
                        throw new Error("Footer social link icon is missing or invalid.");
                      }
                      return null
                    }
                    return (
                      <Link
                        key={index}
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        title={socialLink.label || ""}
                      >
                        <IconComponent className="h-5 w-5" />
                      </Link>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Product */}
          {showProduct && (
            <div>
              <h3 className="font-semibold mb-4">{footerContent.columns?.product?.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Company */}
          {showCompany && (
            <div>
              <h3 className="font-semibold mb-4">{footerContent.columns?.company?.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          {showLegal && (
            <div>
              <h3 className="font-semibold mb-4">{footerContent.columns?.legal?.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        {showCopyright && (
          <div className="pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center md:items-end gap-2">
                <p className="text-sm text-muted-foreground">
                  {footerContent.copyright?.primary_prefix || ''}
                  {footerContent.copyright?.show_year !== false && footerContent.copyright?.year
                    ? `${footerContent.copyright.year} `
                    : ''}
                  {footerContent.copyright?.company || ''}
                  {footerContent.copyright?.primary_suffix ? ` ${footerContent.copyright.primary_suffix}` : ''}
                </p>
                {footerContent.copyright?.show_secondary !== false && footerContent.copyright?.secondary_text && (
                  <p className="text-sm text-muted-foreground">
                    {footerContent.copyright.secondary_text}
                  </p>
                )}
                {showThemeToggle && <ThemeToggle />}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
