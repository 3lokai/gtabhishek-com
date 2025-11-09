"use client";

import { Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { CollaborationsSection } from "@/components/contact/collaborations-section";
import { ContactSection } from "@/components/contact/contact-section";
import { PageShell } from "@/components/page-shell";

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
];

export default function ContactPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-16 md:space-y-24">
        {/* Connect with me section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="space-y-2 text-center">
            <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
              Connect with me
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              Follow me on social media or reach out directly
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  animate={{ opacity: 1, y: 0 }}
                  aria-label={social.name}
                  className="group relative flex items-center gap-2 overflow-hidden rounded-[1.25rem] border border-border/50 bg-gradient-to-b from-card/40 to-card/20 px-4 py-2 text-muted-foreground text-sm backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:text-accent-foreground hover:shadow-lg"
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  key={social.name}
                  rel="noopener noreferrer"
                  target="_blank"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: idx * 0.08,
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    animate={{ opacity: 0, scale: 0.8 }}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                    }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                  />
                  <Icon className="relative z-10 h-5 w-5" />
                  <span className="relative z-10">{social.name}</span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <ContactSection />

        <CollaborationsSection />
      </div>
    </PageShell>
  );
}
