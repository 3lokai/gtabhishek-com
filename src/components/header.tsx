"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import {
  MobileNav,
  MobileNavDropdown,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarButton,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", link: "/" },
  {
    name: "Tech Learnings",
    link: "/vibe-coding",
    children: [
      { name: "Local Setup", link: "/vibe-coding/local-setup" },
      { name: "Local LLMs", link: "/vibe-coding/local-llms" },
      { name: "Projects", link: "/vibe-coding/projects" },
    ],
  },
  { name: "Marketing", link: "/marketing" },
  { name: "Blog", link: "/blog" },
  { name: "About me", link: "/about-me" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Navbar className="top-0">
      <NavBody>
        <Link
          className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 font-normal text-foreground text-sm"
          href="/"
        >
          <span className="font-bold">GT</span>
        </Link>
        <NavItems items={navigationItems} />
        <div className="relative z-20 flex items-center gap-2">
          <NavbarButton as={Link} href="/contact" variant="primary">
            Contact me
          </NavbarButton>
          <AnimatedThemeToggler
            className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
          />
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Link
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 font-normal text-foreground text-sm"
            href="/"
          >
            <span className="font-bold">GT</span>
          </Link>
          <div className="flex items-center gap-2">
            <NavbarButton
              as={Link}
              className="px-3 py-1.5 text-xs"
              href="/contact"
              variant="primary"
            >
              Contact me
            </NavbarButton>
            <AnimatedThemeToggler
              className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
            />
            <MobileNavToggle
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          {navigationItems.map((item) => {
            const hasDropdown = item.children && item.children.length > 0;
            return (
              <div className="w-full" key={item.link}>
                {hasDropdown ? (
                  <MobileNavDropdown
                    item={item}
                    onItemClick={() => setMobileMenuOpen(false)}
                  />
                ) : (
                  <Link
                    className="block text-muted-foreground hover:text-foreground"
                    href={item.link}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
