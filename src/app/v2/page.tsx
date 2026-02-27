"use client";

import { BentoGridV2 } from "@/components/homepage/v2/bento-grid";
import BuildsAndSystemsV2 from "@/components/homepage/v2/builds-and-systems";
import { CTAV2 } from "@/components/homepage/v2/cta";
import ExperienceJourneyV2 from "@/components/homepage/v2/experience-journey";
import { HeroV2 } from "@/components/homepage/v2/hero";
import { PageShell } from "@/components/page-shell";

export default function Home() {
  return (
    <PageShell fullScreen>
      <HeroV2 />
      <BentoGridV2 />
      <BuildsAndSystemsV2 />
      <ExperienceJourneyV2 />
      <CTAV2 />
    </PageShell>
  );
}
