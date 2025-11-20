"use client";

const MODELS = [
  "phi",
  "llama3.2",
  "qwen3",
  "mistral",
  "tinyllama",
  "codellama",
];

export function LocalModelStack() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          Local model stack
        </h2>
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            Most of my day-to-day work runs on local models via{" "}
            <span className="font-semibold text-foreground">Ollama</span> on
            port{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              11434
            </code>
            .
          </p>
        </div>

        {/* Stack strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-border/50 bg-card/40 p-6 backdrop-blur-sm">
          {MODELS.map((model, idx) => (
            <div className="flex items-center gap-3" key={model}>
              <code className="font-mono font-semibold text-foreground text-sm">
                {model}
              </code>
              {idx < MODELS.length - 1 && (
                <span className="text-muted-foreground">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="font-semibold text-foreground text-lg">
            Runs what it can. Fakes the rest.
          </p>
        </div>

        {/* Reality check callout */}
        <div className="mx-auto max-w-2xl rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="mb-2 font-semibold text-foreground text-sm">
            Reality check:
          </p>
          <p className="text-muted-foreground text-sm">
            <strong>3B–13B models</strong> feel fast. <strong>14B–20B</strong>{" "}
            are &quot;make coffee while it runs.&quot; <strong>30B+</strong> is
            where I tap out and use APIs.
          </p>
        </div>
      </div>
    </section>
  );
}
