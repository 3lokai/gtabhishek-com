"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { journey } from "@/data/journey";
import { cn } from "@/lib/utils";

export default function ExperienceJourney() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = railRef.current;
    if (!el) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) {
      return;
    }

    checkScrollability();

    const handleScroll = () => {
      checkScrollability();
    };

    const handleResize = () => {
      checkScrollability();
    };

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Check again after a short delay to account for layout
    const timeoutId = setTimeout(checkScrollability, 100);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkScrollability]);

  const scrollLeft = () => {
    const el = railRef.current;
    if (!el) {
      return;
    }
    const cardWidth = el.clientWidth * 0.42; // Approximate card width on md breakpoint
    el.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    const el = railRef.current;
    if (!el) {
      return;
    }
    const cardWidth = el.clientWidth * 0.42; // Approximate card width on md breakpoint
    el.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          Career Journey
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          A quick glide through roles and outcomes.
        </p>
      </div>

      {/* Rail + path */}
      <section aria-label="Horizontal career journey" className="relative">
        {/* Left navigation button */}
        {canScrollLeft && (
          <Button
            aria-label="Scroll left"
            className="-translate-y-1/2 absolute top-1/2 left-0 z-30 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background/90"
            onClick={scrollLeft}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right navigation button */}
        {canScrollRight && (
          <Button
            aria-label="Scroll right"
            className="-translate-y-1/2 absolute top-1/2 right-0 z-30 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm transition-opacity hover:bg-background/90"
            onClick={scrollRight}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        <div
          className={cn(
            "relative",
            "overflow-x-auto overflow-y-hidden",
            "snap-x snap-mandatory",
            "scroll-p-6",
            "[scrollbar-width:none]",
            "[-ms-overflow-style:none]",
            "[&::-webkit-scrollbar]:hidden"
          )}
          ref={railRef}
        >
          <div className="relative flex min-w-full items-stretch gap-8 pr-6 md:gap-10">
            {/* Animated path under the cards */}
            <PathUnderlay count={journey.length} />

            {journey.map((stop, idx) => (
              <JourneyCard index={idx} key={stop.id} stop={stop} />
            ))}

            {/* End spacer so last card can center nicely */}
            <div className="min-w-[10vw]" />
          </div>
        </div>
      </section>
    </section>
  );
}

type JourneyCardProps = {
  stop: (typeof journey)[number];
  index: number;
};

function JourneyCard({ stop, index }: JourneyCardProps) {
  return (
    <motion.article
      aria-label={`${stop.company}, ${stop.role}, ${stop.period}`}
      className={cn(
        "snap-center",
        "relative w-[78vw] sm:w-[60vw] md:w-[42vw] lg:w-[34vw] xl:w-[28vw]",
        "shrink-0 rounded-2xl border border-border/50",
        "bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm",
        "p-5 md:p-6",
        "group transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      tabIndex={0}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 26,
        delay: index * 0.03,
      }}
      viewport={{ amount: 0.6, once: true }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 20,
        },
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
    >
      {/* Animated glow on hover */}
      <motion.div
        animate={{
          opacity: 0,
          scale: 0.8,
        }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl"
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

      {/* Border glow effect */}
      <motion.div
        animate={{
          opacity: 0,
        }}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
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
      {/* Node pin on the path */}
      <motion.span
        aria-hidden
        className="-top-3 absolute left-8 h-5 w-5 rounded-full border-2 border-primary bg-background shadow"
        initial={{ scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 22,
          delay: 0.05 * index,
        }}
        viewport={{ once: true }}
        whileHover={{
          scale: 1.2,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
          },
        }}
        whileInView={{ scale: 1 }}
      />

      {/* Period tag with glow - positioned top right */}
      <motion.time
        className="glow-text absolute top-5 right-5 z-10 font-medium text-primary/90 text-xs"
        dateTime={stop.period}
        whileHover={{
          scale: 1.1,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
          },
        }}
      >
        {stop.period}
      </motion.time>

      <header className="relative z-10 mb-3">
        <motion.h3
          className="heading-3"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ x: 2 }}
        >
          {stop.company}
        </motion.h3>
        <motion.p
          className="text-primary/90 text-sm md:text-base"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ x: 2 }}
        >
          {stop.role}
        </motion.p>
      </header>

      <ul className="relative z-10 space-y-2 text-muted-foreground text-sm leading-relaxed md:text-[0.95rem]">
        {stop.points.map((p, i) => (
          <motion.li
            className="flex gap-2"
            initial={{ opacity: 0, x: -10 }}
            key={p}
            transition={{
              delay: 0.1 + i * 0.05,
              type: "spring",
              stiffness: 200,
            }}
            viewport={{ once: true }}
            whileHover={{
              x: 4,
              color: "var(--foreground)",
              transition: { duration: 0.2 },
            }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <span
              aria-hidden
              className="mt-2 h-[6px] w-[6px] rounded-full bg-primary/70"
            />
            <span>{p}</span>
          </motion.li>
        ))}
      </ul>

      <footer className="relative z-10 mt-4">
        {stop.href ? (
          <motion.div
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            whileHover={{ x: 2 }}
          >
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary text-xs transition hover:bg-primary/15 md:text-sm"
              href={stop.href}
            >
              Learn more
              <motion.svg
                aria-hidden
                className="-mr-0.5"
                height="14"
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                viewBox="0 0 24 24"
                whileHover={{ rotate: 45 }}
                width="14"
              >
                <title>External link arrow</title>
                <path
                  d="M7 17L17 7M17 7H9M17 7v8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </motion.svg>
            </Link>
          </motion.div>
        ) : null}
      </footer>
    </motion.article>
  );
}

