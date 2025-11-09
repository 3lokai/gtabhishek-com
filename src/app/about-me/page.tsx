import { PageShell } from "@/components/page-shell";

export default function AboutMePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">About me</h1>
          <p className="text-muted-foreground text-xl">
            Content coming soon...
          </p>
        </div>
      </div>
    </PageShell>
  );
}
