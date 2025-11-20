"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FlowStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const FLOW_STEPS: FlowStep[] = [
  {
    id: "trigger",
    title: "Trigger",
    description: "A form submission, a health log, or a scheduled job.",
    icon: "📨",
  },
  {
    id: "n8n",
    title: "Process",
    description: "n8n enriches it and writes it into Postgres or Qdrant.",
    icon: "⚙️",
  },
  {
    id: "ollama",
    title: "Reason",
    description:
      "Local model (via Ollama) does the thinking: tagging, scoring, or drafting.",
    icon: "🧠",
  },
  {
    id: "output",
    title: "Output",
    description:
      "Results go out as Slack notifications, dashboard widgets, or follow-up tasks.",
    icon: "📊",
  },
  {
    id: "monitor",
    title: "Monitor",
    description: "Uptime Kuma and custom scripts keep an eye on everything.",
    icon: "👀",
  },
];

export function RequestFlow() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          How a request actually flows
        </h2>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 space-y-4 text-lg text-muted-foreground">
          <p>A typical workflow looks like this:</p>
        </div>

        {/* Timeline row */}
        <div className="relative mb-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          {FLOW_STEPS.map((step, idx) => (
            <div
              className="flex flex-1 flex-col items-center gap-4"
              key={step.id}
            >
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{
                  type: prefersReduced ? "tween" : "spring",
                  delay: idx * 0.1,
                  duration: prefersReduced ? 0.2 : undefined,
                }}
              >
                <Card className="w-full border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5">
                  <CardHeader className="text-center">
                    <div className="mb-2 text-3xl">{step.icon}</div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              {idx < FLOW_STEPS.length - 1 && (
                <ArrowRight className="hidden h-6 w-6 shrink-0 text-muted-foreground md:block" />
              )}
            </div>
          ))}
        </div>

        <p className="mb-12 text-center text-muted-foreground text-sm italic md:text-base">
          From form to Slack ping — all inside Arda.
        </p>
      </div>
    </section>
  );
}
