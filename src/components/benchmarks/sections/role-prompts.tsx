"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable";
import { getBenchmarks, getRoles } from "@/lib/api/benchmarks";

function renderScoringCriteria(
  criteria: unknown,
  testId: string
): React.ReactNode {
  if (Array.isArray(criteria)) {
    return criteria.map((criterion: any, idx: number) => {
      const criterionKey = `${testId}-criterion-${criterion.name || idx}`;
      return (
        <div
          className="flex items-start gap-3 rounded-lg bg-muted/20 p-3"
          key={criterionKey}
        >
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          <div className="flex-1">
            <div className="font-medium text-sm">
              {criterion.name || `Criterion ${idx + 1}`}
            </div>
            <div className="text-muted-foreground text-xs">
              {criterion.description || "Objective scoring criterion"}
            </div>
          </div>
        </div>
      );
    });
  }

  if (typeof criteria === "object" && criteria !== null) {
    return Object.entries(criteria).map(([key, value]: [string, any]) => {
      const criterionKey = `${testId}-criteria-${key}`;
      return (
        <div
          className="flex items-start gap-3 rounded-lg bg-muted/20 p-3"
          key={criterionKey}
        >
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          <div className="flex-1">
            <div className="font-medium text-sm capitalize">
              {key.replace(/_/g, " ")}
            </div>
            <div className="text-muted-foreground text-xs">
              {typeof value === "number"
                ? `${(value * 100).toFixed(0)}% weight`
                : String(value)}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="text-muted-foreground text-sm">
      Scoring criteria not available
    </div>
  );
}

export function RolePrompts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copiedPrompts, setCopiedPrompts] = useState<Record<string, boolean>>(
    {}
  );

  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Debug: Log the API response
  if (rolesData) {
    console.log("Roles data:", rolesData);
    console.log("Roles array:", rolesData.roles);
    if (rolesData.roles && rolesData.roles.length > 0) {
      console.log("First role:", rolesData.roles[0]);
      console.log("First role tests:", rolesData.roles[0].tests);
    }
  }

  // Debug: Log errors
  if (rolesError) {
    console.error("Roles API error:", rolesError);
  }

  const { data: benchmarksData } = useQuery({
    queryKey: ["benchmarks"],
    queryFn: () => getBenchmarks(),
    staleTime: 5 * 60 * 1000,
  });

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompts((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedPrompts((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getWinnerForRole = (roleName: string) => {
    if (!benchmarksData?.matrix) {
      return null;
    }
    return benchmarksData.matrix
      .filter((item) => item.task === roleName)
      .sort((a, b) => b.score - a.score)[0];
  };

  const scrollToMatrix = (roleName: string) => {
    // Update URL params to filter by role
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", roleName);
    // Clear other filters when filtering by role
    params.delete("model");
    params.delete("minScore");
    params.delete("maxScore");
    router.push(`?${params.toString()}`, { scroll: false });

    // Scroll to matrix section
    const matrixElement = document.getElementById("performance-matrix");
    if (matrixElement) {
      matrixElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (rolesLoading) {
    return (
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center">Loading...</div>
      </section>
    );
  }

  if (rolesError) {
    return (
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center text-muted-foreground">
          Error loading roles:{" "}
          {rolesError instanceof Error ? rolesError.message : "Unknown error"}
        </div>
      </section>
    );
  }

  if (!rolesData?.roles || rolesData.roles.length === 0) {
    return (
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center text-muted-foreground">
          No roles available
        </div>
        {rolesData && (
          <div className="mt-4 text-center text-muted-foreground text-xs">
            Debug: rolesData = {JSON.stringify(rolesData, null, 2)}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          What I Actually Test
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          These aren&apos;t toy examples. These are real professional tasks with
          objective scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rolesData.roles.map((role, index) => {
          const winner = getWinnerForRole(role.name);

          return (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              key={role.name}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
                delay: index * 0.05,
              }}
            >
              <Expandable>
                <ExpandableCard
                  className="group relative h-full w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card/40 to-card/20 backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/5 hover:shadow-lg"
                  collapsedSize={{ height: 200 }}
                  expandedSize={{}}
                  hoverToExpand={true}
                >
                  {/* Glow effect on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(600px 200px at 20% -20%, color-mix(in oklch, var(--accent) 15%, transparent), transparent 60%)",
                    }}
                  />
                  <div className="relative z-10">
                    <ExpandableTrigger>
                      <ExpandableCardHeader>
                        <div className="flex w-full items-start justify-between">
                          <div className="flex-1">
                            <h3 className="heading-3">{role.name}</h3>
                            <p className="mt-1 text-muted-foreground text-sm">
                              {role.test_count} test
                              {role.test_count !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </ExpandableCardHeader>
                    </ExpandableTrigger>

                    <ExpandableContent>
                      <ExpandableCardContent>
                        <div className="space-y-6">
                          {role.tests && role.tests.length > 0 ? (
                            role.tests.map((test: any, testIndex: number) => {
                              const testId = String(
                                test.id || test.test_id || `test-${testIndex}`
                              );
                              const promptKey = `${role.name}-${testId}`;
                              const testWinner = winner;
                              // Try multiple possible field names for prompt
                              const promptText =
                                test.prompt ||
                                test.test_prompt ||
                                test.text ||
                                test.content
                                  ? String(
                                      test.prompt ||
                                        test.test_prompt ||
                                        test.text ||
                                        test.content
                                    )
                                  : "No prompt available";

                              return (
                                <div className="space-y-4" key={promptKey}>
                                  {/* Test Prompt */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="heading-4">
                                        Test: {testId}
                                      </h4>
                                      <Button
                                        onClick={() =>
                                          copyToClipboard(promptText, promptKey)
                                        }
                                        size="sm"
                                        variant="ghost"
                                      >
                                        {copiedPrompts[promptKey] ? (
                                          <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
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
                                        <code>{promptText}</code>
                                      </pre>
                                    </div>
                                  </div>

                                  {/* Scoring Criteria */}
                                  {test.criteria && (
                                    <div className="space-y-3">
                                      <h4 className="heading-4">
                                        How It&apos;s Scored
                                      </h4>
                                      <div className="space-y-2">
                                        {renderScoringCriteria(
                                          test.criteria,
                                          testId
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Current Winner */}
                                  {testWinner && (
                                    <div className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="text-muted-foreground text-xs">
                                            Current Winner
                                          </div>
                                          <div className="font-bold text-lg">
                                            {testWinner.model}
                                          </div>
                                          <div className="text-muted-foreground text-sm">
                                            Score: {testWinner.score.toFixed(1)}
                                            /10 • Time:{" "}
                                            {testWinner.time.toFixed(1)}s
                                          </div>
                                        </div>
                                        <Button
                                          onClick={() =>
                                            scrollToMatrix(role.name)
                                          }
                                          size="sm"
                                          variant="outline"
                                        >
                                          View Results
                                          <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-muted-foreground text-sm">
                              No tests available for this role
                            </div>
                          )}
                        </div>
                      </ExpandableCardContent>
                    </ExpandableContent>
                  </div>
                </ExpandableCard>
              </Expandable>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
