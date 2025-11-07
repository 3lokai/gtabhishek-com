import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Tech Learnings",
};

export default function VibeCodingPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">Tech Learnings</h1>
          <p className="text-muted-foreground text-xl">
            Content coming soon...
          </p>
        </div>
      </div>
    </PageShell>
  );
}
