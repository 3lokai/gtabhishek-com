"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Decision = {
  id: string;
  category: string;
  items: string[];
  color: "green" | "yellow" | "red";
};

const DECISIONS: Decision[] = [
  {
    id: "local-yes",
    category: "Local (yes)",
    items: [
      "Single-user inference on 3B–13B models",
      "Small RAG (<10k docs)",
      "Simple agents",
      "LoRA on 7B",
    ],
    color: "green",
  },
  {
    id: "local-maybe",
    category: "Local (maybe)",
    items: ["14B–20B models", "Large contexts", "Complex multi-step agents"],
    color: "yellow",
  },
  {
    id: "cloud-nope",
    category: "Cloud (nope, not local)",
    items: ["30B+ models", "Real-time voice", "Multi-user production traffic"],
    color: "red",
  },
];

const colorClasses = {
  green: "border-chart-2/50 bg-chart-2/5",
  yellow: "border-chart-4/50 bg-chart-4/5",
  red: "border-destructive/50 bg-destructive/5",
};

export function CloudVsLocal() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          When I go local vs when I go cloud
        </h2>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>I don&apos;t try to run everything locally. Roughly:</p>
        </div>

        {/* Mini table header */}
        <div className="mx-auto max-w-2xl overflow-x-auto rounded-lg border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border/50 border-b">
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Local
                </th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Hybrid
                </th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">
                  Cloud
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-muted-foreground">
                  fast iteration
                </td>
                <td className="px-4 py-2 text-muted-foreground">heavy tests</td>
                <td className="px-4 py-2 text-muted-foreground">
                  production scale
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DECISIONS.map((decision) => (
            <Card
              className={`border ${colorClasses[decision.color]} bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm`}
              key={decision.id}
            >
              <CardHeader>
                <CardTitle className="text-lg">{decision.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  {decision.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="font-semibold text-foreground text-lg">
            Cloud&apos;s for scale, Arda&apos;s for play.
          </p>
        </div>
      </div>
    </section>
  );
}
