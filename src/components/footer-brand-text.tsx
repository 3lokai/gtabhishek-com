"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { cn } from "@/lib/utils";

type FooterBrandTextProps = {
  className?: string;
};

export function FooterBrandText({ className }: FooterBrandTextProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-32 md:h-40 lg:h-48">
          <TextHoverEffect
            automatic={true}
            duration={0.15}
            text="GTabhishek.com"
          />
        </div>
      </div>
    </div>
  );
}
