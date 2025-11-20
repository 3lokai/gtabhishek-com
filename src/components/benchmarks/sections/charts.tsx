"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getBenchmarks } from "@/lib/api/benchmarks";

export function Charts() {
  const { data: benchmarksData, isLoading } = useQuery({
    queryKey: ["benchmarks"],
    queryFn: () => getBenchmarks(),
    staleTime: 5 * 60 * 1000,
  });

  const responseTimeData = benchmarksData?.chartData.responseTimes || [];
  const qualityData = benchmarksData?.chartData.qualityDistribution || [];

  const chartConfig = {
    time: {
      label: "Response Time (s)",
      color: "var(--chart-1)",
    },
    score: {
      label: "Quality Score",
      color: "var(--chart-2)",
    },
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          Visual Insights
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Performance comparisons across models
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Response Time Comparison */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border/50 bg-card p-6"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="heading-3-centered">Response Time Comparison</h3>
          {isLoading && (
            <div className="flex h-[300px] items-center justify-center">
              Loading...
            </div>
          )}
          {!isLoading && responseTimeData.length === 0 && (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
          {!isLoading && responseTimeData.length > 0 && (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer height={300} width="100%">
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis
                    label={{
                      value: "Time (s)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="time"
                    fill="var(--chart-1)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </motion.div>

        {/* Quality Distribution */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border/50 bg-card p-6"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="heading-3-centered">Quality Distribution</h3>
          {isLoading && (
            <div className="flex h-[300px] items-center justify-center">
              Loading...
            </div>
          )}
          {!isLoading && qualityData.length === 0 && (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
          {!isLoading && qualityData.length > 0 && (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer height={300} width="100%">
                <BarChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis
                    domain={[0, 10]}
                    label={{
                      value: "Score",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="score"
                    fill="var(--chart-2)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </motion.div>
      </div>
    </section>
  );
}