type PathUnderlayProps = {
  count: number;
};

function PathUnderlay({ count }: PathUnderlayProps) {
  const SEG_W = 420; // virtual width per segment; matches card width-ish
  const PAD_L = 64;
  const PAD_R = 160;
  const H = 160;
  const W = PAD_L + PAD_R + SEG_W * Math.max(count - 1, 1);

  // Build a gentle sine-like path across segments
  const d = buildWavePath({
    segments: Math.max(count - 1, 1),
    widthPerSeg: SEG_W,
    amp: 26,
    padLeft: PAD_L,
    padRight: PAD_R,
    midY: H / 2,
  });

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute top-10 left-0"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
    >
      <title>Career journey path</title>
      <motion.path
        d={d}
        fill="none"
        initial={{ pathLength: 0 }}
        stroke="hsl(240 5% 60% / 0.35)"
        strokeWidth="2"
        transition={{ duration: 1.2, ease: "easeInOut" }}
        viewport={{ amount: 0.6, once: true }}
        whileInView={{ pathLength: 1 }}
      />
      {/* soft glow */}
      <motion.path
        d={d}
        fill="none"
        initial={{ pathLength: 0 }}
        stroke="hsl(240 5% 60% / 0.15)"
        strokeLinecap="round"
        strokeWidth="8"
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
        viewport={{ amount: 0.6, once: true }}
        whileInView={{ pathLength: 1 }}
      />
    </svg>
  );
}

type BuildWavePathOpts = {
  segments: number;
  widthPerSeg: number;
  amp: number;
  padLeft: number;
  padRight: number;
  midY: number;
};

function buildWavePath(opts: BuildWavePathOpts) {
  const { segments, widthPerSeg, amp, padLeft, padRight, midY } = opts;
  const startX = padLeft;
  const endX = padLeft + segments * widthPerSeg;
  // cubic bezier handles to create a subtle wave per segment
  let d = `M ${startX} ${midY}`;
  for (let i = 0; i < segments; i++) {
    const x1 = startX + i * widthPerSeg + widthPerSeg * 0.33;
    const y1 = midY - amp * (i % 2 === 0 ? 1 : -1);
    const x2 = startX + i * widthPerSeg + widthPerSeg * 0.66;
    const y2 = midY + amp * (i % 2 === 0 ? 1 : -1);
    const x = startX + (i + 1) * widthPerSeg;
    const y = midY;

    d += ` C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
  }
  // tail padding
  return `${d} L ${endX + padRight} ${midY}`;
}
