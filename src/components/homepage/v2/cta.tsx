"use client";

import { ArrowRight, Briefcase, Mail } from "lucide-react";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import {
  Announcement,
  AnnouncementShinyText,
} from "@/components/ui/shadcn-io/announcement";
import { AuroraText } from "../../ui/aurora-text";

export const CTAV2 = () => {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 md:py-32">
      <BackgroundBeams />
      {/* Vignette overlay with radial gradient shadow */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, color-mix(in oklch, var(--background) 50%, transparent) 70%, color-mix(in oklch, var(--background) 80%, transparent) 100%)",
        }}
      />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center space-y-8 text-center">
        <Announcement
          className="border-primary/20 bg-primary/10 px-4 py-2"
          variant="secondary"
        >
          <Briefcase className="mr-2 h-4 w-4" />
          <AnnouncementShinyText>
            Currently employed full time at Publicis Sapient
          </AnnouncementShinyText>
        </Announcement>
        <h2 className="font-bold font-serif text-4xl text-foreground leading-tight md:text-6xl">
          Ready to <AuroraText>Collaborate?</AuroraText>
        </h2>

        <p className="max-w-2xl text-foreground/80 text-lg md:text-xl">
          Whether you have a something specific in mind or just want to say hi,
          I&apos;m always open to discussing new ideas and opportunities.
        </p>

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
            asChild
            className="transition-smooth hover:bg-primary/10"
            size="lg"
            variant="outline"
          >
            <Link href="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Send a Message
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
