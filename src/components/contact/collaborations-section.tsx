"use client";

import { motion } from "motion/react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Announcement,
  AnnouncementShinyText,
} from "@/components/ui/shadcn-io/announcement";

const MotionCard = motion(Card);

const pillars = [
  {
    emoji: "🤖",
    title: "AI + Growth Consulting",
    description:
      "Quick audits, messaging/positioning, and lightweight automations (n8n, LLM workflows, lead routing) to unblock your GTM.",
  },
  {
    emoji: "💡",
    title: "Startup Advisory (Short Sprints)",
    description:
      'Early-stage GTM plans, sales enablement kits, and "first 90 days" motion — focused on clarity, not slide fatigue.',
  },
  {
    emoji: "🎤",
    title: "Speaking & Workshops",
    description:
      "Talks and hands-on sessions on agentic marketing, dark-funnel capture, and building reusable growth systems.",
  },
];

export function CollaborationsSection() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 md:space-y-12"
      initial={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.2,
      }}
    >
      {/* Availability badge */}
      <div className="flex items-center justify-center">
        <Announcement className="border-border/50 bg-muted/30 px-4 py-1.5">
          <AnnouncementShinyText className="text-xs">
            Currently at Publicis Sapient • Selective availability
          </AnnouncementShinyText>
        </Announcement>
      </div>

      <div className="space-y-4 text-center md:space-y-6">
        <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
          Collaborations & Opportunities
        </h2>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          I&apos;m full-time at Publicis Sapient. I still take on a few
          high-leverage collaborations where I can move the needle fast.
        </p>
      </div>

      {/* Three mini-pillars */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {pillars.map((pillar, idx) => (
          <MotionCard
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="group relative overflow-hidden rounded-[1.25rem] border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            key={pillar.title}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1 + idx * 0.08,
            }}
            whileHover={{ y: -4, scale: 1.01 }}
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

            <CardHeader className="relative z-20">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2 font-semibold text-xl">
                    <span className="text-2xl">{pillar.emoji}</span>
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    {pillar.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </MotionCard>
        ))}
      </div>

      {/* Micro-facts / guardrails */}
      <div className="space-y-4 text-center md:space-y-6">
        <div className="mx-auto max-w-2xl space-y-2 text-muted-foreground text-sm">
          <p>
            <strong className="text-foreground">Typical engagement:</strong> 1–3
            week sprint or 2–4 hrs/week.
          </p>
          <p>I prioritize seed to Series A teams and B2B SaaS.</p>
          <p>If I can&apos;t help, I&apos;ll point you to someone who can.</p>
        </div>

        {/* CTA line */}
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          If that sounds useful, book a quick intro or drop me a note — both
          options are above.
        </p>
      </div>
    </motion.div>
  );
}
