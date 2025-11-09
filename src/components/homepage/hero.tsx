"use client";

import { ArrowDown, ArrowRight, Construction } from "lucide-react";
import { AvatarWavePill } from "@/components/ui/avatar-pill";
import { Button } from "@/components/ui/button";
import {
  Announcement,
  AnnouncementShinyText,
} from "@/components/ui/shadcn-io/announcement";
import { Spotlight } from "@/components/ui/spotlight-new";
import { AuroraText } from "../ui/aurora-text";

export const Hero = () => {
  const scrollToSystems = () => {
    document.getElementById("systems")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen animate-fade-in-slow flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
      <Spotlight />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 md:space-y-12">
        {/* Top Announcement Banner */}
        <Announcement
          className="border-primary/20 bg-primary/10 px-4 py-2"
          variant="secondary"
        >
          <Construction className="mr-2 h-4 w-4" />
          <AnnouncementShinyText>
            Under Construction — Live Systems Inside
          </AnnouncementShinyText>
        </Announcement>

        {/* Main Heading */}
        <h1 className="heading-1-hero">
          <span className="whitespace-nowrap">
            <AuroraText>Marketing Strategist</AuroraText> by Day,
          </span>
          <br />
          <span className="whitespace-nowrap">
            <AuroraText>AI Enthusiast</AuroraText> by Night
          </span>
        </h1>

        {/* Introduction with Profile Picture */}
        <div className="flex flex-col items-center gap-4 text-center text-foreground text-lg md:text-xl">
          <div className="flex items-center gap-4">
            <span>Hello, I&apos;m</span>
            <AvatarWavePill label="GT Abhishek" src="/profile.jpg" wave="👋" />
          </div>
          <span>I build with intuition, ship with precision.</span>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            className="glow-primary bg-primary text-primary-foreground transition-smooth hover:bg-primary/90"
            size="lg"
          >
            <a
              href="https://www.linkedin.com/in/gtabhishek/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Let&apos;s Connect
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>

          <Button
            className="border-primary/30 transition-smooth hover:bg-primary/10"
            onClick={scrollToSystems}
            size="lg"
            variant="outline"
          >
            Explore Running Systems
            <ArrowDown className="ml-2 h-5 w-5 animate-float" />
          </Button>
        </div>
      </div>
    </section>
  );
};
