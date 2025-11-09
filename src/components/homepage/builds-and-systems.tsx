"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  icon?: React.ReactNode;
  group: "running" | "building";
  kumaId?: string; // optional monitor key to hydrate status
};

type KumaStatus = Record<string, "up" | "down" | "unknown">;

/** ------- CONFIG: your items ------- */
const ITEMS: Item[] = [
  {
    id: "aistudio",
    title: "AI Studio",
    blurb: "Local LLM chat on RTX 3060 (Ollama)",
    href: "/ai",
    icon: <span>🤖</span>,
    group: "running",
    kumaId: "AI Studio",
  },
  {
    id: "ops",
    title: "Ops Lab",
    blurb: "Self-hosted dashboards & services",
    href: "/ops",
    icon: <span>🧭</span>,
    group: "running",
    kumaId: "Ops Lab",
  },
  {
    id: "status",
    title: "System Status",
    blurb: "Uptime across infrastructure",
    href: "https://status.gtabhishek.com",
    icon: <span>📈</span>,
    group: "running",
    kumaId: "Status Page",
  },
  {
    id: "photos",
    title: "Photos",
    blurb: "Self-hosted family photo vault",
    href: "/photos",
    icon: <span>🖼️</span>,
    group: "running",
    kumaId: "Photos",
  },

  {
    id: "icb",
    title: "IndianCoffeeBeans.com",
    blurb: "Specialty coffee directory + scraping + search",
    href: "/projects/icb",
    icon: <span>☕</span>,
    group: "building",
  },
  {
    id: "maze",
    title: "MAzeApp",
    blurb: "Family photo workflows + automations",
    href: "/projects/maze",
    icon: <span>🧩</span>,
    group: "building",
  },
  {
    id: "bench",
    title: "AI Benchmark Lab",
    blurb: "Model perf tests on local hardware",
    href: "/projects/bench",
    icon: <span>🧪</span>,
    group: "building",
  },
];

/** ------- CONFIG: marquee tech logos/text ------- */
const TECH: string[] = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind",
  "Python",
  "FastAPI",
  "Postgres",
  "Supabase",
  "Docker",
  "n8n",
  "Ollama",
  "Qdrant",
  "Fabric",
  "LangChain",
];

/** Fetch Kuma public JSON — adjust to your endpoint if needed.
 *  If you don't expose JSON, this will gracefully fall back to unknown.
 */
async function fetchKumaStatus(): Promise<KumaStatus> {
  try {
    // Example public API path. If you expose a custom JSON, map it here.
    const res = await fetch(
      "https://status.gtabhishek.com/api/status-page/heartbeat",
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return {};
    }
    const data = await res.json();
    // Expecting shape like: [{ name, status: "up"|"down" }]
    const map: KumaStatus = {};
    if (Array.isArray(data?.monitors)) {
      for (const m of data.monitors) {
        if (m.important) {
          map[m.name as string] = "up";
        } else if (m.status === 1) {
          map[m.name as string] = "up";
        } else {
          map[m.name as string] = "down";
        }
      }
    }
    // Different Kuma builds expose different keys; the above is defensive.
    return map;
  } catch {
    return {};
  }
}

export default function BuildsAndSystems() {
  const [kuma, setKuma] = useState<KumaStatus>({});
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    fetchKumaStatus().then(setKuma);
  }, []);

  const running = useMemo(() => ITEMS.filter((i) => i.group === "running"), []);
  const building = useMemo(
    () => ITEMS.filter((i) => i.group === "building"),
    []
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32" id="systems">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="heading-2-lg">
          Builds & Systems
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Live infrastructure and current projects
        </p>
      </div>

      <Tabs className="mt-12" defaultValue="running">
        <div className="flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="building">In Progress</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent className="mt-10" value="running">
          <CardGrid animated={!prefersReduced} items={running} kuma={kuma} />
        </TabsContent>

        <TabsContent className="mt-10" value="building">
          <CardGrid animated={!prefersReduced} items={building} />
        </TabsContent>
      </Tabs>

      {/* Thin tech stack marquee */}
      <div className="mt-16 border-white/10 border-t pt-10 md:mt-20 md:pt-12">
        <Marquee animated={!prefersReduced} items={TECH} />
      </div>
    </section>
  );
}

/* ---------- subcomponents ---------- */

function CardGrid({
  items,
  kuma,
  animated = true,
}: {
  items: Item[];
  kuma?: KumaStatus;
  animated?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
      {items.map((item, idx) => (
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          key={item.id}
          transition={{
            type: animated ? "spring" : "tween",
            stiffness: 380,
            damping: 30,
            duration: animated ? undefined : 0.2,
            delay: idx * 0.05,
          }}
        >
          <Link
            className="group block rounded-2xl outline-none ring-offset-2 focus-visible:ring-2"
            href={item.href}
            {...(item.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <Card className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all group-hover:border-accent group-hover:bg-accent/5 group-hover:shadow-lg">
              {/* glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                }}
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <span className="text-sm opacity-70 group-hover:opacity-100">
                    ↗
                  </span>
                </div>
                <CardDescription>{item.blurb}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                {item.group === "running" ? (
                  <StatusPill status={resolveStatus(kuma, item.kumaId)} />
                ) : (
                  <SoonPill />
                )}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function resolveStatus(
  kuma: KumaStatus | undefined,
  key?: string
): "up" | "down" | "unknown" {
  if (!(kuma && key)) {
    return "unknown";
  }
  return kuma[key] ?? "unknown";
}

function StatusPill({ status }: { status: "up" | "down" | "unknown" }) {
  let color: string;
  if (status === "up") {
    color = "bg-chart-2";
  } else if (status === "down") {
    color = "bg-destructive";
  } else {
    color = "bg-muted-foreground/50";
  }

  let label: string;
  if (status === "up") {
    label = "Online";
  } else if (status === "down") {
    label = "Down";
  } else {
    label = "Unknown";
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-muted-foreground text-xs">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span>{label}</span>
    </div>
  );
}

function SoonPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-muted-foreground text-xs">
      <span className="h-2.5 w-2.5 rounded-full bg-chart-4" />
      <span>Coming soon</span>
    </div>
  );
}

/* Thin grayscale marquee that pauses on hover and is keyboard accessible */
function Marquee({
  items,
  animated = true,
}: {
  items: string[];
  animated?: boolean;
}) {
  // duplicate for a seamless loop
  const loop = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        animate={animated ? { x: ["0%", "-50%"] } : undefined}
        aria-label="Tech stack"
        className="flex gap-6 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]"
        initial={false}
        role="list"
        transition={
          animated
            ? { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
            : undefined
        }
      >
        {loop.map((t, i) => {
          const isFirstHalf = i < items.length;
          return (
            <li
              className="inline-flex items-center rounded-xl border border-border/50 bg-muted/30 px-4 py-2 text-muted-foreground text-xs"
              key={`${t}-${isFirstHalf ? "first" : "second"}-${i % items.length}`}
              title={t}
            >
              {t}
            </li>
          );
        })}
      </motion.div>
    </div>
  );
}
