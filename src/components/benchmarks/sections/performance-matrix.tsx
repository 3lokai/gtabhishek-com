"use client";

import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getBenchmarks } from "@/lib/api/benchmarks";
import { cn } from "@/lib/utils";
import type { BenchmarkMatrixItem } from "@/types/benchmarks";

function getScoreColor(score: number): string {
  if (score >= 9) {
    return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
  }
  if (score >= 7) {
    return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
  }
  if (score >= 5) {
    return "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30";
  }
  return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
}

type PerformanceMatrixProps = {
  onCellClick?: (benchmarkId: number) => void;
};

export function PerformanceMatrix({ onCellClick }: PerformanceMatrixProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedModel, setSelectedModel] = useState<string[]>(
    searchParams.get("model")?.split(",").filter(Boolean) || []
  );
  const [selectedRole, setSelectedRole] = useState<string[]>(
    searchParams.get("role")?.split(",").filter(Boolean) || []
  );
  const [scoreRange, setScoreRange] = useState<[number, number]>([
    Number.parseFloat(searchParams.get("minScore") || "0"),
    Number.parseFloat(searchParams.get("maxScore") || "10"),
  ]);

  const { data: benchmarksData, isLoading } = useQuery({
    queryKey: ["benchmarks", selectedModel, selectedRole, scoreRange],
    queryFn: () =>
      getBenchmarks({
        model: selectedModel.length > 0 ? selectedModel : undefined,
        role: selectedRole.length > 0 ? selectedRole : undefined,
        minScore: scoreRange[0] > 0 ? scoreRange[0] : undefined,
        maxScore: scoreRange[1] < 10 ? scoreRange[1] : undefined,
      }),
    staleTime: 5 * 60 * 1000,
  });

  // Extract unique models from matrix data
  const availableModels = useMemo(() => {
    if (!benchmarksData?.matrix) {
      return [];
    }
    return Array.from(
      new Set(benchmarksData.matrix.map((item) => item.model))
    ).sort();
  }, [benchmarksData]);

  // Extract unique roles from matrix data
  const availableRoles = useMemo(() => {
    if (!benchmarksData?.matrix) {
      return [];
    }
    return Array.from(
      new Set(benchmarksData.matrix.map((item) => item.task))
    ).sort();
  }, [benchmarksData]);

  // Build matrix: models as rows, roles as columns
  const matrixData = useMemo(() => {
    if (!benchmarksData?.matrix) {
      return { rows: [], columns: [] };
    }

    const models = availableModels;
    const roles = availableRoles;

    const rows = models.map((model) => {
      const row: {
        model: string;
        cells: Record<string, BenchmarkMatrixItem | null>;
      } = {
        model,
        cells: {},
      };

      roles.forEach((role) => {
        const cell = benchmarksData.matrix.find(
          (item) => item.model === model && item.task === role
        );
        row.cells[role] = cell || null;
      });

      return row;
    });

    return { rows, columns: roles };
  }, [benchmarksData, availableModels, availableRoles]);

  const updateFilters = (
    newModel?: string[],
    newRole?: string[],
    newScoreRange?: [number, number]
  ) => {
    const params = new URLSearchParams();
    if (newModel && newModel.length > 0) {
      params.set("model", newModel.join(","));
    }
    if (newRole && newRole.length > 0) {
      params.set("role", newRole.join(","));
    }
    if (newScoreRange) {
      if (newScoreRange[0] > 0) {
        params.set("minScore", newScoreRange[0].toString());
      }
      if (newScoreRange[1] < 10) {
        params.set("maxScore", newScoreRange[1].toString());
      }
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    setSelectedModel([]);
    setSelectedRole([]);
    setScoreRange([0, 10]);
    router.push("?", { scroll: false });
  };

  const handleCellClick = (cell: BenchmarkMatrixItem | null) => {
    if (cell && onCellClick) {
      // TODO: Get actual benchmark ID from cell data
      // For now, we'll need to query for the benchmark ID
      // This is a placeholder - actual implementation would need the ID
      onCellClick(0); // Placeholder
    }
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 md:py-32"
      id="performance-matrix"
    >
      <div className="mb-12 text-center md:mb-16">
        <h2 className="font-extrabold text-3xl tracking-tight md:text-5xl lg:text-6xl">
          Performance Matrix
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Model performance across different roles
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-10 mb-6 rounded-lg border border-border/50 bg-background/80 p-4 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filters:</span>
          </div>

          {/* Model Filter */}
          <Select
            onValueChange={(value) => {
              const newModel = value === "all" ? [] : [value];
              setSelectedModel(newModel);
              updateFilters(newModel, selectedRole, scoreRange);
            }}
            value={selectedModel.length > 0 ? selectedModel[0] : "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select
            onValueChange={(value) => {
              const newRole = value === "all" ? [] : [value];
              setSelectedRole(newRole);
              updateFilters(selectedModel, newRole, scoreRange);
            }}
            value={selectedRole.length > 0 ? selectedRole[0] : "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Score Range */}
          <div className="flex min-w-[200px] flex-1 items-center gap-4">
            <span className="whitespace-nowrap text-muted-foreground text-sm">
              Score: {scoreRange[0].toFixed(1)} - {scoreRange[1].toFixed(1)}
            </span>
            <Slider
              className="flex-1"
              max={10}
              min={0}
              onValueChange={(value) => {
                const newRange = value as [number, number];
                setScoreRange(newRange);
                updateFilters(selectedModel, selectedRole, newRange);
              }}
              step={0.1}
              value={scoreRange}
            />
          </div>

          {/* Reset Button */}
          <Button onClick={resetFilters} size="sm" variant="outline">
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 min-w-[150px] bg-background">
                Model
              </TableHead>
              {matrixData.columns.map((role) => (
                <TableHead className="min-w-[100px] text-center" key={role}>
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  className="py-8 text-center"
                  colSpan={matrixData.columns.length + 1}
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && matrixData.rows.length === 0 && (
              <TableRow>
                <TableCell
                  className="py-8 text-center"
                  colSpan={matrixData.columns.length + 1}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              matrixData.rows.length > 0 &&
              matrixData.rows.map((row) => (
                <TableRow key={row.model}>
                  <TableCell className="sticky left-0 z-10 bg-background font-medium">
                    {row.model}
                  </TableCell>
                  {matrixData.columns.map((role) => {
                    const cell = row.cells[role];
                    return (
                      <TableCell className="text-center" key={role}>
                        {cell ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className={cn(
                                  "w-full rounded border px-2 py-1 font-medium text-sm transition-colors hover:opacity-80",
                                  getScoreColor(cell.score)
                                )}
                                onClick={() => handleCellClick(cell)}
                                type="button"
                              >
                                {cell.score.toFixed(1)}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <div>Score: {cell.score.toFixed(1)}/10</div>
                                <div>Time: {cell.time.toFixed(1)}s</div>
                                <div>Tests: {cell.test_count}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
