"use client";

// Next.js App Router + FM v11:
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// If you're on older setup, swap to: import { motion } from "framer-motion";

type Span = 1 | 2;

type BentoCardProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string; // makes the whole card a link
  icon?: React.ReactNode; // optional top-right icon
  colSpan?: Span; // desktop column span (1|2). Each "span" = 4 cols in a 12-col grid
  rowSpan?: Span; // desktop row span (1|2)
  index?: number; // for stagger animation
};

const MotionCard = motion(Card);

function BentoCard({
  title,
  description,
  className,
  children,
  href,
  icon,
  colSpan = 1,
  rowSpan = 1,
  index = 0,
}: BentoCardProps) {
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!href) {
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
    },
    [href]
  );

  return (
    <MotionCard
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      className={cn(
        "group relative flex min-h-[200px] flex-col overflow-hidden rounded-[1.25rem] border border-border/50 bg-gradient-to-b from-card/40 to-card/20 outline-none ring-primary/0 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg focus-visible:ring-2",
        // spans: each span = 4 columns in md breakpoint
        colSpan === 2 ? "md:col-span-8" : "md:col-span-4",
        rowSpan === 2
          ? "md:row-span-2 md:min-h-[400px]"
          : "md:row-span-1 md:min-h-[250px]",
        className
      )}
      initial={{ opacity: 0, y: 30, scale: 0.96, rotateX: 5 }}
      onKeyDown={handleKey}
      role={href ? "link" : "region"}
      tabIndex={0}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.08,
      }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        rotateX: -2,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20,
        },
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
      }}
    >
      {/* animated glow on hover */}
      <motion.div
        animate={{
          opacity: 0,
          scale: 0.8,
        }}
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl"
        style={{
          background:
            "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        whileHover={{
          opacity: 1,
          scale: 1.1,
        }}
      />

      {/* border glow effect */}
      <motion.div
        animate={{
          opacity: 0,
        }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.25rem]"
        style={{
          boxShadow:
            "inset 0 0 20px color-mix(in oklch, var(--accent) 10%, transparent)",
        }}
        transition={{
          duration: 0.3,
        }}
        whileHover={{
          opacity: 1,
        }}
      />

      {href && (
        <Link
          aria-label={title}
          className="absolute inset-0 z-10"
          href={href}
        />
      )}

      <CardHeader className="z-20">
        <div className="flex items-start justify-between">
          <motion.div transition={{ delay: 0.1 }} whileHover={{ x: 2 }}>
            <CardTitle className="font-semibold text-xl md:text-2xl">
              {title}
            </CardTitle>
          </motion.div>
          {icon && (
            <motion.div
              animate={{
                opacity: 0.7,
                scale: 1,
              }}
              className="text-base"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{
                opacity: 1,
                rotate: [0, -12, 12, -8, 0],
                scale: 1.15,
                transition: {
                  rotate: {
                    duration: 0.6,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        {description && (
          <motion.div transition={{ delay: 0.15 }} whileHover={{ x: 2 }}>
            <CardDescription className="text-sm md:text-base">
              {description}
            </CardDescription>
          </motion.div>
        )}
      </CardHeader>

      {children && (
        <CardContent className="z-20 flex-1">{children}</CardContent>
      )}
    </MotionCard>
  );
}

export function BentoGrid() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <motion.div
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6"
        initial="hidden"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {/* Professional – 2x2 */}
        <BentoCard
          colSpan={2}
          description="B2B marketing leader. Growth ops. AI-driven automation."
          href="/work"
          icon={<span>👔</span>}
          index={0}
          rowSpan={2}
          title="Professional"
        >
          <div className="flex h-full flex-col justify-end gap-4 p-6">
            <ul className="grid grid-cols-2 gap-3 text-muted-foreground text-sm">
              {[
                "• PS: 17+ campaigns → 10+ QOs",
                "• Pardot rollout, TAT < 8 days",
                "• Hevo: CS from 0→5 team",
                "• ekincare: 35→200+ clients",
              ].map((item, idx) => (
                <motion.li
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -10 }}
                  key={item}
                  transition={{
                    delay: 0.3 + idx * 0.08,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    x: 4,
                    color: "var(--foreground)",
                    transition: { duration: 0.2 },
                  }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="text-muted-foreground/80 text-xs">
              All trademarks belong to their owners.
            </div>
          </div>
        </BentoCard>

        {/* Projects – 2x1 */}
        <BentoCard
          colSpan={1}
          description="IndianCoffeeBeans • Second Brain • Financial OS • n8n automations"
          href="/projects"
          icon={<span>🛠️</span>}
          index={1}
          rowSpan={2}
          title="Vibe Projects"
        >
          <div className="grid h-full grid-cols-2 gap-3 p-6 text-muted-foreground text-sm">
            {[
              "☕ ICB — coffee roaster index",
              "🧠 Second Brain pipelines",
              "💸 Finance OS 2026",
              "⚙️ n8n + Fabric flows",
            ].map((item, idx) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border/50 p-3"
                initial={{ opacity: 0, y: 10 }}
                key={item}
                transition={{
                  delay: 0.3 + idx * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "var(--accent)",
                  transition: { duration: 0.2 },
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* Stack – 1x1 */}
        <BentoCard
          description="Ollama • Docker • Supabase • Qdrant • Postgres • n8n"
          href="/stack"
          icon={<span>🖥️</span>}
          index={2}
          title="Local AI setup"
        >
          <div className="flex h-full items-end p-4 text-muted-foreground text-sm">
            Home-grown AI infra on Arda. Because cloud bills are overrated.
          </div>
        </BentoCard>

        {/* Writing – 1x1 */}
        <BentoCard
          description="Notes on growth, systems, and coffee"
          href="/writing"
          icon={<span>✍️</span>}
          index={3}
          title="Writing"
        >
          <div className="flex h-full flex-col justify-end gap-2 p-4 text-muted-foreground text-sm">
            {[
              "• Dark Funnel Agent – a GTM sketch",
              "• Sales Ops → Agentic Marketing",
              "• DIY Second Brain with n8n",
            ].map((item, idx) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -10 }}
                key={item}
                transition={{
                  delay: 0.3 + idx * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  x: 4,
                  color: "var(--foreground)",
                  transition: { duration: 0.2 },
                }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* Systems Live – 1x1 */}
        <BentoCard
          description="Status from n8n webhooks"
          href="/status"
          icon={<span>🟢</span>}
          index={4}
          title="Known tech stack"
        >
          <div className="flex h-full items-end gap-4 p-4 text-muted-foreground text-sm">
            {[
              { label: "ICB API", up: true },
              { label: "SecondBrain Ingest", up: true },
              { label: "Fabric Local", up: false },
            ].map((item, idx) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                key={item.label}
                transition={{
                  delay: 0.3 + idx * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
              >
                <StatusDot label={item.label} up={item.up} />
              </motion.div>
            ))}
          </div>
        </BentoCard>

        {/* Personal/Coffee – 1x1 */}
        <BentoCard
          description="Family, brews, and tinker logs"
          href="/life"
          icon={<span>☕</span>}
          index={5}
          title="Life / Coffee"
        >
          <div className="flex h-full items-end p-4 text-muted-foreground text-sm">
            Latest brew: Ethiopia natural • fruity finish (or so you claim).
          </div>
        </BentoCard>

        {/* Playbooks and templates – 1x2 */}
        <BentoCard
          colSpan={2}
          description="Reusable workflows and templates"
          href="/playbooks"
          icon={<span>📋</span>}
          index={6}
          rowSpan={1}
          title="Playbooks and templates"
        >
          <div className="flex h-full flex-col justify-end gap-4 p-6">
            <div className="text-muted-foreground text-sm">
              Reusable workflows, templates, and automation playbooks.
            </div>
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}

/** tiny helper */
function StatusDot({ label, up = false }: { label: string; up?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden
        className={cn(
          "h-2.5 w-2.5 rounded-full",
          up ? "animate-pulse bg-chart-2" : "bg-muted-foreground/50"
        )}
      />
      <span>{label}</span>
    </div>
  );
}
