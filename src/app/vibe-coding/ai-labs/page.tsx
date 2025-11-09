"use client";

import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Hero } from "@/components/benchmarks/sections/hero";
import { QuickWinners } from "@/components/benchmarks/sections/quick-winners";
import { PerformanceMatrix } from "@/components/benchmarks/sections/performance-matrix";
import { Charts } from "@/components/benchmarks/sections/charts";
import { RolePrompts } from "@/components/benchmarks/sections/role-prompts";
import { FAQ } from "@/components/benchmarks/sections/faq";
import { ResponseModal } from "@/components/benchmarks/modals/response-modal";

export default function AILabsPage() {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<number | null>(null);

  return (
    <PageShell fullScreen>
      <Hero />
      <QuickWinners />
      <PerformanceMatrix onCellClick={setSelectedBenchmarkId} />
      <Charts />
      <RolePrompts />
      <FAQ />
      <ResponseModal
        benchmarkId={selectedBenchmarkId}
        onClose={() => setSelectedBenchmarkId(null)}
      />
    </PageShell>
  );
}

