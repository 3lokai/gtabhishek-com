"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Rocket, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBenchmarks } from "@/lib/api/benchmarks";
import { cn } from "@/lib/utils";

export function QuickWinners() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: benchmarksData } = useQuery({
    queryKey: ["benchmarks"],
    queryFn: () => getBenchmarks(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const scrollToMatrix = (model?: string) => {
    // Update URL params to filter by model
    if (model && model !== "N/A") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("model", model);
      // Clear other filters when filtering by model
      params.delete("role");
      params.delete("minScore");
      params.delete("maxScore");
      router.push(`?${params.toString()}`, { scroll: false });
    }

    // Scroll to matrix section
    const matrixElement = document.getElementById("performance-matrix");
    if (matrixElement) {
      matrixElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const speedChampion = benchmarksData?.summary.speedChampion;
  const qualityChampion = benchmarksData?.summary.qualityChampion;

  // Calculate best overall (balanced speed + quality)
  const bestOverall = benchmarksData?.matrix
    ?.map((item) => ({
      model: item.model,
      score: item.score,
      time: item.time,
      combined: item.score - item.time / 10, // Simple combined metric
    }))
    .sort((a, b) => b.combined - a.combined)[0];

  const cards = [
    {
      title: "Speed Champion",
      description: speedChampion
        ? `${speedChampion.time}s average response`
        : "Fastest model",
      icon: Rocket,
      value: speedChampion?.model || "N/A",
      metric: speedChampion ? `${speedChampion.time}s` : undefined,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Quality Leader",
      description: qualityChampion
        ? `${qualityChampion.score}/10 average score`
        : "Highest quality model",
      icon: Trophy,
      value: qualityChampion?.model || "N/A",
      metric: qualityChampion ? `${qualityChampion.score}/10` : undefined,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Best Overall",
      description: bestOverall
        ? "Balanced speed + quality"
        : "Best balanced performance",
      icon: Star,
      value: bestOverall?.model || "N/A",
      metric: bestOverall
        ? `${bestOverall.score.toFixed(1)}/10 • ${bestOverall.time.toFixed(1)}s`
        : undefined,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 md:py-32"
      id="quick-winners"
    >
      <motion.div
        animate="visible"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        initial="hidden"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              key={card.title}
              transition={{ delay: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden border transition-all hover:shadow-lg",
                  card.borderColor
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                    card.bgColor
                  )}
                />
                <CardHeader className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", card.color)} />
                    <CardTitle className="font-semibold text-xl">
                      {card.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="mb-4">
                    <div className="font-bold font-mono text-2xl text-foreground">
                      {card.value}
                    </div>
                    {card.metric && (
                      <div className="text-muted-foreground text-sm">
                        {card.metric}
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => scrollToMatrix(card.value)}
                    size="sm"
                    variant="outline"
                  >
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
