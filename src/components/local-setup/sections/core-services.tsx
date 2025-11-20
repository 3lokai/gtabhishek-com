"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Service = {
  id: string;
  name: string;
  port: string;
  description: string;
  icon: string;
  category: "infra" | "automation" | "monitoring" | "interface";
};

const SERVICES: Service[] = [
  // Infra Core
  {
    id: "postgres",
    name: "Postgres",
    port: ":5432",
    description:
      "Primary DB for experiments, logs, and anything I want to keep.",
    icon: "🗄️",
    category: "infra",
  },
  {
    id: "redis",
    name: "Redis",
    port: ":6379",
    description:
      "Short-term memory and pub/sub backbone for agents and workflows.",
    icon: "⚡",
    category: "infra",
  },
  {
    id: "qdrant",
    name: "Qdrant",
    port: ":6333",
    description:
      "Vector database for RAG experiments and &quot;second brain&quot; style search.",
    icon: "🔍",
    category: "infra",
  },
  // Automation
  {
    id: "n8n",
    name: "n8n",
    port: ":5678",
    description:
      "The workflow brain. Most automations, cleanups, and notifications start here.",
    icon: "🧠",
    category: "automation",
  },
  {
    id: "ai-trigger",
    name: "AI Trigger",
    port: ":5000",
    description:
      "Automation endpoint for running model benchmarks and scripted tests.",
    icon: "🛠️",
    category: "automation",
  },
  // Monitoring
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    port: ":8090",
    description:
      "&quot;Is everything still alive?&quot; — feeding into status.gtabhishek.com.",
    icon: "📈",
    category: "monitoring",
  },
  {
    id: "homepage",
    name: "Homepage",
    port: ":3000",
    description:
      "A single-pane dashboard to see what&apos;s running and where.",
    icon: "🏠",
    category: "monitoring",
  },
  // Interfaces
  {
    id: "openwebui",
    name: "OpenWebUI",
    port: ":3010",
    description: "My main chat surface for local models running via Ollama.",
    icon: "💬",
    category: "interface",
  },
  {
    id: "immich",
    name: "Immich",
    port: ":2283",
    description:
      "Self-hosted family photo system. AI lab is also the home media vault.",
    icon: "🖼️",
    category: "interface",
  },
  {
    id: "cloudflared",
    name: "Cloudflared",
    port: "",
    description:
      "Tunnels the right services out, without punching obnoxious holes in my router.",
    icon: "☁️",
    category: "infra",
  },
];

const CATEGORIES = {
  infra: "Infra Core",
  automation: "Automation",
  monitoring: "Monitoring",
  interface: "Interfaces",
} as const;

export function CoreServices() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          Core services on Arda
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Everything critical runs as a Docker service behind a single bridge
          network (
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            coffee_net
          </code>
          ) with Cloudflare tunnels for the stuff I want on the internet.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(CATEGORIES).map(([categoryKey, categoryName]) => {
          const categoryServices = SERVICES.filter(
            (s) => s.category === categoryKey
          );
          if (categoryServices.length === 0) {
            return null;
          }

          return (
            <div key={categoryKey}>
              <h3 className="mb-6 text-center font-semibold text-foreground text-lg md:text-xl">
                {categoryName}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {categoryServices.map((service, idx) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    key={service.id}
                    transition={{
                      type: prefersReduced ? "tween" : "spring",
                      stiffness: 380,
                      damping: 30,
                      duration: prefersReduced ? 0.2 : undefined,
                      delay: idx * 0.05,
                    }}
                  >
                    <Card className="relative h-full overflow-hidden border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 blur-2xl transition-opacity duration-300 hover:opacity-100"
                        style={{
                          background:
                            "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                        }}
                      />
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-xl">{service.icon}</span>
                          <span>{service.name}</span>
                          {service.port && (
                            <span className="font-mono font-normal text-muted-foreground text-sm">
                              {service.port}
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{service.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm md:text-base">
          All stateful services write to dedicated volumes under{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
            D:/DockerVolumes/*
          </code>
          , so I can nuke containers without losing brains or memories.
        </p>
      </div>
    </section>
  );
}
