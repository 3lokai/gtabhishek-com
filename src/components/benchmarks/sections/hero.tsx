"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AuroraText } from "@/components/ui/aurora-text";
import { Spotlight } from "@/components/ui/spotlight-new";
import { getBenchmarks, getDashboardSummary } from "@/lib/api/benchmarks";

function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - (1 - progress) ** 3;
      const current = Math.floor(
        startValue + (endValue - startValue) * easeOut
      );

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function Hero() {
  const { data: dashboardSummary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: benchmarksSummary } = useQuery({
    queryKey: ["benchmarks-summary"],
    queryFn: () => getBenchmarks({ summary: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const scrollToNext = () => {
    document
      .getElementById("quick-winners")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      <Spotlight />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 md:space-y-12">
        {/* Main Heading */}
        <h1 className="heading-1-hero">
          <span className="whitespace-nowrap">
            <AuroraText>AI Benchmark Lab</AuroraText>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg text-muted-foreground md:text-xl">
          Testing {benchmarksSummary?.summary.models || 6} local models ×{" "}
          {benchmarksSummary?.summary.roles || 9} professional roles on consumer
          hardware
        </p>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-lg border border-border/50 bg-card/40 p-4 backdrop-blur-sm md:p-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <div className="font-bold text-2xl text-foreground md:text-3xl">
              <AnimatedCounter
                suffix="+"
                value={
                  dashboardSummary?.tests_7d ||
                  benchmarksSummary?.summary.totalTests ||
                  120
                }
              />
            </div>
            <div className="text-muted-foreground text-sm md:text-base">
              Tests
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-lg border border-border/50 bg-card/40 p-4 backdrop-blur-sm md:p-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <div className="font-bold text-2xl text-foreground md:text-3xl">
              {benchmarksSummary?.summary.models || 6}
            </div>
            <div className="text-muted-foreground text-sm md:text-base">
              Models
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-lg border border-border/50 bg-card/40 p-4 backdrop-blur-sm md:p-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            <div className="font-bold text-2xl text-foreground md:text-3xl">
              {benchmarksSummary?.summary.roles || 9}
            </div>
            <div className="text-muted-foreground text-sm md:text-base">
              Roles
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          animate={{ y: [0, 10, 0] }}
          className="mt-8 flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          onClick={scrollToNext}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="h-5 w-5" />
        </motion.button>
      </div>
    </section>
  );
}
