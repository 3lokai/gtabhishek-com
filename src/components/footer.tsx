import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { HexagonIcon, MediumIcon } from "@/components/icons";

type FooterLink = {
  name: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Pages",
    links: [
      { name: "Home", href: "/" },
      { name: "Vibe-Coding", href: "/vibe-coding" },
      { name: "Marketing", href: "/marketing" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "About me", href: "/about-me" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms", href: "/#terms" },
      { name: "Privacy", href: "/#privacy" },
    ],
  },
];

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Medium", icon: "Medium", href: "https://medium.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-border border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Identity */}
          <div className="flex items-center space-x-2 lg:col-span-1">
            <HexagonIcon className="h-6 w-6 text-foreground" />
            <Link
              className="font-semibold text-foreground text-sm transition-colors hover:text-primary"
              href="/"
            >
              GTabhishek.com
            </Link>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section) => (
            <div className="space-y-2" key={section.title}>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-muted-foreground text-sm transition-colors hover:text-accent-foreground"
                      href={link.href}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="font-bold text-foreground text-sm">Social</h3>
            <div className="flex flex-col space-y-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    aria-label={social.name}
                    className="flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-accent-foreground"
                    href={social.href}
                    key={social.name}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {typeof Icon === "string" && Icon === "Medium" ? (
                      <MediumIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="mt-12 border-border border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm md:flex-row">
            <p>© {currentYear} GT Abhishek. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                className="transition-colors hover:text-accent-foreground"
                href="/#terms"
              >
                Terms
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link
                className="transition-colors hover:text-accent-foreground"
                href="/#privacy"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
