"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Channel = {
  id: string;
  name: string;
  description: string;
};

const CHANNELS: Channel[] = [
  {
    id: "bio-hacking",
    name: "#bio-hacking",
    description: "Raw health and habit logs; messy by design.",
  },
  {
    id: "ai-assistant",
    name: "#ai-assistant",
    description:
      "Actionable alerts and &quot;do something about this&quot; items.",
  },
  {
    id: "ai-reports",
    name: "#ai-reports",
    description: "Weekly/monthly rollups and trends.",
  },
  {
    id: "ai-status",
    name: "#ai-status",
    description: "Infra only: uptime, benchmarks, and health checks.",
  },
];

export function SlackChannels() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-lg text-muted-foreground md:text-xl">
          Everything ends up in Slack so I can stay lazy and effective.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {CHANNELS.map((channel) => (
            <Card
              className="border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5"
              key={channel.id}
            >
              <CardHeader>
                <CardTitle className="font-mono text-lg">
                  {channel.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{channel.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
