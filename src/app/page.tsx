"use client";

import { BentoGrid } from "@/components/homepage/bento-grid";
import BuildsAndSystems from "@/components/homepage/builds-and-systems";
import { Hero } from "@/components/homepage/hero";
import { PageShell } from "@/components/page-shell";

export default function Home() {
  return (
    <PageShell fullScreen>
      <Hero />
      <BentoGrid />
      <BuildsAndSystems />
    </PageShell>
  );
}
