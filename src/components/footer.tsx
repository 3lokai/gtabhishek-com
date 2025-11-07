import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

function HexagonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>GTabhishek.com Logo</title>
      <path d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" />
    </svg>
  );
}

function MediumIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Medium</title>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}
