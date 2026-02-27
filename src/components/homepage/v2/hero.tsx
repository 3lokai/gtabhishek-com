"use client";

import { ArrowRight, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Announcement,
  AnnouncementShinyText,
} from "@/components/ui/shadcn-io/announcement";
import { Spotlight } from "@/components/ui/spotlight-new";
import { AuroraText } from "../../ui/aurora-text";

export const HeroV2 = () => {
  return (
    <section className="relative flex min-h-screen animate-fade-in-slow flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      <Spotlight />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-10 md:space-y-14">
        {/* Micro Tagline */}
        <Announcement
          className="border-primary/20 bg-primary/10 px-4 py-2"
          variant="secondary"
        >
          <AnnouncementShinyText>
            Marketing Ops · GTM Design · AI Systems
          </AnnouncementShinyText>
        </Announcement>

        {/* Main Hero */}
        <h1 className="text-center font-bold font-serif text-5xl text-foreground leading-tight md:text-6xl lg:text-7xl">
          I build <AuroraText>GTM systems</AuroraText> that turn
          <br />
          marketing into <AuroraText>pipeline</AuroraText>.
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-center text-lg text-muted-foreground md:text-xl">
          I design revenue engines that scale across teams, products, and growth
          stages. From SaaS startups to enterprise digital, I architect demand
          systems that are enterprise-grade, AI-driven, and repeatable.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <a href="/contact">
              Work With Me
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>

          <Button className="hover:bg-primary/10" size="lg" variant="outline">
            <Link href="/case-studies">View Case Studies & Outcomes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
