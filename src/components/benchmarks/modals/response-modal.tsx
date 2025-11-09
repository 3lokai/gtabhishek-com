"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getBenchmarkDetail } from "@/lib/api/benchmarks";
import { cn } from "@/lib/utils";

type ResponseModalProps = {
  benchmarkId: number | null;
  onClose: () => void;
};

export function ResponseModal({ benchmarkId, onClose }: ResponseModalProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const { data: benchmark, isLoading } = useQuery({
    queryKey: ["benchmark-detail", benchmarkId],
    queryFn: () => getBenchmarkDetail(benchmarkId!),
    enabled: benchmarkId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const copyToClipboard = async (text: string, type: "prompt" | "response") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "prompt") {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) {
      return "bg-green-500/20 text-green-700 dark:text-green-400";
    }
    if (score >= 7) {
      return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
    }
    if (score >= 5) {
      return "bg-orange-500/20 text-orange-700 dark:text-orange-400";
    }
    return "bg-red-500/20 text-red-700 dark:text-red-400";
  };

  if (!benchmarkId) {
    return null;
  }

  return (
    <Dialog onOpenChange={onClose} open={benchmarkId !== null}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        {isLoading && <div className="py-8 text-center">Loading...</div>}
        {!isLoading && benchmark && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>
                    {benchmark.model} → {benchmark.role}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    Benchmark result details
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn("text-sm", getScoreColor(benchmark.score))}
                  >
                    Score: {benchmark.score.toFixed(1)}/10
                  </Badge>
                  <Badge className="text-sm" variant="outline">
                    Time: {benchmark.time.toFixed(1)}s
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <Separator className="my-4" />

            {/* Test Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="heading-3-sm">Test Prompt</h3>
                <Button
                  onClick={() => copyToClipboard(benchmark.prompt, "prompt")}
                  size="sm"
                  variant="ghost"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm">
                  <code>{benchmark.prompt}</code>
                </pre>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Model Response */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="heading-3-sm">Model Response</h3>
                <Button
                  onClick={() =>
                    copyToClipboard(benchmark.response, "response")
                  }
                  size="sm"
                  variant="ghost"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <pre className="max-h-[400px] overflow-x-auto overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                  <code>{benchmark.response}</code>
                </pre>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Scoring Breakdown */}
            <div className="space-y-3">
              <h3 className="heading-3-sm">Scoring Breakdown</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Object.entries(benchmark.breakdown || {}).map(
                  ([key, value]) => (
                    <div
                      className="rounded-lg border border-border/50 bg-muted/20 p-3"
                      key={key}
                    >
                      <div className="text-muted-foreground text-xs capitalize">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="mt-1 font-bold text-lg">
                        {typeof value === "number"
                          ? (value * 100).toFixed(0)
                          : value}
                        %
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}
        {!isLoading && benchmark === null && (
          <div className="py-8 text-center">Benchmark not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
