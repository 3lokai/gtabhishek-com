"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { AuroraText } from "@/components/ui/aurora-text";
import { Spotlight } from "@/components/ui/spotlight-new";

export function LocalSetupHero() {
  const scrollToNext = () => {
    document
      .getElementById("lab-organization")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      <Spotlight />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 md:space-y-12">
        {/* Main Heading */}
        <h1 className="text-center font-bold font-serif text-5xl text-foreground leading-tight md:mb-10 md:text-7xl lg:text-7xl">
          <span className="whitespace-nowrap">
            <AuroraText>Arda</AuroraText> — My Local AI Lab & Ops Box
          </span>
        </h1>

        {/* Subheading */}
        <div className="space-y-4 text-center text-lg text-muted-foreground md:text-xl">
          <p className="font-semibold text-foreground">
            A personal cloud that fits under my desk.
          </p>
          <p>
            A single desktop that runs my models, workflows, and experiments.
          </p>
          <p>
            Ryzen 7, RTX 3060, 32GB RAM — fast enough to be dangerous,
            <br />
            and just constrained enough to keep me honest.
          </p>
        </div>

        {/* Spec Strip */}
        <div className="w-full space-y-2 rounded-lg border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3 md:gap-4">
            <div>
              <span className="font-semibold text-foreground">CPU:</span>{" "}
              <span className="text-muted-foreground">Ryzen 7 5700X</span> ·{" "}
              <span className="font-semibold text-foreground">GPU:</span>{" "}
              <span className="text-muted-foreground">RTX 3060 12GB</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">RAM:</span>{" "}
              <span className="text-muted-foreground">32GB</span> ·{" "}
              <span className="font-semibold text-foreground">Storage:</span>{" "}
              <span className="text-muted-foreground">
                NVMe for AI workloads, HDD for archives
              </span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Sweet spot:</span>{" "}
              <span className="text-muted-foreground">
                3B–13B models, single-user workflows, small RAG systems
              </span>
            </div>
          </div>
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
