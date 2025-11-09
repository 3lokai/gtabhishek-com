"use client";

import { Code, Github, HelpCircle, Lightbulb, TestTube } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    value: "what-is-this",
    question: "What is this?",
    icon: HelpCircle,
    content: (
      <div className="space-y-2 text-muted-foreground">
        <p>
          Role-based testing of local LLMs on consumer hardware (RTX 3060 12GB).
          Real constraints, real performance.
        </p>
        <p>
          This benchmark lab tests how well local AI models perform on actual
          professional tasks, not synthetic benchmarks. Every test is designed
          to mirror real-world scenarios you&apos;d encounter in production.
        </p>
      </div>
    ),
  },
  {
    value: "testing-framework",
    question: "Testing Framework",
    icon: TestTube,
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>9 professional roles</strong> - Coding, architecture,
            reasoning, chat, content writing, agent logic, technical writing,
            data analysis, and research
          </li>
          <li>
            <strong>Objective scoring</strong> - Code execution, math
            verification, structure analysis, and quality metrics
          </li>
          <li>
            <strong>120+ tests run monthly</strong> - Continuous evaluation
            across all models and roles
          </li>
        </ul>
        <p>
          Each test has clear, objective criteria. No subjective judgments—just
          measurable outcomes.
        </p>
      </div>
    ),
  },
  {
    value: "why-this-matters",
    question: "Why This Matters",
    icon: Lightbulb,
    content: (
      <div className="space-y-2 text-muted-foreground">
        <p>
          Most benchmarks assume unlimited compute. This shows what&apos;s
          actually possible on $400 hardware.
        </p>
        <p>
          If you&apos;re building with local AI, you need to know which models
          can handle real tasks on consumer GPUs. This benchmark gives you that
          data.
        </p>
        <p>
          Every result is reproducible. Every prompt is visible. Every score has
          a clear methodology.
        </p>
      </div>
    ),
  },
  {
    value: "tech-stack",
    question: "Tech Stack",
    icon: Code,
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Models:</strong> Ollama (local inference)
          </li>
          <li>
            <strong>Infrastructure:</strong> Docker, Postgres, n8n
          </li>
          <li>
            <strong>Automation:</strong> Scheduled tests, Slack alerts
          </li>
          <li>
            <strong>Frontend:</strong> Next.js, React, Tailwind
          </li>
        </ul>
        <p>
          The entire system runs on a single machine. No cloud dependencies, no
          external APIs—just local inference and local data.
        </p>
      </div>
    ),
  },
  {
    value: "open-source",
    question: "Open Source",
    icon: Github,
    content: (
      <div className="space-y-2 text-muted-foreground">
        <p>
          This benchmark framework is open source. You can run the same tests on
          your hardware and compare results.
        </p>
        <p>
          <a
            className="text-primary hover:underline"
            href="https://github.com/gtabhishek"
            rel="noopener noreferrer"
            target="_blank"
          >
            View on GitHub →
          </a>
        </p>
        <p>
          All prompts, scoring criteria, and test data are available in the
          repository. Transparency is the goal.
        </p>
      </div>
    ),
  },
];

export function FAQ() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="mb-12 text-center">
        <h2 className="heading-2">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Learn more about the benchmark methodology
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <Accordion collapsible type="single">
          {faqItems.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="font-semibold">{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
